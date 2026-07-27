type Props = {
  content: string;
};

export function MarkdownLite({ content }: Props) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="pt-3 text-xl font-semibold tracking-tight text-foreground"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        const lines = trimmed.split("\n");
        if (lines.every((line) => line.trimStart().startsWith("- "))) {
          return (
            <ul
              key={index}
              className="list-disc space-y-2 pl-6 text-muted-foreground"
            >
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.trimStart().replace(/^-\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={index}
            className="whitespace-pre-line leading-8 text-muted-foreground"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
