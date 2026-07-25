# Spec de migração para o Framer

> Documento de build. Traduz a landing HTML/CSS/JS deste repositório para
> construções **nativas** do Framer — não embed, não iframe.
>
> Projeto de destino: `https://framer.com/projects/Snow-State--XK7b062GvtBGT0A9gUKN-aarZy`
> (Project ID `XK7b062GvtBGT0A9gUKN`)
>
> Fonte da verdade do conteúdo: `index.html`. Fonte da verdade visual: `css/styles.css`.
> Identidade e tom de voz: `BRAND.md`.

## Decisões já tomadas (2026-07-25)

Três pontos deste spec exigiam decisão humana. Foram decididos com o Davi e
**não precisam ser rediscutidos** — estão marcados como ✅ nas seções
correspondentes.

| Ponto | Decisão | Seção |
|---|---|---|
| Breakpoints | **Ajustar o Framer para 900 / 560**, para bater com o CSS | §2 |
| Ano do rodapé | **Code component**, já escrito em `framer/CopyrightLine.tsx` | §6.8 |
| Placeholders | **Subir os placeholders e construir**, trocar os assets depois | §0 |

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
2. **Assets pendentes** — ✅ **Decidido: subir os placeholders e construir agora.**
   O layout não precisa ser refeito quando os arquivos reais chegarem — basta
   substituir o asset no Framer. **Não publicar o site antes da troca.**
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
**não coincidem**.

✅ **Decidido: ajustar os breakpoints do Framer para 900 e 560.** Primeira coisa a
fazer no editor, antes de montar qualquer layer — mudar breakpoint depois de
construir obriga a revisar todos os overrides de tamanho.

As colunas `T` e `P` das tabelas abaixo continuam medidas em 810 e 390 (larguras de
referência para conferir o resultado), mas os **pontos de quebra** são 900 e 560.

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

✅ **O ano é dinâmico** e a decisão é **usar code component** — já escrito em
`framer/CopyrightLine.tsx` neste repositório, com instruções de instalação no
cabeçalho do arquivo. Ele renderiza a linha de copyright **inteira** (não só o ano),
porque code components no Framer são layers próprios e não podem ser inseridos
dentro de um text layer como um `<span>`.

Consequência: a tipografia do rodapé está duplicada dentro do componente (Text
Styles não cascateiam para code components). Se o Text Style do rodapé mudar,
atualizar o `.tsx` também.

**Não deixe o texto `{ano}` literal na página.**

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

> Seção reescrita em 2026-07-25 **depois de executar o build no editor**. O que
> segue não é previsão: é o que apareceu na tela.

### 9.1 Bloqueios reais da API

1. **Fontes customizadas não podem ser subidas pelo agente.** Não existe método de
   upload/registro de fonte, e a doc do plugin diz explicitamente *"Custom fonts are
   not available to plugins"*. `font-search` por `Black Mango` e `Garet` retorna
   vazio — não estão na biblioteca do Framer. **§0 é passo manual**: Assets → Fonts
   → Upload, com os 6 arquivos de `assets/fonts/`.
   Mitigação usada: os 16 Text Styles foram criados **sem `fontName`**. Como todo
   layer aplica estilo por nome, aplicar a família depois é 1 comando por preset.

2. **`$control__link` (LinkVariable) não pode ser setado numa instância pela DSL.**
   Falharam as três formas: `$control__link.href`, `$control__link` e `link.href`
   no próprio nó da instância. **Pior: um atributo inválido faz o `SET` inteiro ser
   descartado em silêncio — sem `parseErrors`, sem `errors`, sem warning.** Foi o
   que fez os dois botões do hero saírem idênticos.
   Solução adotada: cada botão é uma `ComponentInstanceNode` dentro de um
   `FrameNode` wrapper que carrega o `link.href`.
   > Regra prática: ao mexer em `$control__*`, aplicar **um atributo por `SET`** e
   > reler o nó. Diagnóstico limpo aqui **não** significa que aplicou.

