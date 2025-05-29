"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Search, Eye, Download, CheckCircle } from "lucide-react"
import { toast } from "~/components/ui/use-toast"

interface DataRequest {
  id: string
  user_id: string
  email?: string
  request_type: "access" | "deletion" | "correction" | "portability"
  status: "pending" | "processing" | "completed" | "rejected"
  details?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export default function DataRequestsPanel() {
  const [requests, setRequests] = useState<DataRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<DataRequest | null>(null)
  const [resolution, setResolution] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests([
        {
          id: "DR-2023-01",
          user_id: "user-123",
          email: "john.doe@example.com",
          request_type: "access",
          status: "pending",
          details: "I would like to request a copy of all my personal data that your organization holds.",
          created_at: "2023-05-22T09:30:00Z",
          updated_at: "2023-05-22T09:30:00Z",
        },
        {
          id: "DR-2023-02",
          user_id: "user-456",
          email: "jane.smith@example.com",
          request_type: "deletion",
          status: "processing",
          details: "Please delete all my personal data from your systems.",
          created_at: "2023-05-21T14:15:00Z",
          updated_at: "2023-05-21T15:20:00Z",
        },
        {
          id: "DR-2023-03",
          user_id: "user-789",
          email: "robert.johnson@example.com",
          request_type: "portability",
          status: "completed",
          details: "I would like to receive all my data in a machine-readable format.",
          created_at: "2023-05-20T11:45:00Z",
          updated_at: "2023-05-21T10:30:00Z",
          completed_at: "2023-05-21T10:30:00Z",
        },
        {
          id: "DR-2023-04",
          user_id: "user-101",
          email: "sarah.williams@example.com",
          request_type: "correction",
          status: "rejected",
          details: "Please correct my email address to sarah.williams@newdomain.com.",
          created_at: "2023-05-19T16:20:00Z",
          updated_at: "2023-05-20T09:15:00Z",
        },
      ])
      setLoading(false)
    }, 1000)

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
      default:
        return "outline"
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
      default:
        return type
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.email && request.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.details && request.details.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.request_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleResolveRequest = () => {
    if (!currentRequest) return

    const updatedRequests = requests.map((request) =>
      request.id === currentRequest.id
        ? {
            ...request,
            status: "completed" as const,
            updated_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          }
        : request,
    )

    setRequests(updatedRequests)
    setIsResolveDialogOpen(false)
    setResolution("")
    toast({
      title: "Request completed",
      description: `Data request ${currentRequest.id} has been marked as completed.`,
    })
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">
       
        Data Requests
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        Manage data subject access requests (DSARs) from users.
      </p>
    </div>
    <Button
      onClick={() =>
        toast({
          title: "Generating report",
          description: "Data requests report is being generated.",
        })
      }
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-shadow shadow-md hover:shadow-lg"
    >
      <Download className="h-4 w-4" />
      Export Report
    </Button>
  </div>

  {/* Card */}
  <Card className="border shadow-sm bg-blue-50 dark:bg-[#1e293b]/30 transition-colors">
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-gray-900 dark:text-white">All Requests</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {filteredRequests.length} data requests submitted
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="w-full sm:w-[250px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="access">Data Access</SelectItem>
              <SelectItem value="deletion">Data Deletion</SelectItem>
              <SelectItem value="correction">Data Correction</SelectItem>
              <SelectItem value="portability">Data Portability</SelectItem>
            </SelectContent>
          </Select>
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>

    <CardContent className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span>Loading data requests...</span>
          </div>
        </div>
      ) : (
        <Table className="min-w-[700px] text-sm text-gray-800 dark:text-gray-100">
          <TableHeader className="bg-blue-100 dark:bg-slate-800 text-left text-gray-800 dark:text-white">
            <TableRow>
              <TableHead className="py-3">Request ID</TableHead>
              <TableHead className="py-3">User ID</TableHead>
              <TableHead className="py-3">Email</TableHead>
              <TableHead className="py-3">Request Type</TableHead>
              <TableHead className="py-3">Status</TableHead>
              <TableHead className="py-3">Created At</TableHead>
              <TableHead className="py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No data requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors even:bg-blue-50 dark:even:bg-slate-800/50"
                >
                  <TableCell className="py-3">{request.id}</TableCell>
                  <TableCell className="py-3">{request.user_id}</TableCell>
                  <TableCell className="py-3">{request.email ?? "—"}</TableCell>
                  <TableCell className="py-3">
                    {getRequestTypeLabel(request.request_type)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentRequest(request);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      {request.status !== "completed" &&
                        request.status !== "rejected" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setCurrentRequest(request);
                              setIsResolveDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
</div>
  )
}