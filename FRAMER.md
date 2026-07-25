# Spec de migração para o Framer

> Documento de build. Traduz a landing HTML/CSS/JS deste repositório para
> construções **nativas** do Framer — não embed, não iframe.
>
> Projeto de destino: `https://framer.com/projects/Snow-State--XK7b062GvtBGT0A9gUKN-aarZy`
> (Project ID `XK7b062GvtBGT0A9gUKN`)
>
> Fonte da verdade do conteúdo: `index.html`. Fonte da verdade visual: `css/styles.css`.
> Identidade e tom de voz: `BRAND.md`.

## Por que este documento existe

O CSS usa `clamp()`, `color-mix()`, `vw` e unidades `ch` — coisas que o Framer não
tem como equivalente direto. O Framer trabalha com **valores concretos por
breakpoint**. Então a parte cara da migração não é montar layers: é resolver essas
funções em números.

Este spec já fez essa conta. Todos os valores abaixo estão em **px**, resolvidos
nos quatro breakpoints, prontos para digitar no painel do Framer.

---

## 0. Pré-requisitos antes de abrir o editor

1. **Nova API key** do projeto (Site Settings → General). A key anterior foi
   compartilhada em chat e deve ser revogada. **Nunca commitar a key aqui.**
2. **Assets pendentes** — hoje são placeholders. Se ainda não chegaram, suba os
   placeholders e troque depois:
   - `assets/logo/dc-monogram.svg` — recriação aproximada, **não é o logo oficial**
   - `assets/img/portrait-placeholder.svg` — placeholder da foto da Dra.
3. **Fontes** (Assets → Fonts → Upload). O CSS declara 6 faces, mas o repo tem 11
   arquivos. Suba **apenas as 6 usadas** — as outras 5 só aumentam o peso da página:

   | Arquivo | Família no Framer | Peso |
   |---|---|---|
   | `BlackMango-Light.otf` | Black Mango | 300 |
   | `BlackMango-Regular.otf` | Black Mango | 400 |
   | `BlackMango-Medium.otf` | Black Mango | 500 |
   | `BlackMango-SemiBold.otf` | Black Mango | 600 |
   | `Garet-Book.ttf` | Garet | 400 |
   | `Garet-Heavy.ttf` | Garet | 800 |

   Não usadas pelo CSS atual: `BlackMango-Thin.ttf`, `-ExtraLight`, `-Bold`,
   `-ExtraBold`, `-Black`.

---

## 1. Color Styles

Crie como estilos nomeados (Assets → Colors). Os seis primeiros são a paleta da
marca; os demais são derivações que o CSS produzia via `color-mix()` e que aqui
viram cores próprias.

### Paleta base

| Nome do estilo | Hex | Uso |
|---|---|---|
| `Cream` | `#F5EDE4` | Superfícies claras, texto sobre fundo escuro |
| `Sand` | `#E8E0D2` | Fundo padrão do site |
| `Camel` | `#C4A47C` | Numeração de serviços, bordas, fundo de foto |
| `Terracota` | `#BC6B54` | Acento, CTAs |
| `Terracota Dark` | `#A65A45` | Hover de CTA, eyebrow |
| `Sage` | `#8A8B77` | Fundo da seção Abordagem |
| `Navy` | `#2C3D5B` | Texto principal, fundo do CTA final e footer |
| `Navy Soft` | `#46536B` | Texto secundário |

### Derivadas (resolvidas de `color-mix()`)

| Nome do estilo | Valor | Onde era usado |
|---|---|---|
| `Header BG` | `rgba(232,224,210,0.85)` | Header no topo |
| `Header BG Scrolled` | `rgba(245,237,228,0.92)` | Header após rolar |
| `Eyebrow On Sage` | `#EAD3C7` | Eyebrow da seção Abordagem |
| `Cream 82` | `rgba(245,237,228,0.82)` | Texto dos pilares |
| `Cream 80` | `rgba(245,237,228,0.80)` | Parágrafo do CTA final |
| `Cream 85` | `rgba(245,237,228,0.85)` | Texto do footer |
| `Cream 60` | `rgba(245,237,228,0.60)` | Linha legal do footer |
| `Cream 45` | `rgba(245,237,228,0.45)` | Borda superior dos pilares |
| `Camel 45` | `rgba(196,164,124,0.45)` | Gradiente do hero |
| `Hairline` | `rgba(44,61,91,0.07)` | Borda dos cards |
| `Hairline Strong` | `rgba(44,61,91,0.28)` | Borda do botão ghost |
| `WhatsApp Green` | `#25D366` | Botão flutuante — **cor externa à marca, intencional** |

