"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { AlertCircle, ArrowLeft, Building2, User, Lock, Mail, Phone } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"

import { ModeToggle } from "~/components/mode-toggle"

import { ARCLogo } from "~/components/arc-logo"
import { motion } from "framer-motion"

// Simple dummy translation function
const t = (text: string) => text

export default function AdminSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    industry: "",
    companySize: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setError("You must accept the terms and privacy policy to create an account")
      return
    }

    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          industry: formData.industry,
          companySize: formData.companySize,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Signup failed")
      }

      await response.json()
      navigate("/admin/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-white to-purple-50 dark:from-pink-950/30 dark:via-background dark:to-purple-950/30 p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        
        <ModeToggle />
      </div>

      <Link
        to="/auth"
        className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Back to auth options"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <ARCLogo />
        </div>

        <Card className="border-2 border-pink-200 dark:border-pink-900 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-pink-500" />
              <CardTitle className="text-2xl font-bold">{t("Organization Signup")}</CardTitle>
            </div>
            <CardDescription className="text-center">
              Create an organization account to manage DPDP Act 2023 compliance
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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-500" />
                  {t("Email Address")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-pink-500" />
                  {t("Organization Name")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Organization"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-pink-500" />
                  {t("Phone Number")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                    <SelectTrigger className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize" className="text-sm font-medium">
                    Company Size
                  </Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => handleSelectChange("companySize", value)}
                  >
                    <SelectTrigger className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-pink-500" />
                  {t("Password")}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-pink-500" />
                  {t("Confirm Password")}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-10 border-pink-200 dark:border-pink-900 focus:border-pink-500 dark:focus:border-pink-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer select-none">
                  {t("I accept the")}{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-pink-600">
                    {t("Terms of Service")}
                  </a>{" "}
                  {t("and")}{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-pink-600">
                    {t("Privacy Policy")}
                  </a>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("Signing up...") : t("Sign Up")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
