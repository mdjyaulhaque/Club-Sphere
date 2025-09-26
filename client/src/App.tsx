import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/lib/protected-route";
import Navigation from "@/components/navigation";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import ClubDirectory from "@/pages/club-directory";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

// ✅ Import new pages
import About from "@/pages/about";
import Contact from "@/pages/contact";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/directory" component={ClubDirectory} />
        <Route path="/about" component={About} />      
        <Route path="/contact" component={Contact} /> 
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
