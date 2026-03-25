import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESS } from './contract'

/** 从链上读取所有留言（客户端直接调用合约） */
export function useGuestbookEntries() {
  return useReadContract({
    address: GUESTBOOK_ADDRESS,
    abi: GUESTBOOK_ABI,
    functionName: 'getEntries',
  })
}

/** 从链上读取留言总数 */
export function useGuestbookEntryCount() {
  return useReadContract({
    address: GUESTBOOK_ADDRESS,
    abi: GUESTBOOK_ABI,
    functionName: 'getEntryCount',
  })
}

/** 发送一条留言到链上 */
export function usePostMessage() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash })

  function postMessage(message: string) {
    writeContract({
      address: GUESTBOOK_ADDRESS,
      abi: GUESTBOOK_ABI,
      functionName: 'postMessage',
      args: [message],
    })
  }

  return { postMessage, hash, isPending, isConfirming, isSuccess, error }
}
