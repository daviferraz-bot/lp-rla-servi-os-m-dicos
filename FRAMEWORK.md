# Framework: do HTML no Claude ao site nativo no Framer

> Playbook da Turbo Partners para construir landing pages e sites no Framer a
> partir de blueprints HTML/CSS construídos com o Claude, usando o **`@framer/agent`
> CLI** (sessões + `exec` + DSL de canvas — não é MCP, apesar do apelido).
>
> Destilado do projeto **LP Dra. Maria Eduarda Deon Ceccato** (2026-07-25), onde
> este processo foi executado do zero ao site completo em um dia. Este documento é
> **autônomo e portátil**: copie para qualquer projeto novo.
>
> Referências vivas do projeto-origem: `FRAMER.md` (spec + §9/§12/§13/§14 com as
> armadilhas na íntegra) e `CLAUDE.md`.

---

## Visão geral: as 6 fases

```
0. Blueprint    HTML/CSS/JS puro, escrito PARA migrar
1. Spec         resolver o que o Framer não tem (clamp, color-mix, ch) em números
2. Pré-flight   rede → node → auth → session (nessa ordem)
3. Fundações    tokens → breakpoints → text styles → CMS → componentes
4. Seções       header/footer primeiro, depois o resto; replicas por override
5. Fechamento   motion, SEO, auditorias programáticas, checklist de aceite
```

A regra que governa tudo: **o Framer aceita comandos errados em silêncio.**
Nenhuma fase termina sem *reler o que foi escrito* — diagnóstico limpo não
significa que aplicou. Esse é o princípio nº 1 do framework e a causa raiz de
quase todos os bugs que já pegamos.

---

## Fase 0 — Blueprint HTML no Claude

O blueprint não é descartável: é a **fonte da verdade** de conteúdo e visual
durante toda a migração, e o preview aprovável pelo cliente antes de tocar no
Framer.

**Regras de escrita do CSS** (o que torna a migração barata):

- **Tokens em `:root`** para toda cor, raio, sombra, espaçamento e fonte.
  Cada token vira um Color Style / valor nomeado no Framer, 1:1.
- **Layout só com flex e grid simples.** Nada de float, position mágico,
  `calc()` encadeado. Cada seção = um bloco bem delimitado com classe própria.
- **Breakpoints explícitos e poucos** (ex.: 900/560). Anote-os — vão virar
  configuração no Framer, e mudar depois de montar layers custa caro.
- `clamp()`, `color-mix()`, unidades `ch` e `vw` **podem** ser usados — mas
  saiba que a Fase 1 vai resolvê-los em px. Se quiser economizar a Fase 1,
  escreva já em px por breakpoint.
- **Seções ancoradas** (`id="..."`) desde o HTML — os links internos do Framer
  vão espelhar essas âncoras.
- Interações em JS mínimo e declarativo (reveal on scroll, header scrolled,
  menu mobile) — cada uma tem um equivalente Framer conhecido (ver Fase 5).

**Assets:** fontes da marca em arquivo, logos em SVG, fotos reais **como
arquivo** (imagem colada em chat não gera arquivo utilizável). Se algo não
existe, crie placeholder e **decida por escrito** que se constrói com
placeholder e troca depois — nunca segure o build por asset.

---

## Fase 1 — Spec de migração (o "FRAMER.md" do projeto)

O Framer trabalha com **valores concretos por breakpoint**. A parte cara da
migração não é montar layers — é resolver funções CSS em números. Faça isso
**em documento, antes de abrir o editor**, para o build virar execução mecânica.

O spec deve conter, nesta ordem:

1. **Decisões fechadas** — tudo que exigiria perguntar ao cliente no meio do
   build (breakpoints, placeholders, ano do rodapé etc.). Feche antes.
2. **Color Styles** — paleta base + cada `color-mix()` resolvido em cor própria
   com nome (ex.: `Cream 82` = `rgba(245,237,228,0.82)`).