> ⚠️ O verde do WhatsApp é a única cor fora da paleta. É proposital (reconhecimento
> do canal). Não substituir por Sage.

### Sombras

O Framer não tem "shadow styles" reutilizáveis como tem para cor — replique nos
componentes:

- `--shadow`: X 0, Y 18, Blur 50, Spread −24, cor `rgba(44,61,91,0.35)`
- `--shadow-sm`: X 0, Y 8, Blur 24, Spread −16, cor `rgba(44,61,91,0.40)`
- Sombra do botão WhatsApp: X 0, Y 12, Blur 30, Spread −8, cor `rgba(37,211,102,0.60)`

---

## 2. Breakpoints

O CSS quebra em **900px** e **560px**. Os padrões do Framer (Tablet 810, Phone 390)
**não coincidem**. Ajuste as larguras dos breakpoints no Framer para 900 e 560, para
que o resultado bata com o blueprint.

Se preferir manter os padrões do Framer, o layout ainda funciona — mas os cards vão
passar de 3 para 2 colunas num ponto diferente do previsto. **Recomendação: ajustar
para 900/560.**

Os valores das tabelas seguintes usam quatro larguras de referência:

| Ref | Largura | Corresponde a |
|---|---|---|
| **XL** | 1440px | Desktop grande |
| **D** | 1200px | Desktop |
| **T** | 810px | Tablet (abaixo de 900 → layout de 2 colunas) |
| **P** | 390px | Phone (abaixo de 560 → 1 coluna) |

### Container

Largura máxima **1160px**, centralizado, com **20px** de padding lateral de cada lado.
No Framer: frame com `max-width 1160`, `width 100%`, `margin auto`, `padding-x 20`.

---

## 3. Escala tipográfica resolvida

Todos os `clamp()` do CSS, calculados. Crie como **Text Styles** e sobrescreva o
tamanho por breakpoint.

| Text Style | Fonte / peso | XL | D | T | P | Outras props |
|---|---|---|---|---|---|---|
| `Body` | Garet 400 | 17.2 | 17.2 | 16.8 | 16 | line-height 1.6, cor Navy |
| `H1 Hero` | Black Mango 300 | 72 | 70.4 | 56.4 | 41.2 | LH 1.08, tracking −0.01em |
| `H2 Section` | Black Mango 300 | 48 | 46.4 | 38.6 | 30.4 | LH 1.08, tracking −0.01em |
| `H2 Sobre` | Black Mango 300 | 44.8 | 44.8 | 38.6 | 30.4 | LH 1.08 |
| `H2 CTA` | Black Mango 300 | 51.2 | 51.2 | 43.4 | 33.4 | LH 1.08, cor Cream |
| `Lead` | Garet 400 | 20 | 19.6 | 18.4 | 17.2 | cor Navy Soft, largura máx. 46ch ≈ **520px** |
| `Eyebrow` | Garet 800 | 11.8 | 11.8 | 11.8 | 11.8 | UPPERCASE, tracking 0.18em, cor Terracota Dark |
| `Card Title` | Black Mango 500 | 21.6 | 21.6 | 21.6 | 21.6 | — |
| `Card Title LG` | Black Mango 500 | 25.6 | 25.6 | 25.6 | 25.6 | seção Serviços |
| `Card Body` | Garet 400 | 15.7 | 15.7 | 15.7 | 15.7 | cor Navy Soft |
| `Card Index` | Black Mango 300 | 38.4 | 38.4 | 38.4 | 38.4 | cor Camel, LH 1 |
| `Pillar Title` | Black Mango 500 | 22.4 | 22.4 | 22.4 | 22.4 | cor Cream |
| `Pillar Body` | Garet 400 | 15.4 | 15.4 | 15.4 | 15.4 | cor Cream 82 |
| `Section Sub` | Garet 400 | 17.3 | 17.3 | 17.3 | 17.3 | cor Navy Soft |
| `Button` | Garet 800 | 14.7 | 14.7 | 14.7 | 14.7 | tracking 0.01em |
| `Button LG` | Garet 800 | 16 | 16 | 16 | 16 | — |

