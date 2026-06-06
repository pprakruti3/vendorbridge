"use client";

import { useState, useCallback } from "react";
import {
  FileText, Eye, Clock, CheckCircle2, Upload, Calendar,
  Package, IndianRupee, ChevronRight, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { mockRFQs, mockVendors } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from "@/lib/helpers";
import { toast } from "sonner";
import type { RFQ } from "@/types";

const VENDOR = mockVendors[0]; // Dell Technologies

export default function VendorRFQsPage() {
  // Filter RFQs relevant to this vendor (invited or all published)
  const relevantRFQs = mockRFQs.filter(
    (rfq) =>
      rfq.status === "PUBLISHED" ||
      rfq.vendors.some((v) => v.vendorId === VENDOR.id)
  );

  const [activeModal, setActiveModal] = useState<"view" | "submit" | null>(null);
  const [focusedRFQ, setFocusedRFQ] = useState<RFQ | null>(null);

  const openModal = useCallback((modal: "view" | "submit", rfq: RFQ) => {
    setFocusedRFQ(rfq);
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTimeout(() => setFocusedRFQ(null), 300);
  }, []);

  const getVendorStatus = (rfq: RFQ) => {
    const entry = rfq.vendors.find((v) => v.vendorId === VENDOR.id);
    return entry?.status ?? "NOT_INVITED";
  };

  const handleSubmitQuote = useCallback(() => {
    toast.success("Quotation submitted!", {
      description: `Your quote for ${focusedRFQ?.rfqNumber} has been sent.`,
    });
    closeModal();
  }, [focusedRFQ, closeModal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-info" /> RFQ Invitations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and respond to requests for quotation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total RFQs", value: relevantRFQs.length, icon: FileText, color: "text-info" },
          { label: "Open", value: relevantRFQs.filter((r) => r.status === "PUBLISHED").length, icon: Clock, color: "text-warning" },
          { label: "Responded", value: relevantRFQs.filter((r) => getVendorStatus(r) === "RESPONDED").length, icon: CheckCircle2, color: "text-success" },
          { label: "Total Value", value: formatCurrency(relevantRFQs.reduce((s, r) => s + r.budget, 0)), icon: IndianRupee, color: "text-primary" },
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
              <TableHead>RFQ #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Your Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantRFQs.map((rfq) => {
              const vendorStatus = getVendorStatus(rfq);
              return (
                <TableRow key={rfq.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{rfq.rfqNumber}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{rfq.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{rfq.category}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(rfq.budget)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${getPriorityColor(rfq.priority)}`}>
                      {rfq.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(rfq.deadline)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        vendorStatus === "RESPONDED"
                          ? "bg-success/15 text-success border-success/20"
                          : vendorStatus === "INVITED" || vendorStatus === "VIEWED"
                          ? "bg-warning/15 text-warning border-warning/20"
                          : "bg-info/15 text-info border-info/20"
                      }`}
                    >
                      {vendorStatus === "NOT_INVITED" ? "OPEN" : vendorStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal("view", rfq)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {vendorStatus !== "RESPONDED" && rfq.status === "PUBLISHED" && (
                        <Button
                          size="sm"
                          className="text-xs h-7 gradient-primary text-white border-0"
                          onClick={() => openModal("submit", rfq)}
                        >
                          <Upload className="w-3 h-3 mr-1" /> Submit Quote
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* ── View RFQ Modal ── */}
      <Dialog open={activeModal === "view"} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-info" />
              {focusedRFQ?.rfqNumber}
            </DialogTitle>
            <DialogDescription>{focusedRFQ?.title}</DialogDescription>
          </DialogHeader>

          {focusedRFQ && (
            <div className="space-y-4 py-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {focusedRFQ.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Budget", value: formatCurrency(focusedRFQ.budget) },
                  { label: "Deadline", value: formatDate(focusedRFQ.deadline) },
                  { label: "Priority", value: focusedRFQ.priority },
                  { label: "Category", value: focusedRFQ.category },
                ].map((f) => (
                  <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-bold text-sm mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary" /> Required Items
                </p>
                {focusedRFQ.items.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.itemName}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {item.quantity} {item.unit}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    {item.specifications && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="text-foreground font-medium">Specs:</span> {item.specifications}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Close</Button>
            {focusedRFQ && focusedRFQ.status === "PUBLISHED" && getVendorStatus(focusedRFQ) !== "RESPONDED" && (
              <Button
                className="gradient-primary border-0 text-white"
                onClick={() => {
                  closeModal();
                  setTimeout(() => { if (focusedRFQ) openModal("submit", focusedRFQ); }, 350);
                }}
              >
                <Upload className="w-4 h-4 mr-2" /> Submit Quote
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit Quote Modal ── */}
      <Dialog open={activeModal === "submit"} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Submit Quotation
            </DialogTitle>
            <DialogDescription>
              {focusedRFQ?.rfqNumber} — {focusedRFQ?.title}
            </DialogDescription>
          </DialogHeader>

          {focusedRFQ && (
            <div className="space-y-4 py-2">
              {/* Items Pricing */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-muted-foreground" /> Item Pricing
                </label>
                {focusedRFQ.items.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border/40 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.itemName}</p>
                      <span className="text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Unit Price (₹)</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">GST (%)</label>
                        <select className="w-full rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                          {[5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery & Warranty */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Delivery Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 business days"
                    className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" /> Warranty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 years onsite"
                    className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Payment Terms */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Payment Terms</label>
                <select className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>Net 60</option>
                  <option>Advance Payment</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  placeholder="Any terms, conditions, or notes…"
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[80px] resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button className="gradient-primary border-0 text-white" onClick={handleSubmitQuote}>
              <Upload className="w-4 h-4 mr-2" /> Submit Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
