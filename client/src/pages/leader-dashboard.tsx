import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClubSchema, insertAnnouncementSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Calendar, Megaphone, BarChart3, User } from "lucide-react";
import type { ClubWithDetails, Membership, User as UserType } from "@shared/schema";

type ClubMembership = Membership & { user: UserType };

export default function LeaderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);

  const { data: clubs = [], isLoading: clubsLoading } = useQuery<ClubWithDetails[]>({
    queryKey: ["/api/clubs"],
    enabled: !!user,
    select: (data) => data.filter(club => 
      club.leaderId === user?.id || 
      club.userRole === "leader"
    ),
  });

  const { data: members = [], isLoading: membersLoading } = useQuery<ClubMembership[]>({
    queryKey: ["/api/clubs", selectedClubId, "members"],
    enabled: !!selectedClubId,
  });

  const createClubForm = useForm({
    resolver: zodResolver(insertClubSchema.omit({ leaderId: true })),
    defaultValues: {
      name: "",
      description: "",
      category: "Academic",
      meetingTime: "",
      meetingLocation: "",
      isActive: true,
    },
  });

  const createAnnouncementForm = useForm({
    resolver: zodResolver(insertAnnouncementSchema.omit({ clubId: true, authorId: true })),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createClubMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/clubs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      setIsCreateClubOpen(false);
      createClubForm.reset();
      toast({
        title: "Success",
        description: "Club created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/clubs/${selectedClubId}/announcements`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsCreateAnnouncementOpen(false);
      createAnnouncementForm.reset();
      toast({
        title: "Success",
        description: "Announcement created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user || (user.role !== "leader" && user.role !== "admin")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">You don't have leader permissions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onCreateClub = (data: any) => {
    createClubMutation.mutate(data);
  };

  const onCreateAnnouncement = (data: any) => {
    createAnnouncementMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Club Leader Dashboard</h1>
        <p className="text-muted-foreground">Manage your clubs and engage with members</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Club Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Clubs</CardTitle>
                <Dialog open={isCreateClubOpen} onOpenChange={setIsCreateClubOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary" data-testid="button-create-club">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Club
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Club</DialogTitle>
                    </DialogHeader>
                    <Form {...createClubForm}>
                      <form onSubmit={createClubForm.handleSubmit(onCreateClub)} className="space-y-4" data-testid="form-create-club">
                        <FormField
                          control={createClubForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Club Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter club name" {...field} data-testid="input-club-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createClubForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe your club..." {...field} data-testid="textarea-club-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createClubForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-club-category">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Academic">Academic</SelectItem>
                                  <SelectItem value="Sports">Sports</SelectItem>
                                  <SelectItem value="Arts">Arts</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                  <SelectItem value="Service">Service</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createClubForm.control}
                          name="meetingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Time</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Fridays 4PM" {...field} data-testid="input-meeting-time" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createClubForm.control}
                          name="meetingLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Room 101" {...field} data-testid="input-meeting-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateClubOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createClubMutation.isPending} data-testid="button-submit-club">
                            {createClubMutation.isPending ? "Creating..." : "Create Club"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {clubsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-8 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : clubs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">You don't lead any clubs yet.</p>
                  <Button onClick={() => setIsCreateClubOpen(true)}>Create Your First Club</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div key={club.id} className="border border-border rounded-lg p-4" data-testid={`card-leader-club-${club.id}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-card-foreground">{club.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {club.memberCount} members • Meeting {club.meetingTime || "TBD"}
                          </p>
                        </div>
                        <Badge variant="default">Leader</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{club.memberCount}</p>
                          <p className="text-xs text-muted-foreground">Members</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">-</p>
                          <p className="text-xs text-muted-foreground">Events</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">-</p>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedClubId(club.id)}
                          variant={selectedClubId === club.id ? "default" : "outline"}
                          data-testid={`button-manage-${club.id}`}
                        >
                          Manage
                        </Button>
                        <Button size="sm" variant="outline">
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Member Management */}
          {selectedClubId && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {clubs.find(c => c.id === selectedClubId)?.name} - Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div>
                            <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg" data-testid={`member-${member.id}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="text-primary h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{member.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(member.joinedAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={member.role === "leader" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Dialog open={isCreateAnnouncementOpen} onOpenChange={setIsCreateAnnouncementOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      disabled={!selectedClubId}
                      data-testid="button-create-announcement"
                    >
                      <Megaphone className="mr-3 h-4 w-4 text-primary" />
                      Create Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                    </DialogHeader>
                    <Form {...createAnnouncementForm}>
                      <form onSubmit={createAnnouncementForm.handleSubmit(onCreateAnnouncement)} className="space-y-4" data-testid="form-create-announcement">
                        <FormField
                          control={createAnnouncementForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Announcement title" {...field} data-testid="input-announcement-title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createAnnouncementForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Write your announcement..." {...field} data-testid="textarea-announcement-content" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateAnnouncementOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createAnnouncementMutation.isPending} data-testid="button-submit-announcement">
                            {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-3 h-4 w-4 text-secondary" />
                  Schedule Event
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-3 h-4 w-4 text-primary" />
                  Manage Members
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Club Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Club Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Clubs Led:</span>
                  <span className="font-medium">{clubs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Members:</span>
                  <span className="font-medium">
                    {clubs.reduce((sum, club) => sum + club.memberCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Clubs:</span>
                  <span className="font-medium">
                    {clubs.filter(club => club.isActive).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
