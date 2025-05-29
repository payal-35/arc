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
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import {
  MoreVertical,
  Plus,
  Trash,
  Edit,
  Search,
  Loader2,
} from "lucide-react"
import { toast } from "~/components/ui/use-toast"

interface Purpose {
  id: string
  name: string
  description: string
  required: boolean
  active: boolean
  created_at: string
}

export default function PurposesPanel() {
  const [purposes, setPurposes] = useState<Purpose[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPurpose, setCurrentPurpose] = useState<Purpose | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    required: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      setPurposes([
        {
          id: "1",
          name: "Essential Services",
          description:
            "Processing necessary for the provision of our core services",
          required: true,
          active: true,
          created_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Analytics",
          description: "Processing for analytics and service improvement",
          required: false,
          active: true,
          created_at: "2023-05-16T14:20:00Z",
        },
        {
          id: "3",
          name: "Marketing",
          description: "Processing for marketing and promotional activities",
          required: false,
          active: true,
          created_at: "2023-05-17T09:45:00Z",
        },
        {
          id: "4",
          name: "Third-party Sharing",
          description: "Sharing data with third-party partners",
          required: false,
          active: false,
          created_at: "2023-05-18T16:10:00Z",
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePurpose = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const newPurpose: Purpose = {
        id: Math.random().toString(36).substring(7),
        name: formData.name,
        description: formData.description,
        required: formData.required,
        active: true,
        created_at: new Date().toISOString(),
      }

      setPurposes([...purposes, newPurpose])
      setFormData({ name: "", description: "", required: false })
      setIsCreateDialogOpen(false)
      setSubmitting(false)
      toast({
        title: "Purpose Created",
        description: `Purpose "${formData.name}" created successfully.`,
      })
    }, 1000)
  }

  const handleEditPurpose = () => {
    if (!currentPurpose) return
    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const updatedPurposes = purposes.map((purpose) =>
        purpose.id === currentPurpose.id
          ? {
              ...purpose,
              name: formData.name,
              description: formData.description,
              required: formData.required,
            }
          : purpose,
      )

      setPurposes(updatedPurposes)
      setIsEditDialogOpen(false)
      setSubmitting(false)
      toast({
        title: "Purpose Updated",
        description: `Purpose "${formData.name}" updated successfully.`,
      })
    }, 1000)
  }

  const handleDeletePurpose = () => {
    if (!currentPurpose) return

    setSubmitting(true)
    setTimeout(() => {
      const updatedPurposes = purposes.filter(
        (purpose) => purpose.id !== currentPurpose.id,
      )
      setPurposes(updatedPurposes)
      setIsDeleteDialogOpen(false)
      setSubmitting(false)
      toast({
        title: "Purpose Deleted",
        description: `Purpose "${currentPurpose.name}" deleted successfully.`,
      })
    }, 1000)
  }

  const handleToggleActive = (id: string) => {
    setSubmitting(true)
    setTimeout(() => {
      const updatedPurposes = purposes.map((purpose) =>
        purpose.id === id ? { ...purpose, active: !purpose.active } : purpose,
      )

      setPurposes(updatedPurposes)
      setSubmitting(false)

      const toggledPurpose = updatedPurposes.find((p) => p.id === id)
      if (!toggledPurpose) return

      toast({
        title: toggledPurpose.active ? "Activate Purpose" : "Deactivate Purpose",
        description: toggledPurpose.active
          ? `Purpose "${toggledPurpose.name}" activated successfully.`
          : `Purpose "${toggledPurpose.name}" deactivated successfully.`,
      })
    }, 500)
  }

  const filteredPurposes = purposes.filter(
    (purpose) =>
      purpose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purpose.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fadeIn transition-all duration-700 ease-in-out font-display">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow dark:text-white">
        Purpose Management
      </h2>
      <p className="text-muted-foreground text-base mt-1">Manage all your purposes here.</p>
    </div>
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="transition-all duration-300 hover:scale-[1.05] shadow-lg bg-gradient-to-tr from-primary to-primary/80 text-white hover:brightness-110">
          <Plus className="mr-2 h-4 w-4" />
          Create Purpose
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl shadow-2xl animate-scaleIn transition-all duration-300 border border-muted bg-background/80 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Purpose</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to create a new purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Purpose Name</Label>
            <Input
              id="name"
              placeholder="Enter purpose name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:shadow-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Purpose Description</Label>
            <Textarea
              id="description"
              placeholder="Enter purpose description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, required: checked as boolean })
              }
            />
            <Label htmlFor="required">Required Purpose</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
            disabled={submitting}
            className="transition-transform duration-300 hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePurpose}
            disabled={submitting}
            className="transition-transform duration-300 hover:scale-105 bg-primary text-white shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Purpose"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>

  <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border border-border bg-background/80 backdrop-blur-md">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Purpose List</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        Search, edit, delete, and activate/deactivate purposes.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Input
        placeholder="Search purposes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 max-w-sm transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:shadow-md"
        type="search"
        spellCheck={false}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filteredPurposes.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No purposes found.</p>
      ) : (
        <Table className="w-full text-sm text-foreground">
  <TableHeader className="bg-blue-100/60 text-blue-900 border-b border-blue-200">
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Required</TableHead>
      <TableHead>Created</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredPurposes.map((purpose) => (
      <TableRow
        key={purpose.id}
        className="bg-blue-50 hover:bg-blue-100 border-b border-blue-100 transition-all duration-200 ease-in-out"
      >
        <TableCell>{purpose.name}</TableCell>
        <TableCell>{purpose.description}</TableCell>
        <TableCell>
          {purpose.required ? (
            <Badge variant="secondary">Required</Badge>
          ) : (
            <Badge variant="outline">Optional</Badge>
          )}
        </TableCell>
        <TableCell>
          {new Date(purpose.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Badge
            variant={purpose.active ? "default" : "destructive"}
            className="cursor-pointer select-none hover:brightness-110 transition-all"
            onClick={() => !submitting && handleToggleActive(purpose.id)}
          >
            {purpose.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:bg-blue-200/50 transition-all"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setCurrentPurpose(purpose)
                  setFormData({
                    name: purpose.name,
                    description: purpose.description,
                    required: purpose.required,
                  })
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentPurpose(purpose)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      )}
    </CardContent>
  </Card>
  {/* Edit Dialog */}
  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
    <DialogContent className="rounded-xl shadow-2xl animate-scaleIn transition-all duration-300 border border-muted bg-background/90 backdrop-blur-md">
      <DialogHeader>
        <DialogTitle>Edit Purpose</DialogTitle>
        <DialogDescription>
          Update the details for the purpose below.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Purpose Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:shadow-md"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-description">Purpose Description</Label>
          <Textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="edit-required"
            checked={formData.required}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, required: checked as boolean })
            }
          />
          <Label htmlFor="edit-required">Required Purpose</Label>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(false)}
          disabled={submitting}
          className="transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          onClick={handleEditPurpose}
          disabled={submitting}
          className="transition-transform duration-300 hover:scale-105"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  {/* Delete Dialog */}
  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <DialogContent className="rounded-xl shadow-2xl animate-scaleIn transition-all duration-300 border border-muted bg-background/90 backdrop-blur-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete purpose "
          {currentPurpose?.name}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(false)}
          disabled={submitting}
          className="transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeletePurpose}
          disabled={submitting}
          className="transition-transform duration-300 hover:scale-105"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  )
}