"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  GitCompare,
  CheckSquare,
  ShoppingCart,
  Receipt,
  Bell,
  BarChart3,
  Crown,
  Shield,
  Bot,
  Settings,
  Globe,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vendors",
    href: "/dashboard/vendors",
    icon: Users,
  },
  {
    title: "RFQ Management",
    href: "/dashboard/rfq",
    icon: FileText,
  },
  {
    title: "Quotations",
    href: "/dashboard/quotations",
    icon: ClipboardList,
  },
  {
    title: "AI Comparison",
    href: "/dashboard/compare",
    icon: GitCompare,
    badge: "AI",
  },
  {
    title: "Approvals",
    href: "/dashboard/approvals",
    icon: CheckSquare,
    badgeCount: 2,
  },
  {
    title: "Purchase Orders",
    href: "/dashboard/purchase-orders",
    icon: ShoppingCart,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: Receipt,
  },
];

const aiNavItems = [
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Bot,
    badge: "GPT",
  },
  {
    title: "Fraud Detection",
    href: "/dashboard/fraud-alerts",
    icon: Shield,
    badgeCount: 2,
  },
];

const analyticsNavItems = [
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Executive Center",
    href: "/dashboard/executive",
    icon: Crown,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badgeCount: 4,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

function SidebarContent({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const NavItem = ({
    item,
  }: {
    item: {
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
      badgeCount?: number;
    };
  }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname?.startsWith(item.href));
    const Icon = item.icon;

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
        )}
        <Icon
          className={cn(
            "shrink-0 transition-colors",
            collapsed ? "w-5 h-5" : "w-4 h-4",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {!collapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 gradient-primary text-white border-0"
              >
                {item.badge}
              </Badge>
            )}
            {item.badgeCount && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 bg-primary/15 text-primary border-0"
              >
                {item.badgeCount}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger render={content} />
          <TooltipContent side="right" sideOffset={10}>
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-border/50",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-base leading-none">
                Vendor<span className="text-gradient">Bridge</span>
              </span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                AI Procurement
              </p>
            </div>
          )}
        </Link>
        {!collapsed && onToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={onToggle}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-3 mb-2">
                Main
              </p>
            )}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          <div>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-3 mb-2">
                AI & Intelligence
              </p>
            )}
            <div className="space-y-1">
              {aiNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          <div>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-3 mb-2">
                Insights & Config
              </p>
            )}
            <div className="space-y-1">
              {analyticsNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-border/50 p-3 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-0" />
          {!collapsed && <span className="ml-4">Toggle Theme</span>}
        </Button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl glass">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs gradient-primary text-white">
                PO
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Priya Officer</p>
              <p className="text-[11px] text-muted-foreground truncate">
                Procurement Lead
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300 shrink-0",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        {collapsed && (
          <div className="absolute top-4 -right-3 z-10">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full bg-background border-border"
              onClick={() => setCollapsed(false)}
            >
              <Menu className="w-3 h-3" />
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-3 left-3 z-50 h-10 w-10 glass rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
