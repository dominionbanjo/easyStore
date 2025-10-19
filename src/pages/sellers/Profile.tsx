"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  storeName: z.string().min(2),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [avatar, setAvatar] = useState("/images/avatar.jpg");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phone: "+234 810 123 4567",
      storeName: "Doe Collections",
      bio: "Bringing fashion to your doorstep!",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    console.log(values);
    toast.success("Profile updated successfully!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    toast.success("Profile picture updated!");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-muted rounded-lg p-1 w-fit">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* PERSONAL INFO */}
        <TabsContent value="personal">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid sm:grid-cols-2 gap-6"
              >
                <div>
                  <Label>First Name</Label>
                  <Input {...form.register("firstName")} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input {...form.register("lastName")} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...form.register("email")} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input {...form.register("phone")} />
                </div>

                <div className="sm:col-span-2">
                  <Label>Bio</Label>
                  <Input {...form.register("bio")} />
                </div>

                <Button
                  type="submit"
                  className="sm:col-span-2 mt-2 bg-primary text-white rounded-full"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STORE INFO */}
        <TabsContent value="store">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border">
                    <AvatarImage src={avatar} alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary p-1 rounded-full cursor-pointer"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <Label className="font-semibold">Store Name</Label>
                  <Input {...form.register("storeName")} className="max-w-sm" />
                </div>
              </div>

              <Separator />
              <Button className="rounded-full bg-primary text-white">
                Update Store Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Email to Buyers</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Product Notifications</Label>
                <Switch defaultChecked />
              </div>
              <Button className="rounded-full bg-primary text-white">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
              </div>
              <Button className="rounded-full bg-primary text-white mt-2">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
