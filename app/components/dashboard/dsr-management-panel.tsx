"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { toast } from "~/components/ui/use-toast"
import {
  Search,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Filter,
  RefreshCw,
} from "lucide-react"

interface DSRRequest {
  id: string
  userId: string
  tenantId: string
  type: "access" | "deletion" | "correction" | "portability" | "objection" | "restriction"
  status: "pending" | "processing" | "completed" | "rejected" | "expired"
  requestedAt: string
  processedAt?: string
  resolutionNote?: string
  userEmail?: string
  userName?: string
  dataCategories?: string[]
  priority?: "low" | "medium" | "high" | "urgent"
  deadline?: string
  assignedTo?: string
}

interface DSRActivity {
  id: string
  requestId: string
  timestamp: string
  action: string
  performedBy: string
  notes?: string
  statusChange?: {
    from: string
    to: string
  }
}

export default function DSRManagementPanel() {
  const [requests, setRequests] = useState<DSRRequest[]>([])
  const [activities, setActivities] = useState<Record<string, DSRActivity[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<DSRRequest | null>(null)
  const [resolution, setResolution] = useState("")
  const [newStatus, setNewStatus] = useState<string>("")
  const [assignee, setAssignee] = useState<string>("")
  const [activeTab, setActiveTab] = useState("details")
  const [exportFormat, setExportFormat] = useState<string>("csv")
  const [sortField, setSortField] = useState<string>("requestedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    // For now, we'll simulate loading and then set some example data
    const timer = setTimeout(() => {
      const mockRequests: DSRRequest[] = [
        {
          id: "DSR-2023-001",
          userId: "user-123456",
          tenantId: "tenant-abcdef",
          type: "access",
          status: "pending",
          requestedAt: "2023-05-15T09:30:00Z",
          userEmail: "john.doe@example.com",
          userName: "John Doe",
          dataCategories: ["profile", "activity", "preferences"],
          priority: "medium",
          deadline: "2023-06-14T09:30:00Z",
        },
        {
          id: "DSR-2023-002",
          userId: "user-789012",
          tenantId: "tenant-abcdef",
          type: "deletion",
          status: "processing",
          requestedAt: "2023-05-10T14:15:00Z",
          processedAt: "2023-05-11T10:20:00Z",
          userEmail: "jane.smith@example.com",
          userName: "Jane Smith",
          dataCategories: ["profile", "payment", "communications"],
          priority: "high",
          deadline: "2023-06-09T14:15:00Z",
          assignedTo: "privacy-officer-1",
        },
        {
          id: "DSR-2023-003",
          userId: "user-345678",
          tenantId: "tenant-abcdef",
          type: "portability",
          status: "completed",
          requestedAt: "2023-05-05T11:45:00Z",
          processedAt: "2023-05-08T16:30:00Z",
          resolutionNote: "All data exported in JSON format and provided via secure download link.",
          userEmail: "robert.johnson@example.com",
          userName: "Robert Johnson",
          dataCategories: ["profile", "activity", "content"],
          priority: "low",
          deadline: "2023-06-04T11:45:00Z",
          assignedTo: "privacy-officer-2",
        },
        {
          id: "DSR-2023-004",
          userId: "user-901234",
          tenantId: "tenant-abcdef",
          type: "correction",
          status: "rejected",
          requestedAt: "2023-05-01T16:20:00Z",
          processedAt: "2023-05-03T09:15:00Z",
          resolutionNote: "Request rejected as the data correction requested conflicts with legal requirements.",
          userEmail: "sarah.williams@example.com",
          userName: "Sarah Williams",
          dataCategories: ["profile"],
          priority: "medium",
          deadline: "2023-05-31T16:20:00Z",
          assignedTo: "privacy-officer-1",
        },
        {
          id: "DSR-2023-005",
          userId: "user-567890",
          tenantId: "tenant-abcdef",
          type: "objection",
          status: "expired",
          requestedAt: "2023-04-15T10:00:00Z",
          userEmail: "michael.brown@example.com",
          userName: "Michael Brown",
          dataCategories: ["marketing", "profiling"],
          priority: "low",
          deadline: "2023-05-15T10:00:00Z",
        },
        {
          id: "DSR-2023-006",
          userId: "user-123789",
          tenantId: "tenant-abcdef",
          type: "restriction",
          status: "pending",
          requestedAt: "2023-05-18T13:45:00Z",
          userEmail: "emily.davis@example.com",
          userName: "Emily Davis",
          dataCategories: ["profiling", "automated-decisions"],
          priority: "urgent",
          deadline: "2023-06-17T13:45:00Z",
        },
      ]

      // Generate mock activities for each request
      const mockActivities: Record<string, DSRActivity[]> = {}
      mockRequests.forEach((request) => {
        const requestActivities: DSRActivity[] = [
          {
            id: `act-${Math.random().toString(36).substring(2, 10)}`,
            requestId: request.id,
            timestamp: request.requestedAt,
            action: "Request submitted",
            performedBy: request.userName || "User",
            notes: `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} request submitted by user`,
          },
        ]

        if (request.status !== "pending") {
          requestActivities.push({
            id: `act-${Math.random().toString(36).substring(2, 10)}`,
            requestId: request.id,
            timestamp: new Date(new Date(request.requestedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            action: "Request acknowledged",
            performedBy: "Privacy Officer",
            statusChange: {
              from: "pending",
              to: "processing",
            },
          })
        }

        if (request.assignedTo) {
          requestActivities.push({
            id: `act-${Math.random().toString(36).substring(2, 10)}`,
            requestId: request.id,
            timestamp: new Date(new Date(request.requestedAt).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            action: "Request assigned",
            performedBy: "Privacy Manager",
            notes: `Request assigned to ${request.assignedTo}`,
          })
        }

        if (request.status === "completed" || request.status === "rejected") {
          requestActivities.push({
            id: `act-${Math.random().toString(36).substring(2, 10)}`,
            requestId: request.id,
            timestamp: request.processedAt || new Date().toISOString(),
            action: request.status === "completed" ? "Request completed" : "Request rejected",
            performedBy: request.assignedTo || "Privacy Officer",
            notes: request.resolutionNote,
            statusChange: {
              from: "processing",
              to: request.status,
            },
          })
        }

        mockActivities[request.id] = requestActivities.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
      })

      setRequests(mockRequests)
      setActivities(mockActivities)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "warning"
      case "completed":
        return "success"
      case "rejected":
        return "destructive"
      case "expired":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <RefreshCw className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "expired":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "access":
        return "Data Access"
      case "deletion":
        return "Data Deletion"
      case "correction":
        return "Data Correction"
      case "portability":
        return "Data Portability"
      case "objection":
        return "Processing Objection"
      case "restriction":
        return "Processing Restriction"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case "access":
        return <Eye className="h-4 w-4" />
      case "deletion":
        return <XCircle className="h-4 w-4" />
      case "correction":
        return <FileText className="h-4 w-4" />
      case "portability":
        return <Download className="h-4 w-4" />
      case "objection":
        return <AlertCircle className="h-4 w-4" />
      case "restriction":
        return <Filter className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "warning"
      case "urgent":
        return "destructive"
      default:
        return "outline"
    }
  }

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDaysRemainingText = (deadline?: string) => {
    if (!deadline) return "No deadline"

    const daysRemaining = calculateDaysRemaining(deadline)

    if (daysRemaining < 0) {
      return `Overdue by ${Math.abs(daysRemaining)} days`
    } else if (daysRemaining === 0) {
      return "Due today"
    } else if (daysRemaining === 1) {
      return "Due tomorrow"
    } else {
      return `${daysRemaining} days remaining`
    }
  }

  const getDaysRemainingClass = (deadline?: string) => {
    if (!deadline) return ""

    const daysRemaining = calculateDaysRemaining(deadline)

    if (daysRemaining < 0) {
      return "text-destructive font-medium"
    } else if (daysRemaining <= 3) {
      return "text-amber-500 dark:text-amber-400 font-medium"
    } else {
      return "text-green-600 dark:text-green-400"
    }
  }

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.userEmail && request.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.userName && request.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.resolutionNote && request.resolutionNote.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === "all" || request.status === statusFilter
      const matchesType = typeFilter === "all" || request.type === typeFilter
      const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

      // Date filtering
      let matchesDate = true
      if (dateFilter !== "all") {
        const requestDate = new Date(request.requestedAt)
        const today = new Date()

        switch (dateFilter) {
          case "today":
            matchesDate = requestDate.toDateString() === today.toDateString()
            break
          case "yesterday":
            const yesterday = new Date(today)
            yesterday.setDate(today.getDate() - 1)
            matchesDate = requestDate.toDateString() === yesterday.toDateString()
            break
          case "thisWeek":
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            matchesDate = requestDate >= startOfWeek
            break
          case "thisMonth":
            matchesDate =
              requestDate.getMonth() === today.getMonth() && requestDate.getFullYear() === today.getFullYear()
            break
          case "lastMonth":
            const lastMonth = new Date(today)
            lastMonth.setMonth(today.getMonth() - 1)
            matchesDate =
              requestDate.getMonth() === lastMonth.getMonth() && requestDate.getFullYear() === lastMonth.getFullYear()
            break
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDate
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === "requestedAt") {
        return sortDirection === "asc"
          ? new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
          : new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      } else if (sortField === "deadline") {
        if (!a.deadline) return sortDirection === "asc" ? 1 : -1
        if (!b.deadline) return sortDirection === "asc" ? -1 : 1
        return sortDirection === "asc"
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      } else if (sortField === "priority") {
        const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 }
        const aPriority = a.priority ? priorityOrder[a.priority] || 0 : 0
        const bPriority = b.priority ? priorityOrder[b.priority] || 0 : 0
        return sortDirection === "asc" ? aPriority - bPriority : bPriority - aPriority
      }
      // Default sort by ID
      return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    })

  const handleProcessRequest = () => {
    if (!currentRequest || !newStatus) return

    // In a real implementation, this would call your API
    const updatedRequests = requests.map((request) =>
      request.id === currentRequest.id
        ? {
            ...request,
            status: newStatus as any,
            processedAt: new Date().toISOString(),
            resolutionNote: resolution,
          }
        : request,
    )

    // Add a new activity
    const newActivity: DSRActivity = {
      id: `act-${Math.random().toString(36).substring(2, 10)}`,
      requestId: currentRequest.id,
      timestamp: new Date().toISOString(),
      action: `Request ${newStatus}`,
      performedBy: "Privacy Officer",
      notes: resolution,
      statusChange: {
        from: currentRequest.status,
        to: newStatus,
      },
    }

    const updatedActivities = {
      ...activities,
      [currentRequest.id]: [newActivity, ...(activities[currentRequest.id] || [])],
    }

    setRequests(updatedRequests)
    setActivities(updatedActivities)
    setIsProcessDialogOpen(false)
    setResolution("")
    setNewStatus("")
    toast({
      title: "Request updated",
      description: `Data subject request ${currentRequest.id} has been ${newStatus}.`,
    })
  }

  const handleAssignRequest = () => {
    if (!currentRequest || !assignee) return

    // In a real implementation, this would call your API
    const updatedRequests = requests.map((request) =>
      request.id === currentRequest.id
        ? {
            ...request,
            assignedTo: assignee,
          }
        : request,
    )

    // Add a new activity
    const newActivity: DSRActivity = {
      id: `act-${Math.random().toString(36).substring(2, 10)}`,
      requestId: currentRequest.id,
      timestamp: new Date().toISOString(),
      action: "Request assigned",
      performedBy: "Privacy Manager",
      notes: `Request assigned to ${assignee}`,
    }

    const updatedActivities = {
      ...activities,
      [currentRequest.id]: [newActivity, ...(activities[currentRequest.id] || [])],
    }

    setRequests(updatedRequests)
    setActivities(updatedActivities)
    setIsAssignDialogOpen(false)
    setAssignee("")
    toast({
      title: "Request assigned",
      description: `Data subject request ${currentRequest.id} has been assigned.`,
    })
  }

  const handleExportRequests = () => {
    // In a real implementation, this would generate and download the export file
    toast({
      title: "Exporting requests",
      description: `Exporting ${filteredRequests.length} requests as ${exportFormat.toUpperCase()}.`,
    })
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc") // Default to descending when changing fields
    }
  }

  return (
    <div className="space-y-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
     <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">
  Data Subject Requests
</h2>

      <p className="text-muted-foreground max-w-xl">
        Manage and process data subject access requests (DSARs) in compliance with privacy regulations.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Select value={exportFormat} onValueChange={setExportFormat}>
        <SelectTrigger className="w-[100px] border border-muted rounded-md shadow-sm hover:border-primary transition-colors">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="xlsx">Excel</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleExportRequests}
        className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-md"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  </div>

  <Card className="shadow-lg rounded-2xl border border-muted bg-background">
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-semibold">All Requests</CardTitle>
          <CardDescription className="text-muted-foreground">
            {filteredRequests.length} data subject requests
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="w-full sm:w-[250px] pl-8 pr-3 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          </div>
<div className="flex flex-wrap gap-2 md:gap-3 w-full">
  {[typeFilter, statusFilter, priorityFilter, dateFilter].map((filter, index) => {
    const placeholders = ['Request type', 'Status', 'Priority', 'Date range'];
    const filterOptions = [
      [
        { value: 'all', label: 'All Types' },
        { value: 'access', label: 'Data Access' },
        { value: 'deletion', label: 'Data Deletion' },
        { value: 'correction', label: 'Data Correction' },
        { value: 'portability', label: 'Data Portability' },
        { value: 'objection', label: 'Processing Objection' },
        { value: 'restriction', label: 'Processing Restriction' }
      ],
      [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' }
      ],
      [
        { value: 'all', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ],
      [
        { value: 'all', label: 'All Dates' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'thisWeek', label: 'This Week' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' }
      ]
    ];

    const setters = [setTypeFilter, setStatusFilter, setPriorityFilter, setDateFilter];

    return (
      <Select
        key={index}
        value={filter}
        onValueChange={(val) => setters[index](val)}
      >
        <SelectTrigger className="w-full sm:w-[150px] border border-muted rounded-md shadow-sm hover:border-primary transition-colors">
          <SelectValue placeholder={placeholders[index]} />
        </SelectTrigger>
        <SelectContent>
          {filterOptions[index].map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  })}
</div>
</div>

          </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p>Loading data subject requests...</p>
          </div>
        </div>
          ) : (
            <div className="rounded-xl border shadow-md overflow-hidden">
  <Table className="w-full">
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-900 dark:text-blue-100 transition-colors">
        <TableHead
          className="w-[120px] cursor-pointer font-semibold"
          onClick={() => toggleSort("id")}
        >
          ID
          {sortField === "id" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead>Type</TableHead>
        <TableHead>User</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="cursor-pointer" onClick={() => toggleSort("requestedAt")}>
          Requested
          {sortField === "requestedAt" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => toggleSort("deadline")}>
          Deadline
          {sortField === "deadline" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => toggleSort("priority")}>
          Priority
          {sortField === "priority" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead>Assigned To</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {filteredRequests.length === 0 ? (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all" || dateFilter !== "all"
              ? "No requests match your search criteria"
              : "No data subject requests submitted yet"}
          </TableCell>
        </TableRow>
      ) : (
        filteredRequests.map((request, index) => (
          <TableRow
            key={request.id}
            className={`transition-colors ${
              index % 2 === 0
                ? "bg-muted/40 dark:bg-muted/10"
                : "bg-background dark:bg-muted/5"
            } hover:bg-blue-50 dark:hover:bg-blue-900/40`}
          >
            <TableCell className="font-medium">{request.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                {getRequestTypeIcon(request.type)}
                <Badge variant="outline">{getRequestTypeLabel(request.type)}</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{request.userName || "Unknown"}</span>
                {request.userEmail && (
                  <span className="text-xs text-muted-foreground">{request.userEmail}</span>
                )}
                <span className="text-xs font-mono text-muted-foreground">{request.userId}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(request.status)}
                <Badge variant={getStatusBadgeVariant(request.status) as any}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {request.deadline ? (
                <div className="flex flex-col">
                  <span>{new Date(request.deadline).toLocaleDateString()}</span>
                  <span className={`text-xs ${getDaysRemainingClass(request.deadline)}`}>
                    {getDaysRemainingText(request.deadline)}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </TableCell>
            <TableCell>
              {request.priority ? (
                <Badge variant={getPriorityBadgeVariant(request.priority) as any}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              {request.assignedTo ? (
                <span className="text-sm">{request.assignedTo}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Unassigned</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentRequest(request);
                    setIsViewDialogOpen(true);
                    setActiveTab("details");
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
                {(request.status === "pending" || request.status === "processing") && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentRequest(request);
                        setIsProcessDialogOpen(true);
                        setNewStatus("");
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Process</span>
                    </Button>
                    {!request.assignedTo && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentRequest(request);
                          setIsAssignDialogOpen(true);
                          setAssignee("");
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span className="sr-only">Assign</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</div>
          )}
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Request Details</span>
              <Badge variant={getStatusBadgeVariant(currentRequest?.status || "") as any}>
                {currentRequest ? currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1) : ""}
              </Badge>
            </DialogTitle>
            <DialogDescription>View the details of this data subject request.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Request Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="data">Data Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">ID</h4>
                  <p className="text-sm">{currentRequest?.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Request Type</h4>
                  <div className="flex items-center gap-1.5">
                    {currentRequest && getRequestTypeIcon(currentRequest.type)}
                    <p className="text-sm">
                      <Badge variant="outline">{currentRequest ? getRequestTypeLabel(currentRequest.type) : ""}</Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">User ID</h4>
                  <p className="text-sm font-mono">{currentRequest?.userId}</p>
                </div>
                {currentRequest?.userName && (
                  <div>
                    <h4 className="text-sm font-medium">User Name</h4>
                    <p className="text-sm">{currentRequest.userName}</p>
                  </div>
                )}
                {currentRequest?.userEmail && (
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-sm">{currentRequest.userEmail}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="flex items-center gap-1.5">
                    {currentRequest && getStatusIcon(currentRequest.status)}
                    <Badge variant={getStatusBadgeVariant(currentRequest?.status || "") as any}>
                      {currentRequest
                        ? currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1)
                        : ""}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Priority</h4>
                  {currentRequest?.priority ? (
                    <Badge variant={getPriorityBadgeVariant(currentRequest.priority) as any}>
                      {currentRequest.priority.charAt(0).toUpperCase() + currentRequest.priority.slice(1)}
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Requested</h4>
                  <p className="text-sm">
                    {currentRequest ? new Date(currentRequest.requestedAt).toLocaleString() : ""}
                  </p>
                </div>
                {currentRequest?.deadline && (
                  <div>
                    <h4 className="text-sm font-medium">Deadline</h4>
                    <div className="flex flex-col">
                      <p className="text-sm">{new Date(currentRequest.deadline).toLocaleString()}</p>
                      <p className={`text-xs ${getDaysRemainingClass(currentRequest.deadline)}`}>
                        {getDaysRemainingText(currentRequest.deadline)}
                      </p>
                    </div>
                  </div>
                )}
                {currentRequest?.assignedTo && (
                  <div>
                    <h4 className="text-sm font-medium">Assigned To</h4>
                    <p className="text-sm">{currentRequest.assignedTo}</p>
                  </div>
                )}
                {currentRequest?.processedAt && (
                  <div>
                    <h4 className="text-sm font-medium">Processed</h4>
                    <p className="text-sm">{new Date(currentRequest.processedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {currentRequest?.resolutionNote && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Resolution Notes</h4>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{currentRequest.resolutionNote}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                {(currentRequest?.status === "pending" || currentRequest?.status === "processing") && (
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      setIsProcessDialogOpen(true)
                      setNewStatus("")
                    }}
                  >
                    Process Request
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="py-4">
              {currentRequest && activities[currentRequest.id] ? (
                <div className="space-y-4">
                  {activities[currentRequest.id].map((activity) => (
                    <div key={activity.id} className="border-l-2 border-primary pl-4 pb-4 relative">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-0"></div>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{activity.action}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">By: {activity.performedBy}</p>
                        {activity.statusChange && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={getStatusBadgeVariant(activity.statusChange.from) as any}
                              className="text-xs"
                            >
                              {activity.statusChange.from.charAt(0).toUpperCase() + activity.statusChange.from.slice(1)}
                            </Badge>
                            <span className="text-xs">→</span>
                            <Badge variant={getStatusBadgeVariant(activity.statusChange.to) as any} className="text-xs">
                              {activity.statusChange.to.charAt(0).toUpperCase() + activity.statusChange.to.slice(1)}
                            </Badge>
                          </div>
                        )}
                        {activity.notes && <p className="text-sm mt-1 p-2 bg-muted rounded-md">{activity.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No activity recorded for this request.</p>
              )}
            </TabsContent>

            <TabsContent value="data" className="py-4">
              {currentRequest?.dataCategories && currentRequest.dataCategories.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Data Categories Requested</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {currentRequest.dataCategories.map((category, index) => (
                      <div key={index} className="flex items-center p-2 border rounded-md">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      </div>
                    ))}
                  </div>

                  {currentRequest.type === "access" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Data Access Format</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">JSON</Badge>
                        <Badge variant="outline">CSV</Badge>
                        <Badge variant="outline">PDF</Badge>
                      </div>
                    </div>
                  )}

                  {currentRequest.type === "portability" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Data Portability Format</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">Machine-readable</Badge>
                        <Badge variant="outline">JSON</Badge>
                        <Badge variant="outline">XML</Badge>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No specific data categories recorded for this request.
                </p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Request Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Request</DialogTitle>
            <DialogDescription>Update the status of this data subject request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium">ID</h4>
              <p className="text-sm">{currentRequest?.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Request Type</h4>
              <p className="text-sm">
                <Badge variant="outline">{currentRequest ? getRequestTypeLabel(currentRequest.type) : ""}</Badge>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">User</h4>
              <p className="text-sm">
                {currentRequest?.userName || currentRequest?.userEmail || currentRequest?.userId}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Current Status</h4>
              <Badge variant={getStatusBadgeVariant(currentRequest?.status || "") as any}>
                {currentRequest ? currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1) : ""}
              </Badge>
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                New Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {currentRequest?.status === "pending" && <SelectItem value="processing">Processing</SelectItem>}
                  {(currentRequest?.status === "pending" || currentRequest?.status === "processing") && (
                    <>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="resolution" className="text-sm font-medium">
                Resolution Notes {newStatus === "rejected" ? "(Required)" : "(Optional)"}
              </label>
              <Textarea
                id="resolution"
                placeholder={
                  newStatus === "completed"
                    ? "Provide details about how this request was fulfilled..."
                    : newStatus === "rejected"
                      ? "Provide reason for rejection..."
                      : "Add notes about this request..."
                }
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessRequest} disabled={!newStatus || (newStatus === "rejected" && !resolution)}>
              Update Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Request Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Request</DialogTitle>
            <DialogDescription>Assign this request to a team member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium">ID</h4>
              <p className="text-sm">{currentRequest?.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Request Type</h4>
              <p className="text-sm">
                <Badge variant="outline">{currentRequest ? getRequestTypeLabel(currentRequest.type) : ""}</Badge>
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assign To
              </label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="privacy-officer-1">Privacy Officer 1</SelectItem>
                  <SelectItem value="privacy-officer-2">Privacy Officer 2</SelectItem>
                  <SelectItem value="legal-team">Legal Team</SelectItem>
                  <SelectItem value="data-team">Data Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRequest} disabled={!assignee}>
              Assign Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
