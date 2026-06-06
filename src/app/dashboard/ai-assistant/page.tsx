"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  FileText,
  Users,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: "Show cheapest laptop vendor", icon: Users },
  { label: "Which vendor has best delivery?", icon: ShoppingCart },
  { label: "Generate spending report", icon: BarChart3 },
  { label: "Show delayed vendors", icon: FileText },
];

const aiResponses: Record<string, string> = {
  "show cheapest laptop vendor": `## 💰 Cheapest Laptop Vendor Analysis

Based on the current quotations for **RFQ-2025-001 (Enterprise Laptops — 100 Units)**:

| Rank | Vendor | Unit Price | Total | Delivery |
|------|--------|-----------|-------|----------|
| 🥇 | **Dell Technologies** | ₹68,500 | ₹68,50,000 | 15 days |
| 🥈 | Lenovo India | ₹70,500 | ₹70,50,000 | 25 days |
| 🥉 | HP Enterprise | ₹72,000 | ₹72,00,000 | 20 days |

### 💡 AI Recommendation
**Dell Technologies** offers the best price-to-value ratio with:
- ✅ Lowest unit price (₹68,500)
- ✅ Fastest delivery (15 business days)
- ✅ Strongest warranty (3yr onsite)
- ✅ Best vendor health score (94/100)

**Potential savings vs HP:** ₹3,50,000 (4.9%)`,

  "which vendor has best delivery": `## 🚚 Vendor Delivery Performance

Based on historical data across all procurement categories:

| Vendor | On-Time Rate | Avg Delivery | Score |
|--------|-------------|-------------|-------|
| 🥇 **Dell Technologies** | 96% | 12 days | 94/100 |
| 🥈 SecureNet Infra | 92% | 14 days | 90/100 |
| 🥉 HP Enterprise | 88% | 18 days | 88/100 |
| 4th | Wipro Furniture | 85% | 16 days | 81/100 |
| 5th | Lenovo India | 78% | 22 days | 80/100 |

### 📊 Key Insight
**Dell Technologies** consistently delivers ahead of schedule with a 96% on-time rate over the past 12 months. They have the highest delivery reliability score in our system.`,

  "generate spending report": `## 📊 Procurement Spending Report — FY 2025

### Overview
| Metric | Value |
|--------|-------|
| Total Spend (YTD) | ₹3,29,00,000 |
| Total Savings | ₹21,00,000 |
| Avg. Cost per PO | ₹4,70,000 |
| Active Vendors | 6 |

### Category Breakdown
| Category | Spend | % of Total |
|----------|-------|-----------|
| IT Hardware | ₹1,40,50,000 | 52% |
| Office Furniture | ₹42,00,000 | 16% |
| Network Infra | ₹38,00,000 | 14% |
| Office Supplies | ₹26,00,000 | 10% |
| IT Services | ₹21,50,000 | 8% |

### 💡 AI Insights
- IT Hardware spending increased 18% vs last quarter
- **Negotiation opportunity:** Bulk pricing could save ₹5,00,000+ on IT Hardware
- 3 vendors have overdue deliveries — consider penalty clauses`,

  "show delayed vendors": `## ⚠️ Delayed Vendors Report

### Currently Delayed
| Vendor | Order | Expected | Delay | Impact |
|--------|-------|----------|-------|--------|
| 🔴 **Lenovo India** | PO-2024-089 | 15 May | 22 days | High |
| 🟡 **Wipro Furniture** | PO-2024-092 | 28 May | 9 days | Medium |

### Risk Assessment
- **Lenovo India**: 3rd delay in 6 months. Reliability score dropped to 80/100.
  - 🔔 Recommend: Issue formal warning + consider alternative vendors
- **Wipro Furniture**: First delay. Weather-related logistics issue.
  - 📋 Recommend: Monitor closely, no action needed yet

### Historical Delay Patterns
- Q1 2025: 4 delays across 3 vendors
- Q2 2025: 2 delays across 2 vendors (improving trend ✅)`,

  default: `I can help you with procurement queries! Try asking me:

- "Show cheapest laptop vendor"
- "Which vendor has best delivery history?"
- "Generate spending report"
- "Show delayed vendors"
- "Compare quotations for RFQ-2025-001"
- "What is the total procurement spend this month?"

I have access to all vendor data, RFQs, quotations, purchase orders, and invoices in the system.`,
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your **AI Procurement Assistant**. I can help you with vendor analysis, spending reports, RFQ management, and procurement insights.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const key = query.toLowerCase().trim();
      const responseContent =
        aiResponses[key] || aiResponses["default"];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            AI Procurement Assistant
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ask anything about vendors, spending, RFQs, and procurement
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          Powered by GPT-4o
        </Badge>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 border-border/50 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "gradient-primary"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[85%] rounded-2xl p-4 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted/50 border border-border/50"
                  }`}
                >
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none prose-table:text-xs prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-table:border prose-table:border-border/50"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(
                          /\|(.+)\|/g,
                          (match) => `<code>${match}</code>`
                        ),
                    }}
                  />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/50 border border-border/50 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Analyzing procurement data...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1 bg-muted/30 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                onClick={() => handleSend(action.label)}
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask about vendors, RFQs, spending..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-muted/30 border-0 h-11 rounded-xl"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="gradient-primary text-white border-0 h-11 px-5 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
