import { Link } from "wouter";
import { 
  GraduationCap, 
  Users, 
  Crown, 
  Shield, 
  Bell, 
  Calendar, 
  BarChart3 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Manage Your School Clubs
              <span className="block text-primary-foreground/90">Like Never Before</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Connect students, organize activities, and build stronger communities with our comprehensive club management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8" data-testid="button-get-started">
                <Link href="/auth">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8" data-testid="button-explore-clubs">
                <Link href="/directory">Explore Clubs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Clubs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From student engagement to administrative oversight, our platform covers every aspect of club management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-student-hub">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Student Hub</h3>
              <p className="text-muted-foreground">Discover clubs, join communities, and stay updated with announcements and events.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-leader-tools">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Crown className="text-secondary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Leader Tools</h3>
              <p className="text-muted-foreground">Manage members, create announcements, schedule events, and track club activities.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-admin-control">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Admin Control</h3>
              <p className="text-muted-foreground">Oversee all clubs, manage users, and access comprehensive analytics and reports.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-notifications">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="text-secondary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Smart Notifications</h3>
              <p className="text-muted-foreground">Stay informed with real-time notifications for events, announcements, and club updates.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-scheduling">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Event Scheduling</h3>
              <p className="text-muted-foreground">Plan and coordinate club meetings, events, and activities with integrated calendar tools.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border card-hover" data-testid="card-analytics">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-secondary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Analytics</h3>
              <p className="text-muted-foreground">Track engagement, monitor club growth, and make data-driven decisions for better outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your School's Club Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of schools already using ClubSphere to create vibrant student communities.
          </p>
          <Button asChild size="lg" className="btn-primary text-lg font-semibold px-8" data-testid="button-start-trial">
            <Link href="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="text-primary text-xl mr-2" />
                <span className="text-lg font-bold text-foreground">ClubSphere</span>
              </div>
              <p className="text-muted-foreground">Empowering schools to build stronger student communities through effective club management.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/contact" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 ClubSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