3. **Gradientes não aceitam tokens de cor.** O hero era
   `radial-gradient(..., transparent 60%)` sobre `var(--sand)`. Foi achatado para um
   gradiente que **termina em Sand** (`rgba(232,224,210,1) 60%`) — visualmente
   idêntico, mas o Sand ali é literal e não acompanha o token se ele mudar.

4. **`currentColor` não resolve em SVG subido como imagem.** O monograma usa
   `stroke="currentColor"`. Foi preciso subir **uma cópia por tint** (terracota para
   o header, camel para o footer). Ao trocar pelo logo oficial, gerar as duas.

### 9.2 Breakpoints — a armadilha principal

5. **A largura de um breakpoint NÃO é o ponto de quebra.** O Framer deriva o range
   do breakpoint **seguinte**, e o menor sempre cobre `0 → próximo`. Criando
   1200/900/560 os breaks reais ficaram em **1200 e 900** — o de 560 nunca era o
   limite, só a largura da prancheta.
   **Solução: 4 breakpoints.** Com 1200 / 900 / 560 / 390 os ranges saem:

   | Breakpoint | Largura | Range real | Papel (CSS) |
   |---|---|---|---|
   | Desktop | 1200 | `≥1200` | desktop |
   | Desktop S | 900 | `900–1199.98` | desktop (valores idênticos) |
   | Tablet | 560 | `560–899.98` | `@media (max-width:900px)` |
   | Phone | 390 | `≤559.98` | `@media (max-width:560px)` |

   Os breaks caem exatamente em **900 e 560**, como decidido. O de 1200 é inócuo
   porque Desktop e Desktop S carregam os mesmos valores.

6. **`breakpoint.default.minWidth` dos Text Styles é travado em 1200** — aceita o
   comando, ignora o valor. Os outros slots (`medium`, `small`) aceitam. Por isso os
   presets usam 4 slots com `default == medium`, espelhando a tabela acima.

7. **O Framer inventa valores nos slots que você não declara.** O `Eyebrow`, que é
   11.8px fixo em todos os tamanhos, foi auto-escalado para **9px** no `medium`; 5
   presets saíram com o `small` errado (`Body` virou 13px em vez de 16.8). Também
   injeta `letterSpacing: -0.02em` por conta própria.
   **Declare `fontSize`, `lineHeight` e `letterSpacing` explicitamente em todos os
   4 slots, inclusive quando o valor não muda — e releia para conferir.**

8. **`letterSpacing` não aceita `em`, só `px`/`rem`.** Todo o tracking em `em` do CSS
   virou px calculado **por breakpoint**, para continuar escalando com o corpo.

### 9.3 Fidelidade visual

9. **`hoverEffect` não anima `borderColor`.** Afeta o botão ghost (borda
   `Hairline Strong → Navy`) e o card (`border-color → transparent`). Nesses casos
   só o fundo/sombra animam.
   O Primary ficou 100% fiel por outro caminho: no CSS a borda dele tem **a mesma
   cor do fundo**, então ela foi removida e os 1.5px foram somados ao padding —
   caixa externa idêntica e `hoverEffect.backgroundColor` limpo.

10. **Header “scrolled” não implementado.** Trocar `fill` no scroll exige
    `scrollVariantEffect`, que só existe em `ComponentInstanceNode` — um `FrameNode`
    solto não faz. Para fechar: transformar o header em `ComponentNode` com as
    variantes `Topo` e `Scrolled` e ligar o `scrollVariantEffect`. Hoje o header é
    sticky e translúcido, mas não muda ao rolar.

11. **Sublinhado do nav crescendo da esquerda** não é expressável num
    `LinkStylePreset`. Virou `text-decoration: underline` na cor Terracota no hover.
    Para o efeito original seria preciso um componente com retângulo animado.

12. **Menu mobile** virou `FixedOverlayNode` com `backdrop.dismissible` (painel de
    320px / 78% vindo da direita, como no CSS). Fecha clicando fora. **Fechar com
    ESC não foi verificado** e não há controle explícito para isso.

13. **Escala fluida** — confirmado: o CSS interpola, o Framer dá saltos. Como não há
    breakpoint em 1440, a coluna **XL da §3 não é usada**; acima de 1200 vale a
    coluna D. A perda é pequena (H1 70.4 em vez de 72).

