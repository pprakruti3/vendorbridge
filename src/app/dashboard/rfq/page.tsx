"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Send,
  Users,
  Calendar,
  IndianRupee,
  Clock,
  ArrowRight,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockRFQs } from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getPriorityColor,
} from "@/lib/helpers";

export default function RFQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRFQs = mockRFQs.filter((rfq) => {
    const matchesSearch =
      rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getResponseRate = (rfq: (typeof mockRFQs)[0]) => {
    if (rfq.vendors.length === 0) return 0;
    const responded = rfq.vendors.filter(
      (v) => v.status === "RESPONDED"
    ).length;
    return Math.round((responded / rfq.vendors.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQ Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage requests for quotation
          </p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button className="gradient-primary border-0 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create RFQ
              </Button>
            }
          />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New RFQ</DialogTitle>
              <DialogDescription>
                Define your procurement requirements and invite vendors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>RFQ Title</Label>
                <Input placeholder="e.g. Enterprise Laptops — 100 Units" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your requirements in detail..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget (₹)</Label>
                <Input type="number" placeholder="e.g. 7500000" />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Hardware">IT Hardware</SelectItem>
                    <SelectItem value="Office Furniture">
                      Office Furniture
                    </SelectItem>
                    <SelectItem value="Network Infrastructure">
                      Network Infrastructure
                    </SelectItem>
                    <SelectItem value="Office Supplies">
                      Office Supplies
                    </SelectItem>
                    <SelectItem value="IT Services">IT Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Save as Draft</Button>
              <Button className="gradient-primary text-white border-0">
                Create & Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total RFQs",
            value: mockRFQs.length,
            icon: FileText,
            color: "text-primary",
          },
          {
            label: "Published",
            value: mockRFQs.filter((r) => r.status === "PUBLISHED").length,
            icon: Send,
            color: "text-info",
          },
          {
            label: "Draft",
            value: mockRFQs.filter((r) => r.status === "DRAFT").length,
            icon: Clock,
            color: "text-warning",
          },
          {
            label: "Closed",
            value: mockRFQs.filter((r) => r.status === "CLOSED").length,
            icon: Eye,
            color: "text-success",
          },
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

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search RFQs..."
            className="pl-10 bg-muted/30 border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
          <SelectTrigger className="w-[150px] bg-muted/30 border-0">
            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="AWARDED">Awarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RFQ Cards */}
      <div className="grid gap-4">
        {filteredRFQs.map((rfq, i) => (
          <Card
            key={rfq.id}
            className="border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {rfq.rfqNumber}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${getStatusColor(rfq.status)}`}
                    >
                      {rfq.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${getPriorityColor(rfq.priority)}`}
                    >
                      {rfq.priority}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                    {rfq.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {rfq.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Budget: {formatCurrency(rfq.budget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {formatDate(rfq.deadline)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {rfq.vendors.length} vendors invited
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {rfq.items.length} items
                    </span>
                  </div>
                </div>

                {/* Response Progress */}
                <div className="flex items-center gap-6">
                  {rfq.vendors.length > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {getResponseRate(rfq)}%
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Response Rate
                      </p>
                      <Progress
                        value={getResponseRate(rfq)}
                        className="h-1 w-20 mt-1"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {rfq.status === "PUBLISHED" &&
                      rfq.vendors.filter((v) => v.status === "RESPONDED")
                        .length >= 2 && (
                        <Link href={`/dashboard/compare?rfqId=${rfq.id}`}>
                          <Button
                            size="sm"
                            className="gradient-primary text-white border-0 text-xs h-8"
                          >
                            AI Compare
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      )}

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-3.5 h-3.5 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-3.5 h-3.5 mr-2" /> Invite Vendors
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="w-3.5 h-3.5 mr-2" /> Send Reminders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel RFQ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
