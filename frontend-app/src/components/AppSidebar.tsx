import { Wallet, Receipt, Split, Banknote, LayoutDashboard, QrCode } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "QR Code", url: "/qrcode", icon: QrCode },
  { title: "Transactions", url: "/transactions", icon: Receipt },
  { title: "Earn", url: "/split", icon: Split },
  { title: "Withdrawals", url: "/withdrawals", icon: Banknote },
];

export function AppSidebar() {
  const { open, openMobile, isMobile: sidebarIsMobile } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  // Em mobile usa openMobile, em desktop usa open
  const isMenuOpen = isMobile ? openMobile : open;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="h-14 border-b border-border flex items-center px-4">
          <div className="flex items-center gap-3">
            {/* Logo quando menu aberto (tanto mobile quanto desktop) */}
            {isMenuOpen && (
              <img 
                src="/nativefi.svg" 
                alt="NativeFi" 
                className="h-8 w-auto"
              />
            )}
            {/* Botão quando menu fechado (apenas desktop, em mobile fica no header) */}
            {!isMobile && !open && <SidebarTrigger />}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      end 
                      className="hover:bg-muted/50" 
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
