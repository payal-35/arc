import React, { useState, useEffect } from "react"
import { useNavigate } from "@remix-run/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import CountUp from 'react-countup';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"


import { ModeToggle } from "~/components/mode-toggle"

import { AnimatedLoader } from "~/components/animated-loader"
import { toast } from "~/components/ui/use-toast"
import {
  Bell,
  FileText,
  User,
  Settings,
  Shield,
  Clock,
  MessageSquare,
  FileSearch,
  LayoutDashboard,
  Download,
  Eye,
  Edit,
  Trash,
  Plus,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
  LogOut,
  Upload,
  Filter,
  BarChart,
  History,
  Loader2,
  AlertCircle,
  SlidersHorizontal,

  AlertTriangle,
  Flag,
  ExternalLink,
} from "lucide-react"
import { AnymatchFn, AnymatchPattern } from "vite"

// Mock user info for development/preview
const mockUserInfo = {
  user_id: "user-123456",
  email: "user@example.com",
  name: "Demo User",
  phone: "+91 98765 43210",
  address: "123 Privacy Street, Data City, 560001",
  created_at: "2023-01-15T10:30:00Z",
  profile_image: "/professional-headshot.png",
}
interface RequestHistoryItem {
  date: string; // or Date, depending on your data
  status: string;
  note: string;
}

interface Request {
  id: string;
  type: string;
  typeColor: string;
  status: string;
  statusColor: string;
  details: string;
  dataCategories: string[];
  format: string;
  estimatedCompletion: string;
  notes: string;
  history: RequestHistoryItem[];
}
interface GrievanceResponse {
  from: string;
  date: string;   
  message: string;
}

interface Grievance {
  id: string;
  tenant_name: string;
  subject: string;
  priority: string;
  status: string;
  statusColor: string;
  details: string;
  type: string;
  assignee: string;
  submitted: string;
  updated: string;
  responses?: GrievanceResponse[];
}

interface Consent {
  id: string;
  purpose: string;
  status: boolean;
  description: string;
  details: string;
  legalBasis: string;
  dataCategories: string[];
  retention: string;
  thirdParties: string[];
  lastUpdated: string;
}

type SettingsForm = {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  theme: string;
  colorScheme: string;
  animations: boolean;
  dataCollection: boolean;
  personalization: boolean;
  thirdPartySharing: boolean;
  twoFactorAuth: boolean; 
}


// Mock consent data
const initialConsents = [
  {
    id: "consent-1",
    purpose: "Marketing Communications",
    description: "Consent to receive marketing emails and notifications about new features, products, and services.",
    status: true,
    lastUpdated: "2023-05-15",
    color: "green",
    details:
      "This consent allows us to send you marketing communications via email, SMS, and in-app notifications. You can revoke this consent at any time.",
    legalBasis: "Consent (GDPR Art. 6(1)(a))",
    dataCategories: ["Email", "Name", "Phone Number", "Usage Data"],
    retention: "Until consent is withdrawn or account is deleted",
    thirdParties: ["Marketing Analytics Provider", "Email Service Provider"],
  },
  {
    id: "consent-2",
    purpose: "Data Analytics",
    description: "Consent to analyze your usage data to improve our services and enhance your experience.",
    status: true,
    lastUpdated: "2023-05-15",
    color: "blue",
    details:
      "This consent allows us to collect and analyze data about how you use our services to improve functionality and user experience.",
    legalBasis: "Legitimate Interest (GDPR Art. 6(1)(f))",
    dataCategories: ["Usage Data", "Device Information", "IP Address"],
    retention: "24 months from collection",
    thirdParties: ["Analytics Provider"],
  },
  {
    id: "consent-3",
    purpose: "Third-party Sharing",
    description: "Consent to share your data with trusted partners and third-party service providers.",
    status: false,
    lastUpdated: "2023-05-16",
    color: "red",
    details:
      "This consent allows us to share your personal data with trusted third-party partners who may offer products or services that might interest you.",
    legalBasis: "Consent (GDPR Art. 6(1)(a))",
    dataCategories: ["Email", "Name", "Phone Number", "Address"],
    retention: "Until consent is withdrawn or account is deleted",
    thirdParties: ["Partner Companies", "Advertising Networks"],
  },
  {
    id: "consent-4",
    purpose: "Personalization",
    description: "Consent to personalize your experience based on your preferences and behavior.",
    status: true,
    lastUpdated: "2023-05-15",
    color: "purple",
    details:
      "This consent allows us to personalize your experience by remembering your preferences and tailoring content based on your past behavior.",
    legalBasis: "Consent (GDPR Art. 6(1)(a))",
    dataCategories: ["Preferences", "Usage History", "Behavioral Data"],
    retention: "Until consent is withdrawn or account is deleted",
    thirdParties: ["Personalization Engine Provider"],
  },
]

// Mock notifications
const initialNotifications = [
  {
    id: 1,
    title: "Consent Review Reminder",
    message: "Your marketing consent is due for review in 30 days.",
    time: "Just now",
    icon: Shield,
    color: "blue",
    unread: true,
    details:
      "We recommend reviewing your marketing consent preferences regularly to ensure they still align with your preferences. Your current marketing consent will expire in 30 days.",
    actionRequired: true,
    actionText: "Review Consent",
    actionLink: "#consents",
    timestamp: "2023-05-22T09:30:00Z",
  },
  {
    id: 2,
    title: "Data Request Processed",
    message: "Your data access request has been processed successfully.",
    time: "2 hours ago",
    icon: FileSearch,
    color: "green",
    unread: true,
    details:
      "Your request to access your personal data (REQ-2023-001) has been processed. You can now download your data from the Data Requests section.",
    actionRequired: false,
    actionText: "View Request",
    actionLink: "#requests",
    timestamp: "2023-05-22T07:15:00Z",
  },
  {
    id: 3,
    title: "Grievance Update",
    message: "Your grievance GR-2023-001 has been updated with a response.",
    time: "Yesterday",
    icon: MessageSquare,
    color: "amber",
    unread: true,
    details:
      "We've provided a response to your grievance regarding data access issues (GR-2023-001). Please review our response and let us know if you need further assistance.",
    actionRequired: true,
    actionText: "View Grievance",
    actionLink: "#grievances",
    timestamp: "2023-05-21T14:20:00Z",
  },
  {
    id: 4,
    title: "Privacy Policy Update",
    message: "Our privacy policy has been updated. Please review the changes.",
    time: "3 days ago",
    icon: FileText,
    color: "purple",
    unread: false,
    details:
      "We've updated our privacy policy to provide more clarity on how we process your data. Key changes include updated information about data retention periods and third-party processors.",
    actionRequired: true,
    actionText: "Review Policy",
    actionLink: "https://example.com/privacy",
    timestamp: "2023-05-19T10:00:00Z",
  },
  {
    id: 5,
    title: "New Feature Available",
    message: "You can now export your consent history as a PDF report.",
    time: "1 week ago",
    icon: Download,
    color: "indigo",
    unread: false,
    details:
      "We've added a new feature that allows you to export your complete consent history as a PDF report. This can be useful for your records or if you need to provide this information to other organizations.",
    actionRequired: false,
    actionText: "Try It Now",
    actionLink: "#history",
    timestamp: "2023-05-15T08:45:00Z",
  },
]

