/**
 * Guestbook 合约的 ABI 和部署地址。
 *
 * ABI 使用 `as const` 声明——这让 viem/wagmi 能在编译期推断出
 * 每个函数的参数和返回值类型，实现完全的类型安全。
 */

export const GUESTBOOK_ADDRESS =
  '0x471C1BEfC9D802f093E16464f7B9ca63B4187c08' as const

export const GUESTBOOK_ABI = [
  {
    type: 'event',
    name: 'NewEntry',
    inputs: [
      { name: 'author', type: 'address', indexed: true },
      { name: 'message', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'postMessage',
    inputs: [{ name: '_message', type: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getEntries',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'author', type: 'address' },
          { name: 'message', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEntryCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const
