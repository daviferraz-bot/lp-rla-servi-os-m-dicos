import { addPropertyControls, ControlType } from "framer"
import { useState } from "react"

/**
 * Formulário de agendamento que abre o WhatsApp já preenchido.
 *
 * ── Por que é um code component ────────────────────────────────
 * O formulário nativo do Framer redireciona para uma URL **fixa**
 * no envio. Para o link do `wa.me` carregar o que a pessoa digitou
 * é preciso montar a URL em runtime — daí o componente.
 *
 * ── Onde o lead fica guardado ──────────────────────────────────
 * Por padrão, em lugar nenhum: o componente só abre o WhatsApp, e
 * a conversa passa a ser o registro. Se você preencher `webhookUrl`
 * (Formspark, Zapier, n8n, Make...), cada envio também é enviado
 * por POST em JSON antes de abrir o WhatsApp — assim o lead não se
 * perde se a pessoa desistir no meio do caminho.
 *
 * ── Tipografia ────────────────────────────────────────────────
 * Text Styles do Framer não cascateiam para dentro de code
 * components, então os valores da marca estão embutidos aqui:
 * Garet no corpo, Black Mango no título. Se os Text Styles
 * mudarem, atualizar este arquivo também.
 *
 * ── Instalação ────────────────────────────────────────────────
 * 1. Assets → Code → New Code File → colar este arquivo.
 * 2. Arrastar para dentro da seção "Agendar".
 * 3. Largura: Fill. Altura: auto.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 520
 */

interface AgendarFormProps {
    phone: string
    webhookUrl: string
    queixas: string[]
    horarios: string[]
    submitLabel: string
    accent: string
    accentHover: string
    onAccent: string
    text: string
    textSoft: string
    fieldFill: string
    fieldBorder: string
    radius: number
    style?: React.CSSProperties
}

const BODY = "Garet, 'Segoe UI', system-ui, sans-serif"

