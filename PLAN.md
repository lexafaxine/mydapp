# 链上留言板 (On-Chain Guestbook) 实施计划

## Context

通过构建一个链上留言板 dApp 来学习 tRPC、TanStack Query、wagmi/viem 和 Solidity。用户连接 MetaMask 钱包，在 Sepolia 测试网上发布和查看留言。tRPC 后端负责缓存和搜索链上数据，TanStack Query 管理前端缓存。

## 新增依赖

```bash
pnpm add wagmi viem
```

（`@tanstack/react-query` 和 `zod` 已安装）

---

## Step 1: 编写并部署智能合约

在 [Remix IDE](https://remix.ethereum.org) 中创建 `Guestbook.sol`，编译后通过 MetaMask 部署到 Sepolia。

合约核心：一个 `Entry` struct 数组 + `postMessage()` 写入 + `getEntries()` 读取 + `NewEntry` 事件。

部署后复制 **合约地址** 和 **ABI**。

参考文件：`contracts/Guestbook.sol`（仅存档，不参与构建）

## Step 2: Web3 集成层

新建 `src/integrations/web3/` 目录：

| 文件 | 作用 |
|------|------|
| `contract.ts` | 导出 ABI（`as const` 类型安全）+ 合约地址 |
| `config.ts` | wagmi 配置：Sepolia 链、injected connector、`ssr: true` |
| `provider.tsx` | `WagmiProvider` 包装组件 |
| `viem-client.ts` | 服务端 viem `PublicClient`（给 tRPC 用） |
| `hooks.ts` | `useGuestbookEntries()`、`usePostMessage()` 等自定义 hooks |

### 关键：SSR 安全

- wagmi config 设置 `ssr: true`，SSR 时返回未连接默认值
- `WagmiProvider` 嵌套在 `TanStackQueryProvider` 内部（共享 QueryClient）

修改 `src/routes/__root.tsx`：

```
<TanStackQueryProvider>
  <Web3Provider>      ← 新增
    <Header />
    {children}
    <Footer />
  </Web3Provider>
</TanStackQueryProvider>
```

## Step 3: ConnectWallet 组件

新建 `src/components/ConnectWallet.tsx`：
- 使用 `useAccount`、`useConnect`、`useDisconnect`、`useSwitchChain`
- 未连接 → 显示 "Connect Wallet" 按钮
- 已连接 → 显示截断地址 + Disconnect 按钮
- 非 Sepolia 网络 → 提示切换

修改 `src/components/Header.tsx`：在 ThemeToggle 旁添加 ConnectWallet。

## Step 4: tRPC Guestbook 路由

修改 `src/integrations/trpc/router.ts`，新增 `guestbook` 子路由：

| Procedure | 类型 | 输入 | 说明 |
|-----------|------|------|------|
| `guestbook.getEntries` | query | 无 | 通过服务端 viem 读取合约，返回所有留言 |
| `guestbook.getEntryCount` | query | 无 | 返回留言总数 |
| `guestbook.search` | query | `{ query: string }` (zod) | 按地址或内容搜索 |

BigInt 处理：tRPC procedure 中将 `uint256` 转为 `number` 再返回。

## Step 5: 留言板前端

修改 `src/routes/index.tsx`，替换占位内容为留言板 UI。

新建组件：

| 组件 | 说明 |
|------|------|
| `GuestbookEntryCard.tsx` | 单条留言卡片，复用已有 `Card` 组件 |
| `GuestbookEntryList.tsx` | 留言列表，通过 tRPC `guestbook.getEntries` 获取数据 |
| `PostMessageForm.tsx` | 发留言表单，使用 `usePostMessage` hook 调用合约 |
| `SearchBar.tsx` | 搜索栏，调用 tRPC `guestbook.search` |

### 缓存失效策略

发留言成功后（`useWaitForTransactionReceipt` 返回 `isSuccess`），调用 `queryClient.invalidateQueries` 刷新 `guestbook.getEntries`。

## Step 6: 润色

- Loading 状态和 skeleton
- 错误处理（交易拒绝、网络错误）
- 空状态提示
- 深色/浅色主题适配

---

## 文件变更总览

**新文件：**
- `contracts/Guestbook.sol`
- `src/integrations/web3/contract.ts`
- `src/integrations/web3/config.ts`
- `src/integrations/web3/provider.tsx`
- `src/integrations/web3/viem-client.ts`
- `src/integrations/web3/hooks.ts`
- `src/components/ConnectWallet.tsx`
- `src/components/PostMessageForm.tsx`
- `src/components/GuestbookEntryList.tsx`
- `src/components/GuestbookEntryCard.tsx`
- `src/components/SearchBar.tsx`

**修改文件：**
- `src/routes/__root.tsx` — 添加 Web3Provider
- `src/components/Header.tsx` — 添加 ConnectWallet
- `src/routes/index.tsx` — 替换为留言板 UI
- `src/integrations/trpc/router.ts` — 添加 guestbook 子路由

## 验证方式

1. `pnpm dev` 启动开发服务器
2. 点击 Connect Wallet → MetaMask 弹窗 → 连接成功显示地址
3. 输入留言 → Post Message → MetaMask 签名 → 等待确认 → 列表自动刷新
4. 搜索功能：按地址或内容过滤
5. 断开钱包 → 表单禁用，留言列表仍可查看
6. 深色/浅色主题切换正常

## 注意事项

- wagmi `ssr: true` 确保 SSR 安全，hydration 时 ConnectWallet 可能需要 `suppressHydrationWarning`
- Solidity `uint256` 返回 `bigint`，tRPC 层需转 `number`
- 默认 Sepolia 公共 RPC 有速率限制，学习阶段够用
- 项目使用 `#/*` 路径别名映射到 `./src/*`
