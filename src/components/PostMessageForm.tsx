import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '#/integrations/trpc/react'
import { usePostMessage } from '#/integrations/web3/hooks'
import { Send } from 'lucide-react'

const MAX_LENGTH = 280

export default function PostMessageForm() {
  const [message, setMessage] = useState('')
  const { isConnected } = useAccount()
  const { postMessage, isPending, isConfirming, isSuccess, error } =
    usePostMessage()
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  // 交易确认后：清空输入 + 刷新留言列表
  useEffect(() => {
    if (isSuccess) {
      setMessage('')
      queryClient.invalidateQueries({
        queryKey: trpc.guestbook.getEntries.queryKey(),
      })
    }
  }, [isSuccess, queryClient, trpc])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim().length === 0) return
    postMessage(message.trim())
  }

  const isDisabled = !isConnected || isPending || isConfirming

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={3}
        disabled={isDisabled}
        placeholder={
          isConnected
            ? 'Write your message...'
            : 'Connect your wallet to post a message'
        }
        className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-[var(--sea-ink)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {message.length}/{MAX_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          {isPending && (
            <span className="text-sm text-muted-foreground">
              Confirm in wallet...
            </span>
          )}
          {isConfirming && (
            <span className="text-sm text-muted-foreground">
              Confirming on chain...
            </span>
          )}
          {isSuccess && (
            <span className="text-sm text-green-600">Posted!</span>
          )}
          {error && (
            <span className="text-sm text-red-500">
              {error.message.includes('User rejected')
                ? 'Transaction rejected'
                : 'Failed to post'}
            </span>
          )}
          <button
            type="submit"
            disabled={isDisabled || message.trim().length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Post
          </button>
        </div>
      </div>
    </form>
  )
}