// Mock data requests
const initialDataRequests = [
  {
    id: "REQ-2023-001",
    type: "Data Access",
    typeColor: "blue",
    status: "Processing",
    statusColor: "amber",
    submitted: "2023-05-20",
    updated: "2023-05-21",
    details: "Request to access all personal data stored in the system.",
    estimatedCompletion: "2023-05-25",
    notes: "Your request is being processed. We are collecting data from all relevant systems.",
    dataCategories: ["Profile Information", "Usage Data", "Consent Records", "Communication History"],
    format: "JSON",
    history: [
      { date: "2023-05-20T10:30:00Z", status: "Submitted", note: "Request received" },
      { date: "2023-05-21T09:15:00Z", status: "Processing", note: "Request assigned to data team" },
    ],
  },
  {
    id: "REQ-2023-002",
    type: "Data Correction",
    typeColor: "amber",
    status: "Completed",
    statusColor: "green",
    submitted: "2023-04-15",
    updated: "2023-04-18",
    details: "Request to update email address from old-email@example.com to user@example.com",
    estimatedCompletion: "2023-04-20",
    notes: "Your email address has been updated successfully across all systems.",
    dataCategories: ["Profile Information"],
    format: "N/A",
    history: [
      { date: "2023-04-15T14:20:00Z", status: "Submitted", note: "Request received" },
      { date: "2023-04-16T11:30:00Z", status: "Processing", note: "Verification email sent" },
      { date: "2023-04-17T09:45:00Z", status: "Processing", note: "Verification completed" },
      { date: "2023-04-18T10:15:00Z", status: "Completed", note: "Email address updated" },
    ],
  },
  {
    id: "REQ-2023-003",
    type: "Data Portability",
    typeColor: "green",
    status: "Completed",
    statusColor: "green",
    submitted: "2023-03-10",
    updated: "2023-03-12",
    details: "Request for data in machine-readable format for transfer to another service provider.",
    estimatedCompletion: "2023-03-15",
    notes: "Your data has been exported in a machine-readable format and is available for download.",
    dataCategories: ["Profile Information", "Usage Data", "Content Data"],
    format: "CSV, JSON",
    history: [
      { date: "2023-03-10T08:30:00Z", status: "Submitted", note: "Request received" },
      { date: "2023-03-11T13:45:00Z", status: "Processing", note: "Data extraction in progress" },
      { date: "2023-03-12T15:20:00Z", status: "Completed", note: "Data export completed and available for download" },
    ],
  },
]

// Mock grievances
const initialGrievances = [
  {
    id: "GR-2023-001",
    subject: "Data Access Request Issue",
    status: "In Progress",
    statusColor: "amber",
    submitted: "2023-05-18",
    updated: "2023-05-19",
    tenant_id: "tenant-1",
    tenant_name: "Acme Corporation",
    priority: "high",
    details:
      "I submitted a data access request last week but haven't received any confirmation or response. The request is urgent as I need this information for legal proceedings.",
    type: "data-access",
    assignee: "Privacy Team",
    responses: [
      {
        date: "2023-05-19T10:30:00Z",
        from: "Privacy Officer",
        message:
          "Thank you for bringing this to our attention. We've identified the issue with your data access request and are expediting the process. We'll have your data ready within 48 hours.",
      },
    ],
  },
  {
    id: "GR-2023-002",
    subject: "Consent Withdrawal Problem",
    status: "Submitted",
    statusColor: "blue",
    submitted: "2023-05-22",
    updated: "2023-05-22",
    tenant_id: "tenant-2",
    tenant_name: "Globex Industries",
    priority: "medium",
    details:
      "I've been trying to withdraw my consent for marketing communications for the past week, but I'm still receiving promotional emails. I've used the unsubscribe link multiple times without success.",
    type: "consent",
    assignee: "Pending Assignment",
    responses: [],
  },
]

