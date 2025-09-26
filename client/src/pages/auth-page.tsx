import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, University, Crown, Shield, Users, Calendar } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"student" | "leader" | "admin">("student");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      schoolId: "",
      role: "student",
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({
      ...registerData,
      role: selectedRole,
    });
  };

  const roleOptions = [
    { value: "student", icon: University, label: "Student" },
    { value: "leader", icon: Crown, label: "Leader" },
    { value: "admin", icon: Shield, label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <GraduationCap className="text-primary text-4xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join ClubSphere"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Create your account to get started"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Enter your credentials to access your dashboard" 
                  : "Fill in your information to create a new account"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" data-testid="form-login">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} data-testid="input-username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} data-testid="input-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full btn-primary" 
                      disabled={loginMutation.isPending}
                      data-testid="button-signin"
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4" data-testid="form-register">
                    {/* Role Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">I am a:</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roleOptions.map(({ value, icon: Icon, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedRole(value as any)}
                            className={`p-3 text-center border rounded-lg transition-colors ${
                              selectedRole === value
                                ? "border-primary bg-accent"
                                : "border-border hover:border-primary hover:bg-accent"
                            }`}
                            data-testid={`button-role-${value}`}
                          >
                            <Icon className="mx-auto mb-1 text-xl" />
                            <span className="text-sm">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} data-testid="input-full-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} data-testid="input-username-register" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} data-testid="input-password-register" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} data-testid="input-confirm-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full btn-primary" 
                      disabled={registerMutation.isPending}
                      data-testid="button-create-account"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-primary hover:underline"
                    data-testid="button-toggle-form"
                  >
                    {isLogin ? "Sign up here" : "Sign in here"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column - Hero */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center text-blue p-12">
        <div className="text-center max-w-md">
          <GraduationCap className="text-6xl mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Build Stronger Communities
          </h2>
          <p className="text-lg opacity-90">
            Connect students, organize events, and manage your school clubs with our comprehensive platform.
          </p>
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Users className="text-lg" />
              <span>Connect with students</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="text-lg" />
              <span>Organize events</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Crown className="text-lg" />
              <span>Lead communities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
