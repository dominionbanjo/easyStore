"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";

import {
  useGetNigerianBanksQuery,
  useRegisterBankAccountMutation,
  useVerifyBankAccountMutation,
} from "@/services/userApi";

type BankFormValues = {
  bank_code: string;
  account_number: string;
  settlement_email?: string;
};

export function BankAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [registerBank, { isLoading }] = useRegisterBankAccountMutation();
  const [verifyBank] = useVerifyBankAccountMutation();

  const { data: banks, isLoading: banksLoading } = useGetNigerianBanksQuery(
    undefined,
    { skip: !open },
  );

  const [verifiedData, setVerifiedData] = useState<{
    account_name: string;
    bank_name: string;
  } | null>(null);

  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<BankFormValues>({
    defaultValues: {
      bank_code: "",
      account_number: "",
      settlement_email: "",
    },
  });

  const { handleSubmit, control } = form;

  const bankCode = useWatch({ name: "bank_code", control });
  const accountNumber = useWatch({ name: "account_number", control });

  /* ───────── BANK OPTIONS ───────── */

  const bankOptions = useMemo(() => {
    if (!Array.isArray(banks?.data)) return [];
    return banks.data.map((b) => ({
      label: b.name,
      value: b.code,
    }));
  }, [banks]);

  /* ───────── VERIFY BANK ───────── */

  useEffect(() => {
    if (!bankCode || !/^\d{10}$/.test(accountNumber ?? "")) {
      setVerifiedData(null);
      setVerifyError(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsVerifying(true);
        setVerifyError(null);

        const res = await verifyBank({
          bank_code: bankCode,
          account_number: accountNumber!,
        }).unwrap();

        setVerifiedData({
          account_name: res.account_name,
          bank_name: res.bank_name,
        });
      } catch (e: any) {
        setVerifiedData(null);
        setVerifyError(e?.data?.message || "Unable to verify bank details");
      } finally {
        setIsVerifying(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [bankCode, accountNumber, verifyBank]);

  /* ───────── SUBMIT ───────── */

  const onSubmit = async (values: BankFormValues) => {
    if (!verifiedData || isVerifying) return;

    try {
      await registerBank(values).unwrap();
      toast.success("Bank account saved successfully");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save bank details");
    }
  };

  /* ───────── UI ───────── */

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-xl">
            <CardHeader>
              <CardTitle>Add Bank Account</CardTitle>
            </CardHeader>

            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormSelect
                    label="Bank"
                    name="bank_code"
                    options={bankOptions}
                    disabled={banksLoading}
                    placeholder={
                      banksLoading ? "Loading banks…" : "Select bank"
                    }
                  />

                  <div className="space-y-1">
                    <FormInput
                      label="Account Number"
                      name="account_number"
                      placeholder="0123456789"
                    />

                    {isVerifying && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Verifying bank details…
                      </p>
                    )}

                    {verifiedData && !isVerifying && (
                      <p className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        {verifiedData.account_name} — {verifiedData.bank_name}
                      </p>
                    )}

                    {verifyError && !isVerifying && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <XCircle className="h-3 w-3" />
                        {verifyError}
                      </p>
                    )}
                  </div>

                  <FormInput
                    label="Settlement Email (optional)"
                    name="settlement_email"
                    placeholder="email@example.com"
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || isVerifying || !verifiedData}
                    >
                      {isLoading ? "Saving..." : "Save Bank"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
