import {frameExtents,fitDistance} from './framing.js';
import {loadBodyParts} from './bodyparts.js';
import {synchronizeProjection} from './cameras.js';
import * as THREE from 'https://esm.sh/three@0.170.0';
import {OrbitControls} from 'https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js';
const items=[
['hyoid','Hueso hioides','Soporte','Soporte óseo suspendido superior a la laringe.','Participa en el desplazamiento del complejo hiolaríngeo durante la deglución.',0xe6bd89,'larynx'],
['epiglottis','Epiglotis','Supraglotis','Cartílago elástico relacionado con la entrada laríngea.','Su inversión contribuye al cierre del vestíbulo laríngeo en la deglución.',0xe5a47a,'larynx'],
['thyroid','Cartílago tiroides','Laringe','Cartílago anterior que protege y sostiene la región glótica.','Marco cartilaginoso que participa en el control de la tensión de los pliegues vocales.',0x71b4bf,'larynx'],
['cricoid','Cartílago cricoides','Laringe','Cartílago inferior laríngeo de forma anular completa.','Soporte estructural subglótico.',0x91d3c8,'larynx'],
['folds','Pliegues vocales','Glotis','Estructuras pares que delimitan la rima glótica.','La abducción facilita la inspiración y la aducción participa en fonación y protección.',0xf0c2b4,'larynx'],
['trachea','Tráquea','Vía aérea inferior','Conducto que conecta la laringe con los bronquios principales.','Conducción del aire y aclaramiento mucociliar.',0x78add4,'lower'],
['rings','Anillos traqueales','Vía aérea inferior','Soportes cartilaginosos generalmente incompletos posteriormente.','Contribuyen a la permeabilidad traqueal.',0xbed5ec,'lower'],
['bronchi','Bronquios principales','Vía aérea inferior','Ramas principales desde la bifurcación traqueal.','Conducen el flujo aéreo hacia ambos pulmones.',0x78a2d2,'lower']];
items.push(['arytenoids','Cartílagos aritenoides','Laringe','Cartílagos pares representados por las mallas independientes derecha e izquierda de BodyParts3D.','Participan en la posición de los pliegues vocales; aquí se muestran estáticos.',0xdca5b5,'larynx'],['ligaments','Ligamentos vocales','Glotis','Mallas de los ligamentos vocales derecho e izquierdo. No representan todo el pliegue vocal.','Contribuyen al soporte del borde vocal. No se simula su vibración.',0xf0c2b4,'larynx']);
const lookup=Object.fromEntries(items.map(d=>[d[0],d]));let selected='thyroid';
const scene=new THREE.Scene();const group=new THREE.Group();scene.add(group);scene.add(new THREE.HemisphereLight(0xffffff,0x2c5667,2.2));const light=new THREE.DirectionalLight(0xffffff,2.4);light.position.set(3,5,6);scene.add(light);
function createRenderer(id){const host=document.getElementById(id);const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.appendChild(renderer.domElement);return {host,renderer}}
const a=createRenderer('three'),b=createRenderer('projection');
const camera=new THREE.PerspectiveCamera(40,1,.1,60);camera.position.set(0,-.3,11);
const ortho=new THREE.OrthographicCamera(-3.5,3.5,3.5,-3.5,.1,60);ortho.position.set(0,0,12);
const controls=new OrbitControls(camera,a.renderer.domElement);controls.enableDamping=true;controls.target.set(0,-.3,0);controls.minDistance=5;controls.maxDistance=19;controls.update();
let realModel=null, pendingModel=null;let activeMode='schematic';const meshMap=new Map();function add(id,geometry,pos,rot,scale){const d=lookup[id];const o=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:d[5],transparent:true,opacity:.86,roughness:.56,side:THREE.DoubleSide}));o.position.set(...pos);if(rot)o.rotation.set(...rot);if(scale)o.scale.set(...scale);o.userData.id=id;group.add(o);if(!meshMap.has(id))meshMap.set(id,[]);meshMap.get(id).push(o);return o}
add('hyoid',new THREE.TorusGeometry(.6,.08,10,40,Math.PI*1.5),[0,2.15,.0],[0,0,Math.PI*.75]);add('epiglottis',new THREE.SphereGeometry(.31,22,14),[0,1.54,-.15],[.35,0,0],[.85,1.4,.34]);add('thyroid',new THREE.CylinderGeometry(.69,.52,1.15,4,1,true),[0,1,0],[0,Math.PI/4,0],[1,1,.86]);add('cricoid',new THREE.TorusGeometry(.47,.105,10,34),[0,.22,0],[Math.PI/2,0,0]);
const left=add('folds',new THREE.BoxGeometry(.5,.06,.18),[-.28,.6,.22],[0,0,.12]),right=add('folds',new THREE.BoxGeometry(.5,.06,.18),[.28,.6,.22],[0,0,-.12]);
add('trachea',new THREE.CylinderGeometry(.37,.37,2.9,32,1,true),[0,-1.4,0]);for(let i=0;i<8;i++)add('rings',new THREE.TorusGeometry(.39,.055,10,36),[0,-.18-i*.35,0],[Math.PI/2,0,0]);
add('bronchi',new THREE.CylinderGeometry(.23,.23,1.6,24,1,true),[-.6,-3.32,0],[0,0,-.67]);add('bronchi',new THREE.CylinderGeometry(.23,.23,1.6,24,1,true),[.6,-3.32,0],[0,0,.67]);
const can=new THREE.Group();group.add(can);const material=new THREE.MeshStandardMaterial({color:0x96d2e4,transparent:true,opacity:.75,roughness:.38});const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,1,24),material);shaft.rotation.x=1.05;shaft.position.set(0,-.7,.4);can.add(shaft);const flange=new THREE.Mesh(new THREE.BoxGeometry(.8,.13,.15),material);flange.position.set(0,-.49,.8);can.add(flange);const cuff=new THREE.Mesh(new THREE.TorusGeometry(.32,.12,10,32),new THREE.MeshStandardMaterial({color:0x8de0ec,transparent:true,opacity:.5}));cuff.rotation.x=Math.PI/2;cuff.position.set(0,-1.25,0);can.add(cuff);can.visible=false;
function activeMeshes(){return activeMode==='bodyparts'?realModel.meshMap:meshMap}
function activeGroup(){return activeMode==='bodyparts'?realModel.group:group}
function apply(){const region=document.getElementById('layer').value,opacity=+document.getElementById('opacity').value;activeMeshes().forEach((arr,id)=>arr.forEach(m=>{m.visible=region==='all'||lookup[id][6]===region;m.material.color.setHex(lookup[id][5]);m.material.opacity=id===selected?Math.min(1,opacity+.1):opacity;m.material.emissive.setHex(id===selected?0x17474f:0);m.material.emissiveIntensity=id===selected?.8:0}));}
function updateMode(){
  group.visible=activeMode==='schematic';if(realModel)realModel.group.visible=activeMode==='bodyparts';
  for(const id of ['glottis','trach'])document.getElementById(id).disabled=activeMode==='bodyparts';
  document.querySelectorAll('[data-anat]').forEach(button=>{button.disabled=!activeMeshes().has(button.dataset.anat);button.title=button.disabled?'Estructura no disponible como malla independiente en este modelo.':''});
  document.getElementById('model-note').textContent=activeMode==='bodyparts'?'BodyParts3D 4.0 · Mallas anatómicas estáticas. Ligamentos vocales, no pliegues completos. Los anillos no están segmentados individualmente. Para movimientos y cánula, cambia al modelo esquemático.':'Modelo construido con primitivas. Movimientos y cánula conceptuales, sin validación anatómica ni clínica.';
  document.getElementById('glottis-note').hidden=activeMode==='bodyparts';
  if(!activeMeshes().has(selected))selected='thyroid';select(selected);fit();
  const status=document.getElementById('renderStatus');status.textContent='Visores sincronizados listos · '+(activeMode==='bodyparts'?'BodyParts3D 4.0':'modelo esquemático');status.dataset.model=activeMode;
}
async function changeModel(){
  const select=document.getElementById('model');
  if(select.value==='schematic'){activeMode='schematic';updateMode();return}
  try{
    document.getElementById('renderStatus').textContent='Cargando anatomía BodyParts3D…';
    if(!realModel){pendingModel??=loadBodyParts();realModel=await pendingModel;scene.add(realModel.group);realModel.group.visible=false;}
    if(select.value!=='bodyparts')return;
    activeMode='bodyparts';updateMode();
  }catch(error){pendingModel=null;select.value='schematic';activeMode='schematic';updateMode();document.getElementById('renderStatus').textContent='No se pudo cargar BodyParts3D: '+error.message+'. Modelo esquemático disponible; selecciona BodyParts3D para reintentar.';}
}
document.getElementById('model').addEventListener('change',changeModel);
function select(id){selected=id;const d=lookup[id];document.getElementById('structure-source').textContent=activeMode==='bodyparts'?'BodyParts3D 4.0 · '+[...new Set(realModel.manifest.meshes.filter(m=>m.structure===id).map(m=>m.fma))].join(' / '):'Geometría esquemática';document.getElementById('category').textContent=d[2];document.getElementById('title').textContent=d[1];document.getElementById('description').textContent=d[3];document.getElementById('function').textContent=d[4];document.querySelectorAll('[data-anat]').forEach(el=>el.classList.toggle('active',el.dataset.anat===id));apply()}
for(const d of items){const btn=document.createElement('button');btn.dataset.anat=d[0];btn.textContent=d[1];btn.addEventListener('click',()=>select(d[0]));document.getElementById('structures').append(btn)}
for(const id of ['layer','opacity'])document.getElementById(id).addEventListener('input',apply);
function glottis(){const v=document.getElementById('glottis').value,gap=v==='breath'?.35:v==='voice'?.02:.15;left.position.x=-.27-gap/2;right.position.x=.27+gap/2;document.getElementById('glottis-note').textContent={breath:'Abducción glótica conceptual.',rest:'Apertura de reposo esquemática.',voice:'Aducción esquemática: no se simula vibración ni sonido.'}[v]}document.getElementById('glottis').addEventListener('change',glottis);glottis();
function trach(){const mode=document.getElementById('trach').value;can.visible=mode!=='none';cuff.visible=mode==='cuff';document.getElementById('trach-note').textContent={none:'Respiración a través de la vía aérea superior.',cuff:'Con cuff inflado, el flujo depende del sellado y del circuito. Nunca utilizar una válvula de fonación unidireccional con cuff inflado.',open:'Con cuff desinflado puede existir flujo por la cánula y a su alrededor; depende de la permeabilidad y resistencia.',valve:'La válvula unidireccional permite inspiración por cánula y espiración hacia vía aérea superior solo con cuff completamente desinflado, permeabilidad comprobada y evaluación clínica.'}[mode]}document.getElementById('trach').addEventListener('change',trach);trach();
const poses={front:[0,0,1],side:[1,0,0],back:[0,0,-1],top:[0,1,.001]};
function modelSphere(){return new THREE.Box3().setFromObject(activeGroup()).getBoundingSphere(new THREE.Sphere())}
function fit(){
  const sphere=modelSphere();const direction=camera.position.clone().sub(controls.target).normalize();
  controls.target.copy(sphere.center);
  const bounds=new THREE.Box3().setFromObject(activeGroup());
  const distance=fitDistance(bounds,camera);
  camera.position.copy(sphere.center).addScaledVector(direction,distance);camera.far=Math.max(200,distance+sphere.radius*4);camera.updateProjectionMatrix();
  controls.minDistance=sphere.radius*.5;controls.maxDistance=Math.max(40,distance*3);controls.update();resize();
}
function pose(type){const center=modelSphere().center;controls.target.copy(center);camera.position.copy(center).add(new THREE.Vector3(...poses[type]).multiplyScalar(11));controls.update();fit();document.querySelectorAll('[data-pose]').forEach(el=>el.classList.toggle('active',el.dataset.pose===type))}
document.querySelectorAll('[data-pose]').forEach(el=>el.addEventListener('click',()=>pose(el.dataset.pose)));document.getElementById('reset').addEventListener('click',()=>pose('front'));
document.getElementById('fit').addEventListener('click',fit);
const ray=new THREE.Raycaster(),p=new THREE.Vector2();a.renderer.domElement.addEventListener('click',e=>{const r=a.renderer.domElement.getBoundingClientRect();p.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(p,camera);const hit=ray.intersectObject(activeGroup(),true).find(h=>h.object.visible&&h.object.userData.id);if(hit)select(hit.object.userData.id)});
const questions=[['¿Qué cartílago forma un anillo completo?',['Tiroides','Cricoides','Epiglotis'],1,'El cricoides conforma un anillo completo.'],['¿Qué movimiento de los pliegues vocales facilita la inspiración?',['Abducción','Aducción','Vibración'],0,'La abducción amplía la apertura glótica.'],['¿En qué condición está contraindicada la válvula de fonación unidireccional?',['Cuff inflado','Cuff desinflado y vía superior permeable','Paciente vigilado'],0,'Con cuff inflado se puede bloquear la espiración y generar una situación peligrosa.']];let q=0;
function quiz(){const item=questions[q],div=document.getElementById('options');div.replaceChildren();document.getElementById('question').textContent=item[0];document.getElementById('feedback').textContent='';item[1].forEach((txt,i)=>{let button=document.createElement('button');button.textContent=txt;button.onclick=()=>document.getElementById('feedback').textContent=(i===item[2]?'✓ Correcto. ':'Revisar. ')+item[3];div.append(button)})}document.getElementById('next').addEventListener('click',()=>{q=(q+1)%questions.length;quiz()});quiz();
document.getElementById('atlasOpen').onclick=()=>{const host=document.getElementById('atlasFrame');host.replaceChildren();const frame=document.createElement('iframe');frame.title='Atlas de laringe University of Dundee';frame.src='https://sketchfab.com/models/a00bc73a303c46248db6a13a88b23404/embed';frame.style.cssText='width:100%;height:500px;border:0;border-radius:10px';frame.allow='fullscreen;autoplay;xr-spatial-tracking';frame.allowFullscreen=true;frame.loading='lazy';host.append(frame)};document.getElementById('atlasClose').onclick=()=>document.getElementById('atlasFrame').replaceChildren();
function resize(){for(const x of [a,b]){const w=x.host.clientWidth,h=x.host.clientHeight;if(w&&h)x.renderer.setSize(w,h,false)}camera.aspect=a.host.clientWidth/Math.max(a.host.clientHeight,1);camera.updateProjectionMatrix();const aspect=b.host.clientWidth/Math.max(b.host.clientHeight,1),extents=frameExtents(new THREE.Box3().setFromObject(activeGroup()),camera.quaternion),height=Math.max(extents.y,extents.x/aspect)*1.22;ortho.left=-height*aspect;ortho.right=height*aspect;ortho.top=height;ortho.bottom=-height;ortho.updateProjectionMatrix()}
new ResizeObserver(()=>{resize();fit()}).observe(a.host);new ResizeObserver(()=>{resize();fit()}).observe(b.host);
function animate(){requestAnimationFrame(animate);controls.update();synchronizeProjection(camera,ortho,controls.target);a.renderer.render(scene,camera);b.renderer.render(scene,ortho)}select('thyroid');resize();animate();changeModel();
