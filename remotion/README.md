# Vídeos da Guaipets (Remotion)

    npm install
    npm run studio        # pré-visualizar e ajustar
    npm run render:logo   # out/logo-reveal.mp4 (16:9). Vertical: npx remotion render LogoRevealVertical out/logo-vertical.mp4

`CenaFinal` gera a cena do fim do site. `npm run frames:cena` exporta os quadros direto para
`guaipets/rolagem/frames/cena/` (depois ajuste `SEQUENCIA` em `guaipets/rolagem/main.js`: ext `.jpeg`, digitos conforme os nomes gerados).
Quando o vídeo do Higgsfield chegar, coloque em `public/` e use `<OffthreadVideo>` no lugar das fotos.
