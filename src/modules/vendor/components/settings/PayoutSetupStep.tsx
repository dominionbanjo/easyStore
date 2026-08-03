import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2, Hash, Landmark, User } from "lucide-react";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { FormInput } from "@/components/shared/form/FormInput";

interface Bank {
  name: string;
  code: string;
  slug: string;
  type: string;
}

interface PayoutSetupStepProps {
  banks: Bank[];
  isVerifying: boolean;
  isRegistering: boolean;
  isValidated: boolean;
  onVerify: () => void;
  onRegister: () => void;
}

export function PayoutSetupStep({
  banks,
  isVerifying,
  isRegistering,
  isValidated,
  onVerify,
  onRegister,
}: PayoutSetupStepProps) {
  const { watch } = useFormContext();
  const account_name = watch("account_name");

  const bankOptions = banks.map((bank) => ({
    label: bank.name,
    value: bank.code,
  }));

  return (
    <Card className="border-none  overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-0 py-6">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Payout Setup
        </CardTitle>
        <CardDescription>
          Setup your bank account to receive payments from sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-6 space-y-6 sm:space-y-8 -mt-4">
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-sm bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
          <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Automated Daily Payouts</p>
            <p className="opacity-80 font-medium">
              Payments are typically settled within 24 hours of successful
              delivery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <FormSelect
              name="bank_code"
              label="Select Bank"
              placeholder="Start typing your bank name..."
              options={bankOptions}
              isSearchable
              icon={<Landmark className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <FormInput
                name="account_number"
                label="Account Number"
                placeholder="0123456789"
                icon={<Hash className="w-4 h-4" />}
                className="flex-1"
              />
              <Button
                variant="secondary"
                className="h-12 rounded-sm px-6 border border-muted-foreground/10"
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

          <FormInput
            name="account_name"
            label="Account Name"
            placeholder="Verified name will appear here"
            icon={<User className="w-4 h-4" />}
            className="opacity-90"
            inputClassName="bg-muted/50 font-bold text-foreground/70 pointer-events-none"
          />
        </div>

        {isValidated && (
          <div className="flex items-center gap-3 p-4 rounded-sm bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Your payout account is verified and active.
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <Button
            onClick={onRegister}
            disabled={isRegistering || !account_name}
            className="w-full sm:w-auto rounded-sm px-12 h-12   bg-emerald-600 hover:bg-emerald-700"
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
