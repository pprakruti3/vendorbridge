"use client";

import { FileText, ClipboardList, ShoppingCart, CheckCircle2, Clock, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function VendorPortalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome, Dell Technologies</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your RFQs, quotations, and orders</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { title: "Open RFQs", value: "2", icon: FileText, color: "text-info", href: "/vendor-portal/rfqs" },
          { title: "Submitted Quotes", value: "1", icon: ClipboardList, color: "text-primary", href: "/vendor-portal/quotations" },
          { title: "Active POs", value: "1", icon: ShoppingCart, color: "text-success", href: "/vendor-portal/purchase-orders" },
          { title: "Pending Actions", value: "1", icon: Clock, color: "text-warning", href: "#" },
        ].map(stat => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Recent RFQ Invitations</CardTitle>
            <CardDescription>RFQs awaiting your quotation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enterprise Laptops — 100 Units</p>
                <p className="text-xs text-muted-foreground">RFQ-2025-001 · Due: Jul 15, 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-success/15 text-success border-success/20">RESPONDED</Badge>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Network Infrastructure Upgrade</p>
                <p className="text-xs text-muted-foreground">RFQ-2025-003 · Due: Aug 15, 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-warning/15 text-warning border-warning/20">PENDING</Badge>
                <Button size="sm" className="text-xs h-7 gradient-primary text-white border-0"><Upload className="w-3 h-3 mr-1" /> Submit Quote</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { text: "Quotation QT-2025-001 shortlisted by buyer", time: "2 hours ago", icon: CheckCircle2, color: "text-success" },
              { text: "PO-2025-002 generated for your quotation", time: "1 day ago", icon: ShoppingCart, color: "text-primary" },
              { text: "RFQ-2025-003 invitation received", time: "2 days ago", icon: FileText, color: "text-info" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