3. **Text Styles** — todos os `clamp()` calculados nos breakpoints de
   referência, com peso, line-height, tracking e cor. ⚠️ Confira o peso contra
   as regras CSS **específicas** (`.hero h1`), não contra a base (`h1,h2,h3`) —
   especificidade já nos enganou uma vez em cada direção.
4. **Espaçamentos** resolvidos (section-y, gaps, paddings) por breakpoint.
5. **Schema de CMS** — toda lista vira coleção (cards, passos, FAQ, pilares).
   Campos + conteúdo completo no spec, pronto para colar.
6. **Árvore de layers por seção** — em pseudocódigo indentado, com fills,
   raios, sombras e estados (hover, scrolled).
7. **Unidades `ch` → px** (regra prática: 1ch ≈ 0,5em da fonte de corpo).
8. **Checklist de aceite** — mensurável, para fechar o build contra ele.

---

## Fase 2 — Pré-flight (ordem obrigatória)

Cada passo é pré-requisito do seguinte. Não pule nem inverta — pedir API key
antes do teste de rede queima uma key à toa.

```bash
# 1. Rede — o Framer responde? (403 = política de rede; PARE e reporte)
curl -sS -o /dev/null -w "%{http_code}\n" --max-time 20 https://framer.com/
# 307/200 = ok

# 2. Node ≥ 24 (o @framer/agent exige)
node --version

# 3. Auth já existe? (não peça key se já houver)
#    ~/.config/framer/projects.json guarda apiKey por projectId
# 4. Sessão
npx @framer/agent@latest setup                    # 1ª vez no ambiente
npx @framer/agent@latest session new "<project-id-ou-url>"   # imprime o session id
```

- Comandos do agente precisam de **rede e `~/.agents`** → rode **sem sandbox**.
- `session new` regenera o contexto do projeto em
  `~/.agents/skills/framer/projects/<id>/` — **leia `index.md` e siga o task
  map** antes do primeiro comando. Não é opcional: é onde estão a gramática da
  DSL e as regras de layout.
- O `fs` dentro do `exec` é sandboxado (cwd do agente, `/tmp`) — **copie
  assets para `/tmp`** antes de ler bytes neles.
- `docs <Método>` antes de usar qualquer método novo. Não adivinhe assinatura.

**O que a API NÃO faz (planeje como passo manual):**

| Limite | Consequência |
|---|---|
| Upload de fonte custom | §Fase 3: text styles **sem `fontName`**, aplicar depois do upload manual |
| `$control__link` (LinkVariable) via DSL | Links de botão vivem em **wrapper FrameNode** |
| Tokens de cor dentro de gradiente | Achatar o gradiente terminando na cor literal |
| `currentColor` em SVG subido | Subir **uma cópia por tint** |
| `FixedOverlayNode` dentro de `ComponentNode` | Menu mobile: overlay no FrameNode, ou drawer por variante |

---

## Fase 3 — Fundações (ordem de dependência)

### 3.1 Color Styles primeiro

Não dependem de nada. Crie todos de uma vez
(`+ColorStyleTokenNode` + `SET light="..."`), guarde o mapa
`nome → var(--token-<uuid>)` do `renamedIds` e **use sempre o token, nunca hex
solto** — a auditoria final varre isso.

### 3.2 Breakpoints — a armadilha nº 1 do Framer

**A largura de um breakpoint NÃO é o ponto de quebra.** O range de cada um é
derivado do breakpoint *seguinte*, e o menor cobre `0 → próximo`. Com
1200/900/560, os breaks reais caem em 1200 e 900 — o 560 nunca vira limite.

**Regra: para quebrar em N pontos, crie N+1 breakpoints.** Para breaks em
900/560:

| Breakpoint | Largura | Range real |
|---|---|---|
| Desktop | 1200 | ≥1200 |
| Desktop S | 900 | 900–1199 (valores = Desktop) |
| Tablet | 560 | 560–899 |
| Phone | 390 | ≤559 |

