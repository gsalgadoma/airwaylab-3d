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
