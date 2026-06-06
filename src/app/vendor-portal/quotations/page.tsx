"use client";

import { useState, useCallback } from "react";
import {
  ClipboardList, Eye, IndianRupee, Clock, CheckCircle2,
  Package, Calendar, Sparkles, TrendingUp,
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
import { mockQuotations, mockRFQs } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";
import type { Quotation } from "@/types";

const VENDOR_ID = "v1"; // Dell Technologies

export default function VendorQuotationsPage() {
  const vendorQuotes = mockQuotations.filter((q) => q.vendorId === VENDOR_ID);

  const [showDetail, setShowDetail] = useState(false);
  const [focusedQuote, setFocusedQuote] = useState<Quotation | null>(null);

  const openDetail = useCallback((q: Quotation) => {
    setFocusedQuote(q);
    setShowDetail(true);
  }, []);

  const closeDetail = useCallback(() => {
    setShowDetail(false);
    setTimeout(() => setFocusedQuote(null), 300);
  }, []);

  const getRFQTitle = (rfqId: string) => {
    return mockRFQs.find((r) => r.id === rfqId)?.title ?? rfqId;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> My Quotations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track all submitted quotations and their review status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Quotes", value: vendorQuotes.length, icon: ClipboardList, color: "text-primary" },
          { label: "Shortlisted", value: vendorQuotes.filter((q) => q.status === "SHORTLISTED").length, icon: Sparkles, color: "text-success" },
          { label: "Under Review", value: vendorQuotes.filter((q) => q.status === "UNDER_REVIEW").length, icon: Clock, color: "text-warning" },
          { label: "Total Value", value: formatCurrency(vendorQuotes.reduce((s, q) => s + q.totalAmount, 0)), icon: IndianRupee, color: "text-info" },
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
              <TableHead>Quote #</TableHead>
              <TableHead>RFQ</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorQuotes.map((q) => (
              <TableRow key={q.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{q.quotationNumber}</TableCell>
                <TableCell className="text-sm max-w-[160px] truncate" title={getRFQTitle(q.rfqId)}>
                  {getRFQTitle(q.rfqId)}
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(q.totalAmount)}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(q.gstAmount)}</TableCell>
                <TableCell className="text-sm">{q.deliveryTime}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(q.status)}`}>
                    {q.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {q.aiScore ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: q.aiScore >= 85 ? "rgba(34,197,94,0.15)" : q.aiScore >= 70 ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)",
                          color: q.aiScore >= 85 ? "#22c55e" : q.aiScore >= 70 ? "#eab308" : "#ef4444",
                        }}
                      >
                        {q.aiScore}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(q.submittedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(q)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── View Quotation Modal ── */}
      <Dialog open={showDetail} onOpenChange={(open) => { if (!open) closeDetail(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              {focusedQuote?.quotationNumber}
            </DialogTitle>
            <DialogDescription>{getRFQTitle(focusedQuote?.rfqId ?? "")}</DialogDescription>
          </DialogHeader>

          {focusedQuote && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Amount", value: formatCurrency(focusedQuote.totalAmount) },
                  { label: "GST", value: formatCurrency(focusedQuote.gstAmount) },
                  { label: "Delivery", value: focusedQuote.deliveryTime },
                  { label: "Warranty", value: focusedQuote.warranty },
                  { label: "Payment Terms", value: focusedQuote.paymentTerms },
                  { label: "Support", value: focusedQuote.supportDetails },
                ].map((f) => (
                  <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-bold text-sm mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="outline" className={`text-xs ${getStatusColor(focusedQuote.status)}`}>
                  {focusedQuote.status.replace("_", " ")}
                </Badge>
              </div>

              {focusedQuote.aiScore && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" /> AI Score
                    </span>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        background: focusedQuote.aiScore >= 85 ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                        color: focusedQuote.aiScore >= 85 ? "#22c55e" : "#eab308",
                      }}
                    >
                      {focusedQuote.aiScore}/100
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary" /> Quoted Items
                </p>
                {focusedQuote.items.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-sm font-bold">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.quantity} × {formatCurrency(item.unitPrice)} · GST {item.gst}%
                    </p>
                    <p className="text-xs text-muted-foreground">{item.specifications}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
