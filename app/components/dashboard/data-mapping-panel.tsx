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
  Plus,
  Edit,
  Trash2,
  Database,
  HardDrive,
  Cloud,
  Globe,
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  Link,
  Eye,
} from "lucide-react"

interface DataCategory {
  id: string
  name: string
  description: string
  sensitivity: "low" | "medium" | "high" | "special"
  examples: string[]
  purposes: string[]
  retention: string
  legalBasis: string
}

interface DataProcessor {
  id: string
  name: string
  type: "internal" | "third-party" | "sub-processor"
  location: string
  description: string
  categories: string[]
  transferMechanism?: string
  contractDate?: string
  dpaStatus: "signed" | "pending" | "expired" | "not-required"
  riskLevel: "low" | "medium" | "high"
}

interface DataStorage {
  id: string
  name: string
  type: "database" | "file-system" | "cloud-storage" | "saas" | "physical"
  location: string
  description: string
  categories: string[]
  encryption: boolean
  backupFrequency?: string
  retentionImplemented: boolean
  accessControls: string[]
}

interface DataFlow {
  id: string
  name: string
  description: string
  source: string
  destination: string
  categories: string[]
  frequency: "real-time" | "daily" | "weekly" | "monthly" | "ad-hoc"
  transferMethod: string
  encryptionInTransit: boolean
}

