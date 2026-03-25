import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from './init'
import { publicClient } from '../web3/viem-client'
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESS } from '../web3/contract'

const guestbookRouter = createTRPCRouter({
  /** 获取所有留言 */
  getEntries: publicProcedure.query(async () => {
    const entries = await publicClient.readContract({
      address: GUESTBOOK_ADDRESS,
      abi: GUESTBOOK_ABI,
      functionName: 'getEntries',
    })

    return entries.map((entry) => ({
      author: entry.author,
      message: entry.message,
      timestamp: Number(entry.timestamp), // bigint → number，方便 JSON 序列化
    }))
  }),

  /** 获取留言总数 */
  getEntryCount: publicProcedure.query(async () => {
    const count = await publicClient.readContract({
      address: GUESTBOOK_ADDRESS,
      abi: GUESTBOOK_ABI,
      functionName: 'getEntryCount',
    })
    return Number(count)
  }),

  /** 按地址或内容搜索留言 */
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const entries = await publicClient.readContract({
        address: GUESTBOOK_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'getEntries',
      })

      const q = input.query.toLowerCase()
      return entries
        .filter(
          (e) =>
            e.author.toLowerCase().includes(q) ||
            e.message.toLowerCase().includes(q),
        )
        .map((entry) => ({
          author: entry.author,
          message: entry.message,
          timestamp: Number(entry.timestamp),
        }))
    }),
})

export const trpcRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ status: 'ok' })),
  guestbook: guestbookRouter,
})

export type TRPCRouter = typeof trpcRouter
