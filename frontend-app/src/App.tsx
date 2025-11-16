import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QRCode from "./pages/QRCode";
import Transactions from "./pages/Transactions";
import Split from "./pages/Split";
import Withdrawals from "./pages/Withdrawals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

const AppLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { open, openMobile, isMobile: sidebarIsMobile } = useSidebar();
  const isMobile = useIsMobile();
  
  // Em mobile usa openMobile, em desktop usa open
  const isMenuOpen = isMobile ? openMobile : open;
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-subtle">
      <AppSidebar />
      <main className="flex-1">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3">
          {/* Botão de toggle: sempre em mobile, ou em desktop quando menu aberto */}
          {(isMobile || isMenuOpen) && <SidebarTrigger />}
          {/* Logo: sempre quando menu fechado (mobile e desktop) */}
          {!isMenuOpen && (
            <img 
              src="/nativefi.svg" 
              alt="NativeFi" 
              className="h-8 w-auto"
            />
          )}
        </header>
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/qrcode" element={<AppLayout><QRCode /></AppLayout>} />
          <Route path="/transactions" element={<AppLayout><Transactions /></AppLayout>} />
          <Route path="/split" element={<AppLayout><Split /></AppLayout>} />
          <Route path="/withdrawals" element={<AppLayout><Withdrawals /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
