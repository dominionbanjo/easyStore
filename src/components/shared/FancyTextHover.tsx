type FancyHoverTextProps = {
  text: string
}

export default function FancyHoverText({ text }: FancyHoverTextProps) {
  return (
    <span className="relative inline-flex overflow-hidden h-[1em] group">
      {/* original text block */}
      <span className="flex absolute  top-0 left-0 group-hover:-translate-y-[1.2em]">
        {text.split("").map((char: string, i: number) => (
          <span
            key={i}
            className="inline-block transition-all text-black"
            style={{ transitionDuration: `${200 + i * 80}ms` }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* hover text block */}
      <span className="flex absolute top-[1.2em] left-0 group-hover:top-0">
        {text.split("").map((char: string, i: number) => (
          <span
            key={i}
            className="inline-block transition-all text-black"
            style={{ transitionDuration: `${200 + i * 80}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}
