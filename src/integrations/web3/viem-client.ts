import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

/**
 * 服务端 viem 客户端——不需要钱包，只用于读取链上数据。
 * tRPC 的 guestbook 路由用它来查询合约。
 */
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})
