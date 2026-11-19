/* Guaipets — visualizador 3D das caminhas (Three.js)
   A forma é modelada aqui; a pele vem das fotos reais (tex/*.jpg).
   Se existir um .glb escaneado em models/, ele é carregado no lugar do modelo procedural. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Fl1LEZFXzzsah8SKDLWeAM5ZmC/';
/* Texturas contínuas geradas no Higgsfield a partir das fotos reais; sem URL, usa o recorte local em tex/ */
const TX = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Fl1LEZFXzzsah8SKDLWeAM5ZmC/';
const TEXTURAS = {
  patchwork: TX + 'd160706a-8ded-46a2-b2ec-3c5c0bec6e2c.jpg',
  chevron: TX + '9db99d1f-5a2b-4c90-b085-7af638535a6f.jpg',
  laranja: TX + '141dc955-14bd-4163-9c7d-b2a9fd7403cf.jpg',
  malhada: TX + 'f326f074-8b3f-4a50-a2c7-8ac077d3026f.jpg',
  cinza: TX + 'a2b28853-e238-45be-80a7-dbd641928006.jpg',
  verde: TX + 'd91efdea-3cc3-4442-804a-7a103293f1ca.jpg',
};
export const MODELOS = [
  { id: 'patchwork', forma: 'ret', pele: 'patchwork', rep: 5, debrum: 0x2a211d, linha: 'Linha Trabalhada', nome: 'Retangular Patchwork', glb: 'models/retangular-patchwork.glb', thumb: CDN + 'd2a086c9-93b6-4956-a2c3-3afb039def7b.jpg', desc: 'Recortes de couro malhado em chevron, borda debruada e almofada central em couro preto.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Patchwork'], ['Pele', 'Malhada natural']] },
  { id: 'redonda', forma: 'red', pele: 'chevron', rep: 4, debrum: 0x161414, linha: 'Linha Trabalhada', nome: 'Redonda Chevron', glb: 'models/redonda-chevron.glb', thumb: CDN + 'c7b735d1-df32-4304-be35-6da092be9d0d.jpg', desc: 'Formato ninho, laterais altas em patchwork chevron preto e branco para o pet se enrolar.', specs: [['Formato', 'Redonda'], ['Acabamento', 'Patchwork chevron'], ['Pele', 'Preto e branco']] },
  { id: 'laranja', forma: 'ret', pele: 'laranja', rep: 4.5, debrum: 0x1c2a48, linha: 'Linha Tingida', nome: 'Retangular Laranja', glb: 'models/retangular-laranja.glb', thumb: CDN + '842faed1-dffc-4981-835a-6e4b980607f0.jpg', desc: 'Pelo longo com tingimento laranja intenso e debrum em couro marinho.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Tingimento especial']] },
  { id: 'malhada', forma: 'ret', pele: 'malhada', rep: 3.5, debrum: 0x161414, linha: 'Linha Exclusiva', nome: 'Retangular Malhada', glb: 'models/retangular-malhada.glb', thumb: 'img/pele-malhada.jpg', desc: 'Pele malhada marrom e branca, única em cada peça, com debrum em couro preto.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Exclusiva']] },
  { id: 'cinza', forma: 'ret', pele: 'cinza', rep: 4.5, debrum: 0x161414, linha: 'Linha Lisa', nome: 'Retangular Cinza', glb: 'models/retangular-cinza.glb', thumb: 'img/pele-cinza.jpg', desc: 'Pelo curto cinza mesclado, discreta e fácil de combinar.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Cinza natural']] },
  { id: 'verde', forma: 'ret', pele: 'verde', rep: 4.5, debrum: 0x14110f, linha: 'Linha Tingida', nome: 'Retangular Verde', glb: 'models/retangular-verde.glb', thumb: 'img/pele-verde.jpg', desc: 'Pelo longo tingido em verde profundo com debrum em couro escuro.', specs: [['Formato', 'Retangular'], ['Acabamento', 'Liso'], ['Pele', 'Tingimento especial']] },
];

