# BodyParts3D airway subset

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- Dataset: BodyParts3D 4.0, IS-A archive, 99% polygon reduction.
- Official download: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Official license statement, updated 2025-02-25: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html
- License: https://creativecommons.org/licenses/by/4.0/
- Dataset release notes: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/release_4.0_e.html

Adaptations by AirwayLab: select the airway subset using the original FMA-to-FJ tables; triangulate OBJ faces and pack positions/indices into GLB. The browser computes normals, applies educational colors, rotates the complete assembly and uses a single uniform display scale. Individual structures retain their source coordinates and proportions. No source geometry is sculpted or clinically validated here.

`manifest.json` records the exact original FMA concepts, representation IDs, FJ file IDs, original English labels, geometry counts and SHA-256 hashes. `tools/build_bodyparts.py` reproduces the conversion using only the Python standard library. The complete source archive is not redistributed in this repository.

The two vocal ligament meshes are not complete vocal folds. The trachea is a single source mesh, without independent cartilaginous rings. The airway surfaces are not verified as hollow luminal surfaces suitable for virtual endoscopy. Motion and tracheostomy illustrations remain available only in the separate schematic mode.

This subset does not include lung parenchyma, the complete bronchial tree or a rib cage. It is a reference atlas, not a patient reconstruction or a universal anatomical standard.
