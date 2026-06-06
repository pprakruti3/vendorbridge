"use client";

import { Download, Eye, Mail, MoreHorizontal, Send, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track purchase orders
          </p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" /> Create PO
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total POs", value: mockPurchaseOrders.length },
          { label: "Sent", value: mockPurchaseOrders.filter(p => p.status === "SENT").length },
          { label: "Completed", value: mockPurchaseOrders.filter(p => p.status === "COMPLETED").length },
          { label: "Total Value", value: formatCurrency(mockPurchaseOrders.reduce((s, p) => s + p.totalAmount, 0)) },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPurchaseOrders.map(po => (
              <TableRow key={po.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{po.poNumber}</TableCell>
                <TableCell className="font-medium">{po.vendor?.companyName}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(po.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(po.status)}`}>{po.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(po.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View</DropdownMenuItem>
                      <DropdownMenuItem><Download className="w-3.5 h-3.5 mr-2" /> Download PDF</DropdownMenuItem>
                      <DropdownMenuItem><Mail className="w-3.5 h-3.5 mr-2" /> Email Vendor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
