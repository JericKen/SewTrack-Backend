import {
  Home,
  Package,
  Tags,
  Truck,
  Users,
  ShoppingCart,
  PackagePlus,
  Wrench,
  Wallet,
  BarChart3,
  UserCog,
  Scissors,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: Home }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", url: "/products", icon: Package },
      { title: "Categories", url: "/categories", icon: Tags },
      { title: "Suppliers", url: "/suppliers", icon: Truck },
      { title: "Customers", url: "/customers", icon: Users },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Sales", url: "/sales", icon: ShoppingCart },
      { title: "Purchases", url: "/purchases", icon: PackagePlus },
      { title: "Repairs", url: "/repairs", icon: Wrench },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Expenses", url: "/expenses", icon: Wallet },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Administration",
    items: [{ title: "Users", url: "/users", icon: UserCog }],
  },
];

function isNavActive(pathname, url) {
  if (url === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border/80 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none hover:bg-transparent active:bg-transparent"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <Scissors className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold tracking-tight">
                  SewTrack
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  Inventory & Sales
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1 py-2">
        {navGroups.map((group, index) => (
          <SidebarGroup key={group.label} className="py-0">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 px-1">
                {group.items.map((item) => {
                  const active = isNavActive(pathname, item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<NavLink to={item.url} />}
                        isActive={active}
                        tooltip={item.title}
                        className="relative transition-colors data-active:bg-sidebar-accent/80 data-active:shadow-sm"
                      >
                        <item.icon className={active ? "text-sidebar-primary" : undefined} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>

            {index < navGroups.length - 1 ? (
              <SidebarSeparator className="my-2 opacity-60" />
            ) : null}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
