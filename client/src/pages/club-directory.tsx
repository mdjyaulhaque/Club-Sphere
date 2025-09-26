import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ClubWithDetails } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Users } from "lucide-react";

const categories = [
  "All Categories",
  "Academic", 
  "Sports",
  "Arts",
  "Technology",
  "Service"
];

export default function ClubDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: clubs = [], isLoading } = useQuery<ClubWithDetails[]>({
    queryKey: ["/api/clubs", selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "All Categories") params.set("category", selectedCategory);
      if (searchQuery) params.set("search", searchQuery);
      
      const res = await fetch(`/api/clubs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  const joinClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      await apiRequest("POST", `/api/clubs/${clubId}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/memberships"] });
      toast({
        title: "Success",
        description: "Successfully joined the club!",
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

  const leaveClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      await apiRequest("DELETE", `/api/clubs/${clubId}/leave`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/memberships"] });
      toast({
        title: "Success",
        description: "Successfully left the club.",
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Academic: "bg-primary/10 text-primary",
      Sports: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Arts: "bg-secondary/10 text-secondary",
      Technology: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      Service: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const handleJoinLeave = (club: ClubWithDetails) => {
    if (club.isMember) {
      leaveClubMutation.mutate(club.id);
    } else {
      joinClubMutation.mutate(club.id);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Club Directory</h1>
          <p className="text-muted-foreground">Discover and join amazing clubs and organizations</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48" data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && clubs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No clubs found</h3>
                <p>Try adjusting your search criteria or browse all clubs.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Club Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="overflow-hidden card-hover" data-testid={`card-club-${club.id}`}>
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {club.category === "Academic" && "📚"}
                  {club.category === "Sports" && "⚽"}
                  {club.category === "Arts" && "🎨"}
                  {club.category === "Technology" && "💻"}
                  {club.category === "Service" && "🤝"}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`text-xs font-medium ${getCategoryColor(club.category)}`}>
                    {club.category}
                  </Badge>
                  <span className="text-muted-foreground text-sm flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {club.memberCount} members
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`text-club-name-${club.id}`}>
                  {club.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {club.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span data-testid={`text-meeting-time-${club.id}`}>
                      {club.meetingTime || "TBD"}
                    </span>
                  </div>
                  {user && (
                    <Button
                      onClick={() => handleJoinLeave(club)}
                      disabled={joinClubMutation.isPending || leaveClubMutation.isPending}
                      className={club.isMember ? "btn-secondary" : "btn-primary"}
                      size="sm"
                      data-testid={`button-${club.isMember ? 'leave' : 'join'}-club-${club.id}`}
                    >
                      {club.isMember ? "Leave Club" : "Join Club"}
                    </Button>
                  )}
                </div>
                {club.leader && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Led by <span className="font-medium">{club.leader.fullName}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
