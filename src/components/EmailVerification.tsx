/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "Invalid verification link",
  );

  const handleVerify = useCallback(async () => {
    if (!token) return;

    setStatus("verifying");
    const success = await verifyEmail(token);

    if (success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage("Verification failed. The link may have expired.");
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token, handleVerify]);

  return (
    <div className="min-h-screen bg-lab-white flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="w-20 h-20 rounded-full bg-led-purple/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-led-purple animate-spin" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Verifying your email...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-led-green/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-led-green" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Email Verified!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="btn-primary w-full"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Verification Failed
            </h2>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
