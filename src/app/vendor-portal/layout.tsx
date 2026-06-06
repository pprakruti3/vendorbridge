"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe, FileText, ClipboardList, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/vendor-portal", label: "Dashboard", icon: Globe },
  { href: "/vendor-portal/rfqs", label: "RFQs", icon: FileText },
  { href: "/vendor-portal/quotations", label: "Quotations", icon: ClipboardList },
  { href: "/vendor-portal/purchase-orders", label: "POs", icon: ShoppingCart },
];

export default function VendorPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show the nav shell on the login page
  if (pathname === "/vendor-portal/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/vendor-portal" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold">VendorBridge</span>
            <span className="text-xs text-muted-foreground ml-1">Vendor Portal</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`text-sm gap-1.5 ${isActive ? "font-medium" : "text-muted-foreground"}`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
          <div className="w-px h-6 bg-border/50 mx-2" />
          <Link href="/vendor-portal/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground text-sm gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
