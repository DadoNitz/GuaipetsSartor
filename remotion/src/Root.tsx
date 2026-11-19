import { Composition } from 'remotion';
import { LogoReveal } from './LogoReveal';
import { CenaFinal } from './CenaFinal';

export const Root = () => (
  <>
    {/* Vinheta do logo: usar em Reels/Stories e como abertura de vídeos */}
    <Composition id="LogoReveal" component={LogoReveal} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="LogoRevealVertical" component={LogoReveal} durationInFrames={150} fps={30} width={1080} height={1920} />
    {/* Cena final do site: ambiente + logo. Quando o vídeo do Higgsfield chegar,
        troque as fotos por <OffthreadVideo src={staticFile('cena-higgsfield.mp4')} /> */}
    <Composition id="CenaFinal" component={CenaFinal} durationInFrames={240} fps={30} width={1600} height={900} />
  </>
);
