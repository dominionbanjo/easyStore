import { useForm, FormProvider } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { FormInput } from "@/components/shared/form/FormInput"; // adjust path as needed

interface SecuritySettingsValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function SecuritySettings() {
  const methods = useForm<SecuritySettingsValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: SecuritySettingsValues) => {
    console.log("Password Update Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card className="p-6 bg-white rounded-sm ">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Password & Security</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormInput
              label="Current Password"
              name="current_password"
              type="password"
            />
            <FormInput
              label="New Password"
              name="new_password"
              type="password"
            />
            <FormInput
              label="Confirm New Password"
              name="confirm_password"
              type="password"
            />

            <Button
              type="submit"
              className="rounded-sm bg-primary text-white mt-2"
            >
              <Lock className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