> Nota sobre `Body`: no CSS o corpo escala com a viewport. Se preferir simplificar,
> **17px fixo** é uma aproximação aceitável — a variação total é de 1,2px.

### Larguras de leitura (unidades `ch` resolvidas)

O Framer não tem `ch`. Converta para px (Garet, ~0,5em de largura média):

- `.hero-copy .lead` — `max-width: 46ch` → **520px**
- `.sobre-copy p` — `max-width: 52ch` → **580px**
- `.section-head` — já em px: **640px**
- `.cta-inner` — já em px: **720px**

---

## 4. Espaçamento resolvido

| Token CSS | Onde | XL | D | T | P |
|---|---|---|---|---|---|
| `--section-y` | padding vertical das seções | 112 | 96 | 65 | 56 |
| `--gap` | gap dos grids de card | 32 | 30 | 20 | 16 |
| hero padding-top | topo do hero | 80 | 72 | 49 | 40 |
| hero/sobre grid gap | entre coluna e foto | 72 | 60 | 40 | 32 |
| section-head margin-bottom | abaixo do cabeçalho | 52 | 48 | 32 | 32 |
| footer padding-top | topo do footer | 56 | 56 | 40 | 32 |
| botão WhatsApp offset | right/bottom | 32 | 32 | 24 | 16 |

> Espaçamentos arredondados para inteiro (diferença máx. 0,5px do CSS original).
> Os tamanhos de fonte da seção 3 estão com a precisão real — ali a diferença é
> perceptível em títulos grandes.

**Raios:** `--radius` = **18px** (cards) · `--radius-lg` = **26px** (fotos) ·
botões = **999px** (pill) · botão WhatsApp = círculo 58×58.

**Easing:** todas as transições usam `cubic-bezier(0.22, 0.61, 0.36, 1)`. O Framer
aceita bezier customizado — use esse valor em vez de "Ease Out" para manter a
sensação idêntica.

---

## 5. CMS

Três coleções. Isso é o que justifica reconstruir nativo em vez de embedar — a
cliente passa a editar sem tocar em código.

### Coleção `Condicoes` (6 itens)

Campos: `Titulo` (text) · `Descricao` (text) · `Ordem` (number)

| Titulo | Descricao |
|---|---|
| Rinite | Espirros, coceira, nariz entupido e coriza persistente. |
| Sinusite | Congestão, dor na face e secreção que não passam. |
| Desvio de septo | Obstrução nasal que atrapalha o sono e o dia a dia. |
| Ronco | Investigação e tratamento das causas do ronco. |
| Apneia do sono | Diagnóstico e manejo para noites — e dias — melhores. |
| Alterações do olfato | Avaliação e testes para perda ou alteração do olfato. |

### Coleção `Servicos` (3 itens)

Campos: `Indice` (text, ex. "01") · `Titulo` (text) · `Descricao` (text)

| Indice | Titulo | Descricao |
|---|---|---|
| 01 | Consultas | Investigação diagnóstica, tratamento, reavaliação e avaliação de quadros agudos, com escuta e explicação clara das opções. |
| 02 | Exames | Exames diagnósticos por vídeo, testes de olfato e testes alérgicos para um diagnóstico preciso. |
| 03 | Cirurgias | Cirurgias minimamente invasivas, quando indicadas, com foco em recuperação e qualidade de vida. |

### Coleção `Pilares` (4 itens)

Campos: `Titulo` (text) · `Descricao` (text)

