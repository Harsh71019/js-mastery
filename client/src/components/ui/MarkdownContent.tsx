import React from 'react'

interface MarkdownContentProps {
  readonly content: string
}

/**
 * A lightweight component to render simple Markdown patterns found in problems:
 * - Triple backticks (```js ... ```) for code blocks
 * - Single backticks (`code`) for inline code
 * - Newlines for line breaks
 */
export const MarkdownContent = ({ content }: MarkdownContentProps): React.JSX.Element | null => {
  if (!content) return null

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```|`[^`]*`)/g)

  return (
    <div className="flex flex-col gap-2 overflow-hidden w-full">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Block Code
          const code = part.replace(/^```(?:javascript|js|ts)?\n?|\n?```$/g, '').trim()
          return (
            <div key={index} className="relative rounded border border-border-default bg-bg-secondary overflow-hidden my-2 w-full max-w-full">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-tertiary/30">
                <span className="text-text-tertiary text-[10px] uppercase tracking-wide font-medium">JavaScript</span>
                <span className="text-[10px] font-medium text-accent-amber bg-accent-amber/10 px-1.5 py-0.5 rounded">JS</span>
              </div>
              <div className="overflow-x-auto w-full scrollbar-thin">
                <pre className="px-4 py-4 text-[13px] font-jetbrains text-text-primary leading-relaxed whitespace-pre min-w-max">
                  {code}
                </pre>
              </div>
            </div>
          )
        } else if (part.startsWith('`')) {
          // Inline Code
          const inlineCode = part.replace(/^`|`$/g, '')
          return (
            <code key={index} className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent-amber font-jetbrains text-[13px] border border-border-default/50">
              {inlineCode}
            </code>
          )
        } else {
          // Normal Text (handle newlines)
          const lines = part.split('\n')
          return (
            <div key={index} className="flex flex-col">
              {lines.map((line, lineIdx) => (
                <p key={lineIdx} className={`${line.trim() === '' ? 'h-3' : 'min-h-[1.5rem]'} text-text-secondary text-sm leading-7`}>
                  {line}
                </p>
              ))}
            </div>
          )
        }
      })}
    </div>
  )
}
