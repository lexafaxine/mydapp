import { Card, CardContent, CardHeader } from '#/components/ui/card'

interface GuestbookEntryProps {
  author: string
  message: string
  timestamp: number
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function GuestbookEntryCard({
  author,
  message,
  timestamp,
}: GuestbookEntryProps) {
  const date = new Date(timestamp * 1000) // Solidity timestamp 是秒，JS 是毫秒

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium text-[var(--sea-ink)]">
          {truncateAddress(author)}
        </span>
        <time className="text-xs text-muted-foreground">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </time>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--sea-ink)] leading-relaxed">{message}</p>
      </CardContent>
    </Card>
  )
}
