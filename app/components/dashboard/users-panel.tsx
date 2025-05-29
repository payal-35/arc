"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Search, Eye, MoreVertical, UserCog, FileText, History, Download } from "lucide-react"
import { toast } from "~/components/ui/use-toast"

interface User {
  id: string
  external_id?: string
  email?: string
  identified: boolean
  last_seen: string
  created_at: string
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real implementation, this would fetch actual data from your API
    // For now, we'll simulate loading and then set some example data
    const timer = setTimeout(() => {
      setUsers([
        {
          id: "user-123",
          external_id: "ext-abc-123",
          email: "john.doe@example.com",
          identified: true,
          last_seen: "2023-05-22T10:30:00Z",
          created_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "user-456",
          external_id: "ext-def-456",
          email: "jane.smith@example.com",
          identified: true,
          last_seen: "2023-05-21T14:45:00Z",
          created_at: "2023-05-16T14:20:00Z",
        },
        {
          id: "user-789",
          external_id: "ext-ghi-789",
          email: "robert.johnson@example.com",
          identified: true,
          last_seen: "2023-05-20T16:10:00Z",
          created_at: "2023-05-17T09:45:00Z",
        },
        {
          id: "user-101",
          identified: false,
          last_seen: "2023-05-19T11:20:00Z",
          created_at: "2023-05-19T11:20:00Z",
        },
        {
          id: "user-102",
          identified: false,
          last_seen: "2023-05-18T09:15:00Z",
          created_at: "2023-05-18T09:15:00Z",
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.external_id && user.external_id.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "identified" && user.identified) ||
      (activeTab === "anonymous" && !user.identified)

    return matchesSearch && matchesTab
  })

  const exportUsers = () => {
    // In a real implementation, this would generate a CSV file
    toast({
      title: "Exporting users",
      description: "Your user data is being exported as a CSV file.",
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">
        User Management
      </h2>
      <p className="text-blue-600">View and manage users in your ARC platform</p>
    </div>
   <Button
  onClick={exportUsers}
  className="border border-blue-600 text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700 transition duration-200 shadow-sm"
>
  <Download className="mr-2 h-4 w-4" />
  Export Users
</Button>

</div>
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="bg-blue-50 border border-blue-200 rounded-md shadow-sm">
      <TabsTrigger value="all">All Users</TabsTrigger>
      <TabsTrigger value="identified">Identified Users</TabsTrigger>
      <TabsTrigger value="anonymous">Anonymous Users</TabsTrigger>
    </TabsList>

    <TabsContent value={activeTab} className="space-y-4 mt-4">
      <Card className="shadow-lg border border-blue-100 bg-blue-50/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-blue-800">
                {activeTab === "all"
                  ? "All Users"
                  : activeTab === "identified"
                  ? "Identified Users"
                  : "Anonymous Users"}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full sm:w-[250px] pl-8 border border-blue-200 focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-600">Loading users...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-blue-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-100 text-blue-800">
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>External ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-blue-500"
                      >
                        {searchQuery
                          ? "No users match your search criteria"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <TableCell className="font-mono text-xs">
                          {user.id}
                        </TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {user.external_id || "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.identified ? (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-700 border border-green-300"
                            >
                              Identified
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 border border-gray-300"
                            >
                              Anonymous
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.last_seen).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentUser(user);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Consents
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                View Activity
                              </DropdownMenuItem>
                              {user.identified && (
                                <DropdownMenuItem>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Manage User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </TabsContent>
  </Tabs>

  {/* Dialog styles are already good, just add visual consistency */}
  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
    <DialogContent className="max-w-md border border-blue-200 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-blue-800">User Details</DialogTitle>
        <DialogDescription className="text-blue-600">
          Detailed information about this user.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <h4 className="text-sm font-medium text-blue-700">User ID</h4>
          <p className="text-sm font-mono">{currentUser?.id}</p>
        </div>
        {currentUser?.email && (
          <div>
            <h4 className="text-sm font-medium text-blue-700">Email</h4>
            <p className="text-sm">{currentUser.email}</p>
          </div>
        )}
        {currentUser?.external_id && (
          <div>
            <h4 className="text-sm font-medium text-blue-700">External ID</h4>
            <p className="text-sm font-mono">{currentUser.external_id}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium text-blue-700">Status</h4>
          <p className="text-sm">
            {currentUser?.identified ? (
              <Badge
                variant="default"
                className="bg-green-100 text-green-700 border border-green-300"
              >
                Identified
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 border border-gray-300"
              >
                Anonymous
              </Badge>
            )}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-700">Last Seen</h4>
          <p className="text-sm">
            {currentUser ? new Date(currentUser.last_seen).toLocaleString() : ""}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-700">Created</h4>
          <p className="text-sm">
            {currentUser ? new Date(currentUser.created_at).toLocaleString() : ""}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  )
}