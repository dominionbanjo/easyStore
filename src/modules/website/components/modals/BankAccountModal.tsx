"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  Loader2,
  XCircle,
  Landmark,
  CreditCard,
  ShieldCheck,
  Mail,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Adjusted Z-Index to 40/50 to fix SelectDropdown visibility issues */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] z-50 overflow-y-auto md:overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-none shadow-2xl bg-background outline-none flex flex-col md:flex-row custom-scrollbar">
          {/* Left Panel - Visual */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-8 text-white relative flex flex-col justify-between overflow-hidden shrink-0 min-h-[260px] md:min-h-0">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Landmark className="w-48 h-48 rotate-12 translate-x-12 translate-y-12" />
            </div>

            <div className="relative z-10">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 sm:mb-8 shadow-xl">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-3 sm:mb-4 uppercase">
                Secure <br /> Payouts
              </h2>
              <p className="text-indigo-50/80 font-medium text-xs sm:text-sm leading-relaxed max-w-[280px]">
                Connect your bank account to receive direct settlements
                securely.
              </p>
            </div>

            <div className="relative z-10 pt-6 md:pt-0">
              <div className="p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-300" />
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white">
                    Encrypted Storage
                  </p>
                </div>
                <p className="text-[9px] sm:text-[10px] text-indigo-50/60 font-medium italic">
                  "We never store your full details. Everything is processed
                  through Paystack."
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-2/3 p-6 sm:p-12 md:overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  Bank Account Details
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Please provide valid Nigerian bank information.
                </p>
              </div>
              <Dialog.Close asChild>
                <button className="h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 min-h-0"
              >
                <div className="space-y-6">
                  <FormSelect
                    label="Select Your Bank"
                    name="bank_code"
                    options={bankOptions}
                    disabled={banksLoading}
                    icon={<Landmark className="h-4 w-4" />}
                    placeholder={
                      banksLoading
                        ? "Scanning banks…"
                        : "Choose your institution"
                    }
                  />

                  <div className="space-y-2">
                    <FormInput
                      label="Account Number"
                      name="account_number"
                      placeholder="10 Digits (e.g. 0123456789)"
                      icon={<CreditCard className="h-4 w-4" />}
                    />

                    <AnimatePresence mode="wait">
                      {isVerifying && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500"
                        >
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Verifying Account...
                        </motion.p>
                      )}

                      {verifiedData && !isVerifying && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                        >
                          <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <CheckCircle className="h-4 w-4" />
                            <p className="text-xs font-black uppercase tracking-wide">
                              Account Verified
                            </p>
                          </div>
                          <p className="text-xs font-bold text-emerald-700 ml-6">
                            {verifiedData.account_name}
                          </p>
                        </motion.div>
                      )}

                      {verifyError && !isVerifying && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500"
                        >
                          <XCircle className="h-3 w-3" />
                          {verifyError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <FormInput
                    label="Notification Email"
                    name="settlement_email"
                    placeholder="Where should we send settlement alerts?"
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  disabled={isLoading || isVerifying || !verifiedData}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <>
                      Register Bank Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </FormProvider>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
