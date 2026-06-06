"use client";

import { BarChart3, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockCategorySpend, mockVendorPerformance, mockApprovalAnalytics } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/helpers";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["oklch(0.68 0.22 275)", "oklch(0.72 0.18 320)", "oklch(0.65 0.19 152)", "oklch(0.75 0.16 65)", "oklch(0.65 0.18 240)"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold"><BarChart3 className="w-6 h-6 text-primary inline mr-2" />Reporting & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive procurement intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" /> Export Excel</Button>
        </div>
      </div>

      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Performance</TabsTrigger>
          <TabsTrigger value="savings">Cost Savings</TabsTrigger>
          <TabsTrigger value="approval">Approval Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Monthly Spend Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={mockDashboardStats.procurementTrends}>
                    <defs>
                      <linearGradient id="aSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.68 0.22 275)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.68 0.22 275)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                    <XAxis dataKey="month" stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} tickFormatter={(v) => `₹${formatNumber(v)}`} />
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} formatter={(v) => [formatCurrency(Number(v))]} />
                    <Area type="monotone" dataKey="spend" stroke="oklch(0.68 0.22 275)" strokeWidth={2} fill="url(#aSpend)" name="Spend" />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">By Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={mockCategorySpend} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="amount" stroke="none">
                      {mockCategorySpend.map((_, idx) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} formatter={(v) => [formatCurrency(Number(v))]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {mockCategorySpend.map((c, i) => (
                    <div key={c.category} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="flex-1 text-muted-foreground">{c.category}</span>
                      <span className="font-medium">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendor">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Vendor Performance Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockVendorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                  <XAxis dataKey="vendor" stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} />
                  <Bar dataKey="onTimeDelivery" fill="oklch(0.68 0.22 275)" name="On-Time" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quality" fill="oklch(0.72 0.18 320)" name="Quality" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="responsiveness" fill="oklch(0.65 0.19 152)" name="Response" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Cost Savings Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={mockDashboardStats.procurementTrends}>
                  <defs>
                    <linearGradient id="aSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.19 152)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.19 152)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} tickFormatter={(v) => `₹${formatNumber(v)}`} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} formatter={(v) => [formatCurrency(Number(v))]} />
                  <Area type="monotone" dataKey="savings" stroke="oklch(0.65 0.19 152)" strokeWidth={2} fill="url(#aSavings)" name="Savings" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Approval Analytics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockApprovalAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.015 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "12px" }} />
                  <Bar dataKey="approved" stackId="a" fill="oklch(0.65 0.19 152)" name="Approved" />
                  <Bar dataKey="rejected" stackId="a" fill="oklch(0.704 0.191 22.216)" name="Rejected" />
                  <Bar dataKey="pending" stackId="a" fill="oklch(0.75 0.16 65)" name="Pending" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
