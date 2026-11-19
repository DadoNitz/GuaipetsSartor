/* Scroll Expand (inspirado no ScrollExpandMedia do React Bits / 21st.dev), em GSAP puro.
   Marcação:
   <section class="sx" data-sx>
     <div class="sx-palco">
       <div class="sx-fundo"><img src="..."></div>
       <div class="sx-midia"><video ...></video></div>
       <h2 class="sx-titulo"><span class="sx-a">Feita para</span><span class="sx-b">ficar perto.</span></h2>
       <p class="sx-dica">Role para expandir</p>
       <div class="sx-legenda">...</div>
     </div>
   </section> */
(function () {
  const css = `
  .sx{position:relative;height:320vh;padding:0!important;margin:0!important;max-width:none!important;width:auto!important}
  .sx-palco{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:grid;place-items:center}
  .sx-fundo{position:absolute;inset:0}
  .sx-fundo img{width:100%;height:100%;object-fit:cover;filter:blur(18px) saturate(.9) brightness(1.08);transform:scale(1.15)}
  .sx-fundo::after{content:'';position:absolute;inset:0;background:color-mix(in srgb,var(--sx-cor,#F6F1EB) 78%,transparent)}
  .sx-midia{position:relative;z-index:1;width:min(320px,62vw);height:min(420px,52vh);border-radius:28px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(46,26,22,.55);will-change:width,height,border-radius}
  .sx-midia video,.sx-midia img{width:100%;height:100%;object-fit:cover;display:block}
  .sx-midia::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,16,12,.55),transparent 45%);opacity:0;transition:opacity .4s}
  .sx-titulo{position:absolute;z-index:2;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.05em;margin:0;pointer-events:none;
    font-weight:400;font-size:clamp(2.6rem,7.5vw,6.6rem);line-height:1;letter-spacing:-.02em;color:#F6F1EB;mix-blend-mode:difference;text-align:center}
  .sx-titulo span{display:block;will-change:transform}
  .sx-dica{position:absolute;z-index:2;bottom:6vh;left:50%;transform:translateX(-50%);margin:0;font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--sx-texto,#7C6459)}
  .sx-legenda{position:absolute;z-index:3;left:6vw;bottom:10vh;max-width:34rem;color:#fff;opacity:0;transform:translateY(24px)}
  .sx-legenda .eyebrow{color:#F8B500}
  .sx-legenda p{font-size:clamp(1.2rem,2.2vw,1.8rem);line-height:1.35;margin-top:.7rem;font-weight:300;text-shadow:0 2px 20px rgba(0,0,0,.35)}
  @media(prefers-reduced-motion:reduce){.sx{height:auto}.sx-palco{position:relative}.sx-midia{width:100%;height:80vh;border-radius:0}.sx-titulo{display:none}.sx-legenda{opacity:1;transform:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function iniciar() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-sx]').forEach(sec => {
      const midia = sec.querySelector('.sx-midia');
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } });
      tl.to(midia, { width: () => innerWidth, height: () => innerHeight, borderRadius: 0, duration: 1, ease: 'power2.inOut' }, 0)
        .to(sec.querySelector('.sx-a'), { x: () => -innerWidth * .55, duration: 1, ease: 'power2.in' }, 0)
        .to(sec.querySelector('.sx-b'), { x: () => innerWidth * .55, duration: 1, ease: 'power2.in' }, 0)
        .to(sec.querySelector('.sx-titulo'), { autoAlpha: 0, duration: .25 }, .8)
        .to(sec.querySelector('.sx-dica'), { autoAlpha: 0, duration: .15 }, 0)
        .to(sec.querySelector('.sx-fundo'), { autoAlpha: 0, duration: .6 }, .4)
        .to(sec.querySelector('.sx-legenda'), { autoAlpha: 1, y: 0, duration: .3 }, 1.05)
        .to({}, { duration: .35 });
      ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: s => midia.style.setProperty('--veu', s.progress > .7 ? 1 : 0) });
    });
    ScrollTrigger.refresh();
    const vs = document.createElement('style'); vs.textContent = '.sx-midia::after{opacity:var(--veu,0)}'; document.head.appendChild(vs);
  }
  if (document.readyState === 'complete') iniciar(); else addEventListener('load', iniciar);
})();
