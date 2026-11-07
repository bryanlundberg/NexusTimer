import type { MessageNode } from '@/entities/chat/lib/message-content'
import { SolveCard } from '@/entities/chat/ui/SolveCard'

export function MessageText({ nodes }: { nodes: MessageNode[] }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return node.value
      case 'link':
        return (
          <a
            key={index}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="underline underline-offset-2 hover:opacity-80"
          >
            {node.value}
          </a>
        )
      case 'solve':
        return <SolveCard key={index} data={node.data} />
      case 'code':
        return (
          <code key={index} className="bg-foreground/10 px-1 font-mono text-[0.9em]">
            {node.value}
          </code>
        )
      case 'bold':
        return (
          <strong key={index} className="font-bold">
            <MessageText nodes={node.children} />
          </strong>
        )
      case 'italic':
        return (
          <em key={index}>
            <MessageText nodes={node.children} />
          </em>
        )
      case 'strike':
        return (
          <s key={index}>
            <MessageText nodes={node.children} />
          </s>
        )
    }
  })
}
