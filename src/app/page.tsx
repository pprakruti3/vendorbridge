"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  FileText,
  Globe,
  LayoutDashboard,
  Moon,
  Shield,
  Sun,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Bot,
    title: "VendorGPT",
    description:
      "AI reads quotation PDFs, extracts data, and auto-compares vendors in seconds.",
  },
  {
    icon: BarChart3,
    title: "AI Comparison Engine",
    description:
      "Weighted scoring algorithm ranks vendors on price, delivery, warranty, and risk.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description:
      "Get AI-powered vendor recommendations with 96% confidence scores.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description:
      "Detect duplicate invoices, fake GST numbers, and suspicious pricing automatically.",
  },
  {
    icon: FileText,
    title: "One-Click Negotiation",
    description:
      "AI generates professional negotiation emails to get better pricing.",
  },
  {
    icon: Zap,
    title: "Approval Workflows",
    description:
      "Multi-level approvals with timeline tracking and complete audit trails.",
  },
];

const stats = [
  { value: "40%", label: "Cost Savings" },
  { value: "10x", label: "Faster Procurement" },
  { value: "96%", label: "AI Accuracy" },
  { value: "500+", label: "Vendors Managed" },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">
              Vendor<span className="text-gradient">Bridge</span>{" "}
              <span className="text-xs font-medium text-muted-foreground">
                AI
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Results
            </a>
            <a
              href="#demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Link href="/dashboard">
              <Button
                variant="default"
                className="gradient-primary border-0 text-white hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Procurement Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Procurement,{" "}
            <span className="text-gradient">Reimagined</span>
            <br />
            with AI
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            VendorBridge AI automates vendor management, quotation comparison,
            and procurement decisions. Built for enterprises that demand
            intelligence, not just software.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gradient-primary border-0 text-white text-lg px-8 py-6 hover:opacity-90 transition-all glow hover:glow-strong"
              >
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/vendor-portal">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 glass"
              >
                <Users className="mr-2 w-5 h-5" />
                Vendor Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center glass rounded-2xl p-6 animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade{" "}
              <span className="text-gradient">AI Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature designed to save time, reduce costs, and eliminate
              procurement risks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group glass rounded-2xl p-6 hover:glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Demo / CTA ───── */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Procurement?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Experience AI-powered vendor comparison, fraud detection, and
                smart negotiations. Built to compete with SAP Ariba and Oracle.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="gradient-primary border-0 text-white text-lg px-8 py-6 hover:opacity-90 glow"
                  >
                    <LayoutDashboard className="mr-2" />
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  No credit card
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Free demo
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Enterprise ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">
              VendorBridge AI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VendorBridge AI. Built for the
            future of procurement.
          </p>
        </div>
      </footer>
    </div>
  );
}