Sempre: `layout="stack"`, `stackDirection="vertical"`, `height="auto"` no
breakpoint. Faça isso **antes de qualquer layer** — replicas herdam tudo.

### 3.3 Text Styles — declare TUDO, confira TUDO

Dois comportamentos do Framer aqui:

1. **`breakpoint.default.minWidth` é travado em 1200** (aceita o comando,
   ignora o valor). Use 4 slots com `default == medium` para espelhar seus
   breaks reais.
2. **Slots não declarados são preenchidos com valores inventados** (um estilo
   fixo de 11.8px virou 9px sozinho; um tracking de -0.02em apareceu do nada).
   Declare `fontSize`, `lineHeight` e `letterSpacing` **nos 4 slots**, mesmo
   quando o valor não muda — e rode um **script de verificação** comparando
   cada slot com o esperado. No projeto-origem, 5 de 16 estilos saíram errados
   na primeira passada.

- `letterSpacing` só aceita px/rem — converta `em` por breakpoint.
- Fontes custom indisponíveis? Crie os estilos **sem `fontName`**; como tudo é
  aplicado por nome de estilo, aplicar a família depois = 1 comando por preset.

### 3.4 CMS

- Toda lista é coleção. O cliente edita sem tocar em layout — é o argumento de
  venda do nativo sobre o embed.
- **Slug**: é auto-gerado do **primeiro campo string** criado. Se o primeiro
  campo lógico é um índice ("01"), crie o Titulo primeiro e depois
  `MOVE <campo> position="0"` para reordenar o painel.
- Ícones editáveis: `+IconVariable` na coleção + `IconNode` no template bindado
  com `$control__icon="var(--variable-<id>)"`.
- Imagens editáveis: `+Variable type="image"` + frame com
  `fill="var(--variable-<id>)"`.
- Verifique o conteúdo relendo a coleção — acentos, travessões e os valores em
  si.

### 3.5 Componentes reutilizáveis

Crie **antes** das seções o que se repete: Button (variantes por contexto),
item de accordion, nav link. Regras que custaram tempo:

- **Controles de instância usam `$control__<nome_em_snake_case>`**, nunca o id
  temporário do `+Variable`. Binde errado e falha **em silêncio**. Rode
  `readComponentControls` antes de bindar.
- **Um atributo por `SET`** em `$control__*`, e releia a instância depois. Um
  atributo inválido descarta o `SET` inteiro sem erro.
- Link em botão: **wrapper FrameNode com `link.href`** por fora da instância. E
  audite instâncias antigas: um `$control__link` residual de outra montagem
  **vence o link do wrapper** (âncora dentro de âncora). Limpe com
  `$control__link="null"`.
- Gesture variant (`CREATE_VARIANT ... gesture="hover"`) para hovers ricos
  (ex.: sublinhado crescendo = retângulo `width 0% → 100%`).
- `hoverEffect` **não anima `borderColor`** — desenhe o hover com fundo/sombra,
  ou dobre a borda no padding quando ela for da cor do fundo.

---

## Fase 4 — Seções

**Ordem: Header → Footer → Hero → demais.** Header e footer fixam a régua de
espaçamento e as cores; o hero valida os padrões de layout antes de
industrializar o resto.

Padrões por seção:

```
Section  [width 100%, stack vertical, stackAlignment center, fill <token>,
          padding-y do spec, scrollTargetEnabled + elementId p/ âncora]
└─ Container  [width 100%, maxWidth 1200, padding-x 20, stack]
   └─ conteúdo...
```

- **maxWidth no container, nunca no breakpoint.**
- Espaço vertical entre blocos de texto: wrapper com `padding`, não margens
  (RichTextNode não tem padding).
- Ênfase inline (itálico/cor/bold no meio do título): `TextRun` dentro do
  mesmo `TextBlock` — nunca dois text layers, senão a quebra responsiva morre.
