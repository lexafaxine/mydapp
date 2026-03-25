import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()], // MetaMask 等浏览器钱包
  transports: {
    [sepolia.id]: http(), // 默认公共 RPC，学习阶段够用
  },
  ssr: true, // TanStack Start 使用 SSR，必须开启
})