14. ~~**Ano dinâmico no footer**~~ — ✅ resolvido: `framer/CopyrightLine.tsx`,
    instalado como code file e renderizando `© 2026 …`. O arquivo precisou de
    tipagem (`CopyrightLineProps` + `satisfies`) para passar no `typecheckCode`.

15. **`backdrop-filter` e `aspect-ratio`** — ambos migraram bem
    (`backgroundBlur="10px"` e `aspectRatio="0.8"`). Sem ressalva.

### 9.4 Correções ao próprio spec

16. **Tracking faltando na §3.** O CSS tem `h1, h2, h3 { letter-spacing: -0.01em }`,
    e nada sobrescreve. Logo `H2 Sobre`, `H2 CTA`, `Card Title`, `Card Title LG` e
    `Pillar Title` **também levam -0.01em** — a tabela da §3 omitia. Já aplicado.
    (`Card Index` é `<span>`, não herda: fica sem tracking, como o spec dizia.)

17. **Peso dos headings: a §3 está certa (300).** Registrando porque é uma pegadinha:
    a regra base `h1, h2, h3` diz `font-weight: 400`, mas todas as regras específicas
    (`.hero-copy h1`, `.section-head h2`, `.sobre-copy h2`, `.cta h2`) dizem **300** e
    vencem por especificidade. Não “corrigir” para 400.

18. **Contraste do `Card Index`.** Camel sobre Cream dá **2.0** contra 2.2 exigido —
    o linter do Framer acusa. Vem do blueprint, não da migração. Num site médico vale
    levar ao cliente: escurecer o Camel só nesse numeral resolveria.

19. **Slug do CMS sai com acento** (`alterações-do-olfato`, `confiança`). Inócuo hoje
    porque não há detail page. Em `Servicos` o `Titulo` foi criado antes do `Indice`
    (e o `Indice` movido para a posição 0) justamente para o slug sair `consultas` e
    não `01`.

## 10. Checklist de aceite

Estado em **2026-07-25**, verificado no editor (não por leitura de código).

- [ ] 6 fontes subidas, nenhuma extra — **bloqueado, passo manual** (ver §9.1.1).
      Hoje o site renderiza em Inter.
- [x] Color styles criados e **aplicados por nome** — 20 tokens; varredura na árvore
      não achou nenhum hex/rgb solto em `fill`/`textColor`/`borderColor`
- [x] Breakpoints em 900 e 560 — via 4 breakpoints, ver §9.2.5
- [x] 3 coleções de CMS populadas (6 + 3 + 4 itens) — com acentos e travessões
- [x] As 3 grids de card reagem em 3 → 2 → 1 coluna
- [x] Pilares: 4 → 2 → 1
- [x] Todos os CTAs apontam para `https://wa.me/5551995337479` — 7 ocorrências,
      nenhum wa.me divergente
- [x] Instagram aponta para `https://instagram.com/dudaceccato.otorrino` — 2
- [x] Âncoras funcionam: `#inicio`, `#condicoes`, `#servicos`, `#sobre`, `#contato`
- [~] Menu mobile abre e fecha clicando fora (overlay dismissible). **ESC não
      verificado**; fechar ao clicar num link não foi configurado — ver §9.3.12
- [x] Rodapé usa o code component `CopyrightLine` — renderiza `© 2026 …`
- [x] Reveal dispara uma vez só (`appearEffect.replay="false"`, 0.7s, bezier do site)
- [x] `prefers-reduced-motion` respeitado — `metadata.reducedMotion="true"` no RootNode
- [x] Metadados e favicon preenchidos — title, description e favicon no RootNode
- [ ] Imagem OG — **não existe** (ver Pendências)
- [ ] Header muda de fundo ao rolar — **não implementado**, ver §9.3.10
- [x] Fotos reais da Dra. no lugar do placeholder — retrato de jaleco no hero,
      foto do 40º Congresso Panamericano na Sobre (2026-07-25)
- [ ] Logo oficial no lugar do `dc-monogram.svg` (header e footer)
- [ ] Textos aprovados pela cliente

