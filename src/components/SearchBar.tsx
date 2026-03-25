import { Search } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by address or message..."
        className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--sea-ink)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}
