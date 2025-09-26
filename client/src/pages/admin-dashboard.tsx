import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Crown, Calendar, Settings, FileText, BarChart3, Download } from "lucide-react";
import type { ClubWithDetails } from "@shared/schema";

interface AdminStats {
  totalStudents: number;
  totalLeaders: number;
  activeClubs: number;
  totalMemberships: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.role === "admin",
  });

  const { data: clubs = [], isLoading: clubsLoading } = useQuery<ClubWithDetails[]>({
    queryKey: ["/api/clubs"],
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">You don't have admin permissions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Oversee all clubs and manage the platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card data-testid="stat-card-students">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-card-foreground" data-testid="stat-total-students">
                  {statsLoading ? "-" : stats?.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-clubs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
                <p className="text-2xl font-bold text-card-foreground" data-testid="stat-active-clubs">
                  {statsLoading ? "-" : stats?.activeClubs}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-leaders">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Club Leaders</p>
                <p className="text-2xl font-bold text-card-foreground" data-testid="stat-total-leaders">
                  {statsLoading ? "-" : stats?.totalLeaders}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Crown className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-memberships">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Memberships</p>
                <p className="text-2xl font-bold text-card-foreground" data-testid="stat-total-memberships">
                  {statsLoading ? "-" : stats?.totalMemberships}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Club Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Club Management</CardTitle>
                <Button className="btn-primary" data-testid="button-add-club">
                  Add New Club
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {clubsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div>
                        <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-24"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-16 bg-muted rounded-full"></div>
                        <div className="h-8 w-16 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {clubs.slice(0, 5).map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`admin-club-${club.id}`}>
                      <div>
                        <h3 className="font-medium text-card-foreground">{club.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {club.memberCount} members • Leader: {club.leader?.fullName || "No leader"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={club.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          {club.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline" data-testid={`button-manage-${club.id}`}>
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                  {clubs.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        View All Clubs ({clubs.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="system-activity">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">New club created</p>
                      <p className="text-sm text-muted-foreground">Photography Club by Mike Johnson</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Crown className="text-secondary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Leadership role assigned</p>
                      <p className="text-sm text-muted-foreground">Sarah Chen promoted in Art Society</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" data-testid="button-manage-users">
                  <Settings className="mr-3 h-4 w-4 text-primary" />
                  Manage Users
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-view-analytics">
                  <BarChart3 className="mr-3 h-4 w-4 text-secondary" />
                  View Analytics
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-system-settings">
                  <Settings className="mr-3 h-4 w-4 text-primary" />
                  System Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-export-data">
                  <Download className="mr-3 h-4 w-4 text-secondary" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="system-status">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Server Status</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Service</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Users Today:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Sessions:</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Club Applications:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
