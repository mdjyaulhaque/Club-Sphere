import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Menu, 
  User, 
  LogOut,
  Home,
  Users,
  Info,
  Mail,
  LayoutDashboard
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/directory", label: "Club Directory", icon: Users },
     { path: "/about", label: "About", icon: Info },
      { path: "/contact", label: "Contact", icon: Mail },
    ...(user ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${mobile ? "flex items-center space-x-2 px-4 py-2 rounded-lg" : ""} ${
            isActivePath(item.path)
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-primary"
          } transition-colors ${mobile ? "" : "px-3 py-2 text-sm font-medium"}`}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
        >
          {mobile && <item.icon className="h-4 w-4" />}
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <GraduationCap className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-foreground">ClubSphere</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLinks />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {user ? (
              /* User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{user.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" data-testid="button-signin">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="btn-primary" data-testid="button-signup">
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme-mobile"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Logo */}
                  <div className="flex items-center px-4">
                    <GraduationCap className="text-primary text-xl mr-2" />
                    <span className="text-lg font-bold text-foreground">ClubSphere</span>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-2">
                    <NavLinks mobile />
                  </div>

                  {/* Mobile User Section */}
                  {user ? (
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        data-testid="button-logout-mobile"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/auth">Sign In</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full btn-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/api/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
