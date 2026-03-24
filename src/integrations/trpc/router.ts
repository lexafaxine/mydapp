import { createTRPCRouter, publicProcedure } from './init'

export const trpcRouter = createTRPCRouter({
	health: publicProcedure.query(() => ({ status: 'ok' })),
})
export type TRPCRouter = typeof trpcRouter
