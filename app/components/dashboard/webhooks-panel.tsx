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
  DialogTrigger,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { Plus, Trash, ExternalLink, RefreshCw, Clock, Copy } from "lucide-react"
import { toast } from "~/components/ui/use-toast"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { format } from "date-fns"

interface WebhookConfig {
  webhookId: string
  url: string
  secret: string
  events: string[]
  status: "active" | "inactive" | "failed"
  createdAt: string
  updatedAt: string
}

interface WebhookDelivery {
  id: string
  webhookId: string
  event: string
  payload: string
  status: "success" | "failed"
  httpCode: number
  errorMsg?: string
  createdAt: string
}

interface WebhookEvent {
  id: string
  name: string
  description: string
  category: string
}

export default function WebhooksPanel() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookSecret, setWebhookSecret] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [currentWebhook, setCurrentWebhook] = useState<WebhookConfig | null>(null)
  const [currentDelivery, setCurrentDelivery] = useState<WebhookDelivery | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [deliveryTab, setDeliveryTab] = useState("recent")
  


  // Available webhook events
  const availableEvents: WebhookEvent[] = [
    {
      id: "consent.created",
      name: "Consent Created",
      description: "Triggered when a new consent record is created",
      category: "Consent",
    },
    {
      id: "Update Consentd",
      name: "Consent Updated",
      description: "Triggered when a consent record is updated",
      category: "Consent",
    },
    {
      id: "Revoke Consentd",
      name: "Consent Revoked",
      description: "Triggered when a consent is revoked",
      category: "Consent",
    },
    {
      id: "dsr.created",
      name: "DSR Created",
      description: "Triggered when a new data subject request is created",
      category: "DSR",
    },
    {
      id: "dsr.updated",
      name: "DSR Updated",
      description: "Triggered when a data subject request is updated",
      category: "DSR",
    },
    {
      id: "dsr.completed",
      name: "DSR Completed",
      description: "Triggered when a data subject request is completed",
      category: "DSR",
    },
    { id: "user.created", name: "User Created", description: "Triggered when a new user is created", category: "User" },
    { id: "user.updated", name: "User Updated", description: "Triggered when a user is updated", category: "User" },
    {
      id: "Create Purposed",
      name: "Purpose Created",
      description: "Triggered when a new purpose is created",
      category: "Purpose",
    },
    {
      id: "Purpose Updated",
      name: "Purpose Updated",
      description: "Triggered when a purpose is updated",
      category: "Purpose",
    },
  ]

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    const timer = setTimeout(() => {
      setWebhooks([
        {
          webhookId: "550e8400-e29b-41d4-a716-446655440000",
          url: "https://api.example.com/webhooks/arc",
          secret: "whsec_abcdefghijklmnopqrstuvwxyz",
          events: ["consent.created", "Update Consentd", "Revoke Consentd"],
          status: "active",
          createdAt: "2023-05-15T10:30:00Z",
          updatedAt: "2023-05-15T10:30:00Z",
        },
        {
          webhookId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          url: "https://dev.example.com/webhooks/arc",
          secret: "whsec_123456789abcdefghijklmnop",
          events: ["dsr.created", "dsr.updated", "dsr.completed"],
          status: "inactive",
          createdAt: "2023-05-16T14:20:00Z",
          updatedAt: "2023-05-16T14:20:00Z",
        },
        {
          webhookId: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          url: "https://test.example.com/webhooks/arc",
          secret: "whsec_testwebhooksecretkey12345",
          events: ["user.created", "user.updated"],
          status: "failed",
          createdAt: "2023-05-17T09:45:00Z",
          updatedAt: "2023-05-17T09:45:00Z",
        },
      ])

      setDeliveries([
        {
          id: "d1",
          webhookId: "550e8400-e29b-41d4-a716-446655440000",
          event: "consent.created",
          payload: JSON.stringify(
            {
              event: "consent.created",
              data: {
                consentId: "c123",
                userId: "u456",
                purposes: ["marketing", "analytics"],
                timestamp: "2023-05-22T09:45:00Z",
              },
            },
            null,
            2,
          ),
          status: "success",
          httpCode: 200,
          createdAt: "2023-05-22T09:45:00Z",
        },
        {
          id: "d2",
          webhookId: "550e8400-e29b-41d4-a716-446655440000",
          event: "Update Consentd",
          payload: JSON.stringify(
            {
              event: "Update Consentd",
              data: {
                consentId: "c123",
                userId: "u456",
                purposes: ["marketing"],
                timestamp: "2023-05-22T10:15:00Z",
              },
            },
            null,
            2,
          ),
          status: "success",
          httpCode: 200,
          createdAt: "2023-05-22T10:15:00Z",
        },
        {
          id: "d3",
          webhookId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          event: "dsr.created",
          payload: JSON.stringify(
            {
              event: "dsr.created",
              data: {
                dsrId: "dsr789",
                userId: "u456",
                type: "deletion",
                timestamp: "2023-05-21T16:10:00Z",
              },
            },
            null,
            2,
          ),
          status: "failed",
          httpCode: 500,
          errorMsg: "Connection timeout after 30s",
          createdAt: "2023-05-21T16:10:00Z",
        },
      ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateWebhook = () => {
    // Validate form
    if (!webhookUrl.trim()) {
      toast({
        title: "Validation error",
        description: "Please provide a URL for your webhook",
        variant: "destructive",
      })
      return
    }

    if (!webhookSecret.trim()) {
      toast({
        title: "Validation error",
        description: "Please provide a secret for your webhook",
        variant: "destructive",
      })
      return
    }

    if (selectedEvents.length === 0) {
      toast({
        title: "Validation error",
        description: "Please select at least one event for your webhook",
        variant: "destructive",
      })
      return
    }

    // Create new webhook
    const newWebhook: WebhookConfig = {
      webhookId: crypto.randomUUID(),
      url: webhookUrl,
      secret: webhookSecret,
      events: selectedEvents,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setWebhooks([...webhooks, newWebhook])
    setIsCreateDialogOpen(false)
    resetForm()

    toast({
      title: "Webhook created",
      description: "Your webhook has been created successfully.",
    })
  }

  const handleDeleteWebhook = () => {
    if (!currentWebhook) return

    // In a real implementation, this would call your API
    const updatedWebhooks = webhooks.filter((webhook) => webhook.webhookId !== currentWebhook.webhookId)
    setWebhooks(updatedWebhooks)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Webhook deleted",
      description: `Webhook for "${currentWebhook.url}" has been deleted successfully.`,
    })
  }

  const handleEventChange = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId])
    } else {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    }
  }

  const resetForm = () => {
    setWebhookUrl("")
    setWebhookSecret("")
    setSelectedEvents([])
    setActiveTab("general")
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP p")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeliveryStatusBadge = (status: string, httpCode: number) => {
    if (status === "success") {
      return <Badge variant="success">Success ({httpCode})</Badge>
    } else {
      return <Badge variant="destructive">Failed ({httpCode})</Badge>
    }
  }

  const openDetailsDialog = (webhook: WebhookConfig) => {
    setCurrentWebhook(webhook)
    setIsDetailsDialogOpen(true)
    // Filter deliveries for this webhook
    const webhookDeliveries = deliveries.filter((d) => d.webhookId === webhook.webhookId)
    setDeliveries(webhookDeliveries)
  }

  const openDeliveryDialog = (delivery: WebhookDelivery) => {
    setCurrentDelivery(delivery)
    setIsDeliveryDialogOpen(true)
  }

