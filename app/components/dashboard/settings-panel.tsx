"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"
import { toast } from "~/components/ui/use-toast"

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general")
  const [reviewFrequency, setReviewFrequency] = useState("6")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoDeleteData, setAutoDeleteData] = useState(false)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC")
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Form fields
  const [formData, setFormData] = useState({
    organizationName: "ARC Enterprise",
    adminEmail: "admin@example.com",
    dpoEmail: "dpo@example.com",
    privacyPolicyUrl: "https://example.com/privacy-policy",
    apiRateLimit: "100",
    webhookTimeout: "5",
    logRetention: "90",
    debugMode: false,
  })

    const handleFormChange = (field: keyof typeof formData, value: string | boolean) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = () => {
    // In a real implementation, this would call your API
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1500)
  }

  const handleResetSettings = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default values? This action cannot be undone.")
    ) {
      setResetting(true)

      // Simulate API call
      setTimeout(() => {
        // Reset all form values to defaults
        setFormData({
          organizationName: "ARC Enterprise",
          adminEmail: "admin@example.com",
          dpoEmail: "dpo@example.com",
          privacyPolicyUrl: "https://example.com/privacy-policy",
          apiRateLimit: "100",
          webhookTimeout: "5",
          logRetention: "90",
          debugMode: false,
        })
        setReviewFrequency("6")
        setEmailNotifications(true)
        setAutoDeleteData(false)
        setLanguage("en")
        setTimezone("UTC")

        setResetting(false)
        toast({
          title: "Settings reset",
          description: "All settings have been reset to default values.",
        })
      }, 1500)
    }
  }

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 py-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-blue-800 dark:text-white drop-shadow-md">
        Settings
      </h2>
      <p className="text-muted-foreground text-sm mt-1">
        Configure your ARC platform settings and preferences
      </p>
    </div>
    <Button onClick={handleSaveSettings} disabled={saving} className="shadow-md">
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  </div>

  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
    <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-xl gap-2 rounded-lg bg-muted p-1 shadow-inner">
      <TabsTrigger value="general" className="rounded-md">General</TabsTrigger>
      <TabsTrigger value="compliance" className="rounded-md">Compliance</TabsTrigger>
      <TabsTrigger value="notifications" className="rounded-md">Notifications</TabsTrigger>
      <TabsTrigger value="advanced" className="rounded-md">Advanced</TabsTrigger>
    </TabsList>

    {/* General Settings */}
    <TabsContent value="general" className="space-y-6">
      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">General Settings</CardTitle>
          <CardDescription>Configure basic settings for your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization-name">Organization Name</Label>
            <Input
              id="organization-name"
              value={formData.organizationName}
              onChange={(e) => handleFormChange("organizationName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleFormChange("adminEmail", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
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
            <Select value={timezone} onValueChange={setTimezone}>
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
        </CardContent>
      </Card>
    </TabsContent>

    {/* Compliance Settings */}
    <TabsContent value="compliance" className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">DPDP Compliance Settings</CardTitle>
          <CardDescription>Configure settings related to Digital Personal Data Protection compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-frequency">Consent Review Frequency (months)</Label>
            <Select value={reviewFrequency} onValueChange={setReviewFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="9">9 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often users will be prompted to review their consent preferences.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-delete">Auto-delete Inactive User Data</Label>
              <Switch id="auto-delete" checked={autoDeleteData} onCheckedChange={setAutoDeleteData} />
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically delete personal data for users inactive for more than 24 months.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dpo-email">Data Protection Officer Email</Label>
            <Input
              id="dpo-email"
              type="email"
              value={formData.dpoEmail}
              onChange={(e) => handleFormChange("dpoEmail", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Email address of your organization's Data Protection Officer.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
            <Input
              id="privacy-policy"
              value={formData.privacyPolicyUrl}
              onChange={(e) => handleFormChange("privacyPolicyUrl", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Notification Settings */}
    <TabsContent value="notifications" className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Notification Settings</CardTitle>
          <CardDescription>Configure how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="pt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Notification Events</h4>
            <div className="grid gap-3">
              {[
                { id: "notify-grievances", label: "New Grievances" },
                { id: "notify-consents", label: "Consent Changes" },
                { id: "notify-webhooks", label: "Webhook Failures" },
                { id: "notify-reviews", label: "Consent Review Reminders" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Advanced Settings */}
    <TabsContent value="advanced" className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Advanced Settings</CardTitle>
          <CardDescription>Configure advanced settings for your ARC platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-rate-limit">API Rate Limit (requests per minute)</Label>
            <Input
              id="api-rate-limit"
              type="number"
              value={formData.apiRateLimit}
              onChange={(e) => handleFormChange("apiRateLimit", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-timeout">Webhook Timeout (seconds)</Label>
            <Input
              id="webhook-timeout"
              type="number"
              value={formData.webhookTimeout}
              onChange={(e) => handleFormChange("webhookTimeout", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="log-retention">Log Retention Period (days)</Label>
            <Input
              id="log-retention"
              type="number"
              value={formData.logRetention}
              onChange={(e) => handleFormChange("logRetention", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-mode">Debug Mode</Label>
              <Switch
                id="debug-mode"
                checked={formData.debugMode}
                onCheckedChange={(checked: boolean) => handleFormChange("debugMode", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enable detailed logging for troubleshooting (not recommended for production).
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button
            variant="destructive"
            className="w-full shadow"
            onClick={handleResetSettings}
            disabled={resetting}
          >
            {resetting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              "Reset to Default Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</div>
  )
}
