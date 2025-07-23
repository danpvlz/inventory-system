import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FileMinus, HandCoins, Package2, PackagePlus } from "lucide-react";

const navItems = [
  { name: "Products", href: "/products", icon: <Package2 />},
  { name: "Inputs", href: "/inputs", icon: <PackagePlus />},
  { name: "Outputs", href: "/outputs", icon: <FileMinus />},
  { name: "Sales", href: "/sales", icon: <HandCoins />},
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-500"><rect width="24" height="24" rx="6" fill="#3B82F6" /><path d="M7 17V7h10v10H7z" fill="#fff" /></svg>
                <span className="text-2xl font-extrabold tracking-tight text-blue-700">Inventory</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MODULES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
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