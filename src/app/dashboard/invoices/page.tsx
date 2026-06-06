"use client";

import { Download, Eye, Mail, MoreHorizontal, Receipt, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground text-sm mt-1">GST-compliant invoicing with tax breakdown</p>
        </div>
        <Button className="gradient-primary border-0 text-white"><Receipt className="w-4 h-4 mr-2" /> Generate Invoice</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: mockInvoices.length },
          { label: "Paid", value: mockInvoices.filter(i => i.status === "PAID").length },
          { label: "Pending", value: mockInvoices.filter(i => i.status === "SENT").length },
          { label: "Total Value", value: formatCurrency(mockInvoices.reduce((s, i) => s + i.totalAmount, 0)) },
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
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map(inv => (
              <TableRow key={inv.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                <TableCell className="font-medium">{inv.vendor?.companyName}</TableCell>
                <TableCell>{formatCurrency(inv.subtotal)}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(inv.gstAmount)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(inv.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(inv.status)}`}>{inv.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(inv.dueDate)}</TableCell>
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
                      <DropdownMenuItem><Printer className="w-3.5 h-3.5 mr-2" /> Print</DropdownMenuItem>
                      <DropdownMenuItem><Mail className="w-3.5 h-3.5 mr-2" /> Email</DropdownMenuItem>
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
