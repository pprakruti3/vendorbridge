"use client";

import {
  Users,
  FileText,
  CheckSquare,
  ShoppingCart,
  Receipt,
  IndianRupee,
  TrendingUp,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockDashboardStats,
  mockCategorySpend,
  mockVendorPerformance,
  mockApprovalAnalytics,
  mockNotifications,
  mockFraudAlerts,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, getRelativeTime } from "@/lib/helpers";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  {
    title: "Total Vendors",
    value: mockDashboardStats.totalVendors,
    icon: Users,
    change: "+3",
    positive: true,
    description: "active vendors",
  },
  {
    title: "Active RFQs",
    value: mockDashboardStats.activeRFQs,
    icon: FileText,
    change: "+2",
    positive: true,
    description: "open requests",
  },
  {
    title: "Pending Approvals",
    value: mockDashboardStats.pendingApprovals,
    icon: CheckSquare,
    change: "2",
    positive: false,
    description: "awaiting action",
  },
  {
    title: "Purchase Orders",
    value: mockDashboardStats.purchaseOrders,
    icon: ShoppingCart,
    change: "+1",
    positive: true,
    description: "this month",
  },
  {
    title: "Invoices",
    value: mockDashboardStats.invoices,
    icon: Receipt,
    change: "+1",
    positive: true,
    description: "generated",
  },
  {
    title: "Monthly Spend",
    value: formatNumber(mockDashboardStats.monthlySpend),
    icon: IndianRupee,
    change: "+18%",
    positive: false,
    description: "vs last month",
    prefix: "₹",
  },
  {
    title: "Procurement Trend",
    value: "↑ 12%",
    icon: TrendingUp,
    change: "12%",
    positive: true,
    description: "efficiency gain",
  },
  {
    title: "Savings Generated",
    value: formatNumber(mockDashboardStats.savingsGenerated),
    icon: PiggyBank,
    change: "+160%",
    positive: true,
    description: "this quarter",
    prefix: "₹",
  },
];

const CHART_COLORS = [
  "oklch(0.68 0.22 275)",
  "oklch(0.72 0.18 320)",
  "oklch(0.65 0.19 152)",
  "oklch(0.75 0.16 65)",
  "oklch(0.65 0.18 240)",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, Priya. Here&apos;s your procurement overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 py-1 px-3">
            <Sparkles className="w-3 h-3 text-primary" />
            AI Insights Ready
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={stat.title}
            className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.positive ? "text-success" : "text-warning"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold">
                {stat.prefix || ""}
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending Trends */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Spending Trends</CardTitle>
            <CardDescription>
              Monthly procurement spend vs savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockDashboardStats.procurementTrends}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.68 0.22 275)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.68 0.22 275)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.65 0.19 152)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.65 0.19 152)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 10%)"
                />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.5 0 0 / 40%)"
                  fontSize={12}
                />
                <YAxis
                  stroke="oklch(0.5 0 0 / 40%)"
                  fontSize={12}
                  tickFormatter={(v) => `₹${formatNumber(v)}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.015 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px oklch(0 0 0 / 30%)",
                  }}
                  formatter={(value) => [formatCurrency(Number(value))]}
                  labelStyle={{ color: "oklch(0.6 0 0)" }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="oklch(0.68 0.22 275)"
                  strokeWidth={2}
                  fill="url(#spendGrad)"
                  name="Spend"
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="oklch(0.65 0.19 152)"
                  strokeWidth={2}
                  fill="url(#savingsGrad)"
                  name="Savings"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Spend Pie */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Spend by Category</CardTitle>
            <CardDescription>Current quarter breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={mockCategorySpend}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                  stroke="none"
                >
                  {mockCategorySpend.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.015 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value))]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {mockCategorySpend.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: CHART_COLORS[i] }}
                  />
                  <span className="flex-1 text-muted-foreground truncate">
                    {cat.category}
                  </span>
                  <span className="font-medium">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendor Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Vendor Performance</CardTitle>
            <CardDescription>
              Top vendors by delivery, quality & responsiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockVendorPerformance} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 10%)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="oklch(0.5 0 0 / 40%)"
                  fontSize={12}
                />
                <YAxis
                  dataKey="vendor"
                  type="category"
                  width={80}
                  stroke="oklch(0.5 0 0 / 40%)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.015 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="onTimeDelivery"
                  fill="oklch(0.68 0.22 275)"
                  name="On-Time Delivery"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="quality"
                  fill="oklch(0.72 0.18 320)"
                  name="Quality"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="responsiveness"
                  fill="oklch(0.65 0.19 152)"
                  name="Responsiveness"
                  radius={[0, 4, 4, 0]}
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Approval Analytics */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Approval Analytics</CardTitle>
            <CardDescription>
              Monthly approval, rejection & pending trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockApprovalAnalytics}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 10%)"
                />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.5 0 0 / 40%)"
                  fontSize={12}
                />
                <YAxis stroke="oklch(0.5 0 0 / 40%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.015 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="approved"
                  stackId="a"
                  fill="oklch(0.65 0.19 152)"
                  name="Approved"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="rejected"
                  stackId="a"
                  fill="oklch(0.704 0.191 22.216)"
                  name="Rejected"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="oklch(0.75 0.16 65)"
                  name="Pending"
                  radius={[4, 4, 0, 0]}
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Alerts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest notifications & updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      notif.isRead ? "bg-muted-foreground/30" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {getRelativeTime(notif.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Alerts */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">AI Fraud Alerts</CardTitle>
                <CardDescription>Active risk detections</CardDescription>
              </div>
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                {mockFraudAlerts.filter((a) => a.status === "OPEN").length} open
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === "CRITICAL"
                        ? "bg-destructive/15 text-destructive"
                        : alert.severity === "HIGH"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">
                        {alert.alertType.replace(/_/g, " ")}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0 h-4 ${
                          alert.severity === "CRITICAL"
                            ? "border-destructive/30 text-destructive"
                            : alert.severity === "HIGH"
                            ? "border-destructive/20 text-destructive"
                            : "border-warning/20 text-warning"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
