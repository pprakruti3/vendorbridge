"use client";

import { useState } from "react";
import {
  Trophy,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  TrendingUp,
  Shield,
  Clock,
  IndianRupee,
  Star,
  Sparkles,
  Bot,
  Copy,
  Send,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockAIComparison, mockQuotations } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/helpers";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const radarData = mockAIComparison.vendorScores.map((vs) => ({
  vendor: vs.vendorName.split(" ")[0],
  Price: vs.priceScore,
  Delivery: vs.deliveryScore,
  History: vs.historyScore,
  Warranty: vs.warrantyScore,
  Risk: vs.riskScore,
}));

const negotiationEmail = `Dear HP Enterprise Team,

Thank you for your quotation QT-2025-002 for the Enterprise Laptops procurement (RFQ-2025-001).

We have received competitive offers from other vendors for the same specifications. After careful evaluation, we believe there is an opportunity to strengthen our partnership by revising the commercial terms.

Specifically, we would appreciate if you could consider:

1. A revised unit price closer to ₹68,500 (current quote: ₹72,000)
2. Expedited delivery timeline of 15 business days (current: 20 days)
3. Upgrade to onsite warranty (current: carry-in)

We value our relationship with HP and would prefer to award this contract to you. A revised offer within the next 5 business days would be greatly appreciated.

Looking forward to your response.

Best regards,
Priya Officer
Procurement Lead, VendorBridge AI`;

