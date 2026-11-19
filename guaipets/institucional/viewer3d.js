/* Guaipets — visualizador 3D das caminhas (Three.js)
   A forma é modelada aqui; a pele vem das fotos reais (tex/*.jpg).
   Se existir um .glb escaneado em models/, ele é carregado no lugar do modelo procedural. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Fl1LEZFXzzsah8SKDLWeAM5ZmC/';
export const MODELOS = [
  { id: 'patchwork', forma: 'ret', pele: 'patchwork', rep: 3.2, debrum: 0x2a211d, linha: 'Linha Trabalhada', nome: 'Retangular Patchwork', glb: 'models/retangular-patchwork.glb', thumb: CDN + 'd2a086c9-93b6-4956-a2c3-3afb039def7b.jpg', desc: 'Recortes de couro malhado em chevron, borda debruada e almofada central em couro preto.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Patchwork'], ['Pele', 'Malhada natural']] },
  { id: 'redonda', forma: 'red', pele: 'chevron', rep: 4, debrum: 0x161414, linha: 'Linha Trabalhada', nome: 'Redonda Chevron', glb: 'models/redonda-chevron.glb', thumb: CDN + 'c7b735d1-df32-4304-be35-6da092be9d0d.jpg', desc: 'Formato ninho, laterais altas em patchwork chevron preto e branco para o pet se enrolar.', specs: [['Formato', 'Redonda'], ['Acabamento', 'Patchwork chevron'], ['Pele', 'Preto e branco']] },
  { id: 'laranja', forma: 'ret', pele: 'laranja', rep: 3, debrum: 0x1c2a48, linha: 'Linha Tingida', nome: 'Retangular Laranja', glb: 'models/retangular-laranja.glb', thumb: CDN + '842faed1-dffc-4981-835a-6e4b980607f0.jpg', desc: 'Pelo longo com tingimento laranja intenso e debrum em couro marinho.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Tingimento especial']] },
  { id: 'malhada', forma: 'ret', pele: 'malhada', rep: 3, debrum: 0x161414, linha: 'Linha Exclusiva', nome: 'Retangular Malhada', glb: 'models/retangular-malhada.glb', thumb: 'img/pele-malhada.jpg', desc: 'Pele malhada marrom e branca, única em cada peça, com debrum em couro preto.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Exclusiva']] },
  { id: 'cinza', forma: 'ret', pele: 'cinza', rep: 3, debrum: 0x161414, linha: 'Linha Lisa', nome: 'Retangular Cinza', glb: 'models/retangular-cinza.glb', thumb: 'img/pele-cinza.jpg', desc: 'Pelo curto cinza mesclado, discreta e fácil de combinar.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Cinza natural']] },
  { id: 'verde', forma: 'ret', pele: 'verde', rep: 3, debrum: 0x14110f, linha: 'Linha Tingida', nome: 'Retangular Verde', glb: 'models/retangular-verde.glb', thumb: 'img/pele-verde.jpg', desc: 'Pelo longo tingido em verde profundo com debrum em couro escuro.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Tingimento especial']] },
];

export function criarVisualizador(palco) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'cena3d';
  palco.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  camera.position.set(1.9, 1.35, 2.2);

  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x8a7360, 0.55));
  const sol = new THREE.DirectionalLight(0xffffff, 2.2);
  sol.position.set(2.5, 4, 2);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.camera.left = sol.shadow.camera.bottom = -1.5;
  sol.shadow.camera.right = sol.shadow.camera.top = 1.5;
  sol.shadow.radius = 6; sol.shadow.bias = -0.0005;
  scene.add(sol);
  const contra = new THREE.DirectionalLight(0xffe2c4, 0.8); contra.position.set(-3, 2, -2.5); scene.add(contra);

  const chao = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.22 }));
  chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; scene.add(chao);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.target.set(0, 0.14, 0);
  controls.minDistance = 1.2; controls.maxDistance = 4.5;
  controls.maxPolarAngle = Math.PI / 2.08; controls.enablePan = false;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.1;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(volta); });
  let volta; controls.addEventListener('end', () => { volta = setTimeout(() => controls.autoRotate = true, 4000); });

  const loader = new THREE.TextureLoader(), cache = {};
  function tex(nome, rep = 1) {
    const k = nome + '@' + rep;
    if (cache[k]) return cache[k];
    const c = loader.load('tex/' + nome + '.jpg');
    c.colorSpace = THREE.SRGBColorSpace; c.wrapS = c.wrapT = THREE.MirroredRepeatWrapping;
    c.repeat.set(rep, 1); c.anisotropy = 8; return (cache[k] = c);
  }
  const pelo = (m) => new THREE.MeshPhysicalMaterial({ map: tex(m.pele, m.rep), roughness: 0.92, sheen: 1, sheenRoughness: 0.55, sheenColor: new THREE.Color(0xffffff).multiplyScalar(0.35) });
  const couro = () => new THREE.MeshPhysicalMaterial({ map: tex('couro', 1), color: 0x3a3430, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.6 });
  const debrum = (cor) => new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.42, clearcoat: 0.4 });

  function retArredondado(L, W, r) {
    const s = new THREE.Shape(), x = -L / 2, y = -W / 2;
    s.moveTo(x + r, y); s.lineTo(x + L - r, y); s.quadraticCurveTo(x + L, y, x + L, y + r);
    s.lineTo(x + L, y + W - r); s.quadraticCurveTo(x + L, y + W, x + L - r, y + W);
    s.lineTo(x + r, y + W); s.quadraticCurveTo(x, y + W, x, y + W - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  function caminho(L, W, r, alt, n = 220) {
    const pts = retArredondado(L, W, r).getSpacedPoints(n).slice(0, -1).map(p => new THREE.Vector3(p.x, alt, p.y));
    return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  }
  function sombra(o) { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; }

  function camaRetangular(m) {
    const g = new THREE.Group(), L = 1.15, W = 0.82;
    const base = new THREE.Mesh(new THREE.ExtrudeGeometry(retArredondado(L - 0.06, W - 0.06, 0.16), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.03, bevelSegments: 4, curveSegments: 24 }), pelo(m));
    base.rotation.x = -Math.PI / 2; base.position.y = 0.025; g.add(base);
    const rimPath = caminho(L - 0.26, W - 0.26, 0.12, 0.17);
    const rim = new THREE.Mesh(new THREE.TubeGeometry(rimPath, 260, 0.135, 28, true), pelo(m));
    rim.scale.set(1, 1.12, 1); g.add(rim);
    const pip1 = new THREE.Mesh(new THREE.TubeGeometry(caminho(L - 0.26, W - 0.26, 0.12, 0.17 + 0.135 * 1.12 * 0.98), 260, 0.011, 8, true), debrum(m.debrum)); g.add(pip1);
    const pip2 = new THREE.Mesh(new THREE.TubeGeometry(caminho(L - 0.02, W - 0.02, 0.17, 0.03), 260, 0.012, 8, true), debrum(m.debrum)); g.add(pip2);
    const alm = new THREE.Mesh(new THREE.ExtrudeGeometry(retArredondado(L - 0.6, W - 0.6, 0.06), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 6, curveSegments: 20 }), couro());
    alm.rotation.x = -Math.PI / 2; alm.position.y = 0.1; g.add(alm);
    return sombra(g);
  }
  function camaRedonda(m) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.08, 96), pelo(m)); base.position.y = 0.04; g.add(base);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.17, 40, 160), pelo({ ...m, rep: 6 }));
    rim.rotation.x = Math.PI / 2; rim.scale.set(1, 1, 1.25); rim.position.y = 0.2; g.add(rim);
    const alm = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.31, 0.09, 72), couro()); alm.position.y = 0.11; g.add(alm);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), couro()); top.scale.y = 0.15; top.position.y = 0.155; g.add(top);
    return sombra(g);
  }

  let atual = null, ativo = true;
  const gltf = new GLTFLoader();
  async function existe(url) { try { const r = await fetch(url, { method: 'HEAD' }); return r.ok && !(r.headers.get('content-type') || '').includes('text/html'); } catch (e) { return false; } }

  async function mostrar(m) {
    if (atual) { scene.remove(atual); atual.traverse(c => { if (c.isMesh) c.geometry.dispose(); }); }
    let obj;
    if (await existe(m.glb)) {
      obj = (await gltf.loadAsync(m.glb)).scene;
      const caixa = new THREE.Box3().setFromObject(obj), tam = caixa.getSize(new THREE.Vector3()), esc = 1.15 / Math.max(tam.x, tam.z);
      obj.scale.setScalar(esc); caixa.setFromObject(obj); obj.position.y -= caixa.min.y; sombra(obj);
    } else obj = m.forma === 'red' ? camaRedonda(m) : camaRetangular(m);
    atual = obj; scene.add(obj);
    obj.scale.multiplyScalar(0.92);
    const alvo = obj.scale.x / 0.92, t0 = performance.now();
    (function cresce(t) { const k = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - k, 3); obj.scale.setScalar(alvo * (0.92 + 0.08 * e)); if (k < 1) requestAnimationFrame(cresce); })(t0);
  }

  function ajustar() {
    const w = palco.clientWidth, h = palco.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(palco); ajustar();
  new IntersectionObserver(es => { ativo = es[0].isIntersecting; }).observe(palco);
  renderer.setAnimationLoop(() => { if (!ativo) return; controls.update(); renderer.render(scene, camera); });
  return { mostrar };
}