const toggleWebhookStatus = (webhook: WebhookConfig) => {
  const updatedWebhooks: WebhookConfig[] = webhooks.map((w) => {
    if (w.webhookId === webhook.webhookId) {
      const newStatus: "active" | "inactive" =
        w.status === "active" ? "inactive" : "active";
      return {
        ...w,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return w;
  });

  setWebhooks(updatedWebhooks);

  toast({
    title: `Webhook ${webhook.status === "active" ? "deactivated" : "activated"}`,
    description: `Webhook for "${webhook.url}" has been ${webhook.status === "active" ? "deactivated" : "activated"} successfully.`,
  });
};

const retryFailedDelivery = (delivery: WebhookDelivery) => {
  const updatedDeliveries: WebhookDelivery[] = deliveries.map((d) => {
    if (d.id === delivery.id) {
      return {
        ...d,
        status: "success" as "success", 
        httpCode: 200,
        errorMsg: undefined,
        createdAt: new Date().toISOString(),
      };
    }
    return d;
  });

  setDeliveries(updatedDeliveries);
  setCurrentDelivery(null);
  setIsDeliveryDialogOpen(false);

  toast({
    title: "Webhook delivery retried",
    description: "The webhook delivery has been retried successfully.",
  });
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">Webhooks</h2>
          <p className="text-muted-foreground">Manage webhooks to receive real-time updates from the ARC platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Create a new webhook to receive real-time updates from the ARC platform.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">
                      Webhook URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://example.com/webhooks/arc"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">The URL where webhook events will be sent.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">
                      Webhook Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhook-secret"
                      placeholder="whsec_..."
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      This secret will be used to sign the webhook payload. Keep it secure.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>
                      Events <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select the events you want to receive notifications for.
                    </p>

                    <div className="border rounded-md p-4 space-y-4">
                      {["Consent", "DSR", "User", "Purpose"].map((category) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-medium">{category} Events</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableEvents
                              .filter((event) => event.category === category)
                              .map((event) => (
                                <div key={event.id} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={event.id}
                                    checked={selectedEvents.includes(event.id)}
                                    onCheckedChange={(checked) => handleEventChange(event.id, checked as boolean)}
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <label
                                      htmlFor={event.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {event.name}
                                    </label>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeCreateDialog}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-blue-600">Your Webhooks</CardTitle>
          <CardDescription>
            {webhooks.filter((webhook) => webhook.status === "active").length} active webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p>Loading webhooks...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No webhooks created yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    webhooks.map((webhook) => (
                      <TableRow key={webhook.webhookId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="cursor-pointer hover:underline" onClick={() => openDetailsDialog(webhook)}>
                              {webhook.url}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.length > 2 ? (
                              <Badge
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => openDetailsDialog(webhook)}
                              >
                                {webhook.events.length} events
                              </Badge>
                            ) : (
                              webhook.events.map((event) => (
                                <Badge key={event} variant="outline" className="text-xs">
                                  {event.split(".")[1]}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                        <TableCell>{formatDate(webhook.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(webhook)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-eye"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span className="sr-only">View webhook details</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleWebhookStatus(webhook)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-power"
                              >
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                <line x1="12" x2="12" y1="2" y2="12" />
                              </svg>
                              <span className="sr-only">
                                {webhook.status === "active" ? "Deactivate" : "Activate"} webhook
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentWebhook(webhook)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete webhook</span>
                            </Button>
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

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Webhook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentWebhook?.url}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Created on {currentWebhook ? formatDate(currentWebhook.createdAt) : ""}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWebhook}>
              Delete Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Webhook Details</DialogTitle>
            <DialogDescription>Detailed information about this webhook</DialogDescription>
          </DialogHeader>
          {currentWebhook && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">URL</p>
                  <p className="font-medium break-all">{currentWebhook.url}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(currentWebhook.status)}
                    <Button variant="outline" size="sm" onClick={() => toggleWebhookStatus(currentWebhook)}>
                      {currentWebhook.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{formatDate(currentWebhook.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p>{formatDate(currentWebhook.updatedAt)}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Secret</p>
                  <div className="flex items-center space-x-2">
                    <Input value="••••••••••••••••••••••••" readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(currentWebhook.secret)
                        toast({
                          title: "Secret copied",
                          description: "The webhook secret has been copied to your clipboard.",
                        })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Subscribed Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {availableEvents.map((event) => {
                    const isSubscribed = currentWebhook.events.includes(event.id)
                    return (
                      <div key={event.id} className="flex items-start space-x-2">
                        <Checkbox checked={isSubscribed} disabled />
                        <div className="grid gap-1 leading-none">
                          <label className="text-sm font-medium leading-none">{event.name}</label>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Delivery History</h3>
                <Tabs value={deliveryTab} onValueChange={setDeliveryTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recent">Recent Deliveries</TabsTrigger>
                    <TabsTrigger value="failed">Failed Deliveries</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recent" className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No deliveries found
                              </TableCell>
                            </TableRow>
                          ) : (
                            deliveries.map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell>
                                  <Badge variant="outline">{delivery.event}</Badge>
                                </TableCell>
                                <TableCell>{getDeliveryStatusBadge(delivery.status, delivery.httpCode)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {formatDate(delivery.createdAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => openDeliveryDialog(delivery)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-eye"
                                      >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span className="sr-only">View delivery details</span>
                                    </Button>
                                    {delivery.status === "failed" && (
                                      <Button variant="ghost" size="icon" onClick={() => retryFailedDelivery(delivery)}>
                                        <RefreshCw className="h-4 w-4" />
                                        <span className="sr-only">Retry delivery</span>
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
                  </TabsContent>

                  <TabsContent value="failed" className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Error</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries.filter((d) => d.status === "failed").length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No failed deliveries found
                              </TableCell>
                            </TableRow>
                          ) : (
                            deliveries
                              .filter((d) => d.status === "failed")
                              .map((delivery) => (
                                <TableRow key={delivery.id}>
                                  <TableCell>
                                    <Badge variant="outline">{delivery.event}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-red-500">{delivery.errorMsg || "Unknown error"}</span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                      {formatDate(delivery.createdAt)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-1">
                                      <Button variant="ghost" size="icon" onClick={() => openDeliveryDialog(delivery)}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-eye"
                                        >
                                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                          <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <span className="sr-only">View delivery details</span>
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => retryFailedDelivery(delivery)}>
                                        <RefreshCw className="h-4 w-4" />
                                        <span className="sr-only">Retry delivery</span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          <DialogFooter>
            {currentDelivery?.status === "failed" && (
              <Button variant="outline" onClick={() => retryFailedDelivery(currentDelivery)} className="mr-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Delivery
              </Button>
            )}
            <Button onClick={() => setIsDeliveryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
