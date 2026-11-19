# Sartor — Apresentações

Home da Sartor para escolher qual proposta apresentar ao cliente. Site estático, sem build (Vercel: Framework "Other", sem comando de build).

    npm run dev   # http://localhost:3000

## Projetos
- `guaipets/rolagem/` — experiência com rolagem (GSAP ScrollTrigger + Lenis, logo reveal)
- `guaipets/institucional/` — institucional clássico (GSAP + Lenis, visualizador 3D)
- `guaipets/landing/` — landing de conversão (GSAP + Lenis, microinterações)
- `remotion/` — vídeos (logo reveal e cena final) em Remotion; não vai para a Vercel

Animações: GSAP 3 (ScrollTrigger, SplitText) e Lenis via jsDelivr. Sem as libs, as páginas aparecem sem animação.

## Novo projeto
Crie uma pasta `<cliente>/<versao>/` com o `index.html` e adicione um card na home.

## Guaipets — pendências
- Vídeo da cena final (Higgsfield): exportar quadros para `guaipets/rolagem/frames/cena/` e ajustar `SEQUENCIA.total`.
- Confirmar e-mail, WhatsApp e loja (dados do institucional 2022).