- Grid → breakpoint estreito: **1 coluna = converta para stack** (regra do
  próprio Framer), com filhos `width="1fr" height="auto"`.
- Grid com N itens: confira se N fecha as linhas em cada breakpoint. 3 itens em
  2 colunas = card órfão → vire stack.
- Replicas: **nunca crie nó novo em replica.** Crie no Primary e sobrescreva
  por compound id (`<replica><nó>`). Visibilidade por breakpoint =
  `visible="true|false"` na replica (ex.: nav vs hambúrguer).
- `position="absolute"` + 4 pinos **não estica** (pins ≠ inset). Tamanho vem de
  `width/height` — use `100%`.
- Após cada seção: **screenshot** (`read-project -q '[{"type":"screenshot",...}]'`)
  e olhe. Foi screenshot que pegou botões idênticos, fundo não esticado e a
  foto que ia girar.

**Code components** (só quando o canvas não expressa a lógica): ano dinâmico,
formulário que monta URL em runtime. Fluxo: `typecheckCode` até limpar →
`createCodeFile` → instanciar pelo `componentId` do export. Tipagem explícita
nas props (o typecheck do Framer reclama de `props` implícito e de
`defaultProps` largos — `satisfies` resolve).

---

## Fase 5 — Fechamento

### 5.1 Motion (dose e mecânica)

Dose: **um movimento de assinatura + micro-interações**, tudo `replay="false"`,
`metadata.reducedMotion="true"` no RootNode. Público de saúde inclui gente com
vertigem/enxaqueca — parallax e scroll-jacking são contraindicados, não só
bregas.

Mecânica (cada linha custou debug):

| Efeito | Como | Armadilha |
|---|---|---|
| Reveal | `appearEffect` on-view | — |
| Cascata de cards | `appearEffect` **no grid** com `enter.stagger` | Filho com `appearEffect` próprio **anula o stagger do pai** → `appearEffect="null"` nos filhos |
| Loop (respiração) | `loopEffect` mirror | **`rotate` default = 360°** — declare TODAS as transformações, mesmo zeradas |
| Header ao rolar | Fundo = `ComponentInstanceNode` com `scrollVariantEffect` | `fromVariant/toVariant` **não gravam**; use `sections.0.target` + `sections.0.variant`. FrameNode puro não tem esse efeito |
| Texto "sendo escrito" | `textEffect` com `tokenization="character"` | Manter o texto no `<h1>`; path SVG animado destrói SEO e leitor de tela |
| Fonte diferente num trecho | `fontName` no `TextRun` | **Não aplica enquanto o nó tem `textStylePreset`** — precisa destacar o preset (inlina estilos) e repor tamanhos por breakpoint na mão. Registre a dívida |

### 5.2 SEO e metadados

`SET rootNode metadata.title/description/favicon` + âncoras funcionando +
`alt` real nas fotos (descreva a cena — "palestrando no congresso X" vale mais
que repetir o nome). OG image 1200×630 é item de checklist.

### 5.3 Auditorias programáticas (não confie no olho)

Serialize a página inteira (`depth` alto), caminhe a árvore e verifique:

```js
// 1. Links: destinos esperados, contagem por destino, nada divergente
// 2. DOIS níveis por botão: n.attributes.link.href  E  n.attributes.$control__link
// 3. Cores soltas: fill/textColor/borderColor que começam com # ou rgb (fora var(--token))
// 4. Grids por breakpoint: gridColumnCount / layout=stack conforme o spec
// 5. Text styles: cada slot de cada preset contra a tabela do spec
```

No projeto-origem, cada uma dessas varreduras pegou pelo menos um erro real.

### 5.4 Conversão e conteúdo (o que faz a página trabalhar)

- **Sintomas em 1ª pessoa** ("Meu nariz entope só de um lado"), rótulo técnico
  como eyebrow. Ninguém busca o diagnóstico; busca o sintoma.
