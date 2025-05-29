import { useState } from "react"
import { useNavigate } from "@remix-run/react"
import {
  Mail, User, Phone, Calendar, MapPin, Lock, AlertCircle, ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { ARCLogo } from "~/components/arc-logo"

import { ModeToggle } from "~/components/mode-toggle"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"

export default function UserSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    age: "",
    location: "",
    password: "",
    confirmPassword: "",
  })

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!acceptedTerms) {
      setError("You must accept the terms and privacy policy to create an account")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          age: Number(formData.age),
          location: formData.location,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Signup failed")
      }

      navigate("/user/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/30 p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        
        <ModeToggle />
      </div>

      <a
        href="/auth"
        className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </a>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <ARCLogo />
        </div>

        <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Manage your privacy rights under DPDP Act 2023
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <LabelWithInput icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabelWithInput icon={User} label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <LabelWithInput icon={User} label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <LabelWithInput icon={Phone} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabelWithInput icon={Calendar} label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                <LabelWithInput icon={MapPin} label="Location" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <LabelWithInput icon={Lock} label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
              <LabelWithInput icon={Lock} label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                />
                <label htmlFor="terms" className="text-sm font-medium leading-none">
                  I accept the <a href="/terms" className="text-blue-500 underline">Terms</a> and <a href="/privacy" className="text-blue-500 underline">Privacy Policy</a>.
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

function LabelWithInput({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ElementType
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="h-10 border-blue-200 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500"
      />
    </div>
  )
}
