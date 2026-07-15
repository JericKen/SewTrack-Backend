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
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Purchases", url: "/purchases", icon: PackagePlus },
  { title: "Repairs", url: "/repairs", icon: Wrench },
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Users", url: "/users", icon: UserCog },
];

export default function AppSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar>

      <SidebarHeader className="text-xl font-bold p-4">
        SewTrack
      </SidebarHeader>

      <SidebarContent>

        <SidebarGroup>

          <SidebarGroupContent>

            <SidebarMenu>

              {menuItems.map((item) => (

                <SidebarMenuItem key={item.title}>

                  <NavLink to={item.url}>
                    <SidebarMenuButton>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </NavLink>

                </SidebarMenuItem>

              ))}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton onClick={logout}>

              <LogOut className="h-4 w-4" />

              <span>Logout</span>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarFooter>

    </Sidebar>
  );
}