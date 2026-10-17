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
