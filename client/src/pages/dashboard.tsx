import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentDashboard from "./student-dashboard";
import LeaderDashboard from "./leader-dashboard";
import AdminDashboard from "./admin-dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    if (user?.role === "admin") return "admin";
    if (user?.role === "leader") return "leader";
    return "student";
  });

  if (!user) return null;

  const availableTabs = [];

  // Always show student dashboard
  availableTabs.push({
    value: "student",
    label: "Student Dashboard",
    component: <StudentDashboard />
  });

  // Show leader dashboard if user is leader or admin
  if (user.role === "leader" || user.role === "admin") {
    availableTabs.push({
      value: "leader",
      label: "Club Leader",
      component: <LeaderDashboard />
    });
  }

  // Show admin dashboard if user is admin
  if (user.role === "admin") {
    availableTabs.push({
      value: "admin",
      label: "Admin Panel", 
      component: <AdminDashboard />
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-auto bg-transparent border-0 p-0">
              {availableTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground hover:text-foreground transition-colors rounded-none"
                  data-testid={`tab-${tab.value}`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Dashboard Content */}
            <div className="mt-0">
              {availableTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  {tab.component}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
