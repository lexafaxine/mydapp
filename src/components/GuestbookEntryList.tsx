import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '#/integrations/trpc/react'
import GuestbookEntryCard from './GuestbookEntryCard'

export default function GuestbookEntryList({
  searchQuery,
}: {
  searchQuery: string
}) {
  const trpc = useTRPC()

  // 有搜索词时走 search，否则走 getEntries
  const entriesQuery = useQuery(
    searchQuery.length > 0
      ? trpc.guestbook.search.queryOptions({ query: searchQuery })
      : trpc.guestbook.getEntries.queryOptions(),
  )

  if (entriesQuery.isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading entries...
      </div>
    )
  }

  if (entriesQuery.isError) {
    return (
      <div className="py-12 text-center text-red-500">
        Failed to load entries: {entriesQuery.error.message}
      </div>
    )
  }

  const entries = entriesQuery.data ?? []

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {searchQuery
          ? 'No entries match your search.'
          : 'No messages yet. Be the first to sign the guestbook!'}
      </div>
    )
  }

  // 最新的留言在最上面
  return (
    <div className="flex flex-col gap-4">
      {[...entries].reverse().map((entry, i) => (
        <GuestbookEntryCard
          key={`${entry.author}-${entry.timestamp}-${i}`}
          author={entry.author}
          message={entry.message}
          timestamp={entry.timestamp}
        />
      ))}
    </div>
  )
}