| Titulo | Descricao |
|---|---|
| Acolhimento | Você é ouvido do início ao fim. |
| Confiança | Decisões tomadas em conjunto. |
| Empatia | Cuidado próximo e humano. |
| Ciência | Condutas com base em evidência. |

---

## 6. Seções — árvore de layers

Ordem de build recomendada: Header → Footer → Hero → demais seções. Header e footer
primeiro porque fixam a régua de espaçamento e as cores.

### 6.1 Header (sticky)

```
Header  [sticky top, z 60, width 100%, bg Header BG, backdrop blur 10]
└─ Container  [stack horizontal, space-between, align center, padding-y 13.6, gap 16]
   ├─ Brand  [link → #topo, stack horizontal, gap 11, align center]
   │  ├─ Logo  [img dc-monogram.svg, 40×40, tint Terracota]
   │  └─ Nome  [stack vertical, LH 1.15]
   │     ├─ "Dra. Maria Eduarda"  [Black Mango 500, 17.9px, Navy]
   │     └─ "DEON CECCATO · OTORRINOLARINGOLOGIA"  [Garet 400, 10.9px,
   │         uppercase, tracking 0.04em, Navy Soft]
   ├─ Nav  [stack horizontal, gap 25.6, align center]
   │  ├─ "Condições" → #condicoes
   │  ├─ "Serviços"  → #servicos
   │  ├─ "Sobre"     → #sobre
   │  ├─ "Contato"   → #contato
   │  └─ Botão "Agendar consulta"  [Primary]
   └─ NavToggle  [hambúrguer, só visível abaixo de 900]
```

**Estados:**
- Header ganha `Header BG Scrolled` + borda inferior `rgba(44,61,91,0.08)` +
  `--shadow-sm` quando `scrollY > 8`. No Framer: variante acionada por scroll,
  transição 0.3s.
- Links de nav: cor Navy Soft → Navy no hover, com **sublinhado que cresce da
  esquerda** (altura 1.5px, cor Terracota, 0→100% em 0.25s). No Framer é uma
  variante de hover com um retângulo animando a largura.

**Abaixo de 900px:** nav vira painel lateral — largura `min(78vw, 320px)`, fundo
Cream, entra da direita (`translateX 100% → 0`, 0.35s), sombra
`-20px 0 60px -30px rgba(44,61,91,0.5)`. Botão CTA ocupa 100% da largura. Fecha ao
clicar num link e com ESC.

### 6.2 Hero (`#inicio`)

```
Hero  [bg Sand + gradiente radial, padding-top ver tabela, padding-bottom --section-y]
└─ Container  [grid 2 col: 1.1fr / 0.9fr, gap ver tabela, align center]
   ├─ Copy
   │  ├─ Eyebrow: "Rinologia & Cirurgia de Base do Crânio"
   │  ├─ H1: "Qualidade de vida começa por respirar bem."
   │  │   └─ "respirar bem" em Terracota + itálico  [span inline]
   │  ├─ Lead  [max 520px]
   │  ├─ Ações  [stack horizontal, wrap, gap 14.4, margin 32/0/17.6]
   │  │  ├─ Botão Primary "Agendar pelo WhatsApp" → wa.me
   │  │  └─ Botão Ghost "Ver tratamentos" → #condicoes
   │  └─ Nota  [•  Atendimento em Porto Alegre e Grande Porto Alegre]
   │            bullet: círculo 7px, cor Sage, gap 8
   └─ Foto  [aspect 4/5, radius 26, overflow hidden, bg Camel, --shadow,
             object-fit cover]
```

**Gradiente do hero:** radial, tamanho 120% × 100%, ancorado no **canto superior
direito**, de `Camel 45` até transparente a 60%, sobre fundo Sand.

**H1 — atenção:** "respirar bem" é itálico + Terracota **dentro** do heading. No
Framer, selecione o trecho e aplique cor/estilo inline; não quebre em dois text
layers, senão a quebra de linha responsiva deixa de funcionar.

**Abaixo de 900px:** vira 1 coluna, foto com `max-width 440px`.

### 6.3 Condições (`#condicoes`)

