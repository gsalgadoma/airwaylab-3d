"""Build a small GLB directly from the official BodyParts3D 4.0 OBJ archive.

No third party Python packages. Download archive, parts.tsv and elements.tsv to
data/bodyparts3d/ using the URLs recorded in assets/bodyparts3d/manifest.json.
Run with Python 3: python tools/build_bodyparts.py
"""
import hashlib
import json
import struct
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/bodyparts3d'
OUTPUT = ROOT / 'assets/bodyparts3d'
SELECTION = {
    'FMA52749': ('hyoid', 'Hueso hioides'),
    'FMA55130': ('epiglottis', 'Epiglotis'),
    'FMA55099': ('thyroid', 'Cartílago tiroides'),
    'FMA9615': ('cricoid', 'Cartílago cricoides'),
    'FMA55113': ('arytenoids', 'Cartílago aritenoides derecho'),
    'FMA55114': ('arytenoids', 'Cartílago aritenoides izquierdo'),
    'FMA55245': ('ligaments', 'Ligamento vocal derecho'),
    'FMA55246': ('ligaments', 'Ligamento vocal izquierdo'),
    'FMA7394': ('trachea', 'Tráquea'),
    'FMA7396': ('bronchi', 'Bronquio principal izquierdo'),
    'FMA68418': ('bronchi', 'Bronquio principal derecho (porción propia)'),
}


def parse_obj(raw):
    vertices, triangles = [], []
    for line in raw.decode('utf-8-sig').splitlines():
        fields = line.split()
        if not fields:
            continue
        if fields[0] == 'v':
            vertices.append([float(v) for v in fields[1:4]])
        elif fields[0] == 'f':
            indices = [int(v.split('/')[0]) for v in fields[1:]]
            indices = [i-1 if i > 0 else len(vertices)+i for i in indices]
            if any(i < 0 or i >= len(vertices) for i in indices):
                raise ValueError('Invalid OBJ vertex index')
            for i in range(1, len(indices)-1):
                triangles.extend([indices[0], indices[i], indices[i+1]])
    if not vertices or not triangles:
        raise ValueError('Empty geometry')
    return vertices, triangles


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    concepts = {}
    for line in (SOURCE / 'parts.tsv').read_text().splitlines()[1:]:
        fields = line.split('\t')
        if fields[0] in SELECTION:
            concepts[fields[0]] = {'representation': fields[1], 'name': fields[2]}
    elements = {}
    for line in (SOURCE / 'elements.tsv').read_text().splitlines()[1:]:
        fma, name, element = line.split('\t')
        if fma in SELECTION:
            elements.setdefault(fma, []).append(element)
    assert set(elements) == set(SELECTION) == set(concepts)
    gltf = {'asset': {'version': '2.0', 'generator': 'AirwayLab BodyParts3D subset converter'},
            'scene': 0, 'scenes': [{'nodes': []}], 'nodes': [], 'meshes': [],
            'accessors': [], 'bufferViews': [], 'buffers': []}
    binary = bytearray()
    manifest = {'dataset': 'BodyParts3D', 'version': '4.0', 'polygonReduction': '99%',
                'license': 'CC-BY-4.0', 'licenseURL': 'https://creativecommons.org/licenses/by/4.0/',
                'licenseSource': 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html',
                'archiveURL': 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip',
                'partsURL': 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_parts_list_e.txt',
                'elementsURL': 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_element_parts.txt',
                'retrieved': '2026-10-18', 'meshes': [], 'duplicateElements': []}

    def accessor(values, component, shape, target, bounds=None):
        while len(binary) % 4:
            binary.append(0)
        offset = len(binary)
        binary.extend(struct.pack('<' + ('f' if component == 5126 else 'I') * len(values), *values))
        view = len(gltf['bufferViews'])
        gltf['bufferViews'].append({'buffer': 0, 'byteOffset': offset,
                                   'byteLength': len(binary)-offset, 'target': target})
        result = {'bufferView': view, 'componentType': component, 'count': len(values)//(3 if shape == 'VEC3' else 1), 'type': shape}
        if bounds:
            result['min'], result['max'] = bounds
        index = len(gltf['accessors'])
        gltf['accessors'].append(result)
        return index

    used = set()
    geometries = {}
    with zipfile.ZipFile(SOURCE / 'source.zip') as archive:
        files = {Path(name).stem: name for name in archive.namelist() if name.lower().endswith('.obj')}
        for fma, (structure, label) in SELECTION.items():
            for element in elements[fma]:
                if element in used:
                    raise ValueError('Duplicate element: ' + element)
                used.add(element)
                raw = archive.read(files[element])
                vertices, triangles = parse_obj(raw)
                fingerprint = hashlib.sha256(json.dumps([vertices, triangles], separators=(',', ':')).encode()).hexdigest()
                key = (fma, fingerprint)
                if key in geometries:
                    manifest['duplicateElements'].append({'fma': fma, 'element': element,
                        'sameGeometryAs': geometries[key], 'sha256OBJ': hashlib.sha256(raw).hexdigest()})
                    continue
                geometries[key] = element
                low = [min(v[axis] for v in vertices) for axis in range(3)]
                high = [max(v[axis] for v in vertices) for axis in range(3)]
                positions = accessor([c for v in vertices for c in v], 5126, 'VEC3', 34962, (low, high))
                indices = accessor(triangles, 5125, 'SCALAR', 34963)
                name = f'{fma}_{element}'
                mesh = len(gltf['meshes'])
                gltf['meshes'].append({'name': name, 'primitives': [{'attributes': {'POSITION': positions}, 'indices': indices}]})
                gltf['nodes'].append({'name': name, 'mesh': mesh})
                gltf['scenes'][0]['nodes'].append(mesh)
                manifest['meshes'].append({'mesh': name, 'fma': fma, 'element': element,
                    'structure': structure, 'label': label, **concepts[fma],
                    'sha256OBJ': hashlib.sha256(raw).hexdigest(),
                    'vertices': len(vertices), 'triangles': len(triangles)//3, 'bounds': [low, high]})
    while len(binary) % 4:
        binary.append(0)
    gltf['buffers'] = [{'byteLength': len(binary)}]
    encoded = json.dumps(gltf, separators=(',', ':')).encode()
    encoded += b' ' * ((-len(encoded)) % 4)
    glb = struct.pack('<III', 0x46546C67, 2, 12+8+len(encoded)+8+len(binary))
    glb += struct.pack('<II', len(encoded), 0x4E4F534A)+encoded
    glb += struct.pack('<II', len(binary), 0x004E4942)+binary
    (OUTPUT / 'airway.glb').write_bytes(glb)
    manifest['sha256GLB'] = hashlib.sha256(glb).hexdigest()
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    print(f'{len(manifest["meshes"])} meshes, {len(manifest["duplicateElements"])} duplicate geometries omitted, {len(glb):,} bytes')


if __name__ == '__main__':
    main()
