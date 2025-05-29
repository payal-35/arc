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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { toast } from "~/components/ui/use-toast"

import {
  Search,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface Consent {
  id: string
  user_id: string
  user_name: string
  user_email: string
  purpose_id: string
  purpose_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export default function ConsentsPanel() {
  const [consents, setConsents] = useState<Consent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [purposeFilter, setPurposeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentConsent, setCurrentConsent] = useState<Consent | null>(null)
  const [consentHistory, setConsentHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchConsents()
  }, [])

  const fetchConsents = (refresh = false) => {
    if (refresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setTimeout(() => {
      const mockConsents: Consent[] = [
        {
          id: "consent-1",
          user_id: "user-1",
          user_name: "John Doe",
          user_email: "john@example.com",
          purpose_id: "purpose-1",
          purpose_name: "Essential Services",
          status: true,
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "consent-2",
          user_id: "user-1",
          user_name: "John Doe",
          user_email: "john@example.com",
          purpose_id: "purpose-2",
          purpose_name: "Analytics",
          status: true,
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "consent-3",
          user_id: "user-1",
          user_name: "John Doe",
          user_email: "john@example.com",
          purpose_id: "purpose-3",
          purpose_name: "Marketing",
          status: false,
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-16T14:20:00Z",
        },
        {
          id: "consent-4",
          user_id: "user-2",
          user_name: "Jane Smith",
          user_email: "jane@example.com",
          purpose_id: "purpose-1",
          purpose_name: "Essential Services",
          status: true,
          created_at: "2023-05-17T09:45:00Z",
          updated_at: "2023-05-17T09:45:00Z",
        },
        {
          id: "consent-5",
          user_id: "user-2",
          user_name: "Jane Smith",
          user_email: "jane@example.com",
          purpose_id: "purpose-2",
          purpose_name: "Analytics",
          status: false,
          created_at: "2023-05-17T09:45:00Z",
          updated_at: "2023-05-17T09:45:00Z",
        },
      ]

      setConsents(mockConsents)

      if (refresh) {
        setRefreshing(false)
        toast({
          title: "Refreshed",
          description: "Consent data has been updated.",
        })
      } else {
        setLoading(false)
      }
    }, 1000)
  }

  const fetchConsentHistory = (consentId: string) => {
    setLoadingHistory(true)

    setTimeout(() => {
      const mockHistory = [
        {
          id: "history-1",
          consent_id: consentId,
          status: true,
          changed_by: "user",
          changed_at: "2023-05-15T10:30:00Z",
          notes: "Initial consent granted",
        },
        {
          id: "history-2",
          consent_id: consentId,
          status: false,
          changed_by: "user",
          changed_at: "2023-05-16T14:20:00Z",
          notes: "Consent revoked by user",
        },
        {
          id: "history-3",
          consent_id: consentId,
          status: true,
          changed_by: "admin",
          changed_at: "2023-05-17T09:45:00Z",
          notes: "Consent reinstated by admin",
        },
      ]

      setConsentHistory(mockHistory)
      setLoadingHistory(false)
    }, 800)
  }

  const handleViewConsentHistory = (consent: Consent) => {
    setCurrentConsent(consent)
    setIsViewDialogOpen(true)
    fetchConsentHistory(consent.id)
  }

  const handleExportConsents = () => {
    toast({
      title: "Export Started",
      description: "Exporting consent report...",
    })

    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Consent report is ready for download.",
      })
    }, 1500)
  }

  const filteredConsents = consents.filter((consent) => {
    const matchesSearch =
      consent.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consent.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consent.purpose_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPurpose =
      purposeFilter === "all" || consent.purpose_id === purposeFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "granted" && consent.status) ||
      (statusFilter === "revoked" && !consent.status)

    return matchesSearch && matchesPurpose && matchesStatus
  })

  const uniquePurposes = Array.from(
    new Set(consents.map((c) => c.purpose_id))
  ).map((purposeId) => {
    const purpose = consents.find((c) => c.purpose_id === purposeId)
    return {
      id: purposeId,
      name: purpose ? purpose.purpose_name : "",
    }
  })

  return (
   <div className="space-y-8 animate-fadeIn">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">
        Consent Management
      </h2>
      <p className="text-blue-600">Manage and review user consent records</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => fetchConsents(true)}
        disabled={refreshing}
        className="border-blue-500 text-blue-700 hover:bg-blue-100 hover:border-blue-600 transition-all duration-200 shadow-sm"
      >
        {refreshing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handleExportConsents}
        className="border-blue-500 text-blue-700 hover:bg-blue-100 hover:border-blue-600 transition-all duration-200 shadow-sm"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Consent Report
      </Button>
    </div>
  </div>

  <Card className="shadow-xl border border-blue-100 bg-blue-50/40 backdrop-blur-sm">
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-blue-800">All Consents</CardTitle>
          <CardDescription>{filteredConsents.length} records found</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email or purpose"
              className="w-full sm:w-[250px] pl-8 border border-blue-200 focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={purposeFilter} onValueChange={setPurposeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] border border-blue-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by Purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {uniquePurposes.map((purpose) => (
                <SelectItem key={purpose.id} value={purpose.id}>
                  {purpose.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] border border-blue-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="granted">Granted</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>

    <CardContent className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : filteredConsents.length === 0 ? (
        <p className="text-center py-6 text-blue-600">No consents found.</p>
      ) : (
        <Table className="border border-blue-100 rounded shadow-sm bg-white text-sm">
          <TableHeader className="bg-blue-100 text-blue-800">
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsents.map((consent) => (
              <TableRow
                key={consent.id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <TableCell>{consent.user_name}</TableCell>
                <TableCell>{consent.user_email}</TableCell>
                <TableCell>{consent.purpose_name}</TableCell>
                <TableCell>
                  {consent.status ? (
                    <Badge
                      variant="success"
                      className="bg-green-100 text-green-700 border border-green-300"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Granted
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border border-red-300"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Revoked
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(consent.created_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(consent.updated_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-700 hover:bg-blue-100"
                    onClick={() => handleViewConsentHistory(consent)}
                  >
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>

  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
    <DialogContent className="bg-white border border-blue-200 rounded-lg shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Consent History</DialogTitle>
        <DialogDescription className="text-blue-600">
          History for {currentConsent?.user_name} – {currentConsent?.purpose_name}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        {loadingHistory ? (
          <p>Loading history...</p>
        ) : (
          consentHistory.map((entry) => (
            <div key={entry.id} className="border border-blue-100 p-3 rounded bg-blue-50">
              <p>
                <strong>Status:</strong> {entry.status ? "Granted" : "Revoked"}
              </p>
              <p>
                <strong>Changed By:</strong> {entry.changed_by}
              </p>
              <p>
                <strong>Changed At:</strong> {entry.changed_at}
              </p>
              <p>
                <strong>Notes:</strong> {entry.notes}
              </p>
            </div>
          ))
        )}
      </div>
      <DialogFooter>
        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  )
}