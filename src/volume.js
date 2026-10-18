const vtk=window.vtk;
const {vtkGenericRenderWindow}=vtk.Rendering.Misc;
const {vtkImageData}=vtk.Common.DataModel;
const {vtkDataArray}=vtk.Common.Core;
const {vtkXMLImageDataReader}=vtk.IO.XML;
const {vtkVolume,vtkVolumeMapper,vtkColorTransferFunction}=vtk.Rendering.Core;
const {vtkPiecewiseFunction}=vtk.Common.DataModel;
const output=document.getElementById('status');const status=s=>output.textContent=s;
try{
const full=vtkGenericRenderWindow.newInstance({background:[0.02,0.055,0.10]});full.setContainer(document.getElementById('viewport'));full.resize();const render=full.getRenderer(),window3d=full.getRenderWindow();const actor=vtkVolume.newInstance(),mapper=vtkVolumeMapper.newInstance();mapper.setSampleDistance(1.5);actor.setMapper(mapper);render.addVolume(actor);
let scalarRange=[-1000,1400],hu=true;
function visual(){const preset=document.getElementById('preset').value,a=Number(document.getElementById('alpha').value),rgb=vtkColorTransferFunction.newInstance(),op=vtkPiecewiseFunction.newInstance();
const pts=preset==='bone'?[[-1000,0,0,0,0],[-200,0,0,0,0],[120,.55,.40,.35,.015],[400,.88,.79,.65,.18],[1200,1,1,.92,.85]]:preset==='air'?[[-1000,.05,.20,.28,.10],[-820,.14,.68,.75,.55],[-520,.20,.45,.58,.07],[-150,.12,.14,.18,.015],[500,.7,.78,.81,.025]]:[[-1000,0,0,0,0],[-300,.08,.08,.12,0],[-80,.48,.21,.20,.025],[50,.72,.45,.38,.14],[300,.9,.70,.59,.25],[1200,1,.95,.84,.6]];
const convert=(v)=>hu?v:scalarRange[0]+(v+1000)/2200*(scalarRange[1]-scalarRange[0]);
for(const [v,r,g,b,o] of pts){rgb.addRGBPoint(convert(v),r,g,b);op.addPoint(convert(v),o*a)}
actor.getProperty().setRGBTransferFunction(0,rgb);actor.getProperty().setScalarOpacity(0,op);actor.getProperty().setScalarOpacityUnitDistance(0,2);actor.getProperty().setInterpolationTypeToFastLinear();actor.getProperty().setShade(true);actor.getProperty().setAmbient(0.3);actor.getProperty().setDiffuse(0.65);actor.getProperty().setSpecular(0.15);mapper.setSampleDistance(Number(document.getElementById('step').value));window3d.render();}
function loadData(image,isHU,label){const scalars=image?.getPointData()?.getScalars();if(!scalars)throw Error('El archivo no contiene escalares volumétricos compatibles.');if(scalars.getNumberOfComponents()!==1)throw Error('Se requiere un volumen escalar de un solo componente.');scalarRange=scalars.getRange();hu=isHU;mapper.setInputData(image);render.resetCamera();visual();status(label+' · Rango: '+scalarRange.map(x=>Math.round(x)).join(' a ')+(isHU?' HU':' unidades'))}
function synthetic(){const N=96,vals=new Int16Array(N*N*N),cx=N/2,cy=N/2;for(let z=0;z<N;z++)for(let y=0;y<N;y++)for(let x=0;x<N;x++){let X=(x-cx)/N,Y=(y-cy)/N,Z=(z-N/2)/N;const outer=(X*X/.21+Y*Y/.15+Z*Z/.34)<1;const bone=(X*X+Y*Y)<.038&&Math.abs(Z)<.41&&Math.abs(X)>.13;const lumen=(X*X/.012+Y*Y/.011)<1&&Math.abs(Z)<.38;const wall=(X*X/.019+Y*Y/.018)<1&&Math.abs(Z)<.38;let value=-1000;if(outer)value=45;if(wall)value=130;if(lumen)value=-970;if(bone)value=900;vals[x+N*(y+N*z)]=value;}
const img=vtkImageData.newInstance();img.setDimensions(N,N,N);img.setSpacing(1,1,1);img.setOrigin(-N/2,-N/2,-N/2);img.getPointData().setScalars(vtkDataArray.newInstance({name:'Synthetic HU',values:vals,numberOfComponents:1}));loadData(img,true,'Fantoma sintético cargado (no es TC de paciente)');}
document.getElementById('demo').addEventListener('click',()=>{try{synthetic()}catch(e){status('Error al crear demostración: '+e.message)}});
document.getElementById('input').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{status('Leyendo archivo local...');const reader=vtkXMLImageDataReader.newInstance();reader.parseAsArrayBuffer(await file.arrayBuffer());const img=reader.getOutputData();loadData(img,false,'Volumen local: '+file.name+' (sin suponer unidades HU)')}catch(err){status('No fue posible cargar VTI: '+err.message)}});
for(const id of ['preset','alpha','step'])document.getElementById(id).addEventListener('input',visual);document.getElementById('reset').addEventListener('click',()=>{render.resetCamera();window3d.render()});new ResizeObserver(()=>full.resize()).observe(document.getElementById('viewport'));synthetic();
}catch(e){status('El motor 3D no pudo iniciar: '+e.message+'. Verifica WebGL y conexión.');console.error(e)}
