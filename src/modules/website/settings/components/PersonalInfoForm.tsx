import { useForm, FormProvider } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/FormInput"; // adjust import path as needed

interface PersonalInfoFormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export default function PersonalInfoForm() {
  const methods = useForm<PersonalInfoFormValues>({
    defaultValues: {
      first_name: "Amaka",
      last_name: "Eze",
      phone_number: "09011223344",
      email: "amakastyle@example.com",
    },
  });

  const onSubmit = (data: PersonalInfoFormValues) => {
    console.log("Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="First Name" name="first_name" />
            <FormInput label="Last Name" name="last_name" />
            <FormInput label="Phone Number" name="phone_number" />
            <FormInput
              label="Email"
              name="email"
              type="email"
              className="opacity-75 pointer-events-none"
            />

            <div className="md:col-span-2 flex justify-end">
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
