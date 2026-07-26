# Contexto do projeto — LP Dra. Maria Eduarda Deon Ceccato

> Este arquivo é carregado automaticamente pelo Claude Code.
> Leia também `BRAND.md` (identidade + briefing) e `README.md` (como rodar).

## O que é

Landing page para a **Dra. Maria Eduarda Deon Ceccato** — Otorrinolaringologia,
especializada em **Rinologia e Cirurgia de Base do Crânio**, em Porto Alegre e
Grande POA. Cliente da Turbo Partners.

Mensagem-âncora: **"Qualidade de vida começa por respirar bem."**

## Objetivo final

A landing foi construída em **HTML/CSS/JS puro como blueprint**, com a decisão já
tomada (confirmada pelo cliente) de **reconstruí-la nativamente no Framer** —
não como embed/iframe, mas como seções nativas, editáveis, com CMS e publicação.

Por isso o código evita truques de CSS que o Framer não reproduz: tokens em
variáveis CSS, layout em flex/grid simples, seções bem delimitadas.

## Estado atual

| Item | Status |
|------|--------|
| Landing HTML/CSS/JS | ✅ Construída, revisada visualmente e commitada |
| Fontes da marca | ✅ Black Mango (9 pesos) + Garet (Book, Heavy) em `assets/fonts/` |
| Paleta / identidade | ✅ Aplicada via tokens CSS (ver `:root` em `css/styles.css`) |
| CTA WhatsApp | ✅ `https://wa.me/5551995337479` em todos os botões |
| Preview hospedado | ✅ https://claude.ai/code/artifact/bf7cf9fd-d5ac-4690-89f2-096bb9f495a0 |
| Spec de migração | ✅ `FRAMER.md` — build completo, pronto para executar |
| Logo DC oficial | ⚠️ **Pendente** — `assets/logo/dc-monogram.svg` é recriação aproximada |
| Fotos da Dra. | ✅ **Recebidas** (2026-07-25) — retrato de jaleco no hero, foto do congresso na Sobre |
| Migração para o Framer | ✅ **Construída** (2026-07-25) — ver abaixo |
| Fontes da marca no Framer | ⚠️ **Pendente** — upload é manual, o agente não consegue |

## ✅ Migração executada (2026-07-25)

**O bloqueio de rede acabou.** O ambiente atual (Mac local do Davi) acessa o Framer
normalmente — `framer.com` responde 307, não mais 403. Node v24.16.0 já instalado e
o projeto já autenticado em `~/.config/framer/projects.json`. **Não peça API key**:
ela já está salva para `XK7b062GvtBGT0A9gUKN`.

> O histórico do bloqueio (403 do security proxy, retestes, allowlist) foi removido
> daqui por estar resolvido. Se voltar a dar 403 num contêiner novo, o teste é:
> ```bash
> curl -sS -o /dev/null -w "%{http_code}\n" --max-time 20 https://framer.com/
> ```

### O que já está construído no projeto Framer

Página `/` (`augiA20Il`), reconstruída **nativamente** — sem embed nem iframe:

- **20 Color Styles** (§1) — paleta + as derivadas de `color-mix()`
- **4 breakpoints** com quebras reais em **900 e 560** (§2) — precisou de 4, não 3;
  a razão está em `FRAMER.md` §9.2.5, é contraintuitivo
- **16 Text Styles** (§3), 64 slots conferidos um a um — **sem `fontName` ainda**
- **3 coleções de CMS** (§5) com os 13 itens
- **11 seções**: Header → Hero → Condições → Serviços → Como é a consulta →
  Abordagem → Sobre → FAQ → Agendar → CTA final → Footer + WhatsApp flutuante
- **6 coleções de CMS**: Condicoes, Servicos, Pilares, Consulta, FAQ
- **Componentes**: `Button` (4 variantes), `FAQ Item` (accordion), `Nav Link`
  (sublinhado no hover), `Header Fundo` (troca de estado ao rolar)
- **Code files**: `CopyrightLine` (ano corrente) e `AgendarForm` (formulário que
  abre o WhatsApp já preenchido)
- **Reveal, SEO e `prefers-reduced-motion`** (§7 e §8), mais a respiração do hero

> As seções novas (§11 do `FRAMER.md`) **não existem no `index.html`**. O blueprint
> HTML continua sendo a referência da migração original; do §11 em diante o **Framer
> é a fonte da verdade**.

### O que falta

1. **Subir as 6 fontes** — `Assets → Fonts → Upload`. **Só você consegue**: a API do
   Framer não tem upload de fonte (*"Custom fonts are not available to plugins"*) e
   nem Black Mango nem Garet existem na biblioteca dele. Hoje o site está em Inter.
   Depois do upload, aplicar `fontName` nos 16 presets — receita no fim do `FRAMER.md`.
2. **Trocar o logo placeholder.** Gerar **duas** cópias tintadas (terracota e camel)
   — `currentColor` não funciona em SVG subido (§9.1.4).
3. **Revisar o conteúdo do FAQ com a Dra.** (§11.3) — principalmente a resposta
   sobre convênio, que hoje só manda falar no WhatsApp porque a informação não
   estava no briefing.
4. **Plugar um `webhookUrl` no `AgendarForm`** se quiser guardar os leads. Sem ele,
   quem desiste antes de abrir o WhatsApp se perde (§11.4).
5. **Trocar as imagens dos cards de Serviços.** Hoje são placeholders do Unsplash,
   escolhidas **sem pessoas** de propósito — stock com profissionais posando lê como
   se fossem a Dra. e a equipe dela (`FRAMER.md` §13.3). O ideal são fotos do
   consultório dela.
