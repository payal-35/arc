"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FileText,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Key,
  Globe,
  Loader2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { toast } from "~/components/ui/use-toast"

interface AdminInfo {
  admin_id: string
  tenant_id: string
  iat: number
  exp: number
}

interface DashboardStats {
  totalPurposes: number
  activePurposes: number
  totalConsents: number
  consentRate: number
  openGrievances: number
  resolvedGrievances: number
  dpdpComplianceScore: number
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPurposes: 0,
    activePurposes: 0,
    totalConsents: 0,
    consentRate: 0,
    openGrievances: 0,
    resolvedGrievances: 0,
    dpdpComplianceScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    // For now, we'll simulate loading and then set some example data
    const timer = setTimeout(() => {
      setStats({
        totalPurposes: 12,
        activePurposes: 8,
        totalConsents: 1458,
        consentRate: 87,
        openGrievances: 3,
        resolvedGrievances: 24,
        dpdpComplianceScore: 92,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalPurposes: 12,
        activePurposes: 8,
        totalConsents: 1472, // Updated value
        consentRate: 88, // Updated value
        openGrievances: 2, // Updated value
        resolvedGrievances: 25, // Updated value
        dpdpComplianceScore: 93, // Updated value
      })
      setRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "Dashboard data has been updated successfully.",
      })
    }, 1500)
  }

  const handleViewFullReport = () => {
    toast({
      title: "Compliance Report",
      description: "Generating full compliance report...",
    })
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your compliance report is ready to view.",
      })
    }, 2000)
  }

  const handleViewAllActivities = () => {
    toast({
      title: "All Activities",
      description: "Loading all activities...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-blue-700">Total Purposes</CardTitle>
      {/* Animated Icon */}
      <FileText className="h-5 w-5 text-blue-600 animate-pulseScale transition-transform duration-300 hover:scale-110" />

    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-800">
        {loading ? "-" : stats.totalPurposes}
      </div>
      <p className="text-xs text-blue-600">
        {loading ? "Loading..." : `${stats.activePurposes} active purposes`}
      </p>
    </CardContent>
  </Card>


<Card className="bg-green-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-green-700">Consent Rate</CardTitle>
      <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-green-800">
        {loading ? "-" : `${stats.consentRate}%`}
      </div>
      <p className="text-xs text-green-600">
        {loading ? "Loading..." : `${stats.totalConsents} total consents`}
      </p>
    </CardContent>
  </Card>

  {/* Grievances */}
  <Card className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-amber-700">Grievances</CardTitle>
      <MessageSquare className="h-5 w-5 text-amber-500 animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-amber-800">
        {loading ? "-" : stats.openGrievances}
      </div>
      <p className="text-xs text-amber-600">
        {loading ? "Loading..." : `${stats.resolvedGrievances} resolved`}
      </p>
    </CardContent>
  </Card>

  {/* DPDP Compliance */}
  <Card className="bg-purple-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-purple-700">DPDP Compliance</CardTitle>
      <ShieldCheck className="h-5 w-5 text-purple-500 animate-float" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-purple-800">
        {loading ? "-" : `${stats.dpdpComplianceScore}%`}
      </div>
      <Progress
        value={loading ? 0 : stats.dpdpComplianceScore}
        className="h-2 mt-2 bg-purple-100 dark:bg-purple-950"
      >
        <div
          className="h-full bg-purple-500"
          style={{ width: `${loading ? 0 : stats.dpdpComplianceScore}%` }}
        />
      </Progress>
    </CardContent>
  </Card>
</div>
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* DPDP Compliance Overview Card */}
  <Card className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-primary">DPDP Compliance Overview</CardTitle>
      <CardDescription>
        Your organization's compliance with Digital Personal Data Protection regulations
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { icon: CheckCircle, label: "Consent Management", status: "Compliant", color: "green" },
          { icon: CheckCircle, label: "Data Access Requests", status: "Compliant", color: "green" },
          { icon: CheckCircle, label: "Grievance Handling", status: "Compliant", color: "green" },
          { icon: AlertTriangle, label: "Data Retention Policies", status: "Needs Review", color: "yellow" },
          { icon: Clock, label: "Periodic Consent Review", status: "In Progress", color: "blue" },
        ].map(({ icon: Icon, label, status, color }, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-md border bg-${color}-50 dark:bg-${color}-950/20 border-${color}-200 dark:border-${color}-800`}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 text-${color}-500 mr-2`} />
              <span>{label}</span>
            </div>
            <span className={`text-${color}-600 font-medium`}>{status}</span>
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleViewFullReport}>
        View Full Compliance Report
      </Button>
    </CardFooter>
  </Card>

  {/* Recent Activities Card */}
  <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-secondary-foreground">Recent Activities</CardTitle>
      <CardDescription>Latest actions in your organization</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          {
            icon: FileText,
            title: "New purpose created",
            time: "Today, 10:30 AM",
            color: "blue",
          },
          {
            icon: CheckCircle,
            title: "Grievance resolved",
            time: "Yesterday, 4:15 PM",
            color: "green",
          },
          {
            icon: Key,
            title: "API key generated",
            time: "Yesterday, 2:45 PM",
            color: "purple",
          },
          {
            icon: Globe,
            title: "Webhook configured",
            time: "May 21, 11:20 AM",
            color: "orange",
          },
          {
            icon: MessageSquare,
            title: "New grievance submitted",
            time: "May 20, 9:05 AM",
            color: "red",
          },
        ].map(({ icon: Icon, title, time, color }, i) => (
          <div
            key={i}
            className={`flex items-center rounded-md border pl-4 py-2 bg-${color}-50 dark:bg-${color}-950/20 border-${color}-200 dark:border-${color}-800`}
          >
            <div className={`h-8 w-8 rounded-full bg-${color}-100 dark:bg-${color}-900 flex items-center justify-center mr-3`}>
              <Icon className={`h-4 w-4 text-${color}-500`} />
            </div>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button
  className="w-full bg-zinc-800 text-white hover:bg-zinc-700"
  onClick={handleViewAllActivities}
>
  View All Activities
</Button>

    </CardFooter>
  </Card>
</div>
</div>
)
}