### Como aplicar as fontes depois do upload

Com as 6 faces subidas no editor, rodar `session new` (para o `<custom-fonts>`
atualizar) e aplicar a família nos 16 presets — `Black Mango` em `H1 Hero`,
`H2 Section`, `H2 Sobre`, `H2 CTA`, `Card Title`, `Card Title LG`, `Card Index` e
`Pillar Title`; `Garet` nos outros 8. Os pesos já estão corretos em cada preset.
Conferir depois se o Framer não reescreveu nenhum `fontSize` de slot (§9.2.7).

---

## Pendências que bloqueiam a publicação

Estas não são detalhes de build — são coisas que faltam do lado da cliente:

1. **Logo DC oficial** em SVG/PNG (fundo transparente, versões creme e terracota).
   O arquivo atual é recriação aproximada. Ao subir no Framer, gerar **duas cópias
   tintadas** — `currentColor` não resolve em SVG usado como imagem (§9.1.4).
2. ~~**Foto da Dra.**~~ — ✅ resolvido em 2026-07-25. Duas fotos entraram:
   `dra-maria-eduarda.jpg` (retrato de jaleco) no hero e
   `dra-maria-eduarda-congresso.jpg` (40º Congresso Panamericano) na Sobre.
   Ambas quadradas (1440² e 1080²) e cortadas para 4/5 pelo `aspectRatio` — o corte
   é centralizado e tira 10% de cada lado. Se o cliente mandar versões já em 4/5,
   trocar dá mais controle de enquadramento.
3. **Valores oficiais de cor**, se houver manual de marca. A paleta atual é
   aproximada (ver `BRAND.md`).
4. **Aprovação dos textos** pela cliente.
5. **Imagem OG** para o preview no WhatsApp. As duas fotos novas servem de base.

---

## 11. Adições além do spec original (2026-07-25)

O spec original cobria a migração 1:1 do blueprint. Depois de construída, a página
ganhou quatro blocos novos, decididos com o Davi para melhorar identificação e
conversão. **Estes não estão no `index.html`** — o blueprint HTML segue como
referência da migração original, e o Framer passou a ser a fonte da verdade daqui
em diante.

### Estrutura atual da página

```
Header → Hero → Condições → Serviços → Como é a consulta → Abordagem
  → Sobre → FAQ → Agendar (formulário) → CTA final → Footer  (+ WhatsApp flutuante)
```

### 11.1 Condições reescritas em 1ª pessoa

A coleção `Condicoes` ganhou o campo **`Condicao`** (nome clínico). O card agora
mostra o rótulo clínico como eyebrow e o **sintoma na voz do paciente** como
título — "Meu nariz entope só de um lado" em vez de "Desvio de septo".
Motivo: ninguém busca pelo diagnóstico, busca pelo sintoma.

### 11.2 Seção "Como é a consulta"

Coleção **`Consulta`** (4 passos: Indice, Titulo, Descricao), entre Serviços e
Abordagem. Existe para derrubar o medo do desconhecido — a maior trava numa LP de
otorrino não é preço, é não saber o que vai acontecer.

### 11.3 FAQ em accordion

Coleção **`FAQ`** (Pergunta, Resposta) + componente **`FAQ Item`** com as variantes
`Aberta` / `Fechada`, alternadas por `SET_VARIANT` com `cycle`. As instâncias entram
fechadas (`$control__variant="Fechada"`).

> ⚠️ **O conteúdo do FAQ precisa do aval da Dra.** As seis respostas foram escritas
> para não prometer resultado nem citar preço, e a de convênio **deliberadamente não
> afirma nada** — manda falar no WhatsApp, porque essa informação não estava no
> briefing. Não publicar sem ela revisar.

### 11.4 Formulário que abre o WhatsApp preenchido

Code component **`framer/AgendarForm.tsx`**, na seção `#agendar`.
Três campos (nome, queixa, melhor horário) → monta a mensagem e abre o `wa.me`
já escrito. O ganho não é o formulário: é a secretária receber *"Oi! Sou a Ana,
minha queixa é nariz entupido, prefiro manhã"* em vez de *"oi"*.

