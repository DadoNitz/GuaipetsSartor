import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { LogoReveal } from './LogoReveal';

/* 8 s: sala com a caminha (zoom lento) → cachorro na caminha → logo reveal */
export const CenaFinal = () => {
  const f = useCurrentFrame();
  const zoomA = interpolate(f, [0, 90], [1.25, 1.05], { extrapolateRight: 'clamp' });
  const fadeB = interpolate(f, [70, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoomB = interpolate(f, [70, 150], [1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Img src={staticFile('cama-patchwork.jpg')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoomA})` }} />
      <Img src={staticFile('poltrona.jpg')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: fadeB, transform: `scale(${zoomB})` }} />
      <Sequence from={140}><LogoReveal /></Sequence>
    </AbsoluteFill>
  );
};