```
Section  [bg Sand, padding-y --section-y]
└─ Container
   ├─ SectionHead  [max 640px, margin-bottom ver tabela]
   │  ├─ Eyebrow: "O que tratamos"
   │  ├─ H2: "Cuidado para quem não respira bem"
   │  └─ Sub: "Se algum desses sintomas faz parte da sua rotina, existe caminho
   │            — clínico ou cirúrgico."
   └─ Grid  [3 col XL/D · 2 col T · 1 col P, gap --gap]
      └─ Card ×6  ← CMS Condicoes
         [bg Cream, borda Hairline, radius 18, padding 25.6/27.2,
          borda-esquerda 3px sólida Camel]
         ├─ Titulo  [Card Title]
         └─ Descricao  [Card Body]
```

**Hover do card:** sobe 4px, ganha `--shadow`, borda vira transparente. 0.3s.

### 6.4 Serviços (`#servicos`)

Mesma estrutura, com diferenças:
- Fundo da seção: **Cream** (não Sand)
- Sem borda esquerda no card
- Padding do card: **35.2 / 32**
- Cada card abre com o número (`Card Index`, Camel, margin-bottom 9.6)
- Título usa `Card Title LG`
- Head: eyebrow "Como podemos cuidar" + H2 "Serviços" (sem subtítulo)
- Grid: 3 col XL/D · 2 col T · 1 col P ← CMS `Servicos`

### 6.5 Abordagem (sem âncora)

```
Section  [bg Sage, texto Cream, padding-y --section-y]
└─ Container
   ├─ SectionHead
   │  ├─ Eyebrow: "Como trabalho"   [cor Eyebrow On Sage — não Terracota Dark]
   │  └─ H2: "Uma jornada de cuidado"  [cor Cream]
   └─ Grid  [4 col XL/D · 2 col T · 1 col P, gap --gap]
      └─ Pilar ×4  ← CMS Pilares
         [padding-y 22.4, borda-superior 2px sólida Cream 45]
         ├─ Titulo  [Pillar Title]
         └─ Descricao  [Pillar Body]
```

> Esta é a única seção com fundo Sage e a única sem âncora de navegação.
> O eyebrow **muda de cor** aqui por contraste — não reutilize o Text Style padrão
> sem sobrescrever.

### 6.6 Sobre (`#sobre`)

```
Section  [bg Sand, padding-y --section-y]
└─ Container  [grid 2 col: 0.9fr / 1.1fr, gap ver tabela, align center]
   ├─ Foto  [aspect 4/5, radius 26, bg Camel, --shadow]   ← à ESQUERDA
   └─ Copy
      ├─ Eyebrow: "Sobre a Dra."
      ├─ H2: "Maria Eduarda Deon Ceccato"  [H2 Sobre]
      ├─ P1  [max 580px] — "Médica especializada em **Rinologia e Cirurgia de Base
      │        do Crânio**, atuando no diagnóstico e tratamento de rinite,
      │        sinusites, desvio de septo, ronco, apneia do sono e alterações
      │        do olfato."   ← trecho em negrito é inline
      ├─ P2  [max 580px] — "Realiza tratamentos clínicos e cirurgias minimamente
      │        invasivas, além de exames diagnósticos por vídeo, testes de olfato
      │        e testes alérgicos — sempre com cuidado voltado à qualidade de vida
      │        e ao bem-estar respiratório."
      └─ Botão Primary "Marcar uma consulta" → wa.me  [margin-top 12.8]
```

⚠️ **Ordem no mobile:** abaixo de 900px o CSS aplica `order: -1` na foto — ela
**continua acima** do texto. Como no desktop ela já está à esquerda, o resultado é o
mesmo empilhamento natural. Confira no preview do Framer: se a foto cair abaixo do
texto, inverta manualmente no breakpoint.

### 6.7 CTA final (`#contato`)

