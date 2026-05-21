import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { makeMeta } from "@/lib/seo";
import { loginAdmin } from "@/lib/api.ts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => makeMeta({ title: "Admin Login — Sudharshan Eye Hospital", description: "Admin sign-in", path: "/admin/login" }),
  component: AdminLogin,
});

type FormData = {
  username: string;
  password: string;
};

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // Check if session token already exists on load
  useEffect(() => {
    const checkExistingSession = () => {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("admin_token="));
      if (tokenCookie) {
        navigate({ to: "/admin/dashboard" });
      }
      setChecking(false);
    };
    checkExistingSession();
  }, [navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginAdmin({ data: { username: data.username, password: data.password } });
      
      if (res.success && res.token) {
        // Set session token in cookies
        document.cookie = `admin_token=${res.token}; path=/; max-age=86400; SameSite=Strict`;
        toast.success("Successfully logged in as admin");
        
        // Navigate directly to dashboard
        navigate({ to: "/admin/dashboard" });
      } else {
        toast.error(res.error || "Authentication failed. Try admin / admin123.");
      }
    } catch (error) {
      toast.error("Invalid credentials. Try using admin / admin123.");
    }
  };

  if (checking) {
    return (
      <SiteLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm font-semibold">Verifying secure admin session...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="relative min-h-[85vh] bg-soft flex items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-accent rounded-full filter blur-3xl opacity-60" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-60" />

        <div className="w-full max-w-md z-10">
          {/* Logo / Header Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-primary-gradient items-center justify-center shadow-elegant mb-3">
              <ShieldCheck className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground">Sudharshan Eye Hospital</h2>
            <p className="text-sm text-muted-foreground mt-1">Hospital Administrative Console</p>
          </div>

          <Card className="border border-border/80 shadow-elegant bg-card/90 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-6 border-b border-border/50 bg-accent/20">
              <CardTitle className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your administrative credentials to manage your clinic
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 pt-6">
                {/* Username Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-semibold text-foreground">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Enter username"
                      className="pl-10 h-10.5 rounded-xl border border-input focus-visible:ring-primary"
                      disabled={isSubmitting}
                      {...register("username", { required: "Username is required" })}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs font-semibold text-destructive mt-1">{errors.username.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10 h-10.5 rounded-xl border border-input focus-visible:ring-primary"
                      disabled={isSubmitting}
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-semibold text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pb-6 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary-gradient hover:opacity-95 text-primary-foreground font-semibold rounded-xl shadow-elegant"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Administrative Access...
                    </>
                  ) : (
                    "Verify Access"
                  )}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground mt-2">
                  System Admin: use default credentials <strong>admin</strong> / <strong>admin123</strong> to login offline.
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
