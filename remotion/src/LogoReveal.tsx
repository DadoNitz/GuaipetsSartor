import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const MARROM = '#2E1A16', AMARELO = '#F8B500';

export const LogoReveal = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const vertical = width < 1200;

  const icone = spring({ frame: frame - 10, fps, config: { damping: 12, mass: .8 } });
  const nome = interpolate(frame, [38, 72], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const tag = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const anel = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const saida = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ background: MARROM, alignItems: 'center', justifyContent: 'center', opacity: saida }}>
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: `2px solid ${AMARELO}33`, transform: `scale(${anel})`, opacity: 1 - anel * .6 }} />
      <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: vertical ? 40 : 48 }}>
        <Img src={staticFile('logo-icone.png')} style={{ width: vertical ? 260 : 220, transform: `scale(${icone}) rotate(${(1 - icone) * -220}deg)` }} />
        <Img src={staticFile('logo-nome-claro.png')} style={{ width: vertical ? 680 : 720, clipPath: `inset(0 ${nome}% 0 0)` }} />
      </div>
      <div style={{ position: 'absolute', bottom: vertical ? 560 : 200, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 72, color: AMARELO, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)` }}>
        ao nosso lado.
      </div>
    </AbsoluteFill>
  );
};
