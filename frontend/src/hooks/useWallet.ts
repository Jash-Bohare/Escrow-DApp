import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  signer: any;
  provider: BrowserProvider | null;
  chainId: number | null;
  balance: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    signer: null,
    provider: null,
    chainId: null,
    balance: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = useCallback(
    async (provider: BrowserProvider, address: string) => {
      try {
        const balance = await provider.getBalance(address);
        setWallet(prev => ({
          ...prev,
          balance: Number(formatEther(balance)).toFixed(4),
        }));
      } catch (err) {
        console.error("Balance fetch failed:", err);
      }
    },
    []
  );

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setWallet({
        isConnected: true,
        address,
        signer,
        provider,
        chainId: Number(network.chainId),
        balance: null,
      });

      await updateBalance(provider, address);
    } catch (err: any) {
      setError(err.message || "Wallet connection failed");
    } finally {
      setIsConnecting(false);
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      signer: null,
      provider: null,
      chainId: null,
      balance: null,
    });
    setError(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => connect();
    const handleChainChanged = () => connect();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect]);

  return {
    ...wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    updateBalance,
  };
}
