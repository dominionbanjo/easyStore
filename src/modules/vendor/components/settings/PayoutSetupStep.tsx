import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";

interface PayoutSetupStepProps {
  bankData: {
    bank_code: string;
    account_number: string;
    account_name: string;
  };
  banks: any[];
  isVerifying: boolean;
  isRegistering: boolean;
  isValidated: boolean;
  onBankChange: (val: string) => void;
  onAccountNumberChange: (val: string) => void;
  onVerify: () => void;
  onRegister: () => void;
}

export function PayoutSetupStep({
  bankData,
  banks,
  isVerifying,
  isRegistering,
  isValidated,
  onBankChange,
  onAccountNumberChange,
  onVerify,
  onRegister,
}: PayoutSetupStepProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent pb-8">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Payout Setup
        </CardTitle>
        <CardDescription>
          Setup your bank account to receive payments from sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-8 -mt-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
          <CreditCard className="w-10 h-10" />
          <div className="text-sm">
            <p className="font-bold">Automated Daily Payouts</p>
            <p className="opacity-80 font-medium">
              Payments are typically settled within 24 hours of successful
              delivery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label>Select Bank</Label>
            <Select value={bankData.bank_code} onValueChange={onBankChange}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {banks?.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <div className="flex gap-2">
              <Input
                value={bankData.account_number}
                onChange={(e) => onAccountNumberChange(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="0123456789"
                maxLength={10}
              />
              <Button
                variant="secondary"
                className="h-11 rounded-xl px-6"
                onClick={onVerify}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Account Name</Label>
            <Input
              value={bankData.account_name}
              readOnly
              className="h-11 rounded-xl bg-muted/50 border-none font-semibold text-foreground/80"
              placeholder="Account Name will appear here"
            />
          </div>
        </div>

        {isValidated && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Your payout account is verified and active.
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <Button
            onClick={onRegister}
            disabled={isRegistering || !bankData.account_name}
            className="rounded-full px-12 h-12 shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700"
          >
            {isRegistering ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            {isValidated ? "Update Payout Details" : "Register Payout Account"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
