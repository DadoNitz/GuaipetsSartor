/* Guaipets — experiência com rolagem
   GSAP + ScrollTrigger + SplitText + Lenis (smooth scroll).
   Se as bibliotecas não carregarem, a página mostra tudo sem animação. */

/* ========= Vídeo da cena final =========
   Exporte os quadros do vídeo (Higgsfield/Remotion):
   ffmpeg -i cena.mp4 -vf "scale=1600:-1,fps=30" frames/cena/%04d.webp
   e troque total pelo número de quadros. Com 0, usa as fotos provisórias. */
const SEQUENCIA = { pasta: 'frames/cena/', ext: '.webp', total: 0, digitos: 4 };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
document.getElementById('ano').textContent = new Date().getFullYear();

if (!window.gsap || !window.ScrollTrigger) {
  document.documentElement.classList.add('sem-anim');
} else {
  iniciar();
}

function iniciar() {
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduz) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const alvo = $(a.getAttribute('href')); if (!alvo) return;
      e.preventDefault(); lenis.scrollTo(alvo, { offset: 0, duration: 1.6 });
    }));
  }

  /* ---------- Barra de progresso e header ---------- */
  gsap.to('#progresso', { width: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  ['#historia', '#cena', '#contato'].forEach(id => ScrollTrigger.create({
    trigger: id, start: 'top 40px', end: 'bottom 40px',
    onToggle: s => $('#topo').classList.toggle('escuro', s.isActive)
  }));

  /* ---------- 1. HERO ---------- */
  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 801px)', mob: '(max-width: 800px)' }, ctx => {
    const { mob } = ctx.conditions;
    const foto = $('#heroFoto');
    gsap.set(foto, {
      width: () => mob ? innerWidth * .62 : innerWidth * .24,
      height: () => mob ? innerHeight * .5 : Math.min(innerWidth * .34, innerHeight * .62),
      top: () => innerHeight * (mob ? .95 : 1.02)
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } });
    tl.to('#rolar', { autoAlpha: 0, duration: .08 }, 0)
      .to('#heroTitulo', { yPercent: -80, autoAlpha: 0, duration: .32, ease: 'power2.in' }, 0)
      .to(foto, { top: () => innerHeight * .5, duration: .35, ease: 'power2.out' }, 0)
      .to(foto, { width: () => innerWidth, height: () => innerHeight, duration: .3, ease: 'power2.inOut' }, .3)
      .fromTo('#heroFoto img', { scale: 1.18 }, { scale: 1, duration: .65, ease: 'none' }, 0)
      .to('#heroVeu', { opacity: 1, duration: .2 }, .5)
      .fromTo('#heroSub', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .15 }, .62)
      .fromTo('#heroAssin', { y: 30, rotate: -14, autoAlpha: 0 }, { y: 0, rotate: -8, autoAlpha: 1, duration: .15 }, .72)
      .to({}, { duration: .13 });
  });

  /* título do hero entra letra a letra ao carregar */
  if (window.SplitText && !reduz) {
    const st = new SplitText('#heroTitulo h1', { type: 'lines,chars', linesClass: 'linha' });
    gsap.from(st.chars, { yPercent: 110, opacity: 0, duration: 1, ease: 'expo.out', stagger: .018, delay: .15 });
    gsap.from('#heroTitulo .eyebrow', { y: 12, opacity: 0, duration: .8, delay: .1 });
  }

  /* ---------- 2. HISTÓRIA (4 passos) ---------- */
  const passos = $$('.hist-passo'), fotos = $$('.hist-foto img'), dots = $$('.hist-dots i');
  gsap.set(passos, { autoAlpha: 0, y: 40 }); gsap.set(fotos, { autoAlpha: 0, scale: 1.08 });
  const th = gsap.timeline({ scrollTrigger: { trigger: '#historia', start: 'top top', end: 'bottom bottom', scrub: .8 } });
  passos.forEach((p, i) => {
    const t = i * 1;
    th.to(p, { autoAlpha: 1, y: 0, duration: .3 }, t)
      .to(fotos[i], { autoAlpha: 1, scale: 1, duration: .4 }, t)
      .to(dots[i], { backgroundColor: '#F8B500', duration: .1 }, t);
    if (i === 1) th.to({ n: 1 }, { n: 3, duration: .7, ease: 'none', onUpdate() { $('#contador').textContent = Math.round(this.targets()[0].n); } }, t + .1);
    if (i < passos.length - 1) th.to(p, { autoAlpha: 0, y: -40, duration: .3 }, t + .7).to(fotos[i], { autoAlpha: 0, duration: .3 }, t + .75);
  });
  th.to({}, { duration: .4 });

  /* ---------- 3. PRODUTO ---------- */
  const benefs = $$('.benef');
  gsap.set(benefs, { autoAlpha: 0, y: 30 });
  mm.add({ desk: '(min-width: 801px)', mob: '(max-width: 800px)' }, ctx => {
    const tp = gsap.timeline({ scrollTrigger: { trigger: '#produto', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tp.fromTo('#prodCama', { rotateY: -22, rotateX: 4, scale: .82 }, { rotateY: 22, rotateX: 10, scale: 1.04, duration: 1, ease: 'none' }, 0);
    if (ctx.conditions.mob) {
      benefs.forEach((b, i) => { const t = .1 + i * .14; tp.to(b, { autoAlpha: 1, y: 0, duration: .05 }, t); if (i < 5) tp.to(b, { autoAlpha: 0, y: -20, duration: .05 }, t + .12); });
    } else {
      benefs.forEach((b, i) => tp.to(b, { autoAlpha: 1, y: 0, duration: .08, ease: 'power2.out' }, .1 + i * .12));
    }
  });

  /* ---------- 4. PELES (trilho horizontal) ---------- */
  const trilho = $('#trilho');
  const mover = gsap.to(trilho, {
    x: () => -(trilho.scrollWidth - innerWidth), ease: 'none',
    scrollTrigger: { trigger: '#peles', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true }
  });
  $$('.pele img').forEach(img => gsap.fromTo(img, { xPercent: 8 }, {
    xPercent: -8, ease: 'none',
    scrollTrigger: { trigger: img.closest('.pele'), containerAnimation: mover, start: 'left right', end: 'right left', scrub: true }
  }));

  /* ---------- 5. NOLAH ---------- */
  gsap.fromTo('#nolahImg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.nolah-img', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.revela').forEach(el => gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));

  /* ---------- 6. CENA FINAL + LOGO REVEAL ---------- */
  const canvas = $('#cenaCanvas'), ctx2d = canvas.getContext('2d'), quadros = [];
  if (SEQUENCIA.total > 0) {
    canvas.style.display = 'block'; $('#cenaA').style.display = $('#cenaB').style.display = 'none';
    for (let i = 1; i <= SEQUENCIA.total; i++) { const im = new Image(); im.src = SEQUENCIA.pasta + String(i).padStart(SEQUENCIA.digitos, '0') + SEQUENCIA.ext; quadros.push(im); }
  }
  const video = { f: 0 };
  let ultimo = -1;
  function desenha() {
    const i = Math.round(video.f * (quadros.length - 1)); if (i === ultimo) return;
    const im = quadros[i]; if (!im || !im.complete || !im.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio, 2), w = innerWidth * dpr, h = innerHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    ctx2d.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh); ultimo = i;
  }

  const tc = gsap.timeline({ scrollTrigger: { trigger: '#cena', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  if (quadros.length) tc.to(video, { f: 1, duration: 5, ease: 'none', onUpdate: desenha }, 0);
  else tc.fromTo('#cenaA', { scale: 1.25 }, { scale: 1.04, duration: 3, ease: 'none' }, 0)
         .to('#cenaA', { autoAlpha: 0, duration: 1.2 }, 2.7)
         .fromTo('#cenaB', { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 2.3, ease: 'none' }, 2.7);
  tc.fromTo('#cenaLegenda', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .5 }, 1.2)
    .to('#cenaLegenda', { autoAlpha: 0, y: -20, duration: .4 }, 4)
    .to('#cenaEscuro', { opacity: .94, duration: .8 }, 5)
    .fromTo('#manif', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .5 }, 5.5)
    .to('#manif', { autoAlpha: 0, y: -30, duration: .4 }, 6.7)
    .to('#cenaEscuro', { opacity: 1, duration: .3 }, 6.9)
    .fromTo('#rIcone', { autoAlpha: 0, scale: .2, rotate: -220 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, 7.2)
    .fromTo('#rNome', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut' }, 7.9)
    .fromTo('#rTag', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5 }, 8.7)
    .fromTo('#rCta', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5 }, 9.1)
    .to({}, { duration: .6 });

  /* ---------- botões magnéticos ---------- */
  if (matchMedia('(hover: hover)').matches) $$('.btn').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .4); });
    b.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
}
