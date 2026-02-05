import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { useWallet } from "./hooks/useWallet";
import { useEscrow } from "./hooks/useEscrow";

const queryClient = new QueryClient();

const App = () => {
  // 🔐 Wallet hook
  const wallet = useWallet();

  // 📄 Escrow hook (depends on wallet)
  const escrow = useEscrow(wallet);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Index wallet={wallet} escrow={escrow} />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
