"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your credentials");
      return;
    }
    setIsLoading(true);
    // Simulate authentication
    await new Promise((r) => setTimeout(r, 1400));

    if (email === "procurement@dell.com" && password === "dell@123") {
      toast.success("Welcome back!", {
        description: "Redirecting to your portal…",
      });
      router.push("/vendor-portal");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your email and password.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-info/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-success/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg shadow-primary/25">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">VendorBridge</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vendor Portal Login
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
                </label>
                <input
                  type="email"
                  placeholder="vendor@company.com"
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-primary border-0 text-white h-11 text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-5 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-[11px] font-semibold text-primary flex items-center gap-1 mb-1.5">
                <ShieldCheck className="w-3 h-3" /> Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                <span>Email:</span>
                <span className="font-mono text-foreground">
                  procurement@dell.com
                </span>
                <span>Password:</span>
                <span className="font-mono text-foreground">dell@123</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by VendorBridge AI · Secure & GST-Compliant
        </p>
      </div>
    </div>
  );
}