**Por que é code component:** o formulário nativo do Framer só redireciona para uma
URL **fixa** — não dá para carregar o que a pessoa digitou. Só código monta a URL
em runtime.

**Onde o lead fica guardado:** por padrão, em lugar nenhum — a conversa no WhatsApp
é o registro. O componente tem uma prop **`webhookUrl`** (Formspark, Zapier, n8n,
Make…) que, se preenchida, manda o lead por POST em JSON antes de abrir o WhatsApp.
Sem ela, um lead que desiste no meio some. **Vale plugar antes de publicar.**

O CTA final virou o caminho alternativo ("Prefere falar direto?") para não competir
com o formulário logo acima.

### 11.5 Movimento

| O quê | Como |
|---|---|
| Respiração | `loopEffect` no retrato do hero: `scale 1.02`, `mirror`, tween 4.5s (ciclo de 9s), `pauseOffscreen` |
| Header ao rolar | Componente **`Header Fundo`** (`Topo` / `Scrolled`) posicionado atrás do conteúdo, trocando de variante via `scrollVariantEffect` |
| Sublinhado do nav | Componente **`Nav Link`** com gesture variant de hover animando a largura do retângulo de 0% a 100% |

Decisão de dose: **um** movimento de assinatura e micro-interações. O público inclui
gente com apneia, vertigem e enxaqueca — movimento pesado aqui é contraindicado, não
só brega. `metadata.reducedMotion` segue ligado.

---

## 12. Armadilhas novas do editor (achadas construindo a §11)

Complementam a §9. Todas custaram tempo.

1. **`loopEffect.rotate` tem default 360.** Pedi só `scale`, e o Framer preencheu o
   resto — o retrato da Dra. ia **girar 360°** em loop. Regra: ao usar `loopEffect`,
   **declare todas as transformações** (`x`, `y`, `rotate`, `rotateX`, `rotateY`,
   `skewX`, `skewY`, `opacity`), mesmo as que ficam em zero, e releia o nó.
   É a mesma classe de problema da §9.2.7, mas aqui o default é destrutivo.

2. **`scrollVariantEffect.fromVariant` / `toVariant` não pegam.** Testei id e nome,
   em comandos separados: aceita sem erro e não grava. O que funciona é o formato de
   seções:
   ```
   SET <instância> scrollVariantEffect.trigger="onScrollTarget";
   SET <instância> scrollVariantEffect.sections.0.target="<id da seção>";
   SET <instância> scrollVariantEffect.sections.0.variant="<id da variante>";
   ```

3. **Os 4 pinos não funcionam como `inset`.** Com `position="absolute"` e
   `left/right/top/bottom` em `0px`, o nó **não estica** — fica no tamanho
   intrínseco. O tamanho vem de `width`/`height`; use `width="100%" height="100%"`.

4. **Controles de instância usam `$control__<nome_em_snake_case>`, não o id
   temporário.** Bindar `$control__faqVarQ` (meu id do `+Variable`) falhou **em
   silêncio**; o certo era `$control__pergunta`. Sempre leia os controles com
   `readComponentControls` antes de bindar.

5. **`FixedOverlayNode` não é suportado dentro de `ComponentNode`.** Por isso o
   header continua sendo `FrameNode` (para o menu lateral seguir funcionando) e só o
   **fundo** virou componente, posicionado atrás do conteúdo. Se um dia o header
   inteiro virar componente, o menu mobile precisa migrar para o padrão de drawer
   com variante `Aberta`/`Fechada`.

---

## 13. Imagens, ícones e motion (2026-07-25)

### 13.1 Serviços em coluna única no Tablet

`Servicos` tem 3 itens: em 2 colunas sobrava um card órfão na segunda linha. No
Tablet (560–899) o grid vira **stack vertical**. `Condicoes` (6 itens) e `Consulta`
(4) continuam em 2 colunas, porque fecham as linhas.

### 13.2 Ícones vindos do CMS

