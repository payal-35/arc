"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import {
  Bell,
  CheckCircle,
  Clock,
  MessageSquare,
  RefreshCw,
  Shield,
  User,
  Loader2,
  Search,
} from "lucide-react"
import { toast } from "~/components/ui/use-toast"
import { Input } from "~/components/ui/input"

interface Notification {
  id: string
  title: string
  body: string
  icon: string
  unread: boolean
  created_at: string
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [onlyUnread, setOnlyUnread] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = (refresh = false) => {
    if (refresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setTimeout(() => {
      setNotifications([
        {
          id: "1",
          title: "New Grievance Submitted",
          body: "A user has submitted a new grievance regarding data access.",
          icon: "message-square",
          unread: true,
          created_at: "2023-05-22T10:30:00Z",
        },
        {
          id: "2",
          title: "Consent Review Due",
          body: "Monthly consent review is due in 3 days.",
          icon: "clock",
          unread: true,
          created_at: "2023-05-22T09:15:00Z",
        },
        {
          id: "3",
          title: "Purpose Updated",
          body: "The 'Marketing' purpose was updated by admin user.",
          icon: "shield",
          unread: false,
          created_at: "2023-05-21T14:45:00Z",
        },
        {
          id: "4",
          title: "New User Registration",
          body: "A new user has registered and provided initial consents.",
          icon: "user",
          unread: false,
          created_at: "2023-05-21T11:20:00Z",
        },
        {
          id: "5",
          title: "Webhook Delivery Failed",
          body: "Webhook delivery to endpoint 'https://api.example.com/webhooks/consent' failed.",
          icon: "alert-triangle",
          unread: false,
          created_at: "2023-05-20T16:10:00Z",
        },
      ])

      if (refresh) {
        setRefreshing(false)
        toast({
          title: "Refreshed",
          description: "Notification data has been updated.",
        })
      } else {
        setLoading(false)
      }
    }, 1000)
  }

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "message-square":
        return <MessageSquare className="h-4 w-4" />
      case "clock":
        return <Clock className="h-4 w-4" />
      case "shield":
        return <Shield className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "alert-triangle":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, unread: false } : n,
    )
    setNotifications(updated)
    toast({
      title: "Marked as Read",
      description: "Notification marked as read.",
    })
  }

  const markAllAsRead = () => {
    setRefreshing(true)
    setTimeout(() => {
      const updated = notifications.map((n) => ({ ...n, unread: false }))
      setNotifications(updated)
      setRefreshing(false)
      toast({
        title: "All Notifications Read",
        description: "All notifications have been marked as read.",
      })
    }, 1000)
  }

  const filteredNotifications = notifications.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase())
    const matchUnread = onlyUnread ? n.unread : true
    return matchSearch && matchUnread
  })

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800">Notification Management</h2>
          <p className="text-muted-foreground">View and manage recent alerts and messages.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fetchNotifications(true)} disabled={refreshing}>
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
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} disabled={refreshing}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-extrabold tracking-tight text-blue-600">Recent Notifications</CardTitle>
              <CardDescription>{unreadCount} unread notifications</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications"
                  className="w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOnlyUnread(!onlyUnread)}
                className={onlyUnread ? "bg-primary/10" : ""}
              >
                {onlyUnread ? "Show All" : "Show Unread"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p>Loading notifications...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Message</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery
                          ? "No results found."
                          : onlyUnread
                          ? "No unread notifications."
                          : "No notifications available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id} className={notification.unread ? "bg-primary/5" : ""}>
                        <TableCell>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {getIconComponent(notification.icon)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                          {notification.body}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(notification.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {notification.unread ? (
                            <Badge>Unread</Badge>
                          ) : (
                            <Badge variant="outline">Read</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {notification.unread && (
                            <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Mark as Read</span>
                            </Button>
                          )}
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
    </div>
  )
}
