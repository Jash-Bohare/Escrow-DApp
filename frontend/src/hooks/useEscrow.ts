import { useState, useCallback, useEffect } from "react";
import { Contract, parseEther, formatEther } from "ethers";
import EscrowABI from "../abi/Escrow.json";
import { WalletState } from "./useWallet";
import { CONTRACT_ADDRESS } from "../constants";

export type EscrowStatus =
  | "created"
  | "funded"
  | "delivered"
  | "disputed"
  | "completed";

export interface EscrowState {
  status: EscrowStatus;
  amount: string;
  buyer: string | null;
  seller: string | null;
  arbiter: string | null;
}

export function useEscrow(wallet: WalletState) {
  const [escrow, setEscrow] = useState<EscrowState>({
    status: "created",
    amount: "0",
    buyer: null,
    seller: null,
    arbiter: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const getContract = useCallback(() => {
    if (!wallet.signer) return null;

    return new Contract(CONTRACT_ADDRESS, EscrowABI, wallet.signer);
  }, [wallet.signer]);

  // -------- READ ON-CHAIN STATE --------

  const refreshEscrow = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    try {
      const statusNum = await contract.getStatus();
      const amount = await contract.amount();
      const buyer = await contract.buyer();
      const seller = await contract.seller();
      const arbiter = await contract.arbiter();

      const statusMap = [
        "created",
        "funded",
        "delivered",
        "disputed",
        "completed",
      ] as EscrowStatus[];

      setEscrow({
        status: statusMap[Number(statusNum)],
        amount: formatEther(amount),
        buyer,
        seller,
        arbiter,
      });
    } catch (err) {
      console.error("Refresh escrow failed:", err);
    }
  }, [getContract]);

  useEffect(() => {
    refreshEscrow();
  }, [refreshEscrow]);

  // -------- WRITE FUNCTIONS --------

  const depositFunds = useCallback(
    async (amountEth: string) => {
      const contract = getContract();
      if (!contract) return;

      setIsLoading(true);
      try {
        const tx = await contract.deposit({
          value: parseEther(amountEth),
        });
        setTxHash(tx.hash);
        await tx.wait();
        await refreshEscrow();
      } finally {
        setIsLoading(false);
      }
    },
    [getContract, refreshEscrow]
  );

  const confirmDelivery = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    setIsLoading(true);
    try {
      const tx = await contract.confirmDelivery();
      setTxHash(tx.hash);
      await tx.wait();
      await refreshEscrow();
    } finally {
      setIsLoading(false);
    }
  }, [getContract, refreshEscrow]);

  const releaseFunds = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    setIsLoading(true);
    try {
      const tx = await contract.releaseFunds();
      setTxHash(tx.hash);
      await tx.wait();
      await refreshEscrow();
    } finally {
      setIsLoading(false);
    }
  }, [getContract, refreshEscrow]);

  const raiseDispute = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    setIsLoading(true);
    try {
      const tx = await contract.raiseDispute();
      setTxHash(tx.hash);
      await tx.wait();
      await refreshEscrow();
    } finally {
      setIsLoading(false);
    }
  }, [getContract, refreshEscrow]);

  const resolveDispute = useCallback(
    async (toSeller: boolean) => {
      const contract = getContract();
      if (!contract) return;

      setIsLoading(true);
      try {
        const tx = await contract.resolveDispute(toSeller);
        setTxHash(tx.hash);
        await tx.wait();
        await refreshEscrow();
      } finally {
        setIsLoading(false);
      }
    },
    [getContract, refreshEscrow]
  );

  // -------- ROLE DETECTION --------

  const getUserRole = useCallback(() => {
    if (!wallet.address) return null;
    const addr = wallet.address.toLowerCase();

    if (escrow.buyer?.toLowerCase() === addr) return "buyer";
    if (escrow.seller?.toLowerCase() === addr) return "seller";
    if (escrow.arbiter?.toLowerCase() === addr) return "arbiter";

    return null;
  }, [wallet.address, escrow]);

  return {
    escrow,
    isLoading,
    txHash,
    getUserRole,
    refreshEscrow,
    depositFunds,
    confirmDelivery,
    releaseFunds,
    raiseDispute,
    resolveDispute,
  };
}
