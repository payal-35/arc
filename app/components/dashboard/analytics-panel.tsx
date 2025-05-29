"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Progress } from "~/components/ui/progress"
import { Calendar, Download, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "~/components/ui/use-toast"

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const refreshData = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Analytics data has been updated.",
      })
    }, 1500)
  }

  const exportReport = () => {
    setExportingReport(true)
    setTimeout(() => {
      setExportingReport(false)
      toast({
        title: "Report exported",
        description: "Your analytics report has been generated and is ready for download.",
      })
    }, 2000)
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Time range updated",
        description: `Analytics data updated for ${
          value === "7d"
            ? "last 7 days"
            : value === "30d"
              ? "last 30 days"
              : value === "90d"
                ? "last 90 days"
                : "last year"
        }.`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">Analytics</h2>
          <p className="text-muted-foreground">Insights and metrics about your DPDP compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing || loading}>
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button onClick={exportReport} disabled={exportingReport || loading}>
            {exportingReport ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consents">Consents</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                  <Progress value={75} className="h-1 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Consent Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                  <Progress value={87} className="h-1 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Data Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">-8% from last month</p>
                  <Progress value={45} className="h-1 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">DPDP Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                  <Progress value={92} className="h-1 mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consents">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Consent Metrics</CardTitle>
                  <CardDescription>Consent rates by purpose over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Consent rate chart would be displayed here</p>
                    <p className="text-sm">
                      Showing data for the last{" "}
                      {timeRange === "7d"
                        ? "7 days"
                        : timeRange === "30d"
                          ? "30 days"
                          : timeRange === "90d"
                            ? "90 days"
                            : "year"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consent by Purpose</CardTitle>
                  <CardDescription>Breakdown of consent rates by purpose</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Essential Services</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Analytics</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Marketing</span>
                        <span className="text-sm font-medium">64%</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Third-party Sharing</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consent Changes</CardTitle>
                  <CardDescription>Consent changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consents Given</span>
                      <span className="text-sm font-medium">187</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consents Withdrawn</span>
                      <span className="text-sm font-medium">32</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consent Updates</span>
                      <span className="text-sm font-medium">56</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Net Change</span>
                      <span className="text-sm font-medium text-green-600">+155</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Requests by Type</CardTitle>
                  <CardDescription>Breakdown of data requests by type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Data requests chart would be displayed here</p>
                    <p className="text-sm">
                      Showing data for the last{" "}
                      {timeRange === "7d"
                        ? "7 days"
                        : timeRange === "30d"
                          ? "30 days"
                          : timeRange === "90d"
                            ? "90 days"
                            : "year"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Request Resolution Time</CardTitle>
                  <CardDescription>Average time to resolve data requests</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Resolution time chart would be displayed here</p>
                    <p className="text-sm">
                      Showing data for the last{" "}
                      {timeRange === "7d"
                        ? "7 days"
                        : timeRange === "30d"
                          ? "30 days"
                          : timeRange === "90d"
                            ? "90 days"
                            : "year"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Request Metrics</CardTitle>
                  <CardDescription>Key metrics for data requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. Resolution Time</p>
                      <p className="text-2xl font-bold">2.3 days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Pending Requests</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>DPDP Compliance Score</CardTitle>
                  <CardDescription>Overall compliance with DPDP regulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative h-40 w-40 flex items-center justify-center">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted-foreground/20"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - 0.92)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute text-3xl font-bold">92%</div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Your organization is well-compliant with DPDP regulations
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance by Category</CardTitle>
                  <CardDescription>Breakdown of compliance by regulatory category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Consent Management</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Data Access Requests</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Grievance Handling</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Data Retention</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Documentation</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Compliance Improvement Opportunities</CardTitle>
                  <CardDescription>Areas where compliance can be improved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Data Retention Policy Implementation</h4>
                        <p className="text-sm text-muted-foreground">
                          Implement automated data retention policies to ensure data is not kept longer than necessary.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Documentation Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Update privacy policy and data processing documentation to reflect recent DPDP amendments.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Staff Training</h4>
                        <p className="text-sm text-muted-foreground">
                          Conduct refresher training for staff on DPDP compliance and data handling procedures.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
