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
| Foto da Dra. | ⚠️ **Pendente** — `assets/img/portrait-placeholder.svg` é placeholder |
| Migração para o Framer | ❌ **Bloqueada** — ver abaixo |

## 🚧 Bloqueio da migração para o Framer

**Projeto Framer de destino:**
- URL: `https://framer.com/projects/Snow-State--XK7b062GvtBGT0A9gUKN-aarZy`
- Project ID: `XK7b062GvtBGT0A9gUKN`

**O que já foi feito:**
- Node.js v24+ instalado (o ambiente vinha com v22) — ver seção abaixo.
- `npx @framer/agent@latest setup` executado com sucesso (skills `framer` e
  `framer-code-components` instaladas).
- `project auth` concluído com sucesso (`Project XK7b062GvtBGT0A9gUKN saved`).

**Onde travou:**
`session new` falha com `Connection timeout after 90000ms`, porque a **política de
rede do ambiente bloqueia todos os domínios do Framer**. O proxy retorna
`403 CONNECT (policy denial)`.

**Reteste em 2026-07-25, em contêiner novo — continua bloqueado:**

```
framer.com  ·  www.framer.com  ·  api.framer.com
edit.framer.com  ·  framerusercontent.com  ·  framer.wiki   → todos 403
github.com · nodejs.org                                     → OK (controle)
```

**Segundo reteste em 2026-07-25, após tentativa de desbloqueio — ainda 403.**
Os quatro hosts principais seguem negados, e o `__agentproxy/status` confirma a
causa: `"kind": "connect_rejected"`, `"gateway answered 403 to CONNECT (policy
denial or upstream failure)"`.

> Antes de gastar uma sessão nova nisso: rode o teste de 1 linha abaixo. Se der
> 403, o desbloqueio não pegou e **não há build possível neste ambiente** — não
> vale instalar Node nem pedir a API key.
>
> ```bash
> curl -sS -o /dev/null -w "%{http_code}\n" --max-time 20 https://framer.com/
> ```
>
> Causa provável de o desbloqueio "não pegar": a política vale a partir da
> **criação do ambiente**. Editar a allowlist e reabrir uma sessão no **mesmo
> ambiente** não basta — é preciso um ambiente novo.

Isso **não deve ser contornado** (orientação explícita em `/root/.ccr/README.md`:
negações de política se reportam, não se roteiam em volta).

### ⚠️ Não é problema de conexão com o GitHub

Confusão já levantada uma vez. São dois caminhos independentes:

- **GitHub** usa um *proxy dedicado*, independente do nível de acesso à rede — por
  isso clone/push funcionam mesmo com política restritiva.
- **Framer** passa pelo *security proxy*, governado pelo **Network access** do
  ambiente. É esse que devolve 403.

O nível padrão é **Trusted**, cuja allowlist cobre npm, PyPI, GitHub e Docker Hub,
mas **não o Framer**. Reconectar o GitHub não muda nada.

**Como destravar — escolha um:**

1. **Editar o ambiente** (ícone de nuvem → engrenagem) → **Network access** →
   **Custom**, adicionando:
   ```
   framer.com
   *.framer.com
   framerusercontent.com
   *.framerusercontent.com
   ```
   Manter marcado **"Also include default list of common package managers"** —
   sem isso perde-se npm e `nodejs.org`, e o `npx @framer/agent` deixa de instalar.

   Dois detalhes: a política vale a partir da **criação** do ambiente, então é
   preciso **abrir uma sessão nova**; e alterar a allowlist **invalida o cache**,
   fazendo o setup script rodar de novo — bom momento para instalar o Node 24+ nele.
   Doc: https://code.claude.com/docs/en/claude-code-on-the-web

2. **Rodar o `@framer/agent` na máquina local**, onde o Framer é acessível e a
   autenticação por navegador funciona normalmente:
   ```bash
   npx @framer/agent@latest setup
   npx @framer/agent@latest session new "<url do projeto>"
   ```
   Nesse caso, use `FRAMER.md` como roteiro de build.

**Antes de reconectar:** gerar uma **nova API key** do projeto no Framer
(Site Settings → General). A key usada anteriormente foi compartilhada em chat e
deve ser revogada. **Nunca commitar a API key neste repositório.**

> Só peça a API key **depois** de o teste de acesso passar. Pedir antes queima uma
> key à toa: o contêiner é efêmero e ela morre com a sessão sem ter sido usada.

## ✅ Decisões de build já tomadas (2026-07-25)

Os três pontos do `FRAMER.md` que exigiam decisão humana estão resolvidos. Não
reabrir com o cliente:

| Ponto | Decisão |
|---|---|
| Breakpoints | Ajustar o Framer para **900 / 560** (bate com o CSS). Fazer **antes** de montar layers |
| Ano do rodapé | **Code component** — pronto em `framer/CopyrightLine.tsx` |
| Placeholders | **Construir com os placeholders** e trocar os assets depois. Não publicar antes da troca |

## ⚠️ Node.js neste ambiente

O ambiente vem com **Node v22**, mas o `@framer/agent` exige **v24+**.
Foi instalado o binário oficial em `/opt/node-v26.5.0-linux-x64`. Para usá-lo:

```bash
export PATH="/opt/node-v26.5.0-linux-x64/bin:$PATH"
```

Como o contêiner é efêmero, **numa sessão nova essa instalação não existe mais** —
verifique com `node --version` e reinstale se necessário (release oficial em
https://nodejs.org/download/release/latest/).

Os comandos do `@framer/agent` precisam de rede e acesso a `~/.agents`, então
devem rodar **com permissões elevadas** (sem sandbox) — caso contrário travam.

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

1. Trocar os placeholders quando o cliente enviar, **como arquivo** (anexo, não
   imagem colada no chat): logo DC em SVG/PNG e foto da Dra. em JPG/PNG.
   Instruções de substituição no `README.md`.
2. Coletar aprovação do conteúdo/textos com o cliente.
3. Destravar o acesso ao Framer (ver acima) e **executar o `FRAMER.md`** —
   o spec já resolve `clamp()`/`color-mix()` em valores px por breakpoint, define
   os Color/Text Styles, as 3 coleções de CMS e a árvore de layers de cada seção,
   e as três decisões pendentes já estão fechadas.

**O caminho crítico é só o acesso ao Framer.** Os itens 1 e 2 não bloqueiam o
build — a decisão foi construir com placeholders e trocar depois. Tudo o que dava
para preparar fora do editor já está preparado.
