"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Search, Eye, CheckCircle, Loader2, Plus, AlertTriangle, AlertCircle, Flag } from "lucide-react"
import { toast } from "~/components/ui/use-toast"

import { Label } from "~/components/ui/label"

// Update the Grievance interface to include priority
interface Grievance {
  id: string
  user_id: string
  tenant_id: string
  tenant_name: string
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
  resolution?: string
}
const formatPriority = (priority: Grievance["priority"]) => {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return priority;
  }

};

const formatStatus = (status: Grievance["status"]) => {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};


// Interface for tenant/organization
interface Tenant {
  id: string
  name: string
}

export default function GrievancesPanel() {

  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orgFilter, setOrgFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentGrievance, setCurrentGrievance] = useState<Grievance | null>(null)
  const [resolution, setResolution] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Update the grievanceForm state to include priority
  const [grievanceForm, setGrievanceForm] = useState<GrievanceForm>({
    tenant_id: "",
    type: "",
    subject: "",
    details: "",
    priority: "medium",
  });
  // Add a state for user's tenants (organizations they have consents with)
  const [userTenants, setUserTenants] = useState<Tenant[]>([
    { id: "tenant-1", name: "Acme Corporation" },
    { id: "tenant-2", name: "Globex Industries" },
    { id: "tenant-3", name: "Stark Enterprises" },
  ])

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    // For now, we'll simulate loading and then set some example data
    const timer = setTimeout(() => {
      // This would also fetch the user's tenants (organizations they have consents with)
      setUserTenants([
        { id: "tenant-1", name: "Acme Corporation" },
        { id: "tenant-2", name: "Globex Industries" },
        { id: "tenant-3", name: "Stark Enterprises" },
      ])

      setGrievances([
        {
          id: "GR-2023-001",
          user_id: "user-123",
          tenant_id: "tenant-1",
          tenant_name: "Acme Corporation",
          subject: "Data Access Request Issue",
          description: "I submitted a data access request last week but haven't received any response.",
          status: "in_progress",
          priority: "high",
          created_at: "2023-05-18T14:30:00Z",
          updated_at: "2023-05-19T09:15:00Z",
        },
        {
          id: "GR-2023-002",
          user_id: "user-123",
          tenant_id: "tenant-2",
          tenant_name: "Globex Industries",
          subject: "Consent Withdrawal Problem",
          description: "I'm trying to withdraw my consent for marketing but the system shows an error.",
          status: "open",
          priority: "medium",
          created_at: "2023-05-20T10:45:00Z",
          updated_at: "2023-05-20T10:45:00Z",
        },
        {
          id: "GR-2023-003",
          user_id: "user-123",
          tenant_id: "tenant-3",
          tenant_name: "Stark Enterprises",
          subject: "Minor UI Issue in Consent Form",
          description: "There's a small alignment issue in the consent form that makes it hard to read on mobile.",
          status: "open",
          priority: "low",
          created_at: "2023-05-22T08:15:00Z",
          updated_at: "2023-05-22T08:15:00Z",
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "secondary"
      case "in_progress":
        return "warning"
      case "resolved":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3 mr-1" />
      case "medium":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      case "low":
        return <Flag className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }
  const filteredGrievances = grievances.filter((grievance) => {
    const matchesSearch =
      grievance.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || grievance.status === statusFilter;
    const matchesOrg = orgFilter === "all" || grievance.tenant_id === orgFilter;
    const matchesPriority = priorityFilter === "all" || grievance.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesOrg && matchesPriority;
  });

  const handleResolveGrievance = () => {
    if (!currentGrievance) return;

    if (!resolution.trim()) {
      toast({
        title: "Resolution is required",
        description: "Please provide a resolution description.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const updatedGrievances = grievances.map((grievance) =>
        grievance.id === currentGrievance.id
          ? {
            ...grievance,
            status: "resolved" as const,
            resolution: resolution,
            updated_at: new Date().toISOString(),
          }
          : grievance,
      );

      setGrievances(updatedGrievances);
      setIsResolveDialogOpen(false);
      setResolution("");
      setSubmitting(false);

      toast({
        title: "Grievance Resolved",
        description: `Grievance with ID ${currentGrievance.id} has been successfully resolved.`,
      });
    }, 1500);
  };

  type Priority = "low" | "medium" | "high";

  type GrievanceForm = {
    tenant_id: string;
    type: string;
    subject: string;
    details: string;
    priority: Priority;
  };

  const handleGrievanceSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !grievanceForm.tenant_id ||
      !grievanceForm.type ||
      !grievanceForm.subject ||
      !grievanceForm.details ||
      !grievanceForm.priority
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields including priority.",
        variant: "destructive",
      });
      return;
    }
  }

  setSubmitting(true)
  // Simulate API call
  setTimeout(() => {
    const selectedTenant = userTenants.find((tenant) => tenant.id === grievanceForm.tenant_id)
    const newGrievance = {
      id: `GR-${new Date().getFullYear()}-${(grievances.length + 1).toString().padStart(3, "0")}`,
      user_id: "user-123",
      tenant_id: grievanceForm.tenant_id,
      tenant_name: selectedTenant ? selectedTenant.name : "Unknown Organization",
      subject: grievanceForm.subject,
      description: grievanceForm.details,
      status: "open" as "open",
      priority: grievanceForm.priority as "medium" | "low" | "high",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  
    setGrievances([newGrievance, ...grievances])
    setSubmitting(false)
    setGrievanceForm({
      tenant_id: "",
      type: "",
      subject: "",
      details: "",
      priority: "medium",
    })
    setTimeout(() => {
      setIsCreateDialogOpen(false);
      toast({
        title: "Submitted",
        description: `Successfully submitted for organization: ${selectedTenant?.name || ""}`,
      });
    }, 1500);
  });

    const handleGrievanceFormChange = (
      field: keyof GrievanceForm,
      value: GrievanceForm[keyof GrievanceForm]
    ) => {
      setGrievanceForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">Grievance Management</h2>
            <p className="text-muted-foreground">Manage and track grievances submitted by users.</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Submit Grievance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Grievances</CardTitle>
                <CardDescription>
                  {filteredGrievances.length} Submitted
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search grievances"
                    className="w-full sm:w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={orgFilter} onValueChange={setOrgFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {userTenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p>Loading grievances...</p>
                </div>
              </div>

            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Grievance Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrievances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchQuery || statusFilter !== "all" || orgFilter !== "all" || priorityFilter !== "all"
                            ? "No results found."
                            : "No grievances submitted yet."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGrievances.map((grievance) => (
                        <TableRow key={grievance.id}>
                          <TableCell className="font-medium">{grievance.id}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{grievance.tenant_name}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{grievance.subject}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getPriorityBadgeVariant(grievance.priority)}
                              className="flex items-center"
                            >
                              {getPriorityIcon(grievance.priority)}
                              {formatPriority(grievance.priority)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(grievance.status)}>
                              {formatStatus(grievance.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(grievance.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentGrievance(grievance);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View grievance</span>
                              </Button>
                              {(grievance.status === "open" || grievance.status === "in_progress") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentGrievance(grievance);
                                    setIsResolveDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sr-only">Resolve grievance</span>
                                </Button>
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


            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Grievance Details</DialogTitle>
                  <DialogDescription>View detailed information about the selected grievance.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium">Grievance ID</h4>
                    <p className="text-sm">{currentGrievance?.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">User ID</h4>
                    <p className="text-sm font-mono">{currentGrievance?.user_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Subject</h4>
                    <p className="text-sm">{currentGrievance?.subject}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm">{currentGrievance?.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Priority</h4>
                    <Badge
                      variant={getPriorityBadgeVariant(currentGrievance?.priority ?? "low") as any}
                      className="mt-1 flex items-center w-fit"
                    >
                      {getPriorityIcon(currentGrievance?.priority ?? "low")}
                      {formatPriority(currentGrievance?.priority ?? "low")}
                    </Badge>

                    <Badge
                      variant={getStatusBadgeVariant(currentGrievance?.status ?? "open") as any}
                      className="mt-1"
                    >
                      {formatStatus(currentGrievance?.status ?? "open")}
                    </Badge>

                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Submitted</h4>
                    <p className="text-sm">
                      {currentGrievance ? new Date(currentGrievance.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Updated</h4>
                    <p className="text-sm">
                      {currentGrievance ? new Date(currentGrievance.updated_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Organization</h4>
                    <p className="text-sm">{currentGrievance?.tenant_name}</p>
                  </div>
                  {currentGrievance?.resolution && (
                    <div>
                      <h4 className="text-sm font-medium">Resolution</h4>
                      <p className="text-sm">{currentGrievance.resolution}</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


            {/* Resolve Grievance Dialog */}
            <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Resolve Grievance</DialogTitle>
                  <DialogDescription>Provide resolution details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium">Grievance ID</h4>
                    <p className="text-sm">{currentGrievance?.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Subject</h4>
                    <p className="text-sm">{currentGrievance?.subject}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Priority</h4>
                    <Badge
                      variant={getPriorityBadgeVariant(currentGrievance?.priority ?? "low") as any}
                      className="mt-1 flex items-center w-fit"
                    >
                      {getPriorityIcon(currentGrievance?.priority ?? "low")}
                      {formatPriority(currentGrievance?.priority ?? "low")}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm">{currentGrievance?.description}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolution" className="text-sm font-medium">
                      Resolution
                    </Label>
                    <Textarea
                      id="resolution"
                      placeholder="Enter resolution here..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleResolveGrievance} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resolving...
                      </>
                    ) : (
                      "Resolve Grievance"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create Grievance Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Grievance</DialogTitle>
                  <DialogDescription>Please fill the form below to submit your grievance.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGrievanceSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant_id">Select Organization</Label>
                    <Select
                      value={grievanceForm.tenant_id}
                      onValueChange={(value) => handleGrievanceFormChange("tenant_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Grievance Type</Label>
                    <Select value={grievanceForm.type} onValueChange={(value) => handleGrievanceFormChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grievance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data-protection">Data Protection</SelectItem>
                        <SelectItem value="data-access">Data Access</SelectItem>
                        <SelectItem value="consent">Consent Issues</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={grievanceForm.priority}
                      onValueChange={(value) => handleGrievanceFormChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high" className="text-red-500 font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          High
                        </SelectItem>
                        <SelectItem value="medium" className="text-amber-500 font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Medium
                        </SelectItem>
                        <SelectItem value="low" className="text-slate-500 font-medium flex items-center">
                          <Flag className="h-4 w-4 mr-2" />
                          Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {grievanceForm.priority === "high"
                        ? "High priority means immediate attention is needed."
                        : grievanceForm.priority === "medium"
                          ? "Medium priority means timely resolution is expected."
                          : "Low priority means it can be resolved in routine timelines."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject"
                      value={grievanceForm.subject}
                      onChange={(e) => handleGrievanceFormChange("subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Description</Label>
                    <Textarea
                      id="details"
                      placeholder="Enter description"
                      value={grievanceForm.details}
                      onChange={(e) => handleGrievanceFormChange("details", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Grievance"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
         </CardContent>
        </Card>
     </div>
  );
}