export default function ComparePage() {
  const [showNegotiation, setShowNegotiation] = useState(false);
  const comparison = mockAIComparison;
  const recommended = comparison.vendorScores.find(
    (vs) => vs.vendorId === comparison.recommendedVendorId
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 text-xs">
              <Sparkles className="w-3 h-3 text-primary" />
              VendorGPT Analysis
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              RFQ-2025-001
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">
            AI Quotation Comparison
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enterprise Laptops — 100 Units · 3 quotations analyzed
          </p>
        </div>
      </div>

      {/* AI Recommendation Card */}
      <Card className="border-primary/20 bg-primary/[0.03] glow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Trophy & Vendor */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  AI Recommended Vendor
                </p>
                <h2 className="text-xl font-bold">Dell Technologies</h2>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {comparison.confidenceScore}% Confidence
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-success/15 text-success border-0">
                    Score: {recommended?.overallScore}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="text-center lg:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                Potential Savings
              </p>
              <p className="text-3xl font-bold text-gradient">
                {formatCurrency(comparison.potentialSavings)}
              </p>
            </div>
          </div>

          {/* Reasons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {comparison.reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {comparison.vendorScores.map((vs, i) => (
          <Card
            key={vs.vendorId}
            className={`border-border/50 transition-all ${
              vs.vendorId === comparison.recommendedVendorId
                ? "ring-2 ring-primary/30"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <Trophy className="w-4 h-4 text-warning" />
                  )}
                  <CardTitle className="text-sm">{vs.vendorName}</CardTitle>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    vs.overallScore >= 90
                      ? "text-success"
                      : vs.overallScore >= 80
                      ? "text-primary"
                      : "text-warning"
                  }`}
                >
                  {vs.overallScore}
                </div>
              </div>
              <CardDescription>
                {mockQuotations.find((q) => q.vendorId === vs.vendorId)
                  ?.quotationNumber || ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Price (40%)", score: vs.priceScore, icon: IndianRupee },
                { label: "Delivery (25%)", score: vs.deliveryScore, icon: Clock },
                { label: "History (15%)", score: vs.historyScore, icon: TrendingUp },
                { label: "Warranty (10%)", score: vs.warrantyScore, icon: Shield },
                { label: "Risk (10%)", score: vs.riskScore, icon: AlertTriangle },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center gap-2">
                  <metric.icon className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground w-24">
                    {metric.label}
                  </span>
                  <Progress value={metric.score} className="h-1.5 flex-1" />
                  <span
                    className={`text-xs font-medium w-7 text-right ${
                      metric.score >= 85
                        ? "text-success"
                        : metric.score >= 70
                        ? "text-primary"
                        : "text-warning"
                    }`}
                  >
                    {metric.score}
                  </span>
                </div>
              ))}

              {vs.vendorId !== comparison.recommendedVendorId && (
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 text-xs"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        AI Negotiate
                      </Button>
                    }
                  />
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        AI Negotiation Copilot
                      </DialogTitle>
                      <DialogDescription>
                        AI-generated negotiation email for {vs.vendorName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        value={negotiationEmail}
                        rows={16}
                        className="font-mono text-sm"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="gap-1">
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </Button>
                      <Button className="gradient-primary text-white border-0 gap-1">
                        <Send className="w-3.5 h-3.5" /> Send Email
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="matrix">Comparison Matrix</TabsTrigger>
          <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
          <TabsTrigger value="bar">Score Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Parameter-wise Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Parameter
                      </th>
                      {comparison.comparisonMatrix[0]?.vendors.map((v) => (
                        <th
                          key={v.vendorId}
                          className="text-center py-3 px-4 font-medium"
                        >
                          <div className="flex items-center justify-center gap-1">
                            {v.vendorId === comparison.recommendedVendorId && (
                              <Trophy className="w-3 h-3 text-warning" />
                            )}
                            {v.vendorName}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.comparisonMatrix.map((row) => (
                      <tr
                        key={row.parameter}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-3 px-4 font-medium">
                          {row.parameter}
                        </td>
                        {row.vendors.map((v) => {
                          const maxScore = Math.max(
                            ...row.vendors.map((x) => x.score)
                          );
                          return (
                            <td
                              key={v.vendorId}
                              className="text-center py-3 px-4"
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span
                                  className={`font-medium ${
                                    v.score === maxScore
                                      ? "text-success"
                                      : "text-foreground"
                                  }`}
                                >
                                  {v.value}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] py-0 h-4 ${
                                    v.score >= 90
                                      ? "text-success border-success/30"
                                      : v.score >= 80
                                      ? "text-primary border-primary/30"
                                      : "text-warning border-warning/30"
                                  }`}
                                >
                                  {v.score}
                                </Badge>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Multi-Dimensional Vendor Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.5 0 0 / 15%)" />
                  <PolarAngleAxis
                    dataKey="vendor"
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Price"
                    dataKey="Price"
                    stroke="oklch(0.68 0.22 275)"
                    fill="oklch(0.68 0.22 275)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Delivery"
                    dataKey="Delivery"
                    stroke="oklch(0.72 0.18 320)"
                    fill="oklch(0.72 0.18 320)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Warranty"
                    dataKey="Warranty"
                    stroke="oklch(0.65 0.19 152)"
                    fill="oklch(0.65 0.19 152)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Weighted Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={comparison.vendorScores.map((vs) => ({
                    vendor: vs.vendorName.split(" ")[0],
                    "Price (40%)": vs.priceScore * 0.4,
                    "Delivery (25%)": vs.deliveryScore * 0.25,
                    "History (15%)": vs.historyScore * 0.15,
                    "Warranty (10%)": vs.warrantyScore * 0.1,
                    "Risk (10%)": vs.riskScore * 0.1,
                  }))}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.5 0 0 / 10%)"
                  />
                  <XAxis
                    dataKey="vendor"
                    stroke="oklch(0.5 0 0 / 40%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0 / 40%)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => [Number(value).toFixed(1)]}
                  />
                  <Bar dataKey="Price (40%)" stackId="a" fill="oklch(0.68 0.22 275)" />
                  <Bar dataKey="Delivery (25%)" stackId="a" fill="oklch(0.72 0.18 320)" />
                  <Bar dataKey="History (15%)" stackId="a" fill="oklch(0.65 0.19 152)" />
                  <Bar dataKey="Warranty (10%)" stackId="a" fill="oklch(0.75 0.16 65)" />
                  <Bar
                    dataKey="Risk (10%)"
                    stackId="a"
                    fill="oklch(0.65 0.18 240)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Negotiation Suggestions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            AI Negotiation Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comparison.negotiationSuggestions.map((suggestion, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{suggestion}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0">
                  <Mail className="w-3 h-3 mr-1" /> Generate Email
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