6. **Imagem OG** e aprovação dos textos.

**Não publicar antes da troca dos placeholders** (decisão já tomada).

### Leia antes de mexer no editor

`FRAMER.md` §9 foi reescrito **depois** do build e lista as armadilhas que só
aparecem na tela. Duas que custam horas se você não souber:

- **Um `SET` com um atributo inválido é descartado inteiro, em silêncio** — sem
  `parseErrors`, sem `errors`, sem warning. Foi assim que dois botões saíram
  idênticos. Ao mexer em `$control__*`, um atributo por `SET` e releia o nó.
- **O Framer inventa valores nos slots de breakpoint que você não declara** — um
  estilo de 11.8px fixo virou 9px sozinho. Declare tudo nos 4 slots e confira.

## ✅ Decisões de build já tomadas (2026-07-25)

Os três pontos do `FRAMER.md` que exigiam decisão humana estão resolvidos. Não
reabrir com o cliente:

| Ponto | Decisão |
|---|---|
| Breakpoints | Ajustar o Framer para **900 / 560** (bate com o CSS). Fazer **antes** de montar layers |
| Ano do rodapé | **Code component** — pronto em `framer/CopyrightLine.tsx` |
| Placeholders | **Construir com os placeholders** e trocar os assets depois. Não publicar antes da troca |

## ⚠️ Rodando o `@framer/agent`

O `@framer/agent` exige **Node v24+**. No Mac do Davi já há **v24.16.0** — só
conferir com `node --version`. (Num contêiner Linux o padrão é v22 e é preciso
instalar o binário oficial de https://nodejs.org/download/release/latest/.)

Os comandos precisam de rede e de acesso a `~/.agents`, então devem rodar **com
permissões elevadas** (sem sandbox) — caso contrário travam.

Fluxo de uma sessão:

```bash
npx @framer/agent@latest session new "XK7b062GvtBGT0A9gUKN"   # imprime o session id
npx @framer/agent@latest exec -s <id>                          # código via stdin
```

Duas pegadinhas do runtime:

- O `fs` do `exec` é **sandboxado** e não enxerga a pasta do projeto — copie o que
  precisar para `/tmp` antes (foi assim que os SVGs subiram).
- Ler um nó de volta depois de escrever é obrigatório: ver a seção
  "Leia antes de mexer no editor" acima.

## Estrutura

```
index.html            Página única, seções ancoradas
css/styles.css        Tokens (:root) + estilos + @font-face
js/script.js          Menu mobile, header ao rolar, reveal on scroll
assets/fonts/         Black Mango (títulos) · Garet (textos)
assets/logo/          Monograma DC (placeholder)
assets/img/           Placeholder da foto
BRAND.md              Identidade, tom de voz, serviços, pendências
README.md             Como rodar e como trocar os placeholders
FRAMER.md             Spec de build no Framer (tokens, breakpoints, CMS, layers)
FRAMEWORK.md          Playbook portátil: HTML no Claude → Framer via @framer/agent
framer/               Code components para colar no editor do Framer
```

Seções da página, na ordem: Header → Hero → Condições → Serviços → Abordagem
(pilares) → Sobre → CTA final → Footer, mais botão flutuante de WhatsApp.

## Convenções

- **Idioma:** todo o conteúdo do site e a conversa com o cliente em **pt-BR**.
- **Tom de voz:** informativo, acolhedor, levemente descontraído.
  **Nunca** apelativo ou sensacionalista (exigência explícita do briefing).
- **Cores e fontes:** usar sempre os tokens de `:root`; não introduzir cores fora
  da paleta da marca.
- **Dados sensíveis:** o briefing de onboarding tinha faturamento, margem e
  comentários sobre concorrentes — isso foi **deliberadamente mantido fora do
  repositório**. Não versionar esse tipo de informação.
- **Git:** desenvolver na branch `claude/maria-eduarda-framer-migration-0tkx69`
  (sucessora de `-xdic3d`, que foi incorporada por fast-forward).
  Não abrir PR sem o usuário pedir.

## Próximos passos

1. **Subir as 6 fontes no Framer** (`Assets → Fonts → Upload`) e depois aplicar
   `fontName` nos 16 Text Styles. É o único item que trava a fidelidade visual —
   o site está em Inter hoje. Receita no fim do `FRAMER.md`.
   ⚠️ **O H1 do hero não segue mais o Text Style** (foi destacado para aceitar a
   fonte manuscrita) e seus trechos em sans estão com `Inter` fixo nos 4
   breakpoints. Trocar na mão para Black Mango — `FRAMER.md` §14.3.
2. **Trocar o logo** quando o cliente enviar, **como arquivo** (anexo, não imagem
   colada no chat): logo DC em SVG/PNG. Instruções no `README.md`. Lembrar das
   **duas** cópias tintadas no Framer — terracota e camel (`FRAMER.md` §9.1.4).
   As fotos da Dra. já entraram: `assets/img/dra-maria-eduarda.jpg` (hero) e
   `assets/img/dra-maria-eduarda-congresso.jpg` (Sobre).
3. Coletar aprovação do conteúdo/textos com o cliente.
4. Fechar os itens abertos do checklist (`FRAMER.md` §10): header "scrolled",
   ESC no menu mobile e imagem OG.
5. **Só então publicar.**

**O caminho crítico é só o acesso ao Framer.** Os itens 1 e 2 não bloqueiam o
build — a decisão foi construir com placeholders e trocar depois. Tudo o que dava
para preparar fora do editor já está preparado.
