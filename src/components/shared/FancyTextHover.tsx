type FancyHoverTextProps = {
  text: string
}

export default function FancyHoverText({ text }: FancyHoverTextProps) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: '1.2em', lineHeight: '1.2em' }}>
      {/* Invisible spacer to maintain width */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      
      {/* original text block (span-mother) */}
      <span className="flex absolute top-0 left-0 transition-transform group-hover:translate-y-[1.2em]">
        {text.split("").map((char: string, i: number) => (
          <span
            key={`top-${i}`}
            className="inline-block transition-transform"
            style={{ transitionDuration: `${200 + i * 100}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* hover text block (span-mother2) */}
      <span className="flex absolute top-0 left-0 -translate-y-[1.2em] transition-transform group-hover:translate-y-0">
        {text.split("").map((char: string, i: number) => (
          <span
            key={`bottom-${i}`}
            className="inline-block transition-transform text-[#17c06e]"
            style={{ transitionDuration: `${200 + i * 100}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  )
}