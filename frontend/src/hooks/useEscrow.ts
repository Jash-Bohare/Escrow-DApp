import { useState, useCallback } from 'react';
import { parseEther, formatEther } from 'ethers';
import { WalletState } from './useWallet';

export type EscrowStatus = 'idle' | 'awaiting_deposit' | 'funded' | 'delivered' | 'released' | 'disputed' | 'resolved';

export interface EscrowState {
  status: EscrowStatus;
  amount: string;
  buyer: string | null;
  seller: string | null;
  arbiter: string | null;
  createdAt: Date | null;
}

// Mock contract addresses for demo
const MOCK_SELLER = '0x1234567890123456789012345678901234567890';
const MOCK_ARBITER = '0x0987654321098765432109876543210987654321';

export function useEscrow(wallet: WalletState) {
  const [escrow, setEscrow] = useState<EscrowState>({
    status: 'idle',
    amount: '0',
    buyer: null,
    seller: null,
    arbiter: null,
    createdAt: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Determine user role based on connected address
  const getUserRole = useCallback((): 'buyer' | 'seller' | 'arbiter' | null => {
    if (!wallet.address) return null;
    const addr = wallet.address.toLowerCase();
    if (escrow.buyer?.toLowerCase() === addr) return 'buyer';
    if (escrow.seller?.toLowerCase() === addr) return 'seller';
    if (escrow.arbiter?.toLowerCase() === addr) return 'arbiter';
    // Default to buyer for demo purposes if no role assigned
    if (!escrow.buyer) return 'buyer';
    return null;
  }, [wallet.address, escrow]);

  const depositFunds = useCallback(async (amountEth: string) => {
    if (!wallet.signer || !wallet.address) return;
    
    setIsLoading(true);
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      const mockTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      setTxHash(mockTxHash);
      setEscrow({
        status: 'funded',
        amount: amountEth,
        buyer: wallet.address,
        seller: MOCK_SELLER,
        arbiter: MOCK_ARBITER,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Deposit failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.signer, wallet.address]);

  const confirmDelivery = useCallback(async () => {
    if (!wallet.signer) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEscrow(prev => ({ ...prev, status: 'delivered' }));
    } catch (err) {
      console.error('Confirm delivery failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.signer]);

  const releaseFunds = useCallback(async () => {
    if (!wallet.signer) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEscrow(prev => ({ ...prev, status: 'released' }));
    } catch (err) {
      console.error('Release funds failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.signer]);

  const raiseDispute = useCallback(async () => {
    if (!wallet.signer) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEscrow(prev => ({ ...prev, status: 'disputed' }));
    } catch (err) {
      console.error('Raise dispute failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.signer]);

  const resolveDispute = useCallback(async (toParty: 'buyer' | 'seller') => {
    if (!wallet.signer) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEscrow(prev => ({ ...prev, status: 'resolved' }));
    } catch (err) {
      console.error('Resolve dispute failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.signer]);

  const resetEscrow = useCallback(() => {
    setEscrow({
      status: 'idle',
      amount: '0',
      buyer: null,
      seller: null,
      arbiter: null,
      createdAt: null,
    });
    setTxHash(null);
  }, []);

  return {
    escrow,
    isLoading,
    txHash,
    getUserRole,
    depositFunds,
    confirmDelivery,
    releaseFunds,
    raiseDispute,
    resolveDispute,
    resetEscrow,
  };
}
