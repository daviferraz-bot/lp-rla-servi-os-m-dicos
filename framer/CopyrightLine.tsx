import { addPropertyControls, ControlType } from "framer"

/**
 * Linha de copyright do rodapé, com o ano sempre atual.
 *
 * Substitui o comportamento de `js/script.js`, que preenchia
 * `#ano` com `new Date().getFullYear()`. O Framer não tem
 * expressão dinâmica em text layer, então a linha inteira vira
 * um code component.
 *
 * ── Por que a linha inteira, e não só o ano ────────────────────
 * Code components no Framer são layers próprios; não é possível
 * inserir um dentro de um text layer como um `<span>`. Montar
 * "© " + [componente] + " Dra. ..." como stack horizontal quebra
 * de forma imprevisível no mobile. Então o componente carrega o
 * texto todo.
 *
 * ── Tipografia ────────────────────────────────────────────────
 * Text Styles do Framer não cascateiam para dentro de code
 * components, então os valores do spec (§3 e §6.8 do FRAMER.md)
 * estão nos defaults abaixo e também expostos no painel:
 *   Garet 400 · 13.1px · Cream 60 (rgba(245,237,228,0.60))
 * Se o Text Style do rodapé mudar, atualizar aqui também.
 *
 * ── Instalação ────────────────────────────────────────────────
 * 1. No editor: Assets → Code → New Code File → colar este arquivo.
 * 2. Arrastar o componente para dentro do frame `Legal` do footer.
 * 3. Largura: Fill. Altura: auto.
 * 4. Conferir que a fonte Garet já foi subida no projeto
 *    (Assets → Fonts), senão cai no fallback sans-serif.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 320
 */
interface CopyrightLineProps {
    holder: string
    notice: string
    color: string
    fontSize: number
    align: "left" | "center" | "right"
    style?: React.CSSProperties
}

export default function CopyrightLine(props: CopyrightLineProps) {
    const { holder, notice, color, fontSize, align, style } = props

    return (
        <p
            style={{
                margin: 0,
                width: "100%",
                fontFamily: "Garet, sans-serif",
                fontWeight: 400,
                fontSize: fontSize,
                lineHeight: 1.6,
                color: color,
                textAlign: align,
                ...style,
            }}
        >
            {`© ${new Date().getFullYear()} ${holder}. ${notice}`}
        </p>
    )
}

CopyrightLine.defaultProps = {
    holder: "Dra. Maria Eduarda Deon Ceccato",
    notice: "Todos os direitos reservados.",
    color: "rgba(245, 237, 228, 0.6)",
    fontSize: 13.1,
    align: "left",
} satisfies CopyrightLineProps

addPropertyControls(CopyrightLine, {
    holder: {
        type: ControlType.String,
        title: "Titular",
        description: "Nome que aparece depois do ano.",
    },
    notice: {
        type: ControlType.String,
        title: "Aviso",
        description: "Frase final. Deixe vazio para omitir.",
    },
    color: {
        type: ControlType.Color,
        title: "Cor",
        description: "Padrão: Cream 60.",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Tamanho",
        min: 10,
        max: 24,
        step: 0.1,
        displayStepper: true,
        unit: "px",
    },
    align: {
        type: ControlType.Enum,
        title: "Alinhar",
        options: ["left", "center", "right"],
        optionTitles: ["Esquerda", "Centro", "Direita"],
        displaySegmentedControl: true,
    },
})
