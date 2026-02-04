import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  signer: JsonRpcSigner | null;
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

  const updateBalance = useCallback(async (provider: BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = (Number(balance) / 1e18).toFixed(4);
      setWallet(prev => ({ ...prev, balance: balanceInEth }));
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
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
      setError(err.message || 'Failed to connect wallet');
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

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (wallet.isConnected) {
        connect();
      }
    };

    const handleChainChanged = () => {
      if (wallet.isConnected) {
        connect();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [wallet.isConnected, connect, disconnect]);

  return {
    ...wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    updateBalance,
  };
}