export function criarVisualizador(palco) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.88;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'cena3d';
  palco.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  camera.position.set(1.2, 1.3, 1.45);

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
  controls.target.set(0, 0.12, 0);
  controls.minDistance = 0.9; controls.maxDistance = 4.5;
  controls.maxPolarAngle = Math.PI / 2.08; controls.enablePan = false;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.1;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(volta); });
  let volta; controls.addEventListener('end', () => { volta = setTimeout(() => controls.autoRotate = true, 4000); });

  const loader = new THREE.TextureLoader().setCrossOrigin('anonymous'), cache = {};
  function tex(nome, rep = 1) {
    const k = nome + '@' + rep;
    if (cache[k]) return cache[k];
    const c = loader.load(TEXTURAS[nome] || ('tex/' + nome + '.jpg'));
    c.colorSpace = THREE.SRGBColorSpace; c.wrapS = c.wrapT = TEXTURAS[nome] ? THREE.RepeatWrapping : THREE.MirroredRepeatWrapping;
    c.repeat.set(rep, 1); c.anisotropy = 8; return (cache[k] = c);
  }
  const pelo = (m) => new THREE.MeshPhysicalMaterial({ map: tex(m.pele, m.rep), roughness: 0.92, sheen: 1, sheenRoughness: 0.55, sheenColor: new THREE.Color(0xffffff).multiplyScalar(0.2) });
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

  /* Perfil da borda (n = para fora do contorno, y = altura), varrido ao longo do contorno da cama */
  const PERFIL = new THREE.SplineCurve([
    [-0.115, 0.075], [-0.125, 0.15], [-0.115, 0.24], [-0.075, 0.305], [0, 0.325], [0.075, 0.3],
    [0.11, 0.23], [0.12, 0.13], [0.105, 0.04], [0.075, 0.0]
  ].map(([x, y]) => new THREE.Vector2(x, y))).getSpacedPoints(48);

  function contornoRet(L, W, r, n = 320) {
    return retArredondado(L, W, r).getSpacedPoints(n).slice(0, -1);
  }
  function contornoCirc(R, n = 320) {
    return Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R); });
  }
  function varrer(pts, perfil, repU, escala = 1) {
    const N = pts.length, M = perfil.length, pos = [], uv = [], idx = [];
    let total = 0; const acc = [0];
    for (let i = 1; i <= N; i++) { total += pts[i % N].distanceTo(pts[i - 1]); acc.push(total); }
    let perim = 0; const accV = [0];
    for (let j = 1; j < M; j++) { perim += perfil[j].distanceTo(perfil[j - 1]); accV.push(perim); }
    for (let i = 0; i <= N; i++) {
      const p = pts[i % N], prev = pts[(i - 1 + N) % N], next = pts[(i + 1) % N];
      const t = new THREE.Vector2().subVectors(next, prev).normalize();
      let nx = t.y, nz = -t.x; if (nx * p.x + nz * p.y < 0) { nx = -nx; nz = -nz; }
      for (let j = 0; j < M; j++) {
        const q = perfil[j];
        pos.push(p.x + nx * q.x * escala, q.y * escala, p.y + nz * q.x * escala);
        uv.push(acc[i] / total * repU, accV[j] / perim);
      }
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < M - 1; j++) {
      const a = i * M + j, b2 = (i + 1) * M + j;
      idx.push(a, b2, a + 1, b2, b2 + 1, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    // garante normais para fora
    const tri = new THREE.Triangle(), n = new THREE.Vector3(), c = new THREE.Vector3();
    tri.setFromAttributeAndIndices(g.attributes.position, idx[0], idx[1], idx[2]); tri.getNormal(n); tri.getMidpoint(c);
    if (n.y < 0 && c.y > 0.07) { g.index.array.reverse(); g.computeVertexNormals(); }
    return g;
  }
  function tuboContorno(pts, offN, y, raio, cor) {
    const v3 = pts.map((p, i) => {
      const prev = pts[(i - 1 + pts.length) % pts.length], next = pts[(i + 1) % pts.length];
      const t = new THREE.Vector2().subVectors(next, prev).normalize();
      let nx = t.y, nz = -t.x; if (nx * p.x + nz * p.y < 0) { nx = -nx; nz = -nz; }
      return new THREE.Vector3(p.x + nx * offN, y, p.y + nz * offN);
    });
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v3, true), 400, raio, 8, true), debrum(cor));
  }
  function montar(m, pts, fundo, almofada) {
    const g = new THREE.Group();
    const mat = pelo(m); mat.side = THREE.DoubleSide;
    g.add(new THREE.Mesh(varrer(pts, PERFIL, 1), mat));
    g.add(tuboContorno(pts, 0.088, 0.292, 0.009, m.debrum));
    g.add(tuboContorno(pts, 0.078, 0.006, 0.009, m.debrum));
    const chaoCama = new THREE.Mesh(fundo, pelo({ ...m, rep: 1 })); chaoCama.rotation.x = -Math.PI / 2; chaoCama.position.y = 0.002; g.add(chaoCama);
    const alm = new THREE.Mesh(almofada, couro()); alm.rotation.x = -Math.PI / 2; alm.position.y = 0.03; g.add(alm);
    return sombra(g);
  }
  function camaRetangular(m) {
    const L = 1.15, W = 0.84, c = 0.12, pts = contornoRet(L - 2 * c, W - 2 * c, 0.15);
    const fundo = new THREE.ShapeGeometry(retArredondado(L - 0.1, W - 0.1, 0.2), 24);
    const ai = 2 * c + 0.12, alm = new THREE.ExtrudeGeometry(retArredondado(L - ai, W - ai, 0.06), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 8, curveSegments: 24 });
    return montar(m, pts, fundo, alm);
  }
  function camaRedonda(m) {
    const pts = contornoCirc(0.44);
    const fundo = new THREE.CircleGeometry(0.52, 96);
    const s = new THREE.Shape(); s.absarc(0, 0, 0.3, 0, Math.PI * 2);
    const alm = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 8, curveSegments: 64 });
    const g = montar(m, pts, fundo, alm);
    g.children[0].scale.set(1, 1.18, 1); g.children[1].position.y = 0.292 * 0.18;
    return g;
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