`Condicoes`, `Consulta` e `Pilares` ganharam um campo **`Icone`** (`+IconVariable`,
set **Lucide**). O `IconNode` do template é bindado com
`$control__icon="var(--variable-<id>)"`, então a Dra. troca o ícone pelo CMS sem
tocar no layout.

| Coleção | Ícones | Cor |
|---|---|---|
| Condicoes | Droplets · Scan Face · Wind · Audio Lines · Moon · Flower 2 | Terracota |
| Consulta | Calendar Check · Stethoscope · Clipboard List · Repeat | Camel |
| Pilares | Hand Heart · Heart Handshake · Users · Microscope | Cream |

Nos Serviços o ícone teria competido com o numeral grande, então esse card recebeu
**imagem** em vez de ícone.

### 13.3 Imagens nos cards de Serviços

`Servicos` ganhou o campo **`Imagem`** (`+Variable type="image"`). O card foi
reestruturado para a imagem sangrar até a borda:

```
Card  [padding 0, overflow clip]
├─ Imagem   [width 100%, aspectRatio 1.6, fill = var(--variable-<id>)]
└─ Conteúdo [padding 28.8/32/35.2/32]  ← numeral, título e descrição
```

Tratamento aplicado no template: `saturate="88%"` e `brightness="102%"`, para o
stock frio não brigar com a paleta creme/terracota. Hover: `scale 1.05` na imagem.

> ⚠️ **As imagens são placeholders do Unsplash.** A primeira tentativa trouxe fotos
> de **outras pessoas** em centro cirúrgico — numa página da própria médica, isso lê
> como se fossem ela e a equipe dela. Foram trocadas por imagens **sem pessoas**
> (ambiente, instrumentos). Mantenha essa regra ao substituir: ou foto real do
> consultório dela, ou imagem sem gente. Nunca stock com profissionais posando.

### 13.4 Motion

| Onde | O quê |
|---|---|
| Grids (5) | `appearEffect` no **container** com `stagger 0.08s` — os cards entram em cascata |
| Títulos (9 H2/H1) | `textEffect` com `tokenization="word"`, y 12px, 0.55s — entram palavra a palavra |
| Imagens de Serviço | `hoverEffect.scale 1.05` |
| Hero | respiração (§11.5) |

**Pegadinha:** os cards tinham `appearEffect` próprio, que **anula o stagger do
pai** — cada card animava sozinho e a cascata não acontecia. Foi preciso
`appearEffect="null"` nos templates de card para o stagger do grid valer.

Dose: tudo entra uma vez só (`replay="false"`) e `metadata.reducedMotion` segue
ligado. O público inclui gente com apneia, vertigem e enxaqueca — nada de parallax
ou scroll-jacking.

---

## 14. Credenciais, funil e a frase manuscrita (2026-07-25)

### 14.1 Formação e registro profissional

A Sobre ganhou uma faixa de credenciais (borda superior + 4 colunas), vinda da bio
do Instagram dela:

| Rótulo | Valor |
|---|---|
| Medicina | PUCRS |
| Otorrinolaringologia | HCPA |
| Rinologia e Cirurgia de Base do Crânio | EPM / UNIFESP |
| Registro | CRM-RS 49262 · RQE 46420 |