```
Section  [bg Navy, texto Cream, text-align center, padding-y --section-y]
└─ Inner  [max 720px, centralizado]
   ├─ H2: "Vamos cuidar da sua respiração?"  [H2 CTA]
   ├─ P: "Agende sua consulta pelo WhatsApp. Atendimento em Porto Alegre e
   │      Grande Porto Alegre."  [Cream 80, 17.6px, margin 16/0/32]
   └─ Ações  [stack horizontal, wrap, gap 16, justify center]
      ├─ Botão Primary LG "Agendar pelo WhatsApp" → wa.me
      └─ Botão Ghost LG "@dudaceccato.otorrino" → Instagram
         [variante escura: texto Cream, borda rgba(245,237,228,0.4);
          hover: fundo rgba(245,237,228,0.1), borda Cream]
```

**Abaixo de 560px:** ambos os botões ocupam 100% da largura (vale também para os
botões do hero).

### 6.8 Footer

```
Footer  [bg Navy, texto Cream 85, padding-top ver tabela,
         borda-superior 1px rgba(245,237,228,0.12)]
├─ Container  [stack horizontal, wrap, space-between, gap 32/48, padding-bottom 32]
│  ├─ Brand  [stack horizontal, gap 16, align center]
│  │  ├─ Logo 48×48  [tint Camel]
│  │  └─ "Dra. Maria Eduarda Deon Ceccato" [Black Mango 500, 16.8px, Cream]
│  │     + quebra + "Otorrinolaringologia · Rinologia"
│  └─ Contato  [stack vertical, gap 8, 15.2px]
│     ├─ "WhatsApp: (51) 99533-7479" → wa.me
│     ├─ "Instagram: @dudaceccato.otorrino" → Instagram
│     └─ "Porto Alegre e Grande Porto Alegre — RS"  [texto puro, sem link]
└─ Legal  [borda-superior 1px rgba(245,237,228,0.12), padding-y 19.2,
           13.1px, cor Cream 60]
   └─ "© {ano} Dra. Maria Eduarda Deon Ceccato. Todos os direitos reservados."
```

⚠️ **O ano é dinâmico** (`js/script.js` preenche via `new Date().getFullYear()`).
No Framer, ou use um code component de uma linha, ou digite o ano fixo e trate como
manutenção anual. **Não deixe o texto `{ano}` literal na página.**

Hover dos links de contato: cor → Cream + sublinhado.

### 6.9 Botão flutuante WhatsApp

```
Link  [fixed, right/bottom ver tabela, z 70]
      [58×58, círculo, bg WhatsApp Green, ícone SVG 28×28 branco, centralizado]
      [sombra 0 12 30 -8 rgba(37,211,102,0.6)]
      [hover: scale 1.08, 0.25s]
      → https://wa.me/5551995337479  ·  aria-label "Falar no WhatsApp"
```

O path do SVG está em `index.html:195` — copie de lá.

---

## 7. Interações

| Comportamento | Origem | Como fazer no Framer |
|---|---|---|
| Reveal ao rolar | `.reveal` + IntersectionObserver | Efeito **Appear**: opacidade 0→1, Y +22px→0, duração **0.7s**, bezier `(0.22,0.61,0.36,1)`, dispara a ~14% de visibilidade, **uma vez só** (não repetir) |
| Header ao rolar | `.scrolled`, `scrollY > 8` | Variante por scroll, transição 0.3s |
| Menu mobile | `.nav.open` | Overlay lateral, slide da direita, 0.35s |
| Hover de card | `.card:hover` | Variante: Y −4px, `--shadow`, borda transparente, 0.3s |
| Hover de botão | `.btn:hover` | Y −2px, `--shadow-sm`; Primary também troca fundo para Terracota Dark |
| Sublinhado do nav | `::after` width 0→100% | Retângulo 1.5px Terracota animando largura a partir da esquerda |
| Scroll suave nas âncoras | `scroll-behavior: smooth` | Ativar smooth scroll nos links de âncora |

**Elementos com reveal** (`class="reveal"` no HTML): copy e foto do hero, cada
section-head, cada um dos 6 cards de condição, cada um dos 3 cards de serviço, cada
um dos 4 pilares, foto e copy do Sobre, e o bloco interno do CTA.

### Acessibilidade — não pule

