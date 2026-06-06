"use client";

import { useState, useCallback } from "react";
import {
  Download, Eye, Mail, MoreHorizontal, Send, ShoppingCart,
  Building2, Package, CreditCard, Calendar, CheckCircle2,
  X, FileText, Loader2, Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockPurchaseOrders, mockQuotations, mockVendors } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";
import { toast } from "sonner";
import type { PurchaseOrder, POStatus } from "@/types";

type ActiveModal = "create" | "view" | "email" | null;

const VENDOR_OPTIONS = mockVendors.filter(v => v.status === "ACTIVE");
const QUOTATION_OPTIONS = mockQuotations;

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [focusedPO, setFocusedPO] = useState<PurchaseOrder | null>(null);

  // Create PO form state
  const [selectedVendorId, setSelectedVendorId] = useState(VENDOR_OPTIONS[0]?.id ?? "");
  const [selectedQuotationId, setSelectedQuotationId] = useState(QUOTATION_OPTIONS[0]?.id ?? "");
  const [poNotes, setPoNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email form
  const [emailBody, setEmailBody] = useState("");

  const openModal = useCallback((modal: ActiveModal, po?: PurchaseOrder) => {
    if (po) setFocusedPO(po);
    if (modal === "email" && po) {
      setEmailBody(
        `Dear ${po.vendor?.companyName} Team,\n\nPlease find attached Purchase Order ${po.poNumber} for your reference.\n\nTotal Amount: ${formatCurrency(po.totalAmount)}\n\nKindly acknowledge receipt and confirm delivery schedule.\n\nRegards,\nProcurement Team`
      );
    }
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTimeout(() => {
      setFocusedPO(null);
      setEmailBody("");
    }, 300);
  }, []);

  const selectedQuotation = QUOTATION_OPTIONS.find(q => q.id === selectedQuotationId);
  const selectedVendor = VENDOR_OPTIONS.find(v => v.id === selectedVendorId);

  const handleCreatePO = useCallback(async () => {
    if (!selectedVendor || !selectedQuotation) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    const now = Date.now();
    const newPO: PurchaseOrder = {
      id: `po${now}`,
      poNumber: `PO-2025-${String(orders.length + 1).padStart(3, "0")}`,
      rfqId: selectedQuotation.rfqId,
      quotationId: selectedQuotation.id,
      vendorId: selectedVendor.id,
      vendor: selectedVendor,
      totalAmount: selectedQuotation.totalAmount,
      taxAmount: selectedQuotation.taxAmount,
      status: "DRAFT",
      approvalRef: `APR-${String(orders.length + 1).padStart(3, "0")}`,
      items: selectedQuotation.items.map(qi => ({
        id: `poi${now}-${qi.id}`,
        poId: `po${now}`,
        productName: qi.productName,
        quantity: qi.quantity,
        unit: "Unit",
        unitPrice: qi.unitPrice,
        totalPrice: qi.totalPrice,
        gst: qi.gst,
      })),
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newPO, ...prev]);
    setIsSubmitting(false);
    closeModal();
    setPoNotes("");
    toast.success("Purchase Order created!", {
      description: `${newPO.poNumber} has been created as a draft.`,
    });
  }, [selectedVendor, selectedQuotation, orders.length, closeModal]);

  const handleDownload = useCallback((po: PurchaseOrder) => {
    toast.success("Downloading PDF…", {
      description: `${po.poNumber} — ${po.vendor?.companyName}`,
    });
  }, []);

  const handleSendEmail = useCallback(() => {
    toast.success("Email sent to vendor!", {
      description: `PO sent to ${focusedPO?.vendor?.companyName}.`,
    });
    closeModal();
  }, [focusedPO, closeModal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track purchase orders</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={() => openModal("create")}>
          <ShoppingCart className="w-4 h-4 mr-2" /> Create PO
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total POs",  value: orders.length },
          { label: "Sent",       value: orders.filter(p => p.status === "SENT").length },
          { label: "Completed",  value: orders.filter(p => p.status === "COMPLETED").length },
          { label: "Total Value",value: formatCurrency(orders.reduce((s, p) => s + p.totalAmount, 0)) },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
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
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(po => (
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
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openModal("view", po)}>
                        <Eye className="w-3.5 h-3.5 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(po)}>
                        <Download className="w-3.5 h-3.5 mr-2" /> Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal("email", po)}>
                        <Mail className="w-3.5 h-3.5 mr-2" /> Email Vendor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── Create PO Modal ── */}
      <Dialog open={activeModal === "create"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Create Purchase Order
            </DialogTitle>
            <DialogDescription>
              Generate a new PO from an approved quotation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Vendor select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Vendor
              </label>
              <select
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedVendorId}
                onChange={e => setSelectedVendorId(e.target.value)}
              >
                {VENDOR_OPTIONS.map(v => (
                  <option key={v.id} value={v.id}>{v.companyName}</option>
                ))}
              </select>
            </div>

            {/* Quotation select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Based on Quotation
              </label>
              <select
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedQuotationId}
                onChange={e => setSelectedQuotationId(e.target.value)}
              >
                {QUOTATION_OPTIONS.map(q => (
                  <option key={q.id} value={q.id}>{q.quotationNumber} — {formatCurrency(q.totalAmount)}</option>
                ))}
              </select>
            </div>

            {/* Quotation preview */}
            {selectedQuotation && (
              <div className="bg-muted/40 rounded-lg p-3 border border-border/40 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Quotation Preview
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Total:</span> <span className="font-semibold">{formatCurrency(selectedQuotation.totalAmount)}</span></div>
                  <div><span className="text-muted-foreground">Delivery:</span> <span className="font-semibold">{selectedQuotation.deliveryTime}</span></div>
                  <div><span className="text-muted-foreground">Warranty:</span> <span className="font-semibold">{selectedQuotation.warranty}</span></div>
                  <div><span className="text-muted-foreground">AI Score:</span> <span className="font-semibold text-primary">{selectedQuotation.aiScore}/100</span></div>
                </div>
                {selectedQuotation.items.length > 0 && (
                  <>
                    <Separator className="my-1" />
                    <div className="space-y-1">
                      {selectedQuotation.items.map(item => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[72px] resize-none"
                placeholder="Any special instructions or terms…"
                value={poNotes}
                onChange={e => setPoNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
            <Button
              className="gradient-primary border-0 text-white"
              onClick={handleCreatePO}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating…</>
                : <><CheckCircle2 className="w-4 h-4 mr-2" /> Create PO</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View PO Modal ── */}
      <Dialog open={activeModal === "view"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {focusedPO?.poNumber}
            </DialogTitle>
            <DialogDescription>{focusedPO?.vendor?.companyName}</DialogDescription>
          </DialogHeader>

          {focusedPO && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Amount", value: formatCurrency(focusedPO.totalAmount) },
                  { label: "Tax Amount",   value: formatCurrency(focusedPO.taxAmount)   },
                  { label: "Status",       value: focusedPO.status, badge: true         },
                  { label: "Created",      value: formatDate(focusedPO.createdAt)        },
                ].map(f => (
                  <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    {f.badge
                      ? <Badge variant="outline" className={`text-[10px] mt-1 ${getStatusColor(focusedPO.status)}`}>{f.value}</Badge>
                      : <p className="font-bold text-sm mt-0.5">{f.value}</p>
                    }
                  </div>
                ))}
              </div>

              {focusedPO.items.length > 0 && (
                <>
                  <Separator />
                  <p className="text-sm font-semibold">Line Items</p>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2.5 font-medium text-muted-foreground">Product</th>
                          <th className="text-center p-2.5 font-medium text-muted-foreground">Qty</th>
                          <th className="text-right p-2.5 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {focusedPO.items.map((item, i) => (
                          <tr key={item.id} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                            <td className="p-2.5 font-medium">{item.productName}</td>
                            <td className="p-2.5 text-center">{item.quantity}</td>
                            <td className="p-2.5 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Close</Button>
            <Button className="gradient-primary border-0 text-white" onClick={() => { closeModal(); if (focusedPO) handleDownload(focusedPO); }}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Email Vendor Modal ── */}
      <Dialog open={activeModal === "email"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email Vendor
            </DialogTitle>
            <DialogDescription>
              Send {focusedPO?.poNumber} to {focusedPO?.vendor?.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground">
              To: <span className="text-foreground font-medium">{focusedPO?.vendor?.email}</span>
            </div>
            <textarea
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[180px] resize-none font-mono"
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button className="gradient-primary border-0 text-white" onClick={handleSendEmail}>
              <Send className="w-4 h-4 mr-2" /> Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
