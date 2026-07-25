# Landing Page — Dra. Maria Eduarda Deon Ceccato

Landing page (HTML/CSS/JS) para a Dra. Maria Eduarda Deon Ceccato —
Otorrinolaringologia / Rinologia, em Porto Alegre e Grande POA.

Construída em HTML/CSS/JS puro, com estrutura pensada para **migração ao Framer**
(seções bem delimitadas, tokens de cor/tipografia em variáveis CSS, layout em flex/grid).

## Como visualizar
Abra o arquivo `index.html` no navegador (duplo clique) ou rode um servidor local:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura
```
index.html            Página única com seções ancoradas
css/styles.css        Tokens (cores, fontes) + estilos
js/script.js          Menu mobile, header ao rolar, reveal on scroll
assets/fonts/         Black Mango (títulos) e Garet (textos)
assets/logo/          Monograma DC (SVG)
assets/img/           Imagens (placeholder da foto)
BRAND.md              Briefing de marca e pendências
```

## Substituir os placeholders
- **Foto da Dra.:** salve o arquivo em `assets/img/dra-maria-eduarda.jpg` e troque o
  `src` das duas tags `<img>` marcadas com comentário no `index.html`
  (hero e seção "Sobre").
- **Logo:** substitua `assets/logo/dc-monogram.svg` pelo arquivo oficial (o atual é uma
  recriação aproximada). Como usa `currentColor`, herda a cor do contexto.

## Identidade
- **Cores:** creme, bege, camel, terracota, verde sálvia e azul marinho (ver `:root` no CSS).
- **Tipografia:** Black Mango (títulos) · Garet (textos).
- **CTA:** WhatsApp `https://wa.me/5551995337479`.

## Pendências
Ver `BRAND.md` — logo em vetor, foto em arquivo e confirmação de cores oficiais.
