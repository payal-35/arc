"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  User,
  Globe,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

interface AuditLog {
  logId: string
  userId: string
  tenantId: string
  purposeId?: string
  actionType: string
  timestamp: string
  consentStatus?: string
  initiator: string
  sourceIP: string
  geoRegion?: string
  jurisdiction?: string
  auditHash: string
  previousHash?: string
  userName?: string
  purposeName?: string
}

export default function AuditLogsPanel() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [currentLog, setCurrentLog] = useState<AuditLog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [initiatorFilter, setInitiatorFilter] = useState<string>("all")

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    const timer = setTimeout(() => {
      const mockLogs: AuditLog[] = [
        {
          logId: "1",
          userId: "user-123",
          userName: "John Doe",
          tenantId: "tenant-456",
          purposeId: "purpose-789",
          purposeName: "Marketing Communications",
          actionType: "   Consents Granted",
          timestamp: "2023-05-15T10:30:00Z",
          consentStatus: "granted",
          initiator: "user",
          sourceIP: "192.168.1.1",
          geoRegion: "US-CA",
          jurisdiction: "CCPA",
          auditHash: "hash123",
          previousHash: "hash122",
        },
        {
          logId: "2",
          userId: "user-123",
          userName: "John Doe",
          tenantId: "tenant-456",
          purposeId: "purpose-790",
          purposeName: "Analytics",
          actionType: "Revoke Consentd",
          timestamp: "2023-05-16T14:20:00Z",
          consentStatus: "revoked",
          initiator: "user",
          sourceIP: "192.168.1.1",
          geoRegion: "US-CA",
          jurisdiction: "CCPA",
          auditHash: "hash124",
          previousHash: "hash123",
        },
        {
          logId: "3",
          userId: "user-456",
          userName: "Jane Smith",
          tenantId: "tenant-456",
          purposeId: "purpose-789",
          purposeName: "Marketing Communications",
          actionType: "   Consents Granted",
          timestamp: "2023-05-17T09:45:00Z",
          consentStatus: "granted",
          initiator: "user",
          sourceIP: "10.0.0.1",
          geoRegion: "EU-DE",
          jurisdiction: "GDPR",
          auditHash: "hash125",
          previousHash: "hash124",
        },
        {
          logId: "4",
          userId: "user-789",
          userName: "Alice Johnson",
          tenantId: "tenant-456",
          actionType: "user.login",
          timestamp: "2023-05-18T11:30:00Z",
          initiator: "system",
          sourceIP: "10.0.0.2",
          geoRegion: "EU-FR",
          jurisdiction: "GDPR",
          auditHash: "hash126",
          previousHash: "hash125",
        },
        {
          logId: "5",
          userId: "user-123",
          userName: "John Doe",
          tenantId: "tenant-456",
          actionType: "dsr.created",
          timestamp: "2023-05-19T16:15:00Z",
          initiator: "user",
          sourceIP: "192.168.1.1",
          geoRegion: "US-CA",
          jurisdiction: "CCPA",
          auditHash: "hash127",
          previousHash: "hash126",
        },
        {
          logId: "6",
          userId: "admin-001",
          userName: "Admin User",
          tenantId: "tenant-456",
          purposeId: "purpose-791",
          purposeName: "Third-party Sharing",
          actionType: "Create Purposed",
          timestamp: "2023-05-20T08:45:00Z",
          initiator: "admin",
          sourceIP: "10.0.0.3",
          geoRegion: "US-NY",
          jurisdiction: "CCPA",
          auditHash: "hash128",
          previousHash: "hash127",
        },
        {
          logId: "7",
          userId: "system",
          userName: "System",
          tenantId: "tenant-456",
          actionType: "system.backup",
          timestamp: "2023-05-21T02:30:00Z",
          initiator: "system",
          sourceIP: "10.0.0.4",
          geoRegion: "US-VA",
          jurisdiction: "CCPA",
          auditHash: "hash129",
          previousHash: "hash128",
        },
      ]

      setAuditLogs(mockLogs)
      setFilteredLogs(mockLogs)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = auditLogs

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.userName?.toLowerCase().includes(query) ||
          log.actionType.toLowerCase().includes(query) ||
          log.sourceIP.toLowerCase().includes(query) ||
          log.geoRegion?.toLowerCase().includes(query) ||
          log.purposeName?.toLowerCase().includes(query),
      )
    }

    // Action type filter
    if (actionTypeFilter !== "all") {
      result = result.filter((log) => {
        const actionCategory = log.actionType.split(".")[0]
        return actionTypeFilter === actionCategory
      })
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const cutoff = new Date()

      switch (dateFilter) {
        case "today":
          cutoff.setHours(0, 0, 0, 0)
          break
        case "yesterday":
          cutoff.setDate(now.getDate() - 1)
          cutoff.setHours(0, 0, 0, 0)
          const yesterdayEnd = new Date(cutoff)
          yesterdayEnd.setDate(yesterdayEnd.getDate() + 1)
          result = result.filter((log) => {
            const logDate = new Date(log.timestamp)
            return logDate >= cutoff && logDate < yesterdayEnd
          })
          break
        case "week":
          cutoff.setDate(now.getDate() - 7)
          break
        case "month":
          cutoff.setMonth(now.getMonth() - 1)
          break
        default:
          break
      }

      if (dateFilter !== "yesterday") {
        result = result.filter((log) => {
          const logDate = new Date(log.timestamp)
          return logDate >= cutoff
        })
      }
    }

    // Initiator filter
    if (initiatorFilter !== "all") {
      result = result.filter((log) => log.initiator === initiatorFilter)
    }

    setFilteredLogs(result)
  }, [searchQuery, actionTypeFilter, dateFilter, initiatorFilter, auditLogs])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP p")
  }

  const getActionTypeIcon = (actionType: string) => {
    const actionCategory = actionType.split(".")[0]
    const actionAction = actionType.split(".")[1]

    switch (actionCategory) {
      case "consent":
        if (actionAction === "granted") return <CheckCircle className="h-4 w-4 text-green-500" />
        if (actionAction === "revoked") return <XCircle className="h-4 w-4 text-red-500" />
        return <FileText className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "dsr":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "purpose":
        return <Shield className="h-4 w-4 text-indigo-500" />
      case "system":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionTypeBadge = (actionType: string) => {
    const actionCategory = actionType.split(".")[0]
    const actionAction = actionType.split(".")[1]

    let variant: "default" | "outline" | "secondary" | "destructive" | "success" = "outline"

    switch (actionCategory) {
      case "consent":
        if (actionAction === "granted") variant = "success"
        if (actionAction === "revoked") variant = "destructive"
        break
      case "user":
        variant = "secondary"
        break
      case "dsr":
        variant = "default"
        break
      case "purpose":
        variant = "outline"
        break
      case "system":
        variant = "secondary"
        break
    }

    return (
      <Badge variant={variant} className="capitalize">
        {actionType.replace(".", ": ")}
      </Badge>
    )
  }

  const openDetailsDialog = (log: AuditLog) => {
    setCurrentLog(log)
    setIsDetailsDialogOpen(true)
  }

  const exportLogs = (format: string) => {
    // In a real implementation, this would generate and download a file
    // For now, we'll just show a toast message
    alert(`Logs exported in ${format.toUpperCase()} format`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">Audit Logs</h2>
          <p className="text-muted-foreground">Track all actions and changes in the ARC platform</p>
        </div>
        <div className="flex space-x-2">
          <Select onValueChange={exportLogs}>
            <SelectTrigger className="w-[180px]">
              <Download className="mr-2 h-4 w-4" />
              <span>Export Logs</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export as CSV</SelectItem>
              <SelectItem value="json">Export as JSON</SelectItem>
              <SelectItem value="pdf">Export as PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-blue-800">Audit Trail</CardTitle>
          <CardDescription>{filteredLogs.length} log entries found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Action</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="consent">Consent</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="dsr">DSR</SelectItem>
                    <SelectItem value="purpose">Purpose</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={initiatorFilter} onValueChange={setInitiatorFilter}>
                  <SelectTrigger className="w-[130px]">
                    <User className="mr-2 h-4 w-4" />
                    <span>Initiator</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p>Loading audit logs...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table className="w-full text-sm border border-border rounded-xl overflow-hidden">
  <TableHeader>
    <TableRow className="bg-muted text-foreground dark:bg-muted/30 dark:text-foreground font-semibold">
      <TableHead>Action</TableHead>
      <TableHead>User</TableHead>
      <TableHead>Timestamp</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Initiator</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredLogs.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={5}
          className="text-center py-8 text-muted-foreground bg-background dark:bg-muted/10"
        >
          No audit logs found matching your filters
        </TableCell>
      </TableRow>
    ) : (
      filteredLogs.map((log, index) => (
        <TableRow
          key={log.logId}
          onClick={() => openDetailsDialog(log)}
          className={`cursor-pointer transition-colors ${
            index % 2 === 0
              ? "bg-muted/50 dark:bg-muted/10"
              : "bg-background dark:bg-muted/5"
          } hover:bg-blue-50 dark:hover:bg-blue-900/30`}
        >
          <TableCell>
            <div className="flex items-center gap-2">
              {getActionTypeIcon(log.actionType)}
              <span className="text-sm font-medium">{getActionTypeBadge(log.actionType)}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="font-medium">{log.userName || log.userId}</div>
            {log.purposeName && (
              <div className="text-xs text-muted-foreground">Purpose: {log.purposeName}</div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {formatDate(log.timestamp)}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
              {log.geoRegion || "Unknown"}
            </div>
            {log.jurisdiction && (
              <div className="text-xs text-muted-foreground">{log.jurisdiction}</div>
            )}
          </TableCell>
          <TableCell>
            <Badge
              variant={
                log.initiator === "system"
                  ? "secondary"
                  : log.initiator === "admin"
                    ? "outline"
                    : "default"
              }
              className="capitalize"
            >
              {log.initiator}
            </Badge>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
 </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Detailed information about this audit log entry</DialogDescription>
          </DialogHeader>
          {currentLog && (
            <div className="py-4 space-y-6">
              <div className="flex items-center space-x-2">
                {getActionTypeIcon(currentLog.actionType)}
                <h3 className="text-lg font-medium">{getActionTypeBadge(currentLog.actionType)}</h3>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="user">User & Purpose</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p>{formatDate(currentLog.timestamp)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Initiator</p>
                      <Badge
                        variant={
                          currentLog.initiator === "system"
                            ? "secondary"
                            : currentLog.initiator === "admin"
                              ? "outline"
                              : "default"
                        }
                        className="capitalize"
                      >
                        {currentLog.initiator}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p>{currentLog.geoRegion || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Jurisdiction</p>
                      <p>{currentLog.jurisdiction || "Not specified"}</p>
                    </div>
                    {currentLog.consentStatus && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Consent Status</p>
                        <Badge
                          variant={currentLog.consentStatus === "granted" ? "success" : "destructive"}
                          className="capitalize"
                        >
                          {currentLog.consentStatus}
                        </Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="user" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">User Name</p>
                      <p>{currentLog.userName || "Not available"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm">{currentLog.userId}</p>
                    </div>
                    {currentLog.purposeName && (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Purpose Name</p>
                          <p>{currentLog.purposeName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Purpose ID</p>
                          <p className="font-mono text-sm">{currentLog.purposeId}</p>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                      <p className="font-mono text-sm">{currentLog.logId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Tenant ID</p>
                      <p className="font-mono text-sm">{currentLog.tenantId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Source IP</p>
                      <p className="font-mono text-sm">{currentLog.sourceIP}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Audit Hash</p>
                      <p className="font-mono text-sm truncate" title={currentLog.auditHash}>
                        {currentLog.auditHash}
                      </p>
                    </div>
                    {currentLog.previousHash && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Previous Hash</p>
                        <p className="font-mono text-sm truncate" title={currentLog.previousHash}>
                          {currentLog.previousHash}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