O CSS tem `@media (prefers-reduced-motion: reduce)` que **desliga todas as
animações**. Verifique se o Framer respeita a preferência do sistema nos efeitos de
Appear; se não respeitar por padrão, é preciso tratar. Um site médico tem público
com vertigem e enxaqueca — isso não é detalhe cosmético.

Mantenha também: `aria-label` no botão flutuante e no toggle do menu,
`aria-expanded` no toggle, `alt` na foto da Dra. (`"Dra. Maria Eduarda Deon
Ceccato"`), e `alt` **vazio** nos logos decorativos.

---

## 8. SEO e metadados

Copiar de `index.html:6-11`:

- **Title:** `Dra. Maria Eduarda Deon Ceccato — Otorrinolaringologia | Rinologia em Porto Alegre`
- **Description:** `Qualidade de vida começa por respirar bem. Diagnóstico e tratamento de rinite, sinusite, desvio de septo, ronco, apneia do sono e olfato. Atendimento em Porto Alegre e Grande POA.`
- **OG title:** `Dra. Maria Eduarda Deon Ceccato — Otorrinolaringologia`
- **OG description:** `Qualidade de vida começa por respirar bem.`
- **Locale:** `pt-BR`
- **Favicon:** `assets/logo/dc-monogram.svg`

**Faltando no blueprint, vale adicionar no Framer:**
- Imagem OG real (1200×630) — hoje não existe; sem ela o link no WhatsApp fica sem
  preview visual, justamente no canal principal de conversão
- Schema.org `Physician` / `MedicalBusiness` com área de atendimento e telefone

---

## 9. O que não migra 1:1

Coisas que exigem decisão humana no editor:

1. **`backdrop-filter: blur(10px)`** no header — o Framer tem background blur, mas o
   resultado pode diferir levemente. Comparar lado a lado.
2. **`aspect-ratio: 4/5`** nas fotos — confirmar que o Framer mantém a proporção ao
   redimensionar, em vez de fixar altura.
3. **Gradiente radial do hero** — a sintaxe `120% 100% at 100% 0%` é específica.
   Ajustar no olho até bater com o preview.
4. **Escala fluida** — o CSS interpola continuamente entre breakpoints; o Framer dá
   saltos. Entre 900 e 1200px o texto vai parecer um pouco diferente do blueprint.
   É aceitável e esperado.
5. **Ano dinâmico no footer** — ver 6.8.

## 10. Checklist de aceite

- [ ] 6 fontes subidas, nenhuma extra
- [ ] Color styles criados e **aplicados por nome** (nada de hex solto nos layers)
- [ ] Breakpoints em 900 e 560
- [ ] 3 coleções de CMS populadas (6 + 3 + 4 itens)
- [ ] As 3 grids de card reagem corretamente em 3 → 2 → 1 coluna
- [ ] Pilares: 4 → 2 → 1
- [ ] Todos os CTAs apontam para `https://wa.me/5551995337479`
- [ ] Instagram aponta para `https://instagram.com/dudaceccato.otorrino`
- [ ] Âncoras funcionam: `#condicoes`, `#servicos`, `#sobre`, `#contato`
- [ ] Menu mobile abre, fecha ao clicar em link e fecha com ESC
- [ ] Reveal dispara uma vez só, não a cada scroll
- [ ] `prefers-reduced-motion` respeitado
- [ ] Metadados e favicon preenchidos
- [ ] Logo oficial e foto real da Dra. no lugar dos placeholders
- [ ] Textos aprovados pela cliente

---

## Pendências que bloqueiam a publicação

Estas não são detalhes de build — são coisas que faltam do lado da cliente:

1. **Logo DC oficial** em SVG/PNG (fundo transparente, versões creme e terracota).
   O arquivo atual é recriação aproximada.
2. **Foto da Dra.** em JPG/PNG, **como arquivo** — imagem colada em chat não gera
   arquivo versionável.
3. **Valores oficiais de cor**, se houver manual de marca. A paleta atual é
   aproximada (ver `BRAND.md`).
4. **Aprovação dos textos** pela cliente.
5. **Imagem OG** para o preview no WhatsApp.
