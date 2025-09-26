import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Calendar, Settings, User, Clock } from "lucide-react";
import type { Membership, Club, AnnouncementWithDetails } from "@shared/schema";

type UserMembership = Membership & { club: Club };

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: memberships = [], isLoading: membershipsLoading } = useQuery<UserMembership[]>({
    queryKey: ["/api/user/memberships"],
    enabled: !!user,
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery<AnnouncementWithDetails[]>({
    queryKey: ["/api/announcements"],
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
          Welcome back, {user.fullName}!
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your clubs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Clubs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Clubs</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/directory">
                    Browse More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {membershipsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : memberships.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">You haven't joined any clubs yet.</p>
                  <Button asChild>
                    <Link href="/directory">Explore Clubs</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {memberships.map((membership) => (
                    <div 
                      key={membership.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                      data-testid={`card-membership-${membership.id}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">
                            {membership.club.category === "Academic" && "📚"}
                            {membership.club.category === "Sports" && "⚽"}
                            {membership.club.category === "Arts" && "🎨"}
                            {membership.club.category === "Technology" && "💻"}
                            {membership.club.category === "Service" && "🤝"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-card-foreground" data-testid={`text-club-name-${membership.id}`}>
                            {membership.club.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Next meeting: {membership.club.meetingTime || "TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={membership.role === "leader" ? "default" : "secondary"}>
                          {membership.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="activity-list">
                {memberships.slice(0, 3).map((membership) => (
                  <div key={membership.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-card-foreground">
                        You joined <span className="font-medium">{membership.club.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(membership.joinedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {memberships.length === 0 && (
                  <p className="text-muted-foreground">No recent activity.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="text-primary text-2xl" />
                </div>
                <h3 className="font-semibold text-card-foreground" data-testid="text-user-name">
                  {user.fullName}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {user.email}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student ID:</span>
                  <span className="text-card-foreground" data-testid="text-student-id">
                    {user.schoolId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clubs Joined:</span>
                  <span className="text-card-foreground" data-testid="text-club-count">
                    {memberships.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-l-4 border-muted pl-4 animate-pulse">
                      <div className="h-4 bg-muted rounded mb-1"></div>
                      <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-primary pl-4" data-testid={`announcement-${announcement.id}`}>
                      <h4 className="font-medium text-card-foreground text-sm">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{announcement.club.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start" data-testid="button-find-clubs">
                  <Link href="/directory">
                    <Search className="mr-3 h-4 w-4 text-primary" />
                    Find New Clubs
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-view-calendar">
                  <Calendar className="mr-3 h-4 w-4 text-secondary" />
                  View Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-settings">
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