- **Seção "como funciona"** derruba o medo do desconhecido — em saúde, a trava
  não é preço.
- **FAQ por CMS** responde objeção e alimenta SEO. Conteúdo **precisa de aval
  do cliente** (em medicina: nada de promessa, preço ou depoimento — CFM).
- **Credenciais**: em anúncio de especialidade médica, **CRM + RQE são
  obrigatórios** (Sobre + rodapé). Prova de autoridade (formação, congressos)
  é a alavanca permitida.
- **Funil único**: CTAs intermediários nos picos de intenção (pós-identificação
  do sintoma, pós-desmontagem do medo) → todos para **uma** seção de conversão;
  canal direto (WhatsApp) em no máximo 2 pontos. Formulário monta a conversa
  pronta (`wa.me/?text=...`) e **precisa de webhook** para não perder quem
  desiste no meio.
- **Imagens**: nunca stock com profissionais posando na página de um
  profissional real — lê como se fosse ele/a equipe. Ambiente e instrumentos,
  sem pessoas, com `saturate/brightness` para casar com a paleta. Ideal: fotos
  reais.

### 5.5 Checklist de aceite (molde)

```
[ ] Fontes: subidas (manual) e aplicadas por preset; H1s destacados acertados na mão
[ ] Tokens aplicados por nome — varredura de cor solta zerada
[ ] Breaks reais nos px do CSS (N+1 breakpoints)
[ ] Coleções CMS completas, acentos ok, slugs decentes
[ ] Grids reagem por breakpoint conforme spec (sem card órfão)
[ ] Auditoria de links limpa (2 níveis) + âncoras ok
[ ] Motion: replay=false, reducedMotion ligado, nada girando por default
[ ] Metadados + favicon + OG
[ ] Assets reais no lugar dos placeholders  ← gate de publicação
[ ] Conteúdo sensível aprovado pelo cliente ← gate de publicação
[ ] Webhook do formulário plugado          ← gate de publicação
```

---

## Apêndice A — Os 10 mandamentos (cola rápida)

1. **Releia tudo que escrever.** O Framer descarta comandos inválidos e aplica
   defaults em silêncio, nos dois sentidos.
2. **N+1 breakpoints** para N pontos de quebra.
3. **Declare todos os slots** de text style e **todas as transformações** de
   `loopEffect`.
4. **Um atributo por `SET`** em `$control__*`, com o nome snake_case do
   controle.
5. **Link de botão no wrapper** — e audite `$control__link` residual.
6. **Tokens por nome, sempre** — hex solto é bug.
7. **1 coluna = stack**, não grid de 1 coluna.
8. **Nó novo só no Primary**; replicas recebem overrides.
9. **Screenshot por seção** + auditorias programáticas no fim.
10. **Gates de publicação**: assets reais, conteúdo aprovado, webhook.

## Apêndice B — Snippets de operação

```bash
# executar código na sessão (heredoc evita expansão do shell)
npx @framer/agent@latest exec -s <id> <<'FRAMER_EXEC'
const res = await framer.agent.applyChanges(`SET <id> fill="var(--token-...)";`, { pagePath: "/" });
console.log(JSON.stringify(res.parseErrors), JSON.stringify(res.linter));
FRAMER_EXEC

# screenshot de um nó
npx @framer/agent@latest read-project -s <id> -p "/" -q '[{"type":"screenshot","id":"<nó>"}]'

# fonte existe na biblioteca?
npx @framer/agent@latest read-project -s <id> -p "/" -q '[{"type":"font-search","name":"<família>"}]'
```

- `renamedIds` do `applyChanges` → **use os ids canônicos** dali em diante;
  ids temporários morrem com a resposta.
- `state.<chave>` persiste entre `exec` da mesma sessão — guarde mapas de
  tokens/ids caros.
- `getRect` pode devolver medida **stale** logo após mudanças grandes —
  confirme por screenshot antes de "consertar" um layout que já está certo.