export default function UserDashboard() {
  const navigate =useNavigate()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)


  // State for consents
  const [consents, setConsents] = useState(initialConsents)
  const [refreshingConsents, setRefreshingConsents] = useState(false)
  
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false)
 const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null)


  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  

  // State for data requests
  const [dataRequests, setDataRequests] = useState(initialDataRequests)
  const [newRequestType, setNewRequestType] = useState("")
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
   const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(null);

  // State for grievances
  const [grievances, setGrievances] = useState(initialGrievances)
  // Update the grievanceForm state to include tenant_id
  const [grievanceForm, setGrievanceForm] = useState({
    tenant_id: "",
    type: "",
    subject: "",
    details: "",
    priority: "medium", // Default to medium priority
  })
  
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const [isGrievanceDialogOpen, setIsGrievanceDialogOpen] = useState(false)
const activeCount = consents.filter((c) => c.status).length;
  const totalCount = consents.length;
  // State for profile
  const [profileForm, setProfileForm] = useState({
    name: mockUserInfo.name,
    email: mockUserInfo.email,
    phone: mockUserInfo.phone,
    address: mockUserInfo.address,
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
  language: "en",
  timezone: "GMT",
  emailNotifications: true,
  theme: "light",
  colorScheme: "blue",
  animations: true,
  dataCollection: false,
  personalization: true,
  thirdPartySharing: false,
  twoFactorAuth: false, 
  });


  // Add a state for user's tenants (organizations they have consents with)
  const [userTenants, setUserTenants] = useState([
    { id: "tenant-1", name: "Acme Corporation" },
    { id: "tenant-2", name: "Globex Industries" },
    { id: "tenant-3", name: "Stark Enterprises" },
  ])

  // Simulate loading for demo purposes
  // In the useEffect where you're loading data, add code to fetch the user's tenants
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)

      // In a real implementation, you would fetch the user's tenants from your API
      // This would be organizations the user has consents with
      setUserTenants([
        { id: "tenant-1", name: "Acme Corporation" },
        { id: "tenant-2", name: "Globex Industries" },
        { id: "tenant-3", name: "Stark Enterprises" },
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle logout
 const handleLogout = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      navigate("/") // Redirect to home
    }, 1000)
  }
  // Handle consent toggle
 const handleConsentToggle = (id: string | number) => {
  setConsents(
    consents.map((consent) => {
      if (consent.id === id) {
        const newStatus = !consent.status;  // Fixed this line
        toast({
          title: newStatus ? "Consent Granted" : "Consent Revoked",
          description: `You have ${newStatus ? "granted" : "revoked"} consent for ${consent.purpose}.`,
          variant: newStatus ? "default" : "destructive",
        });
        return {
          ...consent,
          status: newStatus,
          lastUpdated: new Date().toISOString().split("T")[0],
        };
      }
      return consent;
    })
  );
  };


  // Handle refresh consents
  const handleRefreshConsents = () => {
    setRefreshingConsents(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshingConsents(false)
      toast({
        title: "Consents Refreshed",
        description: "Your consent information has been updated.",
      })
    }, 1500)
  }

  // Handle view consent details
  const handleViewConsentDetails = (consent: any) => {
  setSelectedConsent(consent)
  setIsConsentDialogOpen(true)
}


 


  // Handle export data
  const handleExportData = (type:any) => {
    toast({
      title: "Export Started",
      description: `Your ${type} data is being prepared for download.`,
    })
    // Simulate download after a delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${type} data has been downloaded.`,
      })
    }, 2000)
  }

  // Handle data deletion request
  const handleDataDeletionRequest = () => {
    if (window.confirm("Are you sure you want to request deletion of all your data? This action cannot be undone.")) {
      toast({
        title: "Deletion Request Submitted",
        description: "Your request to delete your data has been submitted.",
        variant: "destructive",
      })
    }
  }

  // Handle new data request
  const handleNewDataRequest = (type:any) => {
    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: `REQ-${new Date().getFullYear()}-${(dataRequests.length + 1).toString().padStart(3, "0")}`,
        type: type,
        typeColor: type === "Data Access" ? "blue" : type === "Data Correction" ? "amber" : "green",
        status: "Pending",
        statusColor: "purple",
        submitted: new Date().toISOString().split("T")[0],
        updated: new Date().toISOString().split("T")[0],
        details: `Request for ${type.toLowerCase()}.`,
        estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: "Your request has been submitted and is pending review.",
        dataCategories: ["Profile Information", "Usage Data"],
        format: type === "Data Portability" ? "JSON, CSV" : "N/A",
        history: [
          {
            date: new Date().toISOString(),
            status: "Submitted",
            note: "Request received",
          },
        ],
      }
      setDataRequests([newRequest, ...dataRequests])
      setSubmitting(false)
      setNewRequestType("")
      setShowNewRequestDialog(false)
      toast({
        title: "Request Submitted",
        description: `Your ${type} request has been submitted successfully.`,
      })
    }, 1500)
  }

  // Handle view request details
  const handleViewRequestDetails = (request:any) => {
    setSelectedRequest(request)
    setIsRequestDialogOpen(true)
  }

  // Handle grievance form change
  const handleGrievanceFormChange = (e:any) => {
    const { name, value } = e.target
    setGrievanceForm({ ...grievanceForm, [name]: value })
  }

  // Handle view grievance details
  const handleViewGrievanceDetails = (grievance:any) => {
    setSelectedGrievance(grievance)
    setIsGrievanceDialogOpen(true)
  }

  // Update the handleGrievanceSubmit function to include tenant_id and priority
  const handleGrievanceSubmit = (e:any) => {
    e.preventDefault()
    if (
      !grievanceForm.tenant_id ||
      !grievanceForm.type ||
      !grievanceForm.subject ||
      !grievanceForm.details ||
      !grievanceForm.priority
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const selectedTenant = userTenants.find((tenant) => tenant.id === grievanceForm.tenant_id)
      const newGrievance = {
        id: `GR-${new Date().getFullYear()}-${(grievances.length + 1).toString().padStart(3, "0")}`,
        subject: grievanceForm.subject,
        tenant_id: grievanceForm.tenant_id,
        tenant_name: selectedTenant ? selectedTenant.name : "Unknown Organization",
        status: "Submitted",
        statusColor: "blue",
        submitted: new Date().toISOString().split("T")[0],
        updated: new Date().toISOString().split("T")[0],
        priority: grievanceForm.priority,
        details: grievanceForm.details,
        type: grievanceForm.type,
        assignee: "Pending Assignment",
        responses: [],
      }
      setGrievances([newGrievance, ...grievances])
      setSubmitting(false)
      setGrievanceForm({
        tenant_id: "",
        type: "",
        subject: "",
        details: "",
        priority: "medium",
      })
      toast({
        title: "Grievance Submitted",
        description: `Your grievance has been submitted successfully to ${selectedTenant?.name}.`,
      })
    }, 1500)
  }

  // Handle profile form change
  const handleProfileFormChange = (e:any) => {
    const { name, value } = e.target
    setProfileForm({ ...profileForm, [name]: value })
  }

  // Handle profile save
  const handleProfileSave = (e:any) => {
    e.preventDefault()
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1500)
  }

  // Handle settings form change
  const handleSettingsFormChange = (name:any, value:any) => {
    setSettingsForm({ ...settingsForm, [name]: value })
  }

  // Handle settings save
  const handleSettingsSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1500)
  }

  // Handle account deletion
  const handleAccountDeletion = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully.",
          variant: "destructive",
        })
        navigate("/")
      }, 2000)
    }
  }

  // Handle file upload
  const handleFileUpload = (e:any) => {
    const file = e.target.files[0]
    if (file) {
      toast({
        title: "File Uploaded",
        description: `File "${file.name}" has been uploaded successfully.`,
      })
    }
  }

  // Helper function to get priority badge variant
  const getPriorityBadgeVariant = (priority:any) => {
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

  // Helper function to get priority icon
  const getPriorityIcon = (priority:any) => {
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

  // Format date for display
  const formatDate = (dateString:any) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-secondary/10">
        <AnimatedLoader message="Loading user dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10 animated-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              ARC User Dashboard
            </h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">DPDP Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            
            <ModeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-primary/20 bg-background/80 backdrop-blur-sm p-4 hidden md:block">
          <div className="space-y-1">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              { id: "consents", icon: Shield, label: "My Consents" },
              { id: "data", icon: FileText, label: "My Data" },
              { id: "requests", icon: FileSearch, label: "Data Requests" },
              { id: "history", icon: Clock, label: "Consent History" },
              { id: "grievances", icon: MessageSquare, label: "Grievances" },
              { id: "notifications", icon: Bell, label: "Notifications" },
              { id: "profile", icon: User, label: "Profile" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`group w-full justify-start transition-all duration-300 ${activeTab === item.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10"
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 animate-zoom ${activeTab === item.id
                      ? "text-white drop-shadow-[0_0_0.3rem_#c084fc]"
                      : "text-primary dark:text-muted"
                    }`}
                />
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}

          </div>


          <div className="mt-8 pt-4 border-t">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 card-hover-effect">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center">
                  <User className="h-4 w-4 text-primary mr-2" />
                  User Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono truncate max-w-[120px] text-primary">{mockUserInfo.user_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="truncate max-w-[120px] text-primary">{mockUserInfo.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden w-full p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 p-1 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="consents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Shield className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="more"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              >
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            {activeTab === "more" && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { id: "requests", icon: FileSearch, label: "Data Requests" },
                  { id: "history", icon: Clock, label: "History" },
                  { id: "grievances", icon: MessageSquare, label: "Grievances" },
                  { id: "notifications", icon: Bell, label: "Notifications" },
                  { id: "profile", icon: User, label: "Profile" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab(item.id)}
                    className="w-full border-primary/20 hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 transition-all duration-300"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            )}
          </Tabs>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-grid-pattern">
          {activeTab === "overview" && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      Welcome, {mockUserInfo.name}
    </h2>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Active Consents */}
{/* Active Consents */}
    <Card className="rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center text-blue-800 dark:text-blue-300">
          <Shield className="h-4 w-4 mr-2" />
          Active Consents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">
          <CountUp end={activeCount} duration={1.2} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Across {totalCount} purposes
        </p>
      </CardContent>
    </Card>

    {/* Pending Requests */}
    <Card className="rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-600 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center text-amber-800 dark:text-amber-300">
          <FileSearch className="h-4 w-4 mr-2" />
          Pending Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-amber-800 dark:text-amber-300">
          <CountUp end={3} duration={1.2} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Awaiting review
        </p>
      </CardContent>
    


          {/* Overview Tab */}
           <CardContent>
                    <div className="text-2xl font-bold text-amber-500">
                      {dataRequests.filter((r) => r.status === "Pending" || r.status === "Processing").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Last updated 2 days ago</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-100/20 border border-purple-500/20 hover:shadow-md transition-all card-hover-effect">

                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Bell className="h-4 w-4 text-purple-500 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">{Notification.length}</div>
                    <p className="text-xs text-muted-foreground">
                      unread messages
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all card-hover-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 text-primary mr-2" />
                      Consent Overview
                    </CardTitle>
                    <CardDescription>Your consent status across different purposes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                     {consents.map((consent) => (
                       <div key={consent.id}>
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-sm">{consent.purpose}</span>
                           <span className="text-sm font-medium">{consent.status ? "Granted" : "Denied"}</span>
                         </div>
                         <Progress
                           value={consent.status ? 100 : 0}
                           className="h-2 bg-primary/20"
                           onClick={() => handleConsentToggle(consent.id)}
                         />
                       </div>
                     ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all card-hover-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      Upcoming Reviews
                    </CardTitle>
                    <CardDescription>Scheduled consent reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                        <div>
                          <p className="font-medium">Marketing Consent</p>
                          <p className="text-xs text-muted-foreground">Review due in 30 days</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("consents")}>
                          Review
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                        <div>
                          <p className="font-medium">Analytics Consent</p>
                          <p className="text-xs text-muted-foreground">Review due in 45 days</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("consents")}>
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-semibold mt-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Consent Updated",
                    description: "You updated your marketing preferences",
                    time: "1 day ago",
                    icon: Shield,
                    iconColor: "text-blue-500",
                    bgColor: "bg-blue-500/10",
                  },
                  {
                    title: "Data Request Processed",
                    description: "Your data access request was processed",
                    time: "2 days ago",
                    icon: FileSearch,
                    iconColor: "text-amber-500",
                    bgColor: "bg-amber-500/10",
                  },
                  {
                    title: "Profile Updated",
                    description: "You updated your profile information",
                    time: "3 days ago",
                    icon: User,
                    iconColor: "text-green-500",
                    bgColor: "bg-green-500/10",
                  },
                  {
                    title: "Grievance Submitted",
                    description: "You submitted a new grievance regarding data access",
                    time: "4 days ago",
                    icon: MessageSquare,
                    iconColor: "text-purple-500",
                    bgColor: "bg-purple-500/10",
                  },
                  {
                    title: "Notification Settings Updated",
                    description: "You changed your notification preferences",
                    time: "5 days ago",
                    icon: Bell,
                    iconColor: "text-pink-500",
                    bgColor: "bg-pink-500/10",
                  },
                ].map((activity, index) => (
                  <Card key={index} className="hover:shadow-md transition-all card-hover-effect">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center`}
                        >
                          <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Consents Tab */}
          {activeTab === "consents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  My Consents
                </h2>
                <Button variant="outline" size="sm" onClick={handleRefreshConsents} disabled={refreshingConsents}>
                  {refreshingConsents ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Consents
                    </>
                  )}
                </Button>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Consent Summary</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Overview of your consent preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Consents Granted", count: consents.filter(c => c.status).length, color: "green" },
                      { label: "Consents Denied", count: consents.filter(c => !c.status).length, color: "red" },
                      { label: "Pending Review", count: 0, color: "amber" },
                      { label: "Days to Next Review", count: 30, color: "blue" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-5 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 shadow-inner backdrop-blur-md hover:scale-[1.03] transition-transform duration-300 animate-slide-up`}
                      >
                        <div className={`text-4xl font-bold text-${item.color}-500 drop-shadow-sm animate-pulse-slow`}>
                          <CountUp end={item.count} duration={1.5} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 text-center">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

<div className="space-y-4 mt-6 animate-fade-in">
  {consents.map((consent, index) => (
    <Card
      key={consent.id}
      className={`border border-${consent.color}-500/20 bg-background hover:shadow-lg hover:scale-[1.01] transition-all duration-300 rounded-xl animate-slide-up`}
      style={{ animationDelay: `${index * 50}ms` }} // stagger effect
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-lg">{consent.purpose}</h4>
              <Badge
                variant={consent.status ? "default" : "secondary"}
                className={`text-white ${consent.status ? "bg-green-500" : "bg-red-500"}`}
              >
                {consent.status ? "Granted" : "Denied"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{consent.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Last updated: {consent.lastUpdated}</p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center">
            <Button variant="outline" size="sm" onClick={() => handleViewConsentDetails(consent)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant={consent.status ? "destructive" : "default"}
              size="sm"
              className={
                !consent.status
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  : ""
              }
              onClick={() => handleConsentToggle(consent.id)}
            >
              {consent.status ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Grant
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

              
              
          <Card className="border border-primary/20 bg-background/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn rounded-2xl">
  <CardHeader className="space-y-1">
    <CardTitle className="text-xl font-semibold text-primary">Consent Management</CardTitle>
    <CardDescription className="text-muted-foreground">
      Additional consent management options
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="w-full border-primary/30 hover:bg-primary/10 transition-colors"
        onClick={() => handleExportData("consent")}
      >
        <Download className="h-4 w-4 mr-2 text-primary" />
        Download Consent Report
      </Button>

      <Button
        variant="outline"
        className="w-full border-primary/30 hover:bg-primary/10 transition-colors"
        onClick={() => setActiveTab("history")}
      >
        <History className="h-4 w-4 mr-2 text-primary" />
        View Consent History
      </Button>
    </div>
  </CardContent>
</Card>



          <Dialog open={isConsentDialogOpen} onOpenChange={setIsConsentDialogOpen}>
<DialogContent className="max-w-2xl p-6 sm:p-8 rounded-2xl border border-border bg-[hsl(var(--background)/0.9)] backdrop-blur-xl shadow-lg transition-all animate-fadeIn">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-primary">Consent Details</DialogTitle>
      <DialogDescription className="text-muted-foreground">
        Detailed information about your consent for <span className="font-medium text-foreground">{selectedConsent?.purpose}</span>
      </DialogDescription>
    </DialogHeader>

    {selectedConsent && (
      <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 space-y-5">
        {[
          { label: "Purpose", value: selectedConsent.purpose },
          {
            label: "Status",
            custom: (
              <Badge
                variant={selectedConsent.status ? "default" : "secondary"}
                className={`mt-1 ${selectedConsent.status ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {selectedConsent.status ? "Granted" : "Denied"}
              </Badge>
            ),
          },
          { label: "Description", value: selectedConsent.description },
          { label: "Detailed Information", value: selectedConsent.details },
          { label: "Legal Basis", value: selectedConsent.legalBasis },
          {
            label: "Data Categories",
            custom: (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedConsent.dataCategories.map((category, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                    {category}
                  </Badge>
                ))}
              </div>
            ),
          },
          { label: "Data Retention", value: selectedConsent.retention },
          {
            label: "Third Parties",
            custom: (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedConsent.thirdParties.map((party, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                    {party}
                  </Badge>
                ))}
              </div>
            ),
          },
          { label: "Last Updated", value: selectedConsent.lastUpdated },
        ].map(({ label, value, custom }, index) => (
          <div key={index}>
            <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
            {custom || <p className="text-sm text-foreground mt-1">{value}</p>}
          </div>
        ))}
      </div>
    )}

    <DialogFooter className="mt-6 flex justify-between items-center">
      <Button
        variant="outline"
        className="border-primary/20 hover:bg-muted transition-all"
        onClick={() => setIsConsentDialogOpen(false)}
      >
        Close
      </Button>

      <Button
        variant={selectedConsent?.status ? "destructive" : "default"}
        className={
          !selectedConsent?.status
            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm"
            : ""
        }
        onClick={() => {
          if (!selectedConsent) return;
          handleConsentToggle(selectedConsent.id);
          setIsConsentDialogOpen(false);
        }}
      >
        {selectedConsent?.status ? (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Revoke Consent
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Grant Consent
          </>
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</div> 
)}


            
            {/*user data tab*/}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  My Data
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportData("all")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDataDeletionRequest}>
                    <Trash className="h-4 w-4 mr-2" />
                    Request Deletion
                  </Button>
                </div>
              </div>
              <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Data Categories</CardTitle>
                  <CardDescription>Overview of your personal data we store</CardDescription>
                </CardHeader>
                <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Profile Information */}
    <Card className="bg-blue-500/10 border-blue-500/20 relative overflow-hidden">
      <div className="absolute top-3 right-3 p-2 rounded-full bg-blue-500/20 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-blue-500/50 hover:bg-blue-500/30">
        <User className="h-5 w-5 text-blue-500 drop-shadow" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span>{mockUserInfo.name}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{mockUserInfo.email}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span>{mockUserInfo.phone}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <span className="truncate max-w-[150px]">{mockUserInfo.address}</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            toast({
              title: "Profile Data",
              description: "Viewing detailed profile information.",
            });
            setActiveTab("profile");
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>

    {/* Activity Data */}
    <Card className="bg-purple-500/10 border-purple-500/20 relative overflow-hidden">
      <div className="absolute top-3 right-3 p-2 rounded-full bg-purple-500/20 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-purple-500/50 hover:bg-purple-500/30">
        <BarChart className="h-5 w-5 text-purple-500 drop-shadow" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Activity Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Login History:</span>
            <span>15 records</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Consent Changes:</span>
            <span>7 records</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Data Requests:</span>
            <span>3 records</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Grievances:</span>
            <span>1 record</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            toast({
              title: "Activity Data",
              description: "Viewing detailed activity information.",
            });
            setActiveTab("history");
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>

    {/* Preference Data */}
    <Card className="bg-amber-500/10 border-amber-500/20 relative overflow-hidden">
      <div className="absolute top-3 right-3 p-2 rounded-full bg-amber-500/20 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-amber-500/50 hover:bg-amber-500/30">
        <SlidersHorizontal className="h-5 w-5 text-amber-500 drop-shadow" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Preference Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Communication:</span>
            <span>Email, SMS</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Language:</span>
            <span>English</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Theme:</span>
            <span>System Default</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Notifications:</span>
            <span>Enabled</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            toast({
              title: "Preference Data",
              description: "Viewing detailed preference information.",
            });
            setActiveTab("settings");
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  </div>
</CardContent>
</Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Data Usage Card */}
  <Card className="group bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Data Usage</CardTitle>
      <CardDescription className="text-muted-foreground">
        How your data is being used
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-300">
        <h4 className="font-medium flex items-center">
          <Shield className="h-5 w-5 text-blue-500 mr-2 transition-transform duration-300 group-hover:scale-110" />
          Service Provision
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Your profile data is used to provide our core services and features.
        </p>
      </div>
      <div className="p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
        <h4 className="font-medium flex items-center">
          <BarChart className="h-5 w-5 text-green-500 mr-2 transition-transform duration-300 group-hover:scale-110" />
          Analytics
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Your activity data is analyzed to improve our services and user experience.
        </p>
      </div>
      <div className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors duration-300">
        <h4 className="font-medium flex items-center">
          <Bell className="h-5 w-5 text-purple-500 mr-2 transition-transform duration-300 group-hover:scale-110" />
          Marketing
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Your preference data is used to send you relevant marketing communications.
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Data Retention Card */}
  <Card className="group bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Data Retention</CardTitle>
      <CardDescription className="text-muted-foreground">
        How long we keep your data
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-300">
        <div>
          <h4 className="font-medium">Profile Information</h4>
          <p className="text-sm text-muted-foreground">Retained until account deletion</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-sm">
          Active
        </Badge>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors duration-300">
        <div>
          <h4 className="font-medium">Activity Data</h4>
          <p className="text-sm text-muted-foreground">Retained for 24 months</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm">
          18 months left
        </Badge>
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition-colors duration-300">
        <div>
          <h4 className="font-medium">Login History</h4>
          <p className="text-sm text-muted-foreground">Retained for 12 months</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 shadow-sm">
          6 months left
        </Badge>
      </div>
    </CardContent>
  </Card>
</div>
</div>
)
}

          {/* Data Requests Tab */}
         {activeTab === "requests" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
        Data Requests
      </h2>
      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition"
        onClick={() => setShowNewRequestDialog(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Request
      </Button>
    </div>

    {showNewRequestDialog && (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 hover:shadow-xl transition-all rounded-2xl">
        <CardHeader>
          <CardTitle>Create New Request</CardTitle>
          <CardDescription>Select the type of data request you want to submit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-type">Request Type</Label>
              <Select value={newRequestType} onValueChange={setNewRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Access">Data Access</SelectItem>
                  <SelectItem value="Data Deletion">Data Deletion</SelectItem>
                  <SelectItem value="Data Correction">Data Correction</SelectItem>
                  <SelectItem value="Data Portability">Data Portability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newRequestType === "Data Correction" && (
              <div className="space-y-2">
                <Label htmlFor="correction-details">Correction Details</Label>
                <Textarea
                  id="correction-details"
                  placeholder="Please describe what information needs to be corrected"
                  rows={3}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleNewDataRequest(newRequestType)}
            disabled={!newRequestType || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </CardFooter>
      </Card>
    )}

    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 hover:shadow-xl transition-all rounded-2xl">
      <CardHeader>
        <CardTitle>Request Types</CardTitle>
        <CardDescription>Types of data requests you can submit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Access */}
          <Card className="bg-blue-500/10 border border-blue-500/20 hover:shadow-xl rounded-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 animate-bounce">
                  <Download className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">Data Access</h3>
                <p className="text-sm text-muted-foreground mt-2">Request a copy of all your personal data</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setNewRequestType("Data Access")
                    setShowNewRequestDialog(true)
                  }}
                >
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deletion (No animation) */}
          <Card className="bg-red-500/10 border border-red-500/20 hover:shadow-xl rounded-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <Trash className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-semibold text-red-600 dark:text-red-400">Data Deletion</h3>
                <p className="text-sm text-muted-foreground mt-2">Request deletion of your personal data</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setNewRequestType("Data Deletion")
                    setShowNewRequestDialog(true)
                  }}
                >
                  Request Deletion
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Correction */}
          <Card className="bg-amber-500/10 border border-amber-500/20 hover:shadow-xl rounded-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 animate-bounce">
                  <Edit className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-semibold text-amber-600 dark:text-amber-400">Data Correction</h3>
                <p className="text-sm text-muted-foreground mt-2">Request correction of inaccurate data</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setNewRequestType("Data Correction")
                    setShowNewRequestDialog(true)
                  }}
                >
                  Request Correction
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portability */}
          <Card className="bg-green-500/10 border border-green-500/20 hover:shadow-xl rounded-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-bounce">
                  <Upload className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-green-600 dark:text-green-400">Data Portability</h3>
                <p className="text-sm text-muted-foreground mt-2">Request data in machine-readable format</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setNewRequestType("Data Portability")
                    setShowNewRequestDialog(true)
                  }}
                >
                  Request Portability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border dark:border-zinc-800 hover:shadow-2xl transition-all duration-300 rounded-2xl shadow-md dark:shadow-none">
  <CardHeader className="pb-4 border-b border-border dark:border-zinc-800">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <CardTitle className="text-lg font-semibold text-foreground">Request History</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Your previous data requests</CardDescription>
      </div>
      <div className="relative w-full sm:w-[250px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search requests..."
          className="pl-8 rounded-lg border border-border dark:border-zinc-700 bg-background shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40 transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <div className="rounded-xl border border-border dark:border-zinc-800 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50 dark:bg-muted/10 backdrop-blur-sm">
          <TableRow>
            <TableHead className="text-muted-foreground">Request ID</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Submitted</TableHead>
            <TableHead className="text-muted-foreground">Updated</TableHead>
            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dataRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No data requests found
              </TableCell>
            </TableRow>
          ) : (
            dataRequests
              .filter(
                (request) =>
                  request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  request.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  request.status.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((request) => (
                <TableRow key={request.id} className="hover:bg-muted/20 transition">
                  <TableCell className="font-mono text-sm text-foreground">{request.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`bg-${request.typeColor}-500/10 text-${request.typeColor}-700 dark:text-${request.typeColor}-300`}
                    >
                      {request.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className={`bg-${request.statusColor}-500`}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.submitted}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.updated}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewRequestDetails(request)}
                      className="hover:bg-primary/10 hover:text-primary transition"
                    >
                      <Eye className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm font-medium">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>

  

   <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
  <DialogContent
    className="max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-xl transition-all duration-300"
  >
    <div className="flex flex-col h-full">
      {/* Header */}
      <DialogHeader className="mb-4">
        <DialogTitle className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Request Details</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Detailed information about your data request
        </DialogDescription>
      </DialogHeader>

      {/* Scrollable Content */}
      {selectedRequest && (
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scroll">
          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Request ID</h4>
            <p className="text-sm font-mono text-muted-foreground">{selectedRequest.id}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Type</h4>
            <Badge
              variant="outline"
              className={`mt-1 bg-${selectedRequest.typeColor}-500/10 text-${selectedRequest.typeColor}-700 dark:text-${selectedRequest.typeColor}-300`}
            >
              {selectedRequest.type}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Status</h4>
            <Badge variant="default" className={`mt-1 bg-${selectedRequest.statusColor}-500`}>
              {selectedRequest.status}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Details</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest.details}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Data Categories</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRequest.dataCategories.map((category, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Format</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest.format}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Estimated Completion</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest.estimatedCompletion}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Notes</h4>
            <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">Request History</h4>
            <div className="space-y-4 pl-3 border-l-2 border-primary/30">
              {selectedRequest.history.map((item, index) => (
                <div key={index} className="relative pl-4">
                  <div className="absolute w-2 h-2 rounded-full bg-primary left-[-10px] top-1.5 shadow-md" />
                  <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{item.status}</p>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <DialogFooter className="pt-4">
        <Button
          onClick={() => setIsRequestDialogOpen(false)}
          className="transition hover:scale-[1.02] active:scale-95"
        >
          Close
        </Button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>
</div>
 )}

    {activeTab === "history" && (
  <div className="space-y-10 animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Consent History
      </h2>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:shadow-sm transition"
          onClick={() => {
            setSearchQuery("");
            toast({
              title: "Filters Reset",
              description: "All filters have been reset.",
            });
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hover:shadow-sm transition"
          onClick={() => handleExportData("consent-history")}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    {/* Timeline Card */}
    <Card className="relative overflow-hidden border border-border/30 bg-gradient-to-br from-muted/10 via-background to-muted/5 hover:shadow-xl transition-all rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Consent Timeline</CardTitle>
        <CardDescription>Visual timeline of your consent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l-2 border-dashed border-primary/30 space-y-12">
          {[
            {
              date: "May 16, 2023",
              time: "14:20",
              purpose: "Third-party Sharing",
              action: "Consent Revoked",
              description: "You revoked consent for sharing data with third parties",
              color: "red",
            },
            {
              date: "May 15, 2023",
              time: "10:30",
              purpose: "Marketing Communications",
              action: "Consent Granted",
              description: "You granted consent for marketing communications",
              color: "green",
            },
            {
              date: "May 15, 2023",
              time: "10:30",
              purpose: "Data Analytics",
              action: "Consent Granted",
              description: "You granted consent for data analytics",
              color: "green",
            },
            {
              date: "May 15, 2023",
              time: "10:30",
              purpose: "Personalization",
              action: "Consent Granted",
              description: "You granted consent for personalization",
              color: "green",
            },
            {
              date: "May 15, 2023",
              time: "10:30",
              purpose: "Third-party Sharing",
              action: "Consent Granted",
              description: "You granted consent for sharing data with third parties",
              color: "green",
            },
            {
              date: "May 15, 2023",
              time: "10:25",
              purpose: "Account Creation",
              action: "Account Created",
              description: "You created your account and accepted the Terms of Service",
              color: "blue",
            },
          ].map((event, index) => (
            <div
              key={index}
              className="relative pl-4 group transition-all duration-300"
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[22px] w-4 h-4 rounded-full bg-${event.color}-500 ring-4 ring-white dark:ring-background shadow-lg`}
              />

              {/* Date and Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {event.date} • {event.time}
                </span>
                <Badge
                  className={`bg-gradient-to-r from-${event.color}-500/20 to-${event.color}-400/20 text-${event.color}-600 dark:text-${event.color}-300 border-none backdrop-blur-sm px-3`}
                >
                  {event.action}
                </Badge>
              </div>

              {/* Purpose & Description */}
              <h4 className="text-base font-semibold mt-1 text-foreground">{event.purpose}</h4>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  

    <Card className="bg-gradient-to-br from-muted/10 via-background to-muted/5 border border-border/30 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-foreground">Consent Statistics</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Summary of your consent activity
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Consent Changes */}
      <Card className="relative overflow-hidden border-none bg-blue-500/10 backdrop-blur-sm rounded-xl shadow hover:scale-[1.02] transition-all group">
        <CardContent className="p-6 text-center space-y-2">
          <div className="text-4xl font-bold text-blue-500 group-hover:scale-110 transition-transform">
            6
          </div>
          <p className="text-sm text-muted-foreground">Total Consent Changes</p>
          <div className="absolute -top-2 -right-2 h-20 w-20 bg-blue-400/10 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-all" />
        </CardContent>
      </Card>

      {/* Consents Granted */}
      <Card className="relative overflow-hidden border-none bg-green-500/10 backdrop-blur-sm rounded-xl shadow hover:scale-[1.02] transition-all group">
        <CardContent className="p-6 text-center space-y-2">
          <div className="text-4xl font-bold text-green-500 group-hover:scale-110 transition-transform">
            5
          </div>
          <p className="text-sm text-muted-foreground">Consents Granted</p>
          <div className="absolute -top-2 -right-2 h-20 w-20 bg-green-400/10 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-all" />
        </CardContent>
      </Card>

      {/* Consents Revoked */}
      <Card className="relative overflow-hidden border-none bg-red-500/10 backdrop-blur-sm rounded-xl shadow hover:scale-[1.02] transition-all group">
        <CardContent className="p-6 text-center space-y-2">
          <div className="text-4xl font-bold text-red-500 group-hover:scale-110 transition-transform">
            1
          </div>
          <p className="text-sm text-muted-foreground">Consents Revoked</p>
          <div className="absolute -top-2 -right-2 h-20 w-20 bg-red-400/10 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-all" />
        </CardContent>
      </Card>
    </div>
  </CardContent>
</Card>
</div>
    )}

          {/* Grievances Tab */}
          {activeTab === "grievances" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
        Grievances
      </h2>
      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-indigo-600 to-purple-600"
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          toast({
            title: "Submit Grievance",
            description: "Scroll down to fill out the grievance form.",
          });
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Submit Grievance
      </Button>
    </div>

    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Grievance Types</CardTitle>
        <CardDescription>Types of grievances you can submit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/10 border-blue-500/20 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium">Data Protection</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Issues related to how your data is protected
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <FileSearch className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-medium">Data Access</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Issues related to accessing your personal data
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/20 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-medium">Consent Issues</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Issues related to consent management
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Grievance History</CardTitle>
            <CardDescription>Your previously submitted grievances</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search grievances..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {grievances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No grievances found
                  </TableCell>
                </TableRow>
              ) : (
                grievances
                  .filter(
                    (grievance) =>
                      grievance.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      grievance.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (grievance.tenant_name &&
                        grievance.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      grievance.status.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((grievance) => (
                    <TableRow key={grievance.id}>
                      <TableCell className="font-medium">{grievance.id}</TableCell>
                      <TableCell>{grievance.tenant_name || "N/A"}</TableCell>
                      <TableCell>{grievance.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getPriorityBadgeVariant(grievance.priority)}
                          className="flex items-center w-fit"
                        >
                          {getPriorityIcon(grievance.priority)}
                          {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className={`bg-${grievance.statusColor}-500`}>
                          {grievance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{grievance.submitted}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewGrievanceDetails(grievance)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Submit a New Grievance</CardTitle>
        <CardDescription>If you have any concerns about your data or privacy</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleGrievanceSubmit}>
          <div className="space-y-2">
            <Label htmlFor="tenant-id">Organization</Label>
            <Select
              value={grievanceForm.tenant_id}
              onValueChange={(value) => setGrievanceForm({ ...grievanceForm, tenant_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
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
            <Label htmlFor="grievance-type">Grievance Type</Label>
            <Select
              value={grievanceForm.type}
              onValueChange={(value) => setGrievanceForm({ ...grievanceForm, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-protection">Data Protection</SelectItem>
                <SelectItem value="data-access">Data Access</SelectItem>
                <SelectItem value="consent-issues">Consent Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={grievanceForm.subject}
              onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={grievanceForm.details}
              onChange={(e) => setGrievanceForm({ ...grievanceForm, details: e.target.value })}
              required
              rows={5}
            />
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Submit Grievance
          </Button>
        </form>
      </CardContent>
    </Card>

    {selectedGrievance && (
      <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Grievance Details</DialogTitle>
            <DialogDescription>
              Details for grievance ID: {selectedGrievance.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Subject</h3>
              <p>{selectedGrievance.subject}</p>
            </div>

            <div>
              <h3 className="font-semibold">Status</h3>
              <Badge
                variant="default"
                className={`bg-${selectedGrievance.statusColor}-500 px-2 py-1 rounded-md`}
              >
                {selectedGrievance.status}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold">Submitted</h3>
              <p>{selectedGrievance.submitted}</p>
            </div>

            <div>
              <h3 className="font-semibold">Details</h3>
              <p>{selectedGrievance.details}</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setSelectedGrievance(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </div>
)}
    {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  Profile
                </h2>
                <Button variant="outline" size="sm" onClick={handleProfileSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Your profile photo and information</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={mockUserInfo.profile_image || "/placeholder.svg"} alt={mockUserInfo.name} />
                      <AvatarFallback>{mockUserInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{mockUserInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{mockUserInfo.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Member since {new Date(mockUserInfo.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-4 space-y-2 w-full">
                     <Button
    size="sm"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
    onClick={() => {
      const el = document.getElementById("profile-photo-upload");
      if (el) el.click();
    }}
  >
    <Upload className="h-4 w-4 mr-2" />
    Upload New Photo
  </Button>

  <input
    id="profile-photo-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleFileUpload}
  />

  <Button
    size="sm"
    className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-md transition-colors"
    onClick={() => {
      toast({
        title: "Photo Removed",
        description: "Your profile photo has been removed.",
      });
    }}
  >
    <Trash className="h-4 w-4 mr-2" />
    Remove Photo
  </Button>


                    </div>        
                  </CardContent>
                </Card>
            

                <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleProfileSave}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={profileForm.name} onChange={handleProfileFormChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileFormChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileFormChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileFormChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself"
                          value={profileForm.bio}
                          onChange={handleProfileFormChange}
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

          <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 hover:shadow-xl hover:border-primary/30 transition-all duration-300 rounded-2xl">
  <CardHeader className="space-y-1">
    <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Account Security</CardTitle>
    <CardDescription className="text-muted-foreground text-sm">
      Manage your account security settings
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={profileForm.currentPassword}
            onChange={handleProfileFormChange}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div></div>
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={profileForm.newPassword}
            onChange={handleProfileFormChange}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={profileForm.confirmPassword}
            onChange={handleProfileFormChange}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/10">
        <div className="space-y-0.5">
          <Label className="text-base font-medium">Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
        </div>
        <Switch
          checked={settingsForm.twoFactorAuth}
          onCheckedChange={(checked) => handleSettingsFormChange("twoFactorAuth", checked)}
        />
      </div>

      <Separator />
    </div>
  </CardContent>

  <CardFooter className="flex justify-between pt-4">
    <Button
      variant="outline"
      className="rounded-xl border-muted-foreground hover:border-primary/40 transition-colors"
      onClick={() => {
        setProfileForm({
          ...profileForm,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }}
    >
      Cancel
    </Button>
    <Button
      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 transition-all"
      onClick={() => {
        if (
          profileForm.newPassword &&
          profileForm.newPassword === profileForm.confirmPassword &&
          profileForm.currentPassword
        ) {
          toast({
            title: "Password Updated",
            description: "Your password has been updated successfully.",
          })
          setProfileForm({
            ...profileForm,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
        } else if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "New password and confirmation do not match.",
            variant: "destructive",
          })
        } else if (profileForm.newPassword && !profileForm.currentPassword) {
          toast({
            title: "Current Password Required",
            description: "Please enter your current password.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "No Changes",
            description: "No password changes were made.",
          })
        }
      }}
    >
      Save Changes
    </Button>
  </CardFooter>
</Card>
</div>
)}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  Settings
                </h2>
                <Button variant="outline" size="sm" onClick={handleSettingsSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>Manage your general account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settingsForm.language}
                          onValueChange={(value) => handleSettingsFormChange("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="te">Telugu</SelectItem>
                            <SelectItem value="bn">Bengali</SelectItem>
                            <SelectItem value="mr">Marathi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settingsForm.timezone}
                          onValueChange={(value) => handleSettingsFormChange("timezone", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                            <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive important notifications via email</p>
                        </div>
                        <Switch
                          checked={settingsForm.emailNotifications}
                          onCheckedChange={(checked) => handleSettingsFormChange("emailNotifications", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 mt-4">
                  <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize how the dashboard looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                          value={settingsForm.theme}
                          onValueChange={(value) => handleSettingsFormChange("theme", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System Default</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color-scheme">Color Scheme</Label>
                        <Select
                          value={settingsForm.colorScheme}
                          onValueChange={(value) => handleSettingsFormChange("colorScheme", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color scheme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indigo">Indigo (Default)</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="pink">Pink</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable animations throughout the interface</p>
                        </div>
                        <Switch
                          checked={settingsForm.animations}
                          onCheckedChange={(checked) => handleSettingsFormChange("animations", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 mt-4">
                  <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Consent Updates</Label>
                          <p className="text-sm text-muted-foreground">Notifications about consent changes</p>
                        </div>
                       
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Communications</Label>
                          <p className="text-sm text-muted-foreground">Promotional and marketing messages</p>
                        </div>
                       </div>
                    </Card>
                  
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4 mt-4">
                  <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage your privacy preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Data Collection</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow collection of usage data to improve services
                          </p>
                        </div>
                        <Switch
                          checked={settingsForm.dataCollection}
                          onCheckedChange={(checked) => handleSettingsFormChange("dataCollection", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Personalization</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow personalization based on your preferences
                          </p>
                        </div>
                        <Switch
                          checked={settingsForm.personalization}
                          onCheckedChange={(checked) => handleSettingsFormChange("personalization", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Third-party Sharing</Label>
                          <p className="text-sm text-muted-foreground">Allow sharing data with trusted partners</p>
                        </div>
                        <Switch
                          checked={settingsForm.thirdPartySharing}
                          onCheckedChange={(checked) => handleSettingsFormChange("thirdPartySharing", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="space-y-2 pt-4">
                        <Button variant="destructive" className="w-full" onClick={handleAccountDeletion}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete My Account
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          This action is irreversible and will permanently delete all your data.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
    </div>
  </div>
  )
}

