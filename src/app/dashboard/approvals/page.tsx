"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  User,
  FileText,
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockApprovals } from "@/lib/mock-data";
import { getStatusColor, formatDateTime } from "@/lib/helpers";

export default function ApprovalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Approval Workflow</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Multi-level procurement approvals with audit trail
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: mockApprovals.filter((a) => a.status === "PENDING").length, icon: Clock, color: "text-warning" },
          { label: "Approved", value: 15, icon: CheckCircle2, color: "text-success" },
          { label: "Rejected", value: 3, icon: XCircle, color: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {mockApprovals.map((approval, i) => (
          <Card
            key={approval.id}
            className="border-border/50 animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {approval.entityType} Approval — {approval.entityId.toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      Requested on {formatDateTime(approval.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${getStatusColor(approval.status)}`}>
                  {approval.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Approval Timeline */}
              <div className="relative pl-8">
                {approval.steps.map((step, stepIdx) => (
                  <div key={step.id} className="relative pb-6 last:pb-0">
                    {/* Connector Line */}
                    {stepIdx < approval.steps.length - 1 && (
                      <div className="absolute left-[-20px] top-8 w-0.5 h-full bg-border" />
                    )}
                    {/* Step Circle */}
                    <div
                      className={`absolute left-[-28px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        step.status === "APPROVED"
                          ? "bg-success/20 border-success text-success"
                          : step.status === "REJECTED"
                          ? "bg-destructive/20 border-destructive text-destructive"
                          : "bg-warning/20 border-warning text-warning"
                      }`}
                    >
                      {step.status === "APPROVED" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : step.status === "REJECTED" ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Level {step.level}:{" "}
                            {step.level === 1
                              ? "Manager"
                              : step.level === 2
                              ? "Finance"
                              : "CEO"}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${getStatusColor(step.status)}`}
                          >
                            {step.status}
                          </Badge>
                        </div>
                        {step.actionAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(step.actionAt)}
                          </span>
                        )}
                      </div>
                      {step.comments && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {step.comments}
                        </p>
                      )}
                      {step.status === "PENDING" && (
                        <div className="flex items-center gap-2 mt-3">
                          <Textarea
                            placeholder="Add comments..."
                            rows={1}
                            className="text-xs h-8 min-h-0"
                          />
                          <Button
                            size="sm"
                            className="h-8 gradient-primary text-white border-0 text-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                          >
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
