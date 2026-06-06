"use client";

import { AlertTriangle, Eye, Shield, CheckCircle2, Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockFraudAlerts } from "@/lib/mock-data";
import { getSeverityColor, getStatusColor, formatDateTime } from "@/lib/helpers";

export default function FraudAlertsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> AI Fraud Detection
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Automated detection of duplicate invoices, fake GST, collusion, and abnormal pricing
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Alerts", value: mockFraudAlerts.filter(a => a.status === "OPEN").length, color: "text-destructive" },
          { label: "Investigating", value: mockFraudAlerts.filter(a => a.status === "INVESTIGATING").length, color: "text-warning" },
          { label: "Resolved", value: mockFraudAlerts.filter(a => a.status === "RESOLVED").length, color: "text-success" },
          { label: "Total Alerts", value: mockFraudAlerts.length, color: "text-primary" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {mockFraudAlerts.map((alert, i) => (
          <Card
            key={alert.id}
            className={`border-border/50 animate-slide-up ${
              alert.severity === "CRITICAL" ? "border-l-4 border-l-destructive" : alert.severity === "HIGH" ? "border-l-4 border-l-destructive/60" : ""
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === "CRITICAL" ? "bg-destructive/15 text-destructive" :
                  alert.severity === "HIGH" ? "bg-destructive/10 text-destructive" :
                  "bg-warning/10 text-warning"
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{alert.alertType.replace(/_/g, " ")}</h3>
                    <Badge variant="outline" className={`text-[10px] ${getSeverityColor(alert.severity)}`}>{alert.severity}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${getStatusColor(alert.status)}`}>{alert.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Vendor: {alert.vendor?.companyName || "Unknown"}</span>
                    <span>Detected: {formatDateTime(alert.detectedAt)}</span>
                  </div>
                  {alert.evidence && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs font-medium mb-1">Evidence</p>
                      <pre className="text-xs text-muted-foreground font-mono">{JSON.stringify(alert.evidence, null, 2)}</pre>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {alert.status === "OPEN" && (
                    <>
                      <Button size="sm" className="text-xs h-7"><SearchIcon className="w-3 h-3 mr-1" /> Investigate</Button>
                      <Button size="sm" variant="outline" className="text-xs h-7"><CheckCircle2 className="w-3 h-3 mr-1" /> Dismiss</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
