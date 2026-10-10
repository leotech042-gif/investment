import { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sprout,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Calendar,
  Gift,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface EnhancedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: () => void;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  },
];

export function EnhancedLoginModal({
  isOpen,
  onClose,
  mode,
  onSwitchMode,
}: EnhancedLoginModalProps) {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    referralCode: "",
  });
  const [ageError, setAgeError] = useState("");

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDateChange = (value: string) => {
    setFormData({ ...formData, dateOfBirth: value });

    if (value) {
      const age = calculateAge(value);
      if (age < 18) {
        setAgeError("You must be at least 18 years old to use this platform");
      } else {
        setAgeError("");
      }
    }
  };

  const isPasswordValid = (password: string): boolean => {
    return PASSWORD_REQUIREMENTS.every((req) => req.test(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        }
      } else {
        // Validate age
        if (formData.dateOfBirth) {
          const age = calculateAge(formData.dateOfBirth);
          if (age < 18) {
            toast.error("You must be at least 18 years old to register");
            setIsLoading(false);
            return;
          }
        }

        // Validate password
        if (!isPasswordValid(formData.password)) {
          toast.error("Please meet all password requirements");
          setIsLoading(false);
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          referralCode: formData.referralCode || undefined,
        });

        if (result.success) {
          onClose();
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            dateOfBirth: "",
            referralCode: "",
          });
        } else {
          toast.error(result.error || "Registration failed");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-led-purple via-led-purple to-led-green p-8 pb-12">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold text-white">
                {mode === "login" ? "Welcome back" : "Create account"}
              </DialogTitle>
              <DialogDescription className="text-white/80 mt-2">
                {mode === "login"
                  ? "Sign in to access your Invest Glowing account"
                  : "Join the future of modular investing. Must be 18+."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Decorative curve */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 400 50" className="w-full h-12 fill-white">
              <path d="M0,50 L0,20 Q200,50 400,20 L400,50 Z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-led-purple focus:ring-led-purple/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dob"
                  className="text-sm font-medium text-foreground"
                >
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-led-purple focus:ring-led-purple/20"
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {ageError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {ageError}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 h-12 rounded-xl border-gray-200 focus:border-led-purple focus:ring-led-purple/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-led-purple focus:ring-led-purple/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {mode === "register" && formData.password && (
            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">
                Password Requirements:
              </p>
              {PASSWORD_REQUIREMENTS.map((req) => (
                <div key={req.label} className="flex items-center gap-2">
                  {req.test(formData.password) ? (
                    <Check className="w-4 h-4 text-led-green" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                  <span
                    className={`text-sm ${req.test(formData.password) ? "text-led-green" : "text-muted-foreground"}`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label
                htmlFor="referral"
                className="text-sm font-medium text-foreground"
              >
                Referral Code (Optional)
              </Label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="referral"
                  type="text"
                  placeholder="GLOWXXXX"
                  value={formData.referralCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referralCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-led-purple focus:ring-led-purple/20 uppercase"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || (mode === "register" && !!ageError)}
            className="w-full h-12 btn-primary text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-sm text-muted-foreground hover:text-led-purple transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {mode === "login" && (
            <div className="p-4 bg-led-purple/5 rounded-xl">
              <p className="text-xs text-center text-muted-foreground">
                <span className="font-medium text-led-purple">Demo:</span>{" "}
                demo@investglowing.com / Demo@123!
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
