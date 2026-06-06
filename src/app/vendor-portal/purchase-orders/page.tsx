"use client";

import { useState, useCallback } from "react";
import {
  ShoppingCart, Eye, IndianRupee, CheckCircle2,
  Package, Clock, Truck, FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";
import { toast } from "sonner";
import type { PurchaseOrder } from "@/types";

const VENDOR_ID = "v1"; // Dell Technologies

export default function VendorPurchaseOrdersPage() {
  const vendorPOs = mockPurchaseOrders.filter((po) => po.vendorId === VENDOR_ID);

  const [showDetail, setShowDetail] = useState(false);
  const [focusedPO, setFocusedPO] = useState<PurchaseOrder | null>(null);

  const openDetail = useCallback((po: PurchaseOrder) => {
    setFocusedPO(po);
    setShowDetail(true);
  }, []);

  const closeDetail = useCallback(() => {
    setShowDetail(false);
    setTimeout(() => setFocusedPO(null), 300);
  }, []);

  const handleAcknowledge = useCallback((po: PurchaseOrder) => {
    toast.success("PO Acknowledged!", {
      description: `${po.poNumber} has been acknowledged. Delivery tracking is now active.`,
    });
    closeDetail();
  }, [closeDetail]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-success" /> Purchase Orders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your purchase orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total POs", value: vendorPOs.length, icon: ShoppingCart, color: "text-success" },
          { label: "Active", value: vendorPOs.filter((p) => p.status === "SENT" || p.status === "ACKNOWLEDGED").length, icon: Clock, color: "text-info" },
          { label: "Completed", value: vendorPOs.filter((p) => p.status === "COMPLETED").length, icon: CheckCircle2, color: "text-success" },
          { label: "Total Value", value: formatCurrency(vendorPOs.reduce((s, p) => s + p.totalAmount, 0)), icon: IndianRupee, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>PO #</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorPOs.map((po) => (
              <TableRow key={po.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{po.poNumber}</TableCell>
                <TableCell className="text-sm">
                  {po.items.map((i) => i.productName).join(", ")}
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(po.totalAmount)}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(po.taxAmount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(po.status)}`}>
                    {po.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(po.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(po)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {po.status === "SENT" && (
                      <Button
                        size="sm"
                        className="text-xs h-7 gradient-primary text-white border-0"
                        onClick={() => handleAcknowledge(po)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Acknowledge
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── View PO Modal ── */}
      <Dialog open={showDetail} onOpenChange={(open) => { if (!open) closeDetail(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-success" />
              {focusedPO?.poNumber}
            </DialogTitle>
            <DialogDescription>Purchase Order Details</DialogDescription>
          </DialogHeader>

          {focusedPO && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Amount", value: formatCurrency(focusedPO.totalAmount) },
                  { label: "Tax Amount", value: formatCurrency(focusedPO.taxAmount) },
                  { label: "Approval Ref", value: focusedPO.approvalRef },
                  { label: "Created", value: formatDate(focusedPO.createdAt) },
                ].map((f) => (
                  <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-bold text-sm mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="outline" className={`text-xs ${getStatusColor(focusedPO.status)}`}>
                  {focusedPO.status}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary" /> Order Items
                </p>
                {focusedPO.items.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-sm font-bold">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)} · GST {item.gst}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Timeline (visual) */}
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-info" /> Delivery Status
                </p>
                <div className="space-y-0">
                  {[
                    { label: "PO Created", done: true, date: formatDate(focusedPO.createdAt) },
                    { label: "PO Sent to Vendor", done: focusedPO.status !== "DRAFT", date: focusedPO.status !== "DRAFT" ? formatDate(focusedPO.createdAt) : "Pending" },
                    { label: "Vendor Acknowledged", done: focusedPO.status === "ACKNOWLEDGED" || focusedPO.status === "COMPLETED", date: focusedPO.status === "ACKNOWLEDGED" || focusedPO.status === "COMPLETED" ? "Confirmed" : "Pending" },
                    { label: "Delivery Completed", done: focusedPO.status === "COMPLETED", date: focusedPO.status === "COMPLETED" ? "Delivered" : "Pending" },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-start gap-3 py-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.done
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        {i < 3 && (
                          <div className={`w-px h-4 ${step.done ? "bg-success/40" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="flex-1 -mt-0.5">
                        <p className={`text-sm ${step.done ? "font-medium" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDetail}>Close</Button>
            {focusedPO && focusedPO.status === "SENT" && (
              <Button className="gradient-primary border-0 text-white" onClick={() => handleAcknowledge(focusedPO)}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Acknowledge PO
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
