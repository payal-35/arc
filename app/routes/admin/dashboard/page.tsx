import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";

import { useState } from "react";
import { toast } from "~/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { ModeToggle } from "~/components/mode-toggle";

import {
  Bell,
  FileText,
  Globe,
  Key,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Database,
  FileSearch,
  PieChart,
  Map,
} from "lucide-react";
import PurposesPanel from "~/components/dashboard/purposes-panel";
import AuditLogsPanel from "~/components/dashboard/audit-logs-panel";
import GrievancesPanel from "~/components/dashboard/grievances-panel";
import WebhooksPanel from "~/components/dashboard/webhooks-panel";
import NotificationsPanel from "~/components/dashboard/notifications-panel";
import ApiKeysPanel from "~/components/dashboard/api-keys-panel";
import SettingsPanel from "~/components/dashboard/settings-panel";
import DashboardOverview from "~/components/dashboard/dashboard-overview";
import ConsentsPanel from "~/components/dashboard/consents-panel";
import UsersPanel from "~/components/dashboard/users-panel";
import DataRequestsPanel from "~/components/dashboard/data-requests-panel";
import AnalyticsPanel from "~/components/dashboard/analytics-panel";
import DSRManagementPanel from "~/components/dashboard/dsr-management-panel";
import DataMappingPanel from "~/components/dashboard/data-mapping-panel";

interface AdminInfo {
  admin_id: string;
  tenant_id: string;
  iat?: number;
  exp?: number;
}

// Loader simulating fetch admin info and loading delay
export const loader: LoaderFunction = async () => {
  await new Promise((r) => setTimeout(r, 1500));

  const adminInfo: AdminInfo = {
    admin_id: "admin-123456",
    tenant_id: "tenant-abcdef",
  };

  return json({ adminInfo });
};

// Action to handle logout
export const action: ActionFunction = async ({ request }) => {
  await new Promise((r) => setTimeout(r, 1000));

 

  return redirect("/");
};

export default function AdminDashboard() {
  const { adminInfo } = useLoaderData<{ adminInfo: AdminInfo }>();
  
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

 
  const loading = navigation.state === "loading" || navigation.state === "submitting";

  const handleLogout = () => {
   
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "more") {
      setMobileMoreOpen(!mobileMoreOpen);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-secondary/10">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10 animated-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              ARC Admin Dashboard
            </h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              DPDP Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            
            <ModeToggle />
            {/* Logout form */}
            <form
              method="post"
              onSubmit={() =>
                toast({
                  title: "Logged Out",
                  description: "You have been successfully logged out.",
                })
              }
            >
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-primary/20 bg-background/80 backdrop-blur-sm p-4 hidden md:block">
          <div className="space-y-1">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              { id: "purposes", icon: FileText, label: "Purposes" },
              { id: "consents", icon: Shield, label: "Consents" },
              { id: "users", icon: Users, label: "Users" },
              { id: "data-requests", icon: FileSearch, label: "Data Requests" },
              { id: "dsr-management", icon: FileSearch, label: "DSR Management" },
              { id: "data-mapping", icon: Map, label: "Data Mapping" },
              { id: "audit", icon: Database, label: "Audit Logs" },
              { id: "grievances", icon: MessageSquare, label: "Grievances" },
              { id: "webhooks", icon: Globe, label: "Webhooks" },
              { id: "notifications", icon: Bell, label: "Notifications" },
              { id: "apikeys", icon: Key, label: "API Keys" },
              { id: "analytics", icon: PieChart, label: "Analytics" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item, index) => (
              <div key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`group w-full justify-start transition-all duration-300 ${activeTab === item.id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10"
                    }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 animate-zoom ${activeTab === item.id
                        ? "text-white drop-shadow-[0_0_0.4rem_#c084fc]"
                        : "text-primary"
                      }`}
                  />

                  <span className="font-medium">{item.label}</span>
                </Button>
              </div>
            ))}
          </div>



          <div className="mt-8 pt-4 border-t">
            <Card className="bg-background border border-primary/20">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  Admin Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono truncate max-w-[120px] text-primary">
                      {adminInfo.admin_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenant:</span>
                    <span className="font-mono truncate max-w-[120px] text-primary">
                      {adminInfo.tenant_id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "purposes" && <PurposesPanel />}
          {activeTab === "consents" && <ConsentsPanel />}
          {activeTab === "users" && <UsersPanel />}
          {activeTab === "data-requests" && <DataRequestsPanel />}
          {activeTab === "dsr-management" && <DSRManagementPanel />}
          {activeTab === "data-mapping" && <DataMappingPanel />}
          {activeTab === "audit" && <AuditLogsPanel />}
          {activeTab === "grievances" && <GrievancesPanel />}
          {activeTab === "webhooks" && <WebhooksPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "apikeys" && <ApiKeysPanel />}
          {activeTab === "analytics" && <AnalyticsPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}