export default function DataMappingPanel() {
  const [activeTab, setActiveTab] = useState("categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Data states
  const [categories, setCategories] = useState<DataCategory[]>([])
  const [processors, setProcessors] = useState<DataProcessor[]>([])
  const [storages, setStorages] = useState<DataStorage[]>([])
  const [flows, setFlows] = useState<DataFlow[]>([])

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [processorDialogOpen, setProcessorDialogOpen] = useState(false)
  const [storageDialogOpen, setStorageDialogOpen] = useState(false)
  const [flowDialogOpen, setFlowDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Current item states
  const [currentCategory, setCurrentCategory] = useState<DataCategory | null>(null)
  const [currentProcessor, setCurrentProcessor] = useState<DataProcessor | null>(null)
  const [currentStorage, setCurrentStorage] = useState<DataStorage | null>(null)
  const [currentFlow, setCurrentFlow] = useState<DataFlow | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null)

  // Form states
  const [categoryForm, setCategoryForm] = useState<Partial<DataCategory>>({
    name: "",
    description: "",
    sensitivity: "medium",
    examples: [],
    purposes: [],
    retention: "",
    legalBasis: "",
  })

  const [processorForm, setProcessorForm] = useState<Partial<DataProcessor>>({
    name: "",
    type: "internal",
    location: "",
    description: "",
    categories: [],
    transferMechanism: "",
    dpaStatus: "pending",
    riskLevel: "medium",
  })

  const [storageForm, setStorageForm] = useState<Partial<DataStorage>>({
    name: "",
    type: "database",
    location: "",
    description: "",
    categories: [],
    encryption: false,
    backupFrequency: "",
    retentionImplemented: false,
    accessControls: [],
  })

  const [flowForm, setFlowForm] = useState<Partial<DataFlow>>({
    name: "",
    description: "",
    source: "",
    destination: "",
    categories: [],
    frequency: "daily",
    transferMethod: "",
    encryptionInTransit: false,
  })

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sensitivityFilter, setSensitivityFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    // Simulate API call to fetch data
    const timer = setTimeout(() => {
      // Mock data
      const mockCategories: DataCategory[] = [
        {
          id: "cat-001",
          name: "Personal Identifiers",
          description: "Basic information that can identify an individual",
          sensitivity: "medium",
          examples: ["Name", "Email", "Phone Number", "Address"],
          purposes: ["Account Creation", "Communication", "Shipping"],
          retention: "7 years after account closure",
          legalBasis: "Contract Performance",
        },
        {
          id: "cat-002",
          name: "Financial Information",
          description: "Data related to financial transactions and payment methods",
          sensitivity: "high",
          examples: ["Credit Card Number", "Bank Account", "Transaction History"],
          purposes: ["Payment Processing", "Fraud Prevention"],
          retention: "3 years after last transaction",
          legalBasis: "Contract Performance",
        },
        {
          id: "cat-003",
          name: "Biometric Data",
          description: "Physical or behavioral human characteristics",
          sensitivity: "special",
          examples: ["Fingerprints", "Facial Recognition", "Voice Patterns"],
          purposes: ["Authentication", "Security"],
          retention: "Until user revokes consent or account closure",
          legalBasis: "Explicit Consent",
        },
        {
          id: "cat-004",
          name: "Usage Data",
          description: "Information about how users interact with services",
          sensitivity: "low",
          examples: ["Pages Visited", "Features Used", "Time Spent"],
          purposes: ["Service Improvement", "Analytics"],
          retention: "2 years from collection",
          legalBasis: "Legitimate Interest",
        },
        {
          id: "cat-005",
          name: "Health Information",
          description: "Data related to physical or mental health",
          sensitivity: "special",
          examples: ["Medical History", "Diagnoses", "Treatment Plans"],
          purposes: ["Health Services", "Research"],
          retention: "10 years after last service",
          legalBasis: "Explicit Consent",
        },
      ]

      const mockProcessors: DataProcessor[] = [
        {
          id: "proc-001",
          name: "Internal Data Team",
          type: "internal",
          location: "India",
          description: "Company's internal data processing team",
          categories: ["Personal Identifiers", "Usage Data"],
          dpaStatus: "not-required",
          riskLevel: "low",
        },
        {
          id: "proc-002",
          name: "CloudPay Services",
          type: "third-party",
          location: "United States",
          description: "Payment processing service provider",
          categories: ["Financial Information", "Personal Identifiers"],
          transferMechanism: "Standard Contractual Clauses",
          contractDate: "2023-01-15",
          dpaStatus: "signed",
          riskLevel: "high",
        },
        {
          id: "proc-003",
          name: "AnalyticsPlus",
          type: "third-party",
          location: "European Union",
          description: "Analytics and user behavior tracking",
          categories: ["Usage Data"],
          transferMechanism: "Adequacy Decision",
          contractDate: "2022-11-30",
          dpaStatus: "signed",
          riskLevel: "medium",
        },
        {
          id: "proc-004",
          name: "SecureID Verification",
          type: "third-party",
          location: "United Kingdom",
          description: "Identity verification service",
          categories: ["Personal Identifiers", "Biometric Data"],
          transferMechanism: "Standard Contractual Clauses",
          contractDate: "2023-03-22",
          dpaStatus: "signed",
          riskLevel: "high",
        },
      ]

      const mockStorages: DataStorage[] = [
        {
          id: "store-001",
          name: "User Database",
          type: "database",
          location: "India",
          description: "Primary PostgreSQL database for user accounts",
          categories: ["Personal Identifiers", "Usage Data"],
          encryption: true,
          backupFrequency: "Daily",
          retentionImplemented: true,
          accessControls: ["Role-based Access", "IP Restriction", "Audit Logging"],
        },
        {
          id: "store-002",
          name: "Payment Processing System",
          type: "saas",
          location: "United States",
          description: "Third-party payment processing platform",
          categories: ["Financial Information"],
          encryption: true,
          backupFrequency: "Real-time",
          retentionImplemented: true,
          accessControls: ["2FA", "Encryption", "Tokenization"],
        },
        {
          id: "store-003",
          name: "Document Storage",
          type: "cloud-storage",
          location: "European Union",
          description: "Cloud storage for user documents and uploads",
          categories: ["Personal Identifiers"],
          encryption: true,
          backupFrequency: "Weekly",
          retentionImplemented: false,
          accessControls: ["Access Keys", "Encryption"],
        },
        {
          id: "store-004",
          name: "Analytics Data Warehouse",
          type: "database",
          location: "European Union",
          description: "Data warehouse for analytics and reporting",
          categories: ["Usage Data"],
          encryption: false,
          backupFrequency: "Monthly",
          retentionImplemented: true,
          accessControls: ["Role-based Access"],
        },
      ]

      const mockFlows: DataFlow[] = [
        {
          id: "flow-001",
          name: "User Registration Flow",
          description: "Data flow from registration form to user database",
          source: "Web Application",
          destination: "User Database",
          categories: ["Personal Identifiers"],
          frequency: "real-time",
          transferMethod: "API",
          encryptionInTransit: true,
        },
        {
          id: "flow-002",
          name: "Payment Processing Flow",
          description: "Transfer of payment information to payment processor",
          source: "Web Application",
          destination: "CloudPay Services",
          categories: ["Financial Information", "Personal Identifiers"],
          frequency: "real-time",
          transferMethod: "API",
          encryptionInTransit: true,
        },
        {
          id: "flow-003",
          name: "Analytics Data Export",
          description: "Export of usage data to analytics platform",
          source: "Web Application",
          destination: "AnalyticsPlus",
          categories: ["Usage Data"],
          frequency: "daily",
          transferMethod: "Batch Export",
          encryptionInTransit: true,
        },
        {
          id: "flow-004",
          name: "Backup Process",
          description: "Database backup to cloud storage",
          source: "User Database",
          destination: "Cloud Backup",
          categories: ["Personal Identifiers", "Financial Information", "Usage Data"],
          frequency: "daily",
          transferMethod: "Automated Backup",
          encryptionInTransit: true,
        },
      ]

      setCategories(mockCategories)
      setProcessors(mockProcessors)
      setStorages(mockStorages)
      setFlows(mockFlows)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getSensitivityBadge = (sensitivity: string) => {
    switch (sensitivity) {
      case "low":
        return <Badge variant="outline">Low</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "high":
        return <Badge variant="warning">High</Badge>
      case "special":
        return <Badge variant="destructive">Special Category</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getProcessorTypeBadge = (type: string) => {
    switch (type) {
      case "internal":
        return <Badge variant="outline">Internal</Badge>
      case "third-party":
        return <Badge variant="secondary">Third Party</Badge>
      case "sub-processor":
        return <Badge variant="warning">Sub-processor</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDPAStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge variant="success">Signed</Badge>
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "not-required":
        return <Badge variant="outline">Not Required</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStorageTypeBadge = (type: string) => {
    switch (type) {
      case "database":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" /> Database
          </Badge>
        )
      case "file-system":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" /> File System
          </Badge>
        )
      case "cloud-storage":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Cloud className="h-3 w-3" /> Cloud Storage
          </Badge>
        )
      case "saas":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> SaaS
          </Badge>
        )
      case "physical":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" /> Physical
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getFlowFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case "real-time":
        return <Badge variant="secondary">Real-time</Badge>
      case "daily":
        return <Badge variant="outline">Daily</Badge>
      case "weekly":
        return <Badge variant="outline">Weekly</Badge>
      case "monthly":
        return <Badge variant="outline">Monthly</Badge>
      case "ad-hoc":
        return <Badge variant="warning">Ad-hoc</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleAddCategory = () => {
    if (!categoryForm.name || !categoryForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newCategory: DataCategory = {
      id: `cat-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      name: categoryForm.name || "",
      description: categoryForm.description || "",
      sensitivity: (categoryForm.sensitivity as "low" | "medium" | "high" | "special") || "medium",
      examples: categoryForm.examples || [],
      purposes: categoryForm.purposes || [],
      retention: categoryForm.retention || "",
      legalBasis: categoryForm.legalBasis || "",
    }

    setCategories([...categories, newCategory])
    setCategoryForm({
      name: "",
      description: "",
      sensitivity: "medium",
      examples: [],
      purposes: [],
      retention: "",
      legalBasis: "",
    })
    setCategoryDialogOpen(false)

    toast({
      title: "Category added",
      description: `Data category "${newCategory.name}" has been added.`,
    })
  }

  const handleUpdateCategory = () => {
    if (!currentCategory || !categoryForm.name || !categoryForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === currentCategory.id
        ? {
            ...cat,
            name: categoryForm.name || cat.name,
            description: categoryForm.description || cat.description,
            sensitivity: (categoryForm.sensitivity as "low" | "medium" | "high" | "special") || cat.sensitivity,
            examples: categoryForm.examples || cat.examples,
            purposes: categoryForm.purposes || cat.purposes,
            retention: categoryForm.retention || cat.retention,
            legalBasis: categoryForm.legalBasis || cat.legalBasis,
          }
        : cat,
    )

    setCategories(updatedCategories)
    setCategoryForm({
      name: "",
      description: "",
      sensitivity: "medium",
      examples: [],
      purposes: [],
      retention: "",
      legalBasis: "",
    })
    setCategoryDialogOpen(false)

    toast({
      title: "Category updated",
      description: `Data category "${currentCategory.name}" has been updated.`,
    })
  }

  const handleAddProcessor = () => {
    if (!processorForm.name || !processorForm.location || !processorForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newProcessor: DataProcessor = {
      id: `proc-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      name: processorForm.name || "",
      type: (processorForm.type as "internal" | "third-party" | "sub-processor") || "internal",
      location: processorForm.location || "",
      description: processorForm.description || "",
      categories: processorForm.categories || [],
      transferMechanism: processorForm.transferMechanism,
      contractDate: processorForm.contractDate,
      dpaStatus: (processorForm.dpaStatus as "signed" | "pending" | "expired" | "not-required") || "pending",
      riskLevel: (processorForm.riskLevel as "low" | "medium" | "high") || "medium",
    }

    setProcessors([...processors, newProcessor])
    setProcessorForm({
      name: "",
      type: "internal",
      location: "",
      description: "",
      categories: [],
      transferMechanism: "",
      dpaStatus: "pending",
      riskLevel: "medium",
    })
    setProcessorDialogOpen(false)

    toast({
      title: "Processor added",
      description: `Data processor "${newProcessor.name}" has been added.`,
    })
  }

  const handleUpdateProcessor = () => {
    if (!currentProcessor || !processorForm.name || !processorForm.location || !processorForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const updatedProcessors = processors.map((proc) =>
      proc.id === currentProcessor.id
        ? {
            ...proc,
            name: processorForm.name || proc.name,
            type: (processorForm.type as "internal" | "third-party" | "sub-processor") || proc.type,
            location: processorForm.location || proc.location,
            description: processorForm.description || proc.description,
            categories: processorForm.categories || proc.categories,
            transferMechanism: processorForm.transferMechanism || proc.transferMechanism,
            contractDate: processorForm.contractDate || proc.contractDate,
            dpaStatus: (processorForm.dpaStatus as "signed" | "pending" | "expired" | "not-required") || proc.dpaStatus,
            riskLevel: (processorForm.riskLevel as "low" | "medium" | "high") || proc.riskLevel,
          }
        : proc,
    )

    setProcessors(updatedProcessors)
    setProcessorForm({
      name: "",
      type: "internal",
      location: "",
      description: "",
      categories: [],
      transferMechanism: "",
      dpaStatus: "pending",
      riskLevel: "medium",
    })
    setProcessorDialogOpen(false)

    toast({
      title: "Processor updated",
      description: `Data processor "${currentProcessor.name}" has been updated.`,
    })
  }

  const handleAddStorage = () => {
    if (!storageForm.name || !storageForm.location || !storageForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newStorage: DataStorage = {
      id: `store-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      name: storageForm.name || "",
      type: (storageForm.type as "database" | "file-system" | "cloud-storage" | "saas" | "physical") || "database",
      location: storageForm.location || "",
      description: storageForm.description || "",
      categories: storageForm.categories || [],
      encryption: storageForm.encryption || false,
      backupFrequency: storageForm.backupFrequency,
      retentionImplemented: storageForm.retentionImplemented || false,
      accessControls: storageForm.accessControls || [],
    }

    setStorages([...storages, newStorage])
    setStorageForm({
      name: "",
      type: "database",
      location: "",
      description: "",
      categories: [],
      encryption: false,
      backupFrequency: "",
      retentionImplemented: false,
      accessControls: [],
    })
    setStorageDialogOpen(false)

    toast({
      title: "Storage added",
      description: `Data storage "${newStorage.name}" has been added.`,
    })
  }

  const handleUpdateStorage = () => {
    if (!currentStorage || !storageForm.name || !storageForm.location || !storageForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const updatedStorages = storages.map((store) =>
      store.id === currentStorage.id
        ? {
            ...store,
            name: storageForm.name || store.name,
            type:
              (storageForm.type as "database" | "file-system" | "cloud-storage" | "saas" | "physical") || store.type,
            location: storageForm.location || store.location,
            description: storageForm.description || store.description,
            categories: storageForm.categories || store.categories,
            encryption: storageForm.encryption !== undefined ? storageForm.encryption : store.encryption,
            backupFrequency: storageForm.backupFrequency || store.backupFrequency,
            retentionImplemented:
              storageForm.retentionImplemented !== undefined
                ? storageForm.retentionImplemented
                : store.retentionImplemented,
            accessControls: storageForm.accessControls || store.accessControls,
          }
        : store,
    )

    setStorages(updatedStorages)
    setStorageForm({
      name: "",
      type: "database",
      location: "",
      description: "",
      categories: [],
      encryption: false,
      backupFrequency: "",
      retentionImplemented: false,
      accessControls: [],
    })
    setStorageDialogOpen(false)

    toast({
      title: "Storage updated",
      description: `Data storage "${currentStorage.name}" has been updated.`,
    })
  }

  const handleAddFlow = () => {
    if (!flowForm.name || !flowForm.source || !flowForm.destination || !flowForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newFlow: DataFlow = {
      id: `flow-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      name: flowForm.name || "",
      description: flowForm.description || "",
      source: flowForm.source || "",
      destination: flowForm.destination || "",
      categories: flowForm.categories || [],
      frequency: (flowForm.frequency as "real-time" | "daily" | "weekly" | "monthly" | "ad-hoc") || "daily",
      transferMethod: flowForm.transferMethod || "",
      encryptionInTransit: flowForm.encryptionInTransit || false,
    }

    setFlows([...flows, newFlow])
    setFlowForm({
      name: "",
      description: "",
      source: "",
      destination: "",
      categories: [],
      frequency: "daily",
      transferMethod: "",
      encryptionInTransit: false,
    })
    setFlowDialogOpen(false)

    toast({
      title: "Flow added",
      description: `Data flow "${newFlow.name}" has been added.`,
    })
  }

  const handleUpdateFlow = () => {
    if (!currentFlow || !flowForm.name || !flowForm.source || !flowForm.destination || !flowForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const updatedFlows = flows.map((flow) =>
      flow.id === currentFlow.id
        ? {
            ...flow,
            name: flowForm.name || flow.name,
            description: flowForm.description || flow.description,
            source: flowForm.source || flow.source,
            destination: flowForm.destination || flow.destination,
            categories: flowForm.categories || flow.categories,
            frequency:
              (flowForm.frequency as "real-time" | "daily" | "weekly" | "monthly" | "ad-hoc") || flow.frequency,
            transferMethod: flowForm.transferMethod || flow.transferMethod,
            encryptionInTransit:
              flowForm.encryptionInTransit !== undefined ? flowForm.encryptionInTransit : flow.encryptionInTransit,
          }
        : flow,
    )

    setFlows(updatedFlows)
    setFlowForm({
      name: "",
      description: "",
      source: "",
      destination: "",
      categories: [],
      frequency: "daily",
      transferMethod: "",
      encryptionInTransit: false,
    })
    setFlowDialogOpen(false)

    toast({
      title: "Flow updated",
      description: `Data flow "${currentFlow.name}" has been updated.`,
    })
  }

  const handleDelete = () => {
    if (!itemToDelete) return

    switch (itemToDelete.type) {
      case "category":
        setCategories(categories.filter((cat) => cat.id !== itemToDelete.id))
        toast({
          title: "Category deleted",
          description: "The data category has been deleted.",
        })
        break
      case "processor":
        setProcessors(processors.filter((proc) => proc.id !== itemToDelete.id))
        toast({
          title: "Processor deleted",
          description: "The data processor has been deleted.",
        })
        break
      case "storage":
        setStorages(storages.filter((store) => store.id !== itemToDelete.id))
        toast({
          title: "Storage deleted",
          description: "The data storage has been deleted.",
        })
        break
      case "flow":
        setFlows(flows.filter((flow) => flow.id !== itemToDelete.id))
        toast({
          title: "Flow deleted",
          description: "The data flow has been deleted.",
        })
        break
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleEditCategory = (category: DataCategory) => {
    setCurrentCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description,
      sensitivity: category.sensitivity,
      examples: category.examples,
      purposes: category.purposes,
      retention: category.retention,
      legalBasis: category.legalBasis,
    })
    setCategoryDialogOpen(true)
  }

  const handleEditProcessor = (processor: DataProcessor) => {
    setCurrentProcessor(processor)
    setProcessorForm({
      name: processor.name,
      type: processor.type,
      location: processor.location,
      description: processor.description,
      categories: processor.categories,
      transferMechanism: processor.transferMechanism,
      contractDate: processor.contractDate,
      dpaStatus: processor.dpaStatus,
      riskLevel: processor.riskLevel,
    })
    setProcessorDialogOpen(true)
  }

  const handleEditStorage = (storage: DataStorage) => {
    setCurrentStorage(storage)
    setStorageForm({
      name: storage.name,
      type: storage.type,
      location: storage.location,
      description: storage.description,
      categories: storage.categories,
      encryption: storage.encryption,
      backupFrequency: storage.backupFrequency,
      retentionImplemented: storage.retentionImplemented,
      accessControls: storage.accessControls,
    })
    setStorageDialogOpen(true)
  }

  const handleEditFlow = (flow: DataFlow) => {
    setCurrentFlow(flow)
    setFlowForm({
      name: flow.name,
      description: flow.description,
      source: flow.source,
      destination: flow.destination,
      categories: flow.categories,
      frequency: flow.frequency,
      transferMethod: flow.transferMethod,
      encryptionInTransit: flow.encryptionInTransit,
    })
    setFlowDialogOpen(true)
  }

  const handleViewItem = (type: string, id: string) => {
    switch (type) {
      case "category":
        const category = categories.find((cat) => cat.id === id)
        if (category) {
          setCurrentCategory(category)
          setViewDialogOpen(true)
        }
        break
      case "processor":
        const processor = processors.find((proc) => proc.id === id)
        if (processor) {
          setCurrentProcessor(processor)
          setViewDialogOpen(true)
        }
        break
      case "storage":
        const storage = storages.find((store) => store.id === id)
        if (storage) {
          setCurrentStorage(storage)
          setViewDialogOpen(true)
        }
        break
      case "flow":
        const flow = flows.find((f) => f.id === id)
        if (flow) {
          setCurrentFlow(flow)
          setViewDialogOpen(true)
        }
        break
    }
  }

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (sensitivityFilter === "all" || cat.sensitivity === sensitivityFilter),
  )

  const filteredProcessors = processors.filter(
    (proc) =>
      (proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (typeFilter === "all" || proc.type === typeFilter) &&
      (locationFilter === "all" || proc.location === locationFilter) &&
      (categoryFilter === "all" || proc.categories.includes(categoryFilter)),
  )

  const filteredStorages = storages.filter(
    (store) =>
      (store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (typeFilter === "all" || store.type === typeFilter) &&
      (locationFilter === "all" || store.location === locationFilter) &&
      (categoryFilter === "all" || store.categories.includes(categoryFilter)),
  )

  const filteredFlows = flows.filter(
    (flow) =>
      (flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.destination.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || flow.categories.includes(categoryFilter)),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">Data Mapping</h2>
          <p className="text-muted-foreground">
            Map and manage your data inventory, processors, storage locations, and data flows
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div >
              <CardTitle className="text-3xl font-bold text-blue-600 dark:text-white">Data Inventory</CardTitle>
              <CardDescription>Comprehensive mapping of your organization's data assets</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search data inventory..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="categories">Data Categories</TabsTrigger>
              <TabsTrigger value="processors">Data Processors</TabsTrigger>
              <TabsTrigger value="storage">Storage Locations</TabsTrigger>
              <TabsTrigger value="flows">Data Flows</TabsTrigger>
            </TabsList>

            {/* Data Categories Tab */}
            <TabsContent value="categories">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sensitivities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="special">Special Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setCurrentCategory(null)
                    setCategoryForm({
                      name: "",
                      description: "",
                      sensitivity: "medium",
                      examples: [],
                      purposes: [],
                      retention: "",
                      legalBasis: "",
                    })
                    setCategoryDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Loading data categories...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table className="w-full text-sm border border-border rounded-xl overflow-hidden">
  <TableHeader>
    <TableRow className="bg-muted text-foreground dark:bg-muted/30 dark:text-foreground font-semibold">
      <TableHead>Name</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Sensitivity</TableHead>
      <TableHead>Legal Basis</TableHead>
      <TableHead>Retention</TableHead>
      <TableHead className="w-[100px]">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredCategories.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={6}
          className="text-center py-8 text-muted-foreground bg-background dark:bg-muted/10"
        >
          {searchQuery || sensitivityFilter !== "all"
            ? "No data categories match your search criteria"
            : "No data categories defined yet"}
        </TableCell>
      </TableRow>
    ) : (
      filteredCategories.map((category, index) => (
        <TableRow
          key={category.id}
          className={`transition-colors ${
            index % 2 === 0
              ? "bg-muted/50 dark:bg-muted/10"
              : "bg-background dark:bg-muted/5"
          } hover:bg-blue-50 dark:hover:bg-blue-900/30`}
        >
          <TableCell className="font-medium">{category.name}</TableCell>
          <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
          <TableCell>{getSensitivityBadge(category.sensitivity)}</TableCell>
          <TableCell>{category.legalBasis || "-"}</TableCell>
          <TableCell>{category.retention || "-"}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleViewItem("category", category.id)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setItemToDelete({ type: "category", id: category.id });
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
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
            </TabsContent>

            {/* Data Processors Tab */}
            <TabsContent value="processors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="third-party">Third Party</SelectItem>
                      <SelectItem value="sub-processor">Sub-processor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="European Union">European Union</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setCurrentProcessor(null)
                    setProcessorForm({
                      name: "",
                      type: "internal",
                      location: "",
                      description: "",
                      categories: [],
                      transferMechanism: "",
                      dpaStatus: "pending",
                      riskLevel: "medium",
                    })
                    setProcessorDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Processor
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Loading data processors...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Data Categories</TableHead>
                        <TableHead>DPA Status</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProcessors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {searchQuery || typeFilter !== "all" || locationFilter !== "all" || categoryFilter !== "all"
                              ? "No data processors match your search criteria"
                              : "No data processors defined yet"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProcessors.map((processor) => (
                          <TableRow key={processor.id}>
                            <TableCell className="font-medium">{processor.name}</TableCell>
                            <TableCell>{getProcessorTypeBadge(processor.type)}</TableCell>
                            <TableCell>{processor.location}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {processor.categories.map((cat, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{getDPAStatusBadge(processor.dpaStatus)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  processor.riskLevel === "low"
                                    ? "outline"
                                    : processor.riskLevel === "medium"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {processor.riskLevel.charAt(0).toUpperCase() + processor.riskLevel.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewItem("processor", processor.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEditProcessor(processor)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setItemToDelete({ type: "processor", id: processor.id })
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
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
            </TabsContent>

            {/* Storage Locations Tab */}
            <TabsContent value="storage">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="file-system">File System</SelectItem>
                      <SelectItem value="cloud-storage">Cloud Storage</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="European Union">European Union</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setCurrentStorage(null)
                    setStorageForm({
                      name: "",
                      type: "database",
                      location: "",
                      description: "",
                      categories: [],
                      encryption: false,
                      backupFrequency: "",
                      retentionImplemented: false,
                      accessControls: [],
                    })
                    setStorageDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Storage
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Loading storage locations...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Data Categories</TableHead>
                        <TableHead>Encryption</TableHead>
                        <TableHead>Retention</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStorages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {searchQuery || typeFilter !== "all" || locationFilter !== "all" || categoryFilter !== "all"
                              ? "No storage locations match your search criteria"
                              : "No storage locations defined yet"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStorages.map((storage) => (
                          <TableRow key={storage.id}>
                            <TableCell className="font-medium">{storage.name}</TableCell>
                            <TableCell>{getStorageTypeBadge(storage.type)}</TableCell>
                            <TableCell>{storage.location}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {storage.categories.map((cat, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {storage.encryption ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" /> Encrypted
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Not Encrypted
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {storage.retentionImplemented ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Implemented
                                </Badge>
                              ) : (
                                <Badge variant="warning" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Not Implemented
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewItem("storage", storage.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEditStorage(storage)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setItemToDelete({ type: "storage", id: storage.id })
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
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
            </TabsContent>

            {/* Data Flows Tab */}
            <TabsContent value="flows">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setCurrentFlow(null)
                    setFlowForm({
                      name: "",
                      description: "",
                      source: "",
                      destination: "",
                      categories: [],
                      frequency: "daily",
                      transferMethod: "",
                      encryptionInTransit: false,
                    })
                    setFlowDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Flow
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Loading data flows...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Data Categories</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Encryption</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFlows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {searchQuery || categoryFilter !== "all"
                              ? "No data flows match your search criteria"
                              : "No data flows defined yet"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFlows.map((flow) => (
                          <TableRow key={flow.id}>
                            <TableCell className="font-medium">{flow.name}</TableCell>
                            <TableCell>{flow.source}</TableCell>
                            <TableCell>{flow.destination}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {flow.categories.map((cat, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{getFlowFrequencyBadge(flow.frequency)}</TableCell>
                            <TableCell>
                              {flow.encryptionInTransit ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" /> Encrypted
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Not Encrypted
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewItem("flow", flow.id)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEditFlow(flow)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setItemToDelete({ type: "flow", id: flow.id })
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentCategory
                ? "Data Category Details"
                : currentProcessor
                  ? "Data Processor Details"
                  : currentStorage
                    ? "Data Storage Details"
                    : "Data Flow Details"}
            </DialogTitle>
            <DialogDescription>Detailed information about this data asset</DialogDescription>
          </DialogHeader>

          {currentCategory && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm">{currentCategory.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Sensitivity</h4>
                  <div>{getSensitivityBadge(currentCategory.sensitivity)}</div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{currentCategory.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Legal Basis</h4>
                  <p className="text-sm">{currentCategory.legalBasis || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Retention Period</h4>
                  <p className="text-sm">{currentCategory.retention || "Not specified"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Examples</h4>
                {currentCategory.examples && currentCategory.examples.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentCategory.examples.map((example, index) => (
                      <Badge key={index} variant="outline">
                        {example}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No examples provided</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Purposes</h4>
                {currentCategory.purposes && currentCategory.purposes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentCategory.purposes.map((purpose, index) => (
                      <Badge key={index} variant="secondary">
                        {purpose}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No purposes specified</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Related Data Assets</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Processors</h5>
                    {processors.filter((p) => p.categories.includes(currentCategory.name)).length > 0 ? (
                      <div className="space-y-2">
                        {processors
                          .filter((p) => p.categories.includes(currentCategory.name))
                          .map((processor) => (
                            <div key={processor.id} className="p-2 border rounded-md text-xs">
                              <div className="font-medium">{processor.name}</div>
                              <div className="text-muted-foreground">{processor.type}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No processors use this data</p>
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Storage Locations</h5>
                    {storages.filter((s) => s.categories.includes(currentCategory.name)).length > 0 ? (
                      <div className="space-y-2">
                        {storages
                          .filter((s) => s.categories.includes(currentCategory.name))
                          .map((storage) => (
                            <div key={storage.id} className="p-2 border rounded-md text-xs">
                              <div className="font-medium">{storage.name}</div>
                              <div className="text-muted-foreground">
                                {storage.type} in {storage.location}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No storage locations for this data</p>
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Data Flows</h5>
                    {flows.filter((f) => f.categories.includes(currentCategory.name)).length > 0 ? (
                      <div className="space-y-2">
                        {flows
                          .filter((f) => f.categories.includes(currentCategory.name))
                          .map((flow) => (
                            <div key={flow.id} className="p-2 border rounded-md text-xs">
                              <div className="font-medium">{flow.name}</div>
                              <div className="text-muted-foreground">
                                {flow.source} → {flow.destination}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No data flows for this data</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentProcessor && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm">{currentProcessor.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Type</h4>
                  <div>{getProcessorTypeBadge(currentProcessor.type)}</div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{currentProcessor.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm">{currentProcessor.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Risk Level</h4>
                  <Badge
                    variant={
                      currentProcessor.riskLevel === "low"
                        ? "outline"
                        : currentProcessor.riskLevel === "medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {currentProcessor.riskLevel.charAt(0).toUpperCase() + currentProcessor.riskLevel.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium">DPA Status</h4>
                  <div>{getDPAStatusBadge(currentProcessor.dpaStatus)}</div>
                </div>
                {currentProcessor.contractDate && (
                  <div>
                    <h4 className="text-sm font-medium">Contract Date</h4>
                    <p className="text-sm">{currentProcessor.contractDate}</p>
                  </div>
                )}
                {currentProcessor.transferMechanism && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium">Transfer Mechanism</h4>
                    <p className="text-sm">{currentProcessor.transferMechanism}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Data Categories Processed</h4>
                {currentProcessor.categories && currentProcessor.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentProcessor.categories.map((category, index) => {
                      const categoryData = categories.find((c) => c.name === category)
                      return (
                        <Badge
                          key={index}
                          variant={
                            categoryData?.sensitivity === "special"
                              ? "destructive"
                              : categoryData?.sensitivity === "high"
                                ? "warning"
                                : categoryData?.sensitivity === "medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {category}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data categories specified</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Related Data Flows</h4>
                {flows.filter((f) => f.source === currentProcessor.name || f.destination === currentProcessor.name)
                  .length > 0 ? (
                  <div className="space-y-2">
                    {flows
                      .filter((f) => f.source === currentProcessor.name || f.destination === currentProcessor.name)
                      .map((flow) => (
                        <div key={flow.id} className="p-2 border rounded-md">
                          <div className="font-medium">{flow.name}</div>
                          <div className="text-sm flex items-center gap-1">
                            <span
                              className={
                                flow.source === currentProcessor.name ? "text-muted-foreground" : "font-medium"
                              }
                            >
                              {flow.source}
                            </span>
                            <Link className="h-3 w-3" />
                            <span
                              className={
                                flow.destination === currentProcessor.name ? "text-muted-foreground" : "font-medium"
                              }
                            >
                              {flow.destination}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getFlowFrequencyBadge(flow.frequency)}
                            {flow.encryptionInTransit && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                <Shield className="h-3 w-3 mr-1" /> Encrypted
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No related data flows</p>
                )}
              </div>
            </div>
          )}

          {currentStorage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm">{currentStorage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Type</h4>
                  <div>{getStorageTypeBadge(currentStorage.type)}</div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{currentStorage.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm">{currentStorage.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Encryption</h4>
                  {currentStorage.encryption ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Encrypted
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Not Encrypted
                    </Badge>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Retention Implementation</h4>
                  {currentStorage.retentionImplemented ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Implemented
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Not Implemented
                    </Badge>
                  )}
                </div>
                {currentStorage.backupFrequency && (
                  <div>
                    <h4 className="text-sm font-medium">Backup Frequency</h4>
                    <p className="text-sm">{currentStorage.backupFrequency}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Data Categories Stored</h4>
                {currentStorage.categories && currentStorage.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentStorage.categories.map((category, index) => {
                      const categoryData = categories.find((c) => c.name === category)
                      return (
                        <Badge
                          key={index}
                          variant={
                            categoryData?.sensitivity === "special"
                              ? "destructive"
                              : categoryData?.sensitivity === "high"
                                ? "warning"
                                : categoryData?.sensitivity === "medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {category}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data categories specified</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Access Controls</h4>
                {currentStorage.accessControls && currentStorage.accessControls.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentStorage.accessControls.map((control, index) => (
                      <Badge key={index} variant="outline">
                        {control}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No access controls specified</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Related Data Flows</h4>
                {flows.filter((f) => f.source === currentStorage.name || f.destination === currentStorage.name).length >
                0 ? (
                  <div className="space-y-2">
                    {flows
                      .filter((f) => f.source === currentStorage.name || f.destination === currentStorage.name)
                      .map((flow) => (
                        <div key={flow.id} className="p-2 border rounded-md">
                          <div className="font-medium">{flow.name}</div>
                          <div className="text-sm flex items-center gap-1">
                            <span
                              className={flow.source === currentStorage.name ? "text-muted-foreground" : "font-medium"}
                            >
                              {flow.source}
                            </span>
                            <Link className="h-3 w-3" />
                            <span
                              className={
                                flow.destination === currentStorage.name ? "text-muted-foreground" : "font-medium"
                              }
                            >
                              {flow.destination}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getFlowFrequencyBadge(flow.frequency)}
                            {flow.encryptionInTransit && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                <Shield className="h-3 w-3 mr-1" /> Encrypted
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No related data flows</p>
                )}
              </div>
            </div>
          )}

          {currentFlow && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm">{currentFlow.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Frequency</h4>
                  <div>{getFlowFrequencyBadge(currentFlow.frequency)}</div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{currentFlow.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Source</h4>
                  <p className="text-sm">{currentFlow.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Destination</h4>
                  <p className="text-sm">{currentFlow.destination}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Transfer Method</h4>
                  <p className="text-sm">{currentFlow.transferMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Encryption in Transit</h4>
                  {currentFlow.encryptionInTransit ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Encrypted
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Not Encrypted
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Data Categories Transferred</h4>
                {currentFlow.categories && currentFlow.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentFlow.categories.map((category, index) => {
                      const categoryData = categories.find((c) => c.name === category)
                      return (
                        <Badge
                          key={index}
                          variant={
                            categoryData?.sensitivity === "special"
                              ? "destructive"
                              : categoryData?.sensitivity === "high"
                                ? "warning"
                                : categoryData?.sensitivity === "medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {category}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data categories specified</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Data Flow Diagram</h4>
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-background">
                        <div className="font-medium text-sm">{currentFlow.source}</div>
                        <div className="text-xs text-muted-foreground">Source</div>
                      </div>
                    </div>
                    <div className="h-8 border-l-2 border-dashed relative">
                      <div className="absolute -left-[60px] top-1/2 transform -translate-y-1/2 flex items-center">
                        {currentFlow.encryptionInTransit ? (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" /> Encrypted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Unencrypted
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-background">
                        <div className="font-medium text-sm">{currentFlow.destination}</div>
                        <div className="text-xs text-muted-foreground">Destination</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {currentCategory
                ? "Update the details of this data category"
                : "Add a new data category to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., Personal Identifiers"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Describe this data category"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sensitivity" className="text-sm font-medium">
                Sensitivity Level
              </label>
              <Select
                value={categoryForm.sensitivity}
                onValueChange={(value) => setCategoryForm({ ...categoryForm, sensitivity: value as any })}
              >
                <SelectTrigger id="sensitivity">
                  <SelectValue placeholder="Select sensitivity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="special">Special Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="examples" className="text-sm font-medium">
                Examples (comma separated)
              </label>
              <Input
                id="examples"
                value={categoryForm.examples?.join(", ")}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    examples: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g., Name, Email, Phone Number"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="purposes" className="text-sm font-medium">
                Purposes (comma separated)
              </label>
              <Input
                id="purposes"
                value={categoryForm.purposes?.join(", ")}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    purposes: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g., Account Creation, Communication"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="retention" className="text-sm font-medium">
                Retention Period
              </label>
              <Input
                id="retention"
                value={categoryForm.retention}
                onChange={(e) => setCategoryForm({ ...categoryForm, retention: e.target.value })}
                placeholder="e.g., 7 years after account closure"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="legalBasis" className="text-sm font-medium">
                Legal Basis
              </label>
              <Select
                value={categoryForm.legalBasis}
                onValueChange={(value) => setCategoryForm({ ...categoryForm, legalBasis: value })}
              >
                <SelectTrigger id="legalBasis">
                  <SelectValue placeholder="Select legal basis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consent">Consent</SelectItem>
                  <SelectItem value="Contract Performance">Contract Performance</SelectItem>
                  <SelectItem value="Legal Obligation">Legal Obligation</SelectItem>
                  <SelectItem value="Vital Interests">Vital Interests</SelectItem>
                  <SelectItem value="Public Interest">Public Interest</SelectItem>
                  <SelectItem value="Legitimate Interest">Legitimate Interest</SelectItem>
                  <SelectItem value="Explicit Consent">Explicit Consent (Special Category)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentCategory ? handleUpdateCategory : handleAddCategory}>
              {currentCategory ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processor Dialog */}
      <Dialog open={processorDialogOpen} onOpenChange={setProcessorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentProcessor ? "Edit Processor" : "Add Processor"}</DialogTitle>
            <DialogDescription>
              {currentProcessor
                ? "Update the details of this data processor"
                : "Add a new data processor to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                value={processorForm.name}
                onChange={(e) => setProcessorForm({ ...processorForm, name: e.target.value })}
                placeholder="e.g., CloudPay Services"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={processorForm.type}
                onValueChange={(value) => setProcessorForm({ ...processorForm, type: value as any })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select processor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="third-party">Third Party</SelectItem>
                  <SelectItem value="sub-processor">Sub-processor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                value={processorForm.description}
                onChange={(e) => setProcessorForm({ ...processorForm, description: e.target.value })}
                placeholder="Describe this data processor"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <Input
                id="location"
                value={processorForm.location}
                onChange={(e) => setProcessorForm({ ...processorForm, location: e.target.value })}
                placeholder="e.g., United States"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="categories" className="text-sm font-medium">
                Data Categories
              </label>
              <Select
                value={processorForm.categories?.join(",")}
                onValueChange={(value) =>
                  setProcessorForm({
                    ...processorForm,
                    categories: value.split(",").filter(Boolean),
                  })
                }
              >
                <SelectTrigger id="categories">
                  <SelectValue placeholder="Select data categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1 mt-2">
                {processorForm.categories?.map((category, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() =>
                        setProcessorForm({
                          ...processorForm,
                          categories: processorForm.categories?.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {processorForm.type === "third-party" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="transferMechanism" className="text-sm font-medium">
                    Transfer Mechanism
                  </label>
                  <Select
                    value={processorForm.transferMechanism}
                    onValueChange={(value) => setProcessorForm({ ...processorForm, transferMechanism: value })}
                  >
                    <SelectTrigger id="transferMechanism">
                      <SelectValue placeholder="Select transfer mechanism" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard Contractual Clauses">Standard Contractual Clauses</SelectItem>
                      <SelectItem value="Binding Corporate Rules">Binding Corporate Rules</SelectItem>
                      <SelectItem value="Adequacy Decision">Adequacy Decision</SelectItem>
                      <SelectItem value="Explicit Consent">Explicit Consent</SelectItem>
                      <SelectItem value="Not Required">Not Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contractDate" className="text-sm font-medium">
                    Contract Date
                  </label>
                  <Input
                    id="contractDate"
                    type="date"
                    value={processorForm.contractDate}
                    onChange={(e) => setProcessorForm({ ...processorForm, contractDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dpaStatus" className="text-sm font-medium">
                    DPA Status
                  </label>
                  <Select
                    value={processorForm.dpaStatus}
                    onValueChange={(value) => setProcessorForm({ ...processorForm, dpaStatus: value as any })}
                  >
                    <SelectTrigger id="dpaStatus">
                      <SelectValue placeholder="Select DPA status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signed">Signed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="not-required">Not Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="riskLevel" className="text-sm font-medium">
                Risk Level
              </label>
              <Select
                value={processorForm.riskLevel}
                onValueChange={(value) => setProcessorForm({ ...processorForm, riskLevel: value as any })}
              >
                <SelectTrigger id="riskLevel">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentProcessor ? handleUpdateProcessor : handleAddProcessor}>
              {currentProcessor ? "Update Processor" : "Add Processor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Storage Dialog */}
      <Dialog open={storageDialogOpen} onOpenChange={setStorageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentStorage ? "Edit Storage" : "Add Storage"}</DialogTitle>
            <DialogDescription>
              {currentStorage
                ? "Update the details of this storage location"
                : "Add a new storage location to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                value={storageForm.name}
                onChange={(e) => setStorageForm({ ...storageForm, name: e.target.value })}
                placeholder="e.g., User Database"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={storageForm.type}
                onValueChange={(value) => setStorageForm({ ...storageForm, type: value as any })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select storage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="file-system">File System</SelectItem>
                  <SelectItem value="cloud-storage">Cloud Storage</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                value={storageForm.description}
                onChange={(e) => setStorageForm({ ...storageForm, description: e.target.value })}
                placeholder="Describe this storage location"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <Input
                id="location"
                value={storageForm.location}
                onChange={(e) => setStorageForm({ ...storageForm, location: e.target.value })}
                placeholder="e.g., United States"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="categories" className="text-sm font-medium">
                Data Categories
              </label>
              <Select
                value={storageForm.categories?.join(",")}
                onValueChange={(value) =>
                  setStorageForm({
                    ...storageForm,
                    categories: value.split(",").filter(Boolean),
                  })
                }
              >
                <SelectTrigger id="categories">
                  <SelectValue placeholder="Select data categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1 mt-2">
                {storageForm.categories?.map((category, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() =>
                        setStorageForm({
                          ...storageForm,
                          categories: storageForm.categories?.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="encryption"
                checked={storageForm.encryption}
                onChange={(e) => setStorageForm({ ...storageForm, encryption: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="encryption" className="text-sm font-medium">
                Data is encrypted at rest
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="backupFrequency" className="text-sm font-medium">
                Backup Frequency
              </label>
              <Select
                value={storageForm.backupFrequency}
                onValueChange={(value) => setStorageForm({ ...storageForm, backupFrequency: value })}
              >
                <SelectTrigger id="backupFrequency">
                  <SelectValue placeholder="Select backup frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Real-time">Real-time</SelectItem>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="retentionImplemented"
                checked={storageForm.retentionImplemented}
                onChange={(e) => setStorageForm({ ...storageForm, retentionImplemented: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="retentionImplemented" className="text-sm font-medium">
                Retention periods are implemented
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="accessControls" className="text-sm font-medium">
                Access Controls (comma separated)
              </label>
              <Input
                id="accessControls"
                value={storageForm.accessControls?.join(", ")}
                onChange={(e) =>
                  setStorageForm({
                    ...storageForm,
                    accessControls: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g., Role-based Access, IP Restriction"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStorageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentStorage ? handleUpdateStorage : handleAddStorage}>
              {currentStorage ? "Update Storage" : "Add Storage"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flow Dialog */}
      <Dialog open={flowDialogOpen} onOpenChange={setFlowDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentFlow ? "Edit Flow" : "Add Flow"}</DialogTitle>
            <DialogDescription>
              {currentFlow ? "Update the details of this data flow" : "Add a new data flow to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                value={flowForm.name}
                onChange={(e) => setFlowForm({ ...flowForm, name: e.target.value })}
                placeholder="e.g., User Registration Flow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                value={flowForm.description}
                onChange={(e) => setFlowForm({ ...flowForm, description: e.target.value })}
                placeholder="Describe this data flow"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">
                Source *
              </label>
              <Input
                id="source"
                value={flowForm.source}
                onChange={(e) => setFlowForm({ ...flowForm, source: e.target.value })}
                placeholder="e.g., Web Application"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium">
                Destination *
              </label>
              <Input
                id="destination"
                value={flowForm.destination}
                onChange={(e) => setFlowForm({ ...flowForm, destination: e.target.value })}
                placeholder="e.g., User Database"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="categories" className="text-sm font-medium">
                Data Categories
              </label>
              <Select
                value={flowForm.categories?.join(",")}
                onValueChange={(value) =>
                  setFlowForm({
                    ...flowForm,
                    categories: value.split(",").filter(Boolean),
                  })
                }
              >
                <SelectTrigger id="categories">
                  <SelectValue placeholder="Select data categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1 mt-2">
                {flowForm.categories?.map((category, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() =>
                        setFlowForm({
                          ...flowForm,
                          categories: flowForm.categories?.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium">
                Frequency
              </label>
              <Select
                value={flowForm.frequency}
                onValueChange={(value) => setFlowForm({ ...flowForm, frequency: value as any })}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="transferMethod" className="text-sm font-medium">
                Transfer Method
              </label>
              <Input
                id="transferMethod"
                value={flowForm.transferMethod}
                onChange={(e) => setFlowForm({ ...flowForm, transferMethod: e.target.value })}
                placeholder="e.g., API, Batch Export"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="encryptionInTransit"
                checked={flowForm.encryptionInTransit}
                onChange={(e) => setFlowForm({ ...flowForm, encryptionInTransit: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="encryptionInTransit" className="text-sm font-medium">
                Data is encrypted in transit
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFlowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentFlow ? handleUpdateFlow : handleAddFlow}>
              {currentFlow ? "Update Flow" : "Add Flow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {itemToDelete?.type === "category" &&
                "Deleting this data category may impact processors, storage locations, and data flows that reference it."}
              {itemToDelete?.type === "processor" && "Deleting this processor will remove it from your data inventory."}
              {itemToDelete?.type === "storage" &&
                "Deleting this storage location will remove it from your data inventory."}
              {itemToDelete?.type === "flow" && "Deleting this data flow will remove it from your data inventory."}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
