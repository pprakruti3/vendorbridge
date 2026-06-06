"use client";

import { Bell, Check, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/mock-data";
import { getRelativeTime } from "@/lib/helpers";

const typeIcons: Record<string, string> = {
  RFQ: "📋",
  QUOTATION: "📄",
  APPROVAL: "✅",
  PO: "🛒",
  INVOICE: "🧾",
  SYSTEM: "🤖",
};

export default function NotificationsPage() {
  const unread = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notification Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unread} unread notifications
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1">
          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {mockNotifications.map((notif, i) => (
          <Card
            key={notif.id}
            className={`border-border/50 hover:bg-muted/30 transition-all cursor-pointer animate-slide-up ${
              !notif.isRead ? "border-l-2 border-l-primary" : ""
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-2xl">{typeIcons[notif.type] || "📌"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-medium ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.title}
                  </h3>
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(notif.createdAt)}</span>
              <Badge variant="outline" className="text-[10px] shrink-0">{notif.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
