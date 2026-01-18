import { useForm, FormProvider } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput"; // adjust import path

interface AccountPreferencesValues {
  store_name: string;
  username: string;
  current_sales_channel: string;
}

export default function AccountPreferences() {
  const methods = useForm<AccountPreferencesValues>({
    defaultValues: {
      store_name: "Amaka’s Style Loft",
      username: "amakastyle",
      current_sales_channel: "Instagram",
    },
  });

  const onSubmit = (data: AccountPreferencesValues) => {
    console.log("Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Store Name */}
            <FormInput label="Store Name" name="store_name" />

            {/* Username */}
            <FormInput label="Username" name="username" />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="rounded-full bg-primary text-white"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
