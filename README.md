# AirwayLab 3D

Visualizador educativo interactivo y esquemático de anatomía y fisiología de la vía aérea.

## Abrir
[Aplicación web en GitHub Pages](https://gsalgadoma.github.io/airwaylab-3d/) (disponible después de activar Pages en Settings → Pages → Deploy from a branch → main / root).

El archivo `index.html` es una aplicación estática autónoma y no requiere compilación. Necesita conexión a Internet para cargar Three.js desde esm.sh.

## Funciones
- Modelo 3D conceptual con rotación y zoom.
- Ocho grupos anatómicos seleccionables con fichas explicativas.
- Vistas anterior, lateral, posterior y superior.
- Selector de regiones anatómicas y transparencia.
- Estados glóticos esquemáticos: inspiración, reposo y fonación.
- Preguntas de autoevaluación con retroalimentación.

## Limitaciones
**Prototipo docente no validado anatómicamente**. La geometría es simplificada; las variaciones glóticas son ilustrativas, no una simulación biomecánica. No utilizar para decisiones clínicas, planificación quirúrgica ni entrenamiento procedimental.

## Próximos pasos
Integrar un modelo anatómico 3D validado, separar geometrías, incorporar cinemática laríngea contrastada, desarrollar vía aérea artificial/traqueostomía y realizar revisión experta.

## Créditos
AirwayLab 3D — Gabriel Salgado Maldonado. Inspiración conceptual: [DevRush/iiviewer](https://github.com/DevRush/iiviewer). No se ha incorporado código de ese repositorio en esta versión autónoma.


## Atlas de imágenes clínicas reales
El sitio incluye un panel separado del modelo esquemático. Cada imagen enlaza a su ficha original y conserva su atribución:
- [Laringoscopia normal](https://commons.wikimedia.org/wiki/File:Larynx_normal.jpg) — Welleschik, CC BY-SA 3.0.
- [Endolarynx vocal folds](https://commons.wikimedia.org/wiki/File:Endolarynx_vocal_folds.jpg) — Anatomist90, CC BY-SA 3.0.
- [Bronchoscopy](https://commons.wikimedia.org/wiki/File:Bronchoscopy.jpg) — National Cancer Institute/NIH, dominio público. **Imagen del procedimiento, no fotografía intraluminal.**

Las imágenes se cargan por URL desde Wikimedia Commons y requieren conexión a Internet. Las condiciones de reutilización están indicadas junto a cada recurso. No reutilizar las fotos sin preservar su crédito y requisitos de licencia. La fuente NIH [Interactive Larynx](https://3d.nih.gov/entries/3DPX-014756?version=2) se enlaza como candidato para integración futura; la licencia específica debe revisarse antes de copiar el modelo.

## Privacidad
No subir imágenes identificables de pacientes ni metadatos clínicos sin contar con autorización y anonimización apropiadas.


## Atlas 3D detallado de la Universidad de Dundee

Se incluye una visualización embebida y opcional (Sketchfab, carga mediante botón) de [Anatomy of the Larynx](https://sketchfab.com/3d-models/anatomy-of-the-larynx-a00bc73a303c46248db6a13a88b23404), editado y texturizado por Annie Campbell, University of Dundee School of Medicine. Basado en BodyParts3D, Database Center for Life Science. Licencia del modelo derivado: CC BY-SA 4.0 (revisar también atribuciones del material original CC BY-SA 2.1 Japan). El archivo del modelo no está alojado en este repositorio; se incrusta desde el proveedor. Su funcionamiento depende de la disponibilidad de Sketchfab y la conexión a Internet. No reemplaza el modelo 3D esquemático ni está sincronizado con él.

**Nota de exactitud:** La imagen Wikimedia `Endolarynx vocal folds.jpg` es fotografía de disección, no laringoscopía en vivo.


## Módulo de traqueostomía (MVP 0.2)
Se incorporó una **cánula 3D esquemática** en la escena original y un panel de estados:
- Sin cánula.
- Traqueostomía con cuff inflado.
- Traqueostomía con cuff desinflado y sin válvula.
- Válvula unidireccional de fonación con cuff completamente desinflado.

El esquema indica rutas conceptuales y **no simula** presiones, caudales, oclusiones, dinámica real ni tolerancia individual. **Nunca utilizar válvula de fonación con cuff inflado.** La indicación requiere comprobar permeabilidad de vía aérea superior, estabilidad clínica y valoración profesional; el material no es un protocolo clínico.

Una ficha de correlación permite saltar desde el explorador al atlas anatómico detallado. **La geometría del atlas externo Sketchfab no está sincronizada ni es seleccionable automáticamente por las fichas.**

Pruebas recomendadas tras desplegar: abrir la página, mover la cámara, alternar estados, verificar visibilidad de la cánula y confirmar que el enlace al atlas detallado funciona. 


## Visor volumétrico 3D de TC (experimental)

Abrir [ct-viewer.html](https://gsalgadoma.github.io/airwaylab-3d/ct-viewer.html). Implementa renderizado volumétrico acelerado por GPU con vtk.js y transferencia de color y opacidad, controles de calidad, rotación, zoom y apertura local de archivos `.vti` escalares.

**Al abrir se genera un fantoma 3D totalmente sintético en memoria. NO es una tomografía clínica real.** No usar con fines diagnósticos. El botón de archivo local utiliza File API y no sube el archivo a GitHub; el sitio depende de módulos JavaScript públicos cargados desde CDN, que recibirán conexiones de red. No abrir archivos identificables o no autorizados.

Los `.vti` reales deben convertirse desde fuentes autorizadas/anónimas con una herramienta como 3D Slicer, preservando orientación, espaciado, HU y metadatos apropiados. Por defecto, los archivos locales se tratan como valores escalares de unidad desconocida: el preset remapea su rango y no debe interpretarse como HU hasta comprobar y documentar una conversión calibrada. Esta versión todavía no soporta lectura directa de DICOM, MPR, segmentación clínica ni sincronización de cortes.

Requiere un navegador compatible con WebGL y conexión a Internet. El renderizador y la carga de archivos deben someterse a pruebas manuales en navegador y dispositivos de destino.


## Estación radiológica MPR + 3D

[Ir al visor radiológico](https://gsalgadoma.github.io/airwaylab-3d/radiology.html).

Módulo adicional basado en NiiVue 0.57.0 para:
- visualizar cortes axiales, coronales y sagitales y reconstrucciones 3D;
- cargar archivos locales NIfTI (`.nii`, `.nii.gz`) y NRRD;
- visualizar un ejemplo abierto de **RM cerebral MNI152** de la galería de demostración de NiiVue, que **no es un estudio de TC cervical**.

Este módulo no sustituye al visor experimental vtk.js existente (`ct-viewer.html`) ni implementa todavía Cornerstone3D u OHIF, ni lectura DICOMweb directa. Para una futura plataforma OHIF se requiere una fuente de DICOM validada con CORS y condiciones de acceso apropiadas. Un TC de cuello/línea aérea abierto y con redistribución autorizada queda pendiente de incorporación.

**Seguridad:** archivo de usuario procesado localmente sin endpoint de carga; no utilizar datos identificables sin autorización y medidas institucionales adecuadas. Conexiones de red al proveedor CDN y al volumen de demostración son necesarias. No apto para interpretación diagnóstica. Se requiere validación manual en navegador antes de uso docente.
