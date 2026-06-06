"use client";

import {
  Crown,
  IndianRupee,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockDashboardStats, mockVendorPerformance, mockCategorySpend } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/helpers";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const COLORS = ["oklch(0.68 0.22 275)", "oklch(0.72 0.18 320)", "oklch(0.65 0.19 152)", "oklch(0.75 0.16 65)", "oklch(0.65 0.18 240)"];

const aiInsights = [
  { icon: PiggyBank, title: "Cost Optimization", description: "Bulk ordering IT Hardware in Q3 could save ₹5,00,000+ based on volume discount analysis.", type: "savings" },
  { icon: AlertTriangle, title: "Vendor Risk Alert", description: "Lenovo India's reliability score dropped 12% this quarter. Consider diversifying IT Hardware vendors.", type: "risk" },
  { icon: TrendingUp, title: "Spending Forecast", description: "Q3 procurement spend projected at ₹1.2Cr based on current trends — 15% above budget.", type: "forecast" },
  { icon: Users, title: "Vendor Consolidation", description: "Consolidating IT Hardware vendors from 3 to 2 could improve negotiation leverage by 20%.", type: "strategy" },
];

export default function ExecutivePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-warning" /> Executive Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Strategic procurement intelligence for leadership</p>
        </div>
        <Badge variant="outline" className="gap-1 py-1 px-3"><Sparkles className="w-3 h-3 text-primary" /> AI-Powered Insights</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Spend (YTD)", value: "₹3.29Cr", change: "+18%", positive: false, icon: IndianRupee },
          { title: "Savings Generated", value: "₹21L", change: "+160%", positive: true, icon: PiggyBank },
          { title: "Top Vendor", value: "Dell Tech", change: "Score: 94", positive: true, icon: Users },
          { title: "Risk Exposure", value: "₹12.5L", change: "2 alerts", positive: false, icon: ShieldAlert },
        ].map((kpi, i) => (
          <Card key={kpi.title} className="border-border/50 group hover:glow transition-all animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.positive ? "text-success" : "text-warning"}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spend Forecast Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Spend Forecast & Trends</CardTitle>
            <CardDescription>Monthly procurement spend with AI projection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[...mockDashboardStats.procurementTrends, { month: "Jul", spend: 9200000, savings: 1400000, orders: 14 }, { month: "Aug", spend: 10100000, savings: 1600000, orders: 16 }]}>
                <defs>
                  <linearGradient id="execSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.68 0.22 275)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.68 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} tickFormatter={(v) => `₹${formatNumber(v)}`} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} formatter={(value) => [formatCurrency(Number(value))]} />
                <Area type="monotone" dataKey="spend" stroke="oklch(0.68 0.22 275)" strokeWidth={2} fill="url(#execSpendGrad)" name="Spend" />
                <Area type="monotone" dataKey="savings" stroke="oklch(0.65 0.19 152)" strokeWidth={2} fill="oklch(0.65 0.19 152 / 10%)" name="Savings" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={mockCategorySpend} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="amount" stroke="none">
                  {mockCategorySpend.map((_, idx) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} formatter={(v) => [formatCurrency(Number(v))]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {mockCategorySpend.map((c, i) => (
                <div key={c.category} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="flex-1 text-muted-foreground truncate">{c.category}</span>
                  <span className="font-medium">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Strategic Insights</CardTitle>
          <CardDescription>AI-generated recommendations for procurement optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  insight.type === "savings" ? "bg-success/15 text-success" :
                  insight.type === "risk" ? "bg-destructive/15 text-destructive" :
                  insight.type === "forecast" ? "bg-warning/15 text-warning" :
                  "bg-primary/15 text-primary"
                }`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Rankings */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Vendor Performance Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockVendorPerformance.map((v, i) => (
              <div key={v.vendor} className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <span className="font-medium text-sm w-28">{v.vendor}</span>
                <Progress value={v.overall} className="flex-1 h-2" />
                <span className={`text-sm font-bold w-10 text-right ${v.overall >= 90 ? "text-success" : v.overall >= 80 ? "text-primary" : "text-warning"}`}>{v.overall}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
