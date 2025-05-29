"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Eye } from "lucide-react";

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
import { Key, Plus, Copy, Trash, AlertCircle, Clock, Shield, Globe, Calendar } from "lucide-react"
import { toast } from "~/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Textarea } from "~/components/ui/textarea"
import { format } from "date-fns"

interface APIKey {
  keyId: string
  label: string
  createdAt: string
  lastUsedAt?: string
  revoked: boolean
  revokedAt?: string
  expiresAt?: string
  scopes: string[]
  whitelistedIPs?: string[]
}

interface Scope {
  id: string
  name: string
  description: string
}

export default function ApiKeysPanel() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [newKeyGenerated, setNewKeyGenerated] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState("")
  const [keyLabel, setKeyLabel] = useState("")
  const [currentKey, setCurrentKey] = useState<APIKey | null>(null)
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [ipAddresses, setIpAddresses] = useState<string>("")
  const [activeTab, setActiveTab] = useState("general")

  // Available scopes for API keys
  const availableScopes: Scope[] = [
    { id: "read:consents", name: "Read Consents", description: "View consent records" },
    { id: "write:consents", name: "Write Consents", description: "Create and update consent records" },
    { id: "read:users", name: "Read Users", description: "View user information" },
    { id: "read:purposes", name: "Read Purposes", description: "View purpose definitions" },
    { id: "write:purposes", name: "Write Purposes", description: "Create and update purpose definitions" },
    { id: "read:audit", name: "Read Audit Logs", description: "View audit logs" },
    { id: "read:dsr", name: "Read DSR", description: "View data subject requests" },
    { id: "write:dsr", name: "Write DSR", description: "Create and update data subject requests" },
  ]

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    // For now, we'll simulate loading and then set some example data
    const timer = setTimeout(() => {
      setApiKeys([
        {
          keyId: "550e8400-e29b-41d4-a716-446655440000",
          label: "Production API",
          createdAt: "2023-05-15T10:30:00Z",
          lastUsedAt: "2023-05-22T09:45:00Z",
          revoked: false,
          expiresAt: "2024-05-15T10:30:00Z",
          scopes: ["read:consents", "read:users", "read:purposes"],
          whitelistedIPs: ["192.168.1.1", "10.0.0.1"],
        },
        {
          keyId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          label: "Development API",
          createdAt: "2023-05-16T14:20:00Z",
          lastUsedAt: "2023-05-21T16:10:00Z",
          revoked: false,
          scopes: ["read:consents", "write:consents", "read:users", "read:purposes", "write:purposes"],
        },
        {
          keyId: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          label: "Testing Environment",
          createdAt: "2023-05-17T09:45:00Z",
          revoked: true,
          revokedAt: "2023-05-20T11:30:00Z",
          scopes: ["read:consents", "read:users"],
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateKey = () => {
    // In a real implementation, this would call your API
    // Similar to the Go implementation in CreateAPIKeyHandler

    // Validate form
    if (!keyLabel.trim()) {
      toast({
        title: "Validation error",
        description: "Please provide a label for your API key",
        variant: "destructive",
      })
      return
    }

    if (selectedScopes.length === 0) {
      toast({
        title: "Validation error",
        description: "Please select at least one scope for your API key",
        variant: "destructive",
      })
      return
    }

    // Generate a fake API key (in production this would come from the backend)
    const generatedKey = `arc_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Create new key object
    const newKey: APIKey = {
      keyId: crypto.randomUUID(),
      label: keyLabel,
      createdAt: new Date().toISOString(),
      revoked: false,
      scopes: selectedScopes,
    }

    // Add expiry date if provided
    if (expiryDate) {
      newKey.expiresAt = new Date(expiryDate).toISOString()
    }

    // Add whitelisted IPs if provided
    if (ipAddresses.trim()) {
      newKey.whitelistedIPs = ipAddresses.split(",").map((ip) => ip.trim())
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyValue(generatedKey)
    setNewKeyGenerated(true)
  }

  const handleDeleteKey = () => {
    if (!currentKey) return

    // In a real implementation, this would call your API
    // Similar to the Go implementation in RevokeAPIKeyHandler
    const updatedKeys = apiKeys.map((key) => {
      if (key.keyId === currentKey.keyId) {
        return {
          ...key,
          revoked: true,
          revokedAt: new Date().toISOString(),
        }
      }
      return key
    })

    setApiKeys(updatedKeys)
    setIsDeleteDialogOpen(false)
    toast({
      title: "API key revoked",
      description: `API key "${currentKey.label}" has been revoked successfully.`,
    })
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setNewKeyGenerated(false)
    setNewKeyValue("")
    setKeyLabel("")
    setSelectedScopes([])
    setExpiryDate("")
    setIpAddresses("")
    setActiveTab("general")
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "PPP p")
  }

  const handleScopeChange = (scopeId: string, checked: boolean) => {
    if (checked) {
      setSelectedScopes([...selectedScopes, scopeId])
    } else {
      setSelectedScopes(selectedScopes.filter((id) => id !== scopeId))
    }
  }

  const openDetailsDialog = (key: APIKey) => {
    setCurrentKey(key)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">API Keys</h2>
          <p className="text-muted-foreground">Manage API keys for secure access to the ARC platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{newKeyGenerated ? "API Key Created" : "Create New API Key"}</DialogTitle>
              <DialogDescription>
                {newKeyGenerated
                  ? "Your new API key has been created. Please copy it now as you won't be able to see it again."
                  : "Create a new API key to access the ARC platform programmatically."}
              </DialogDescription>
            </DialogHeader>
            {newKeyGenerated ? (
              <div className="space-y-4 py-4">
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This API key will only be displayed once. Please copy it and store it securely.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="api-key" value={newKeyValue} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyApiKey(newKeyValue)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-label">
                        Key Label <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="key-label"
                        placeholder="e.g., Production API"
                        value={keyLabel}
                        onChange={(e) => setKeyLabel(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Give your API key a descriptive name to identify its purpose.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiration Date</Label>
                      <Input
                        id="expiry-date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-sm text-muted-foreground">
                        Optional. If not set, the API key will not expire.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="permissions" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>
                        Scopes <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select the permissions this API key will have.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-md p-4">
                        {availableScopes.map((scope) => (
                          <div key={scope.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={scope.id}
                              checked={selectedScopes.includes(scope.id)}
                              onCheckedChange={(checked) => handleScopeChange(scope.id, checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={scope.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {scope.name}
                              </label>
                              <p className="text-sm text-muted-foreground">{scope.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="ip-whitelist">IP Address Whitelist</Label>
                      <Textarea
                        id="ip-whitelist"
                        placeholder="192.168.1.1, 10.0.0.1"
                        value={ipAddresses}
                        onChange={(e) => setIpAddresses(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Optional. Comma-separated list of IP addresses that are allowed to use this API key. If empty,
                        the API key can be used from any IP address.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              {newKeyGenerated ? (
                <Button onClick={closeCreateDialog}>Done</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={closeCreateDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-blue-600">Your API Keys</CardTitle>
          <CardDescription>{apiKeys.filter((key) => !key.revoked).length} active API keys</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p>Loading API keys...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table className="text-sm text-gray-800 dark:text-gray-100">
  <TableHeader className="bg-blue-100 dark:bg-slate-800 text-left text-gray-800 dark:text-white">
    <TableRow>
      <TableHead className="py-3">Label</TableHead>
      <TableHead className="py-3">Created</TableHead>
      <TableHead className="py-3">Last Used</TableHead>
      <TableHead className="py-3">Status</TableHead>
      <TableHead className="py-3">Scopes</TableHead>
      <TableHead className="py-3 w-[100px]">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {apiKeys.length === 0 ? (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
          No API keys created yet
        </TableCell>
      </TableRow>
    ) : (
      apiKeys.map((key) => (
        <TableRow
          key={key.keyId}
          className={`transition-colors hover:bg-blue-50 dark:hover:bg-slate-700 ${
            key.revoked ? "opacity-60" : ""
          }`}
        >
          <TableCell className="font-medium">
            <div className="flex items-center">
              <Key className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span
                className="cursor-pointer hover:underline"
                onClick={() => openDetailsDialog(key)}
              >
                {key.label}
              </span>
            </div>
          </TableCell>
          <TableCell>{formatDate(key.createdAt)}</TableCell>
          <TableCell>{key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never used"}</TableCell>
          <TableCell>
            {key.revoked ? (
              <Badge variant="destructive">Revoked</Badge>
            ) : key.expiresAt && new Date(key.expiresAt) < new Date() ? (
              <Badge variant="outline">Expired</Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )}
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {key.scopes.length > 2 ? (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => openDetailsDialog(key)}
                >
                  {key.scopes.length} scopes
                </Badge>
              ) : (
                key.scopes.map((scope) => (
                  <Badge
                    key={scope}
                    variant="outline"
                    className="text-xs text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  >
                    {scope.split(":")[1]}
                  </Badge>
                ))
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDetailsDialog(key)}
                disabled={key.revoked}
              >
                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="sr-only">View key details</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentKey(key);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={key.revoked}
              >
                <Trash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Revoke key</span>
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
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentKey?.label}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Created on {currentKey ? formatDate(currentKey.createdAt) : ""}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKey}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
            <DialogDescription>Detailed information about this API key</DialogDescription>
          </DialogHeader>
          {currentKey && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Label</p>
                  <p className="font-medium">{currentKey.label}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>
                    {currentKey.revoked ? (
                      <Badge variant="destructive">Revoked</Badge>
                    ) : currentKey.expiresAt && new Date(currentKey.expiresAt) < new Date() ? (
                      <Badge variant="outline">Expired</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(currentKey.createdAt)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Used</p>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{currentKey.lastUsedAt ? formatDate(currentKey.lastUsedAt) : "Never used"}</p>
                  </div>
                </div>
                {currentKey.expiresAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Expires</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{formatDate(currentKey.expiresAt)}</p>
                    </div>
                  </div>
                )}
                {currentKey.revoked && currentKey.revokedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Revoked</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{formatDate(currentKey.revokedAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">Permissions</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {currentKey.scopes.map((scope) => {
                    const scopeInfo = availableScopes.find((s) => s.id === scope)
                    return (
                      <div key={scope} className="flex items-start space-x-2">
                        <Checkbox checked={true} disabled />
                        <div className="grid gap-1 leading-none">
                          <label className="text-sm font-medium leading-none">{scopeInfo?.name || scope}</label>
                          {scopeInfo && <p className="text-sm text-muted-foreground">{scopeInfo.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {currentKey.whitelistedIPs && currentKey.whitelistedIPs.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">IP Address Restrictions</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm mb-2">This API key can only be used from these IP addresses:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentKey.whitelistedIPs.map((ip) => (
                        <Badge key={ip} variant="secondary">
                          {ip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {!currentKey?.revoked && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDetailsDialogOpen(false)
                  setIsDeleteDialogOpen(true)
                }}
              >
                Revoke Key
              </Button>
            )}
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
