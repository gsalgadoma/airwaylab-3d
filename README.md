# AirwayLab 3D

Laboratorio educativo interactivo de anatomía y fisiología de vía aérea.

## Acceso

- [Aplicación principal: exploración anatómica sincronizada](https://gsalgadoma.github.io/airwaylab-3d/)
- [Radiología MPR](https://gsalgadoma.github.io/airwaylab-3d/radiology.html)
- [Volúmenes VTI / vtk.js](https://gsalgadoma.github.io/airwaylab-3d/ct-viewer.html)

## Versión 0.3: rediseño de la experiencia

La página principal se reconstruyó desde cero con una escena Three.js y **dos cámaras sincronizadas sobre el mismo modelo**:

1. Exploración 3D con rotación, zoom, raycasting y selección de estructura.
2. Proyección ortográfica vinculada a la orientación del primer panel.
3. Capas anatómicas, transparencia y vistas predefinidas.
4. Fichas educativas y preguntas de repaso.
5. Simulación **conceptual** de postura glótica y de cánula de traqueostomía con estados de cuff / válvula.
6. Acceso opcional a un atlas externo de mayor fidelidad, sin suponer sincronización con él.
7. Acceso permanente a los módulos de radiología anteriores.

### Advertencias científicas
- **El modelo principal sigue siendo esquemático y no anatómicamente validado.** No representa un corte de TC, imagen endoscópica ni reconstrucción de paciente.
- La segunda cámara genera una proyección del mismo modelo, **no una endoscopía virtual**. Una cámara endoscópica auténtica exige una superficie luminal anatómicamente adecuada.
- El atlas de Dundee se visualiza incrustado desde Sketchfab con créditos en pantalla. No se descarga ni edita su geometría en esta versión.
- Las funciones de traqueostomía son material de enseñanza, **no instrucciones clínicas**; nunca utilizar una válvula de fonación unidireccional con cuff inflado.
- Los módulos radiológicos y el atlas son independientes y todavía no están sincronizados espacialmente.

## Próximos hitos verificables
1. Incorporar un modelo laríngeo GLB autorizado y correctamente segmentado con identificación de estructuras.
2. Vincular el atlas detallado al motor de renderizado propio **solo si su licencia, formato y segmentación lo permiten**.
3. Crear el modo endoscópico virtual después de revisar la anatomía luminal.
4. Adquirir legalmente un conjunto de TC cervical, revisar anonimización y licencias, y añadir sincronización con MPR.

## Pruebas
Abre la web, mueve la cámara izquierda y observa la orientación del panel derecho, elige vistas predefinidas, capas y opacidad, comprueba las fichas y prueba los escenarios de traqueostomía. La publicación en GitHub Pages no sustituye las pruebas en navegador.

## Créditos
AirwayLab — proyecto educativo de Gabriel Salgado Maldonado. Inspirado conceptualmente en [LearnCoronary](https://learncoronary.com/) y [DevRush/iiviewer](https://github.com/DevRush/iiviewer), **sin copiar su código**. Tecnologías: Three.js y GitHub Pages. Modelo externo de laringe: University of Dundee / Annie Campbell, derivado de BodyParts3D, con atribuciones y licencia en la fuente original.
