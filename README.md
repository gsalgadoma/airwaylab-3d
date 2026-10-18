# AirwayLab 3D

Laboratorio educativo interactivo de anatomía y fisiología de vía aérea.

## Acceso

- [Aplicación principal: exploración anatómica sincronizada](https://gsalgadoma.github.io/airwaylab-3d/)
- [Radiología MPR](https://gsalgadoma.github.io/airwaylab-3d/radiology.html)
- [Volúmenes VTI / vtk.js](https://gsalgadoma.github.io/airwaylab-3d/ct-viewer.html)

## Versión 0.4: anatomía BodyParts3D

La página principal se reconstruyó desde cero con una escena Three.js y **dos cámaras sincronizadas sobre el mismo modelo**:

1. Exploración 3D con rotación, zoom, raycasting y selección de estructura.
2. Proyección ortográfica vinculada a la orientación del primer panel.
3. Capas anatómicas, transparencia y vistas predefinidas.
4. Fichas educativas y preguntas de repaso.
5. Simulación **conceptual** de postura glótica y de cánula de traqueostomía con estados de cuff / válvula.
6. Acceso opcional a un atlas externo de mayor fidelidad, sin suponer sincronización con él.
7. Acceso permanente a los módulos de radiología anteriores.

### Advertencias científicas
- **El modelo inicial utiliza mallas de BodyParts3D 4.0.** Es un atlas de referencia, no una reconstrucción de paciente ni una validación clínica. El selector conserva el modelo esquemático para las simulaciones.
- La segunda cámara genera una proyección del mismo modelo, **no una endoscopía virtual**. Una cámara endoscópica auténtica exige una superficie luminal anatómicamente adecuada.
- El atlas de Dundee se visualiza incrustado desde Sketchfab con créditos en pantalla. No se descarga ni edita su geometría en esta versión.
- Las funciones de traqueostomía son material de enseñanza, **no instrucciones clínicas**; nunca utilizar una válvula de fonación unidireccional con cuff inflado.
- Los módulos radiológicos y el atlas son independientes y todavía no están sincronizados espacialmente.

## Próximos hitos verificables
1. Ampliar y revisar con un especialista el subconjunto BodyParts3D integrado, antes de utilizarlo como referencia docente definitiva.
2. Vincular el atlas detallado al motor de renderizado propio **solo si su licencia, formato y segmentación lo permiten**.
3. Crear el modo endoscópico virtual después de revisar la anatomía luminal.
4. Adquirir legalmente un conjunto de TC cervical, revisar anonimización y licencias, y añadir sincronización con MPR.

## Estabilización del 18 de octubre de 2026

Se conservó HTML y ES Modules: permite publicar directamente en GitHub Pages sin introducir una migración de framework durante la reparación. Cada página carga sus estilos y lógica desde `src/`.

- `src/anatomy.js` y `src/anatomy.css`: escena y contenido educativo existente.
- `src/cameras.js`: sincronización explícita de posición respecto al objetivo y orientación completa de las cámaras.
- `src/radiology.js` y `src/radiology.css`: integración NiiVue 0.57.0. El canvas está dentro de un contenedor de altura independiente; esto evita un ciclo de crecimiento entre la biblioteca y el tamaño del padre. Se eliminó el zoom arbitrario de 0.28 y se usa la transformación identidad de NiiVue, con distribución automática. MPR y MPR + 3D ahora tienen configuraciones distintas. La descarga tiene cancelación real y los controles de carga quedan bloqueados mientras se descarga la demostración. Cargar un archivo local recupera el canvas tras un fallo de la demostración.
- `src/volume.js` y `src/volume.css`: se utiliza la distribución de navegador `vtk.js@34.1.0/vtk.js`. La distribución modular anterior mediante esm.sh fallaba al importar `create` de xmlbuilder2 e impedía iniciar todo el módulo.
- `src/model-loader.js`: adaptador GLB/GLTF preparado para devolver un grupo, límites y un mapa de mallas por estructura. Recibe una URL y un diccionario de nombres de malla a identificadores educativos. Clona materiales para independizar la selección. `src/bodyparts.js` lo utiliza ahora para cargar el subconjunto anatómico inicial. La integración exige revisar licencia, escala, orientación y correspondencia de estructuras; el contenido educativo y la animación siguen asociados al modelo esquemático.

## Pruebas

### Datos anatómicos incluidos

El modo inicial carga `assets/bodyparts3d/airway.glb` mediante `src/bodyparts.js`. El manifiesto identifica cada malla por sus códigos FMA/FJ, con conteos de geometría y hashes. El conjunto incluye hioides, epiglotis, cartílagos tiroides, cricoides y aritenoides, ligamentos vocales, tráquea y porciones principales de ambos bronquios.

La fuente elegida es el archivo oficial **4.0 con reducción de polígonos del 99 %**. No se anuncia como versión 4.3 ni como mallas de resolución máxima. En esta versión los nombres de archivo son IDs FJ; se resuelven utilizando `isa_parts_list_e.txt` y `isa_element_parts.txt`. El archivo oficial actual declara **CC BY 4.0**, actualizado en febrero de 2025. Véanse [atribuciones y transformaciones](assets/bodyparts3d/ATTRIBUTION.md) y [metadatos por malla](assets/bodyparts3d/manifest.json).

`tools/build_bodyparts.py` reconstruye el GLB sin dependencias Python externas. Descarga el ZIP y las tablas de las URLs del manifiesto a `data/bodyparts3d/` como `source.zip`, `parts.tsv` y `elements.tsv`; después ejecuta `python tools/build_bodyparts.py`. El conversor conserva los vértices de origen, triangula caras y empaqueta las piezas con nombres independientes. En pantalla se aplica una rotación y una escala uniforme a todo el conjunto, se calculan normales y se asignan colores.

Los ligamentos vocales no se presentan como pliegues completos. No hay mallas independientes de anillos traqueales ni superficies luminales verificadas para endoscopia virtual. No se incluyen pulmones ni caja torácica en este subconjunto. Los controles de movimiento y cánula están disponibles al cambiar al modo esquemático. Si falla el GLB, ese modo permanece disponible y la carga puede reintentarse.

Se comprobó además la selección de ligamentos, la identificación del modelo cargado, la disponibilidad de controles según el modo y el cambio de ida y vuelta entre ambos modelos. Para comprobar la publicación se puede establecer `AIRWAYLAB_BASE_URL=https://gsalgadoma.github.io/airwaylab-3d/` antes de ejecutar `npm test`.

Instala Node.js y ejecuta `npm install`, `npx playwright install chromium` y `npm test`. Si Chrome está instalado en su ruta habitual de Windows se utiliza ese navegador. El ejecutor inicia y cierra un servidor local en el puerto 4173. Las bibliotecas CDN y la demostración requieren conexión a Internet.

Las pruebas abren los tres módulos a 1440 × 900 y 390 × 900, comprueban inicialización, ausencia de excepciones JavaScript y desbordamiento horizontal, selección anatómica, vistas predefinidas, advertencia del cuff, sincronización matemática de orientación con un objetivo desplazado, cambios de vista MPR, estabilidad del tamaño del canvas, carga NRRD local, preset volumétrico y reinicio de cámara. Guardan seis capturas en `test-results/` para revisión visual. Se verificaron además las capturas de MPR completo y del fantoma volumétrico.

La emulación de tamaño móvil no sustituye pruebas en teléfonos físicos. Quedan pendientes Safari/iOS, Firefox, GPUs reales, recuperación de pérdida de contexto WebGL y archivos clínicos de gran tamaño. La presencia de canvas y el estado de carga no equivalen a validación clínica ni a una comparación automática de píxeles. El subconjunto BodyParts3D se comprueba además en el navegador y conserva sus metadatos de procedencia.

Se incluyó únicamente un subconjunto de mallas oficiales BodyParts3D; no se añadieron nuevas simulaciones ni imágenes de pacientes. Continúan las limitaciones científicas señaladas arriba.

## Créditos
AirwayLab — proyecto educativo de Gabriel Salgado Maldonado. Inspirado conceptualmente en [LearnCoronary](https://learncoronary.com/) y [DevRush/iiviewer](https://github.com/DevRush/iiviewer), **sin copiar su código**. Tecnologías: Three.js y GitHub Pages. Modelo externo de laringe: University of Dundee / Annie Campbell, derivado de BodyParts3D, con atribuciones y licencia en la fuente original.