**O CRM e o RQE não são enfeite.** A norma de publicidade médica exige a
identificação do registro, e o **RQE** especificamente quando se anuncia uma
especialidade — que é exatamente o que a página faz ("especializada em Rinologia e
Cirurgia de Base do Crânio"). Aparecem em **dois lugares**: na faixa da Sobre e no
rodapé.

> Os rótulos espelham a bio dela ao pé da letra. **Não** foram inventados os termos
> "residência" ou "fellowship" — se ela quiser essa precisão, é ela quem confirma.

### 14.2 Funil: tudo converge para o formulário

Decisão do Davi: **os CTAs levam à seção `#agendar`**, não ao WhatsApp direto.
O WhatsApp direto ficou só em dois pontos, e o botão flutuante foi **removido**.

| Onde | Destino |
|---|---|
| Header (desktop e menu mobile) | `/#agendar` |
| Hero — "Agendar consulta" | `/#agendar` |
| Sobre — "Marcar uma consulta" | `/#agendar` |
| CTA final — "Prefere falar direto?" | `wa.me` |
| Rodapé | `wa.me` |
| ~~Botão flutuante~~ | removido |

Motivo: sem passar pelo formulário, o lead que desiste no meio some. Com o funil
assim, o `webhookUrl` do `AgendarForm` (§11.4) deixa de ser opcional na prática —
**é ele que segura o lead.**

O rótulo do botão do hero mudou de "Agendar pelo WhatsApp" para "Agendar consulta",
porque ele não leva mais ao WhatsApp.

### 14.3 "respirar bem" manuscrito — e a dívida que isso criou

A frase-âncora usa **Caveat** (Google Fonts, peso 600), manuscrita natural — as
opções caligráficas formais (Great Vibes, Alex Brush) foram descartadas por lerem
como convite de casamento, não como consultório.

O efeito de "sendo escrita" é o `textEffect` do próprio H1 com
`tokenization="character"` e `delay="0.022s"`: as letras entram uma a uma, da
esquerda para a direita.

> **Por que não um traço de caneta de verdade:** o desenho real da linha exige o
> texto como path SVG com `stroke-dashoffset` animado. Isso tiraria "respirar bem"
> do `<h1>` — a frase-âncora da marca sumiria do principal sinal de SEO da página, e
> leitor de tela perderia o texto. O ganho visual não paga.

**⚠️ Dívida técnica.** `fontName` **não pode ser setado num `TextRun` enquanto o
`RichTextNode` tiver `textStylePreset`** — o preset governa a família e o comando é
descartado em silêncio (testado também com Inter, para confirmar que não era a
Caveat). A saída foi `textStylePreset="null"` no H1 do hero, o que **inlina** os
estilos do preset. Consequências:

1. O H1 do hero **não segue mais o Text Style `H1 Hero`**.
2. Os tamanhos por breakpoint tiveram que ser repostos na mão
   (70.4 / 70.4 / 56.4 / 41.2 e o tracking correspondente).
3. Os runs em sans ficaram com **`fontName="Inter"` fixo**. Quando a Black Mango for
   subida, **esses runs não vão mudar sozinhos** — trocar na mão, nos 4 breakpoints.
4. Setar `fontSize` num run empurra os estilos para **todos** os runs
   individualmente e limpa o valor do nó. Não é bug, mas surpreende ao reler.

Tamanhos da Caveat (ela tem altura-x baixa e no mesmo px parece bem menor que a
sans): **90 / 90 / 72 / 53** px, contra 70.4 / 70.4 / 56.4 / 41.2 da sans.

### 14.4 CTAs intermediários e o link fantasma

Dois CTAs no meio da página, nos momentos de maior intenção — não como seções
novas, mas como uma linha discreta de texto + botão no fim do container:

| Depois de | Texto |
|---|---|
| Condições | "Se reconheceu em algum desses? Vale investigar." |
| Como é a consulta | "É simples assim. Vamos marcar a sua?" |

Ficam logo após o momento em que a pessoa se identifica com um sintoma e logo após
o medo do procedimento ser desfeito. No phone o par empilha.

**Mapa final:** 6 CTAs apontam para `/#agendar` (header, menu mobile, hero,
Condições, Como é a consulta, Sobre) e o WhatsApp direto existe em exatamente 2
lugares (CTA final e rodapé).

> ⚠️ **O link fantasma.** O botão do hero continuava indo para o WhatsApp mesmo com
> o wrapper apontando para `/#agendar`. Causa: a instância guardava um
> `$control__link="https://wa.me/..."` da **primeira montagem** — o frame raiz do
> componente virava um link interno e vencia o do wrapper (âncora dentro de âncora).
>
> Isso expõe uma inconsistência real: na §9.1.2 o `$control__link` foi descartado em
> silêncio; aqui ele **aplicou** em silêncio. **Não confie no comportamento nos dois
> sentidos.** Ao mexer em links de botão, audite os dois níveis:
> ```js
> // link do nó (wrapper)      -> n.attributes.link.href
> // controle da instância     -> n.attributes.$control__link
> ```
> Limpar: `SET <instância> $control__link="null";`