export default function AgendarForm(props: AgendarFormProps) {
    const {
        phone,
        webhookUrl,
        queixas,
        horarios,
        submitLabel,
        accent,
        accentHover,
        onAccent,
        text,
        textSoft,
        fieldFill,
        fieldBorder,
        radius,
        style,
    } = props

    const [nome, setNome] = useState("")
    const [queixa, setQueixa] = useState(queixas[0] ?? "")
    const [horario, setHorario] = useState(horarios[0] ?? "")
    const [erro, setErro] = useState(false)
    const [hover, setHover] = useState(false)

    const labelStyle: React.CSSProperties = {
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 1.4,
        color: textSoft,
        marginBottom: 6,
        display: "block",
    }

    const fieldStyle: React.CSSProperties = {
        width: "100%",
        boxSizing: "border-box",
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 1.5,
        color: text,
        background: fieldFill,
        border: `1px solid ${fieldBorder}`,
        borderRadius: radius,
        padding: "12px 14px",
        outline: "none",
        appearance: "none",
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        const nomeLimpo = nome.trim()
        if (!nomeLimpo) {
            setErro(true)
            return
        }
        setErro(false)

        const mensagem = [
            `Oi! Sou ${nomeLimpo} e gostaria de agendar uma consulta.`,
            `Principal queixa: ${queixa}`,
            `Melhor horário: ${horario}`,
        ].join("\n")

        if (webhookUrl) {
            // não bloqueia a ida para o WhatsApp se o webhook falhar
            void fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nomeLimpo,
                    queixa,
                    horario,
                    origem: "landing-page",
                    enviadoEm: new Date().toISOString(),
                }),
            }).catch(() => undefined)
        }

        const numero = phone.replace(/\D/g, "")
        window.open(
            `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
            "_blank",
            "noopener,noreferrer"
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                ...style,
            }}
        >
            <div>
                <label htmlFor="agendar-nome" style={labelStyle}>
                    Como você se chama?
                </label>
                <input
                    id="agendar-nome"
                    name="nome"
                    type="text"
                    value={nome}
                    autoComplete="name"
                    placeholder="Seu nome"
                    aria-invalid={erro}
                    onChange={(e) => {
                        setNome(e.target.value)
                        if (erro) setErro(false)
                    }}
                    style={{
                        ...fieldStyle,
                        borderColor: erro ? accent : fieldBorder,
                    }}
                />
                {erro ? (
                    <span
                        role="alert"
                        style={{
                            fontFamily: BODY,
                            fontSize: 13,
                            color: accent,
                            marginTop: 6,
                            display: "block",
                        }}
                    >
                        Só falta o seu nome para a gente continuar.
                    </span>
                ) : null}
            </div>

            <div>
                <label htmlFor="agendar-queixa" style={labelStyle}>
                    O que está te incomodando?
                </label>
                <select
                    id="agendar-queixa"
                    name="queixa"
                    value={queixa}
                    onChange={(e) => setQueixa(e.target.value)}
                    style={fieldStyle}
                >
                    {queixas.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="agendar-horario" style={labelStyle}>
                    Melhor horário para você
                </label>
                <select
                    id="agendar-horario"
                    name="horario"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    style={fieldStyle}
                >
                    {horarios.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    width: "100%",
                    fontFamily: BODY,
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: "0.16px",
                    color: onAccent,
                    background: hover ? accentHover : accent,
                    border: "none",
                    borderRadius: 999,
                    padding: "16.8px 32px",
                    cursor: "pointer",
                    transform: hover ? "translateY(-2px)" : "none",
                    transition:
                        "background .25s cubic-bezier(.22,.61,.36,1), transform .25s cubic-bezier(.22,.61,.36,1)",
                }}
            >
                {submitLabel}
            </button>
        </form>
    )
}

AgendarForm.defaultProps = {
    phone: "5551995337479",
    webhookUrl: "",
    queixas: [
        "Nariz entupido",
        "Espirros e coriza que não passam",
        "Dor no rosto / sinusite",
        "Ronco",
        "Acordo cansado / apneia do sono",
        "Perda de olfato",
        "Outro assunto",
    ],
    horarios: ["Manhã", "Tarde", "Tanto faz"],
    submitLabel: "Continuar no WhatsApp",
    accent: "#BC6B54",
    accentHover: "#A65A45",
    onAccent: "#F5EDE4",
    text: "#2C3D5B",
    textSoft: "#46536B",
    fieldFill: "#F5EDE4",
    fieldBorder: "rgba(44, 61, 91, 0.18)",
    radius: 12,
} satisfies AgendarFormProps

addPropertyControls(AgendarForm, {
    phone: {
        type: ControlType.String,
        title: "WhatsApp",
        description: "Só números, com DDI e DDD.",
    },
    webhookUrl: {
        type: ControlType.String,
        title: "Webhook",
        description:
            "Opcional. Recebe o lead por POST antes de abrir o WhatsApp.",
    },
    queixas: {
        type: ControlType.Array,
        title: "Queixas",
        control: { type: ControlType.String },
    },
    horarios: {
        type: ControlType.Array,
        title: "Horários",
        control: { type: ControlType.String },
    },
    submitLabel: { type: ControlType.String, title: "Botão" },
    accent: { type: ControlType.Color, title: "Acento" },
    accentHover: { type: ControlType.Color, title: "Acento hover" },
    onAccent: { type: ControlType.Color, title: "Texto do botão" },
    text: { type: ControlType.Color, title: "Texto" },
    textSoft: { type: ControlType.Color, title: "Texto suave" },
    fieldFill: { type: ControlType.Color, title: "Fundo do campo" },
    fieldBorder: { type: ControlType.Color, title: "Borda do campo" },
    radius: {
        type: ControlType.Number,
        title: "Raio",
        min: 0,
        max: 32,
        unit: "px",
    },
})
