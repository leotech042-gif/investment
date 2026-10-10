import { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import {
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Camera,
  CreditCard,
  User,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface KYCVerificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ID_TYPES = [
  { value: "bvn", label: "BVN (Bank Verification Number)", icon: Fingerprint },
  { value: "nin", label: "NIN (National Identity Number)", icon: CreditCard },
  { value: "passport", label: "International Passport", icon: User },
  { value: "drivers_license", label: "Driver's License", icon: CreditCard },
  { value: "voters_card", label: "Voter's Card", icon: CreditCard },
];

export function KYCVerification({ isOpen, onClose }: KYCVerificationProps) {
  const { kycStatus, submitBVN, submitKYC } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedIdType, setSelectedIdType] = useState("");
  const [bvn, setBvn] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBVNSubmit = async () => {
    if (bvn.length !== 11 || !/^\d+$/.test(bvn)) {
      toast.error("Please enter a valid 11-digit BVN");
      return;
    }

    setIsSubmitting(true);
    const result = await submitBVN(bvn);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("BVN verified successfully!");
      setStep(3);
    } else {
      toast.error(result.error || "BVN verification failed");
    }
  };

  const handleKYCSubmit = async () => {
    if (!selectedIdType || !idNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await submitKYC({
      idType: selectedIdType as
        | "bvn"
        | "nin"
        | "passport"
        | "drivers_license"
        | "voters_card",
      idNumber,
      idDocumentUrl: "https://example.com/id-document.jpg",
      selfieUrl: "https://example.com/selfie.jpg",
    });

    setIsSubmitting(false);
    toast.success("KYC documents submitted for review!");
    onClose();
  };

  const getKYCStatusDisplay = () => {
    switch (kycStatus) {
      case "verified":
        return {
          icon: CheckCircle2,
          color: "text-led-green",
          bgColor: "bg-led-green/10",
          title: "KYC Verified",
          message:
            "Your identity has been verified. You have full access to all features.",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          title: "KYC Under Review",
          message:
            "Your documents are being reviewed. This usually takes 24-48 hours.",
        };
      case "rejected":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          title: "KYC Rejected",
          message:
            "Your verification was rejected. Please submit new documents.",
        };
      default:
        return {
          icon: Shield,
          color: "text-led-purple",
          bgColor: "bg-led-purple/10",
          title: "KYC Required",
          message: "Complete KYC verification to unlock all features.",
        };
    }
  };

  const statusDisplay = getKYCStatusDisplay();

  if (kycStatus === "verified") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              KYC Status
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div
              className={`w-20 h-20 rounded-full ${statusDisplay.bgColor} flex items-center justify-center mx-auto mb-4`}
            >
              <statusDisplay.icon
                className={`w-10 h-10 ${statusDisplay.color}`}
              />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              {statusDisplay.title}
            </h3>
            <p className="text-muted-foreground">{statusDisplay.message}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${statusDisplay.bgColor} flex items-center justify-center`}
            >
              <Shield className={`w-5 h-5 ${statusDisplay.color}`} />
            </div>
            KYC Verification
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? "bg-led-purple" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Select ID Type */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Choose the type of identification document you want to use for
              verification.
            </p>
            <div className="space-y-2">
              {ID_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedIdType(type.value);
                    if (type.value === "bvn") {
                      setStep(2);
                    } else {
                      setStep(2);
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedIdType === type.value
                      ? "border-led-purple bg-led-purple/5"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <type.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">
                    {type.label}
                  </span>
                  <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {selectedIdType === "bvn" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Enter your BVN (11 digits)
                  </label>
                  <Input
                    type="text"
                    placeholder="12345678901"
                    value={bvn}
                    onChange={(e) =>
                      setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    className="h-14 text-lg font-mono rounded-xl"
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your BVN is securely encrypted and used only for identity
                    verification.
                  </p>
                </div>
                <Button
                  onClick={handleBVNSubmit}
                  disabled={bvn.length !== 11 || isSubmitting}
                  className="w-full h-14 btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify BVN"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    ID Number
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your ID number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Upload ID Document
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-led-purple transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or PDF (max 5MB)
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Take a Selfie
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-led-purple transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to take a selfie
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make sure your face is clearly visible
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleKYCSubmit}
                  disabled={!idNumber || isSubmitting}
                  className="w-full h-14 btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-led-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-led-green" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              Verification Submitted!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your documents have been submitted for review. You'll be notified
              once verified.
            </p>
            <Button onClick={onClose} className="btn-primary">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
