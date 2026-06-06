import Link from "next/link";
import { Globe } from "lucide-react";

export default function VendorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold">VendorBridge</span>
            <span className="text-xs text-muted-foreground ml-1">Vendor Portal</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/vendor-portal" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/vendor-portal/rfqs" className="text-muted-foreground hover:text-foreground transition-colors">RFQs</Link>
          <Link href="/vendor-portal/quotations" className="text-muted-foreground hover:text-foreground transition-colors">Quotations</Link>
          <Link href="/vendor-portal/purchase-orders" className="text-muted-foreground hover:text-foreground transition-colors">POs</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
