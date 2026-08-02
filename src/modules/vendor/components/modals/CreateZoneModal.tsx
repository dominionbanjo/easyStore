import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { useCreateZoneMutation } from "@/services/schoolZoneApi";
import {
  useGetCloudinarySignatureQuery,
  type CloudinaryConfig,
} from "@/services/cloudinaryApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CreateZoneFormValues = {
  name: string;
  subdomain: string;
  tagline: string;
  description: string;
  state: string;
  location: string;
  contact_email: string;
  contact_phone: string;
};

export default function CreateZoneModal({
  isOpen,
  onClose,
}: CreateZoneModalProps) {
  const [create, { isLoading }] = useCreateZoneMutation();
  const { data: cloudinaryData } = useGetCloudinarySignatureQuery();

  const methods = useForm<CreateZoneFormValues>({
    defaultValues: {
      name: "",
      subdomain: "",
      tagline: "",
      description: "",
      state: "",
      location: "",
      contact_email: "",
      contact_phone: "",
    },
  });
  const subdomain = methods.watch("subdomain");

  const [logo, setLogo] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const canUpload = Boolean(cloudinaryData);

  const uploadImage = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size cannot exceed 5MB");
    }
    if (!canUpload) {
      throw new Error("Upload service unavailable");
    }
    const uploaded = await uploadToCloudinary(
      file,
      cloudinaryData as CloudinaryConfig
    );
    return uploaded.url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setLogo(await uploadImage(file));
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setCoverImage(await uploadImage(file));
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload cover image"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (values: CreateZoneFormValues) => {
    try {
      await create({
        name: values.name.trim(),
        subdomain: values.subdomain.trim().toLowerCase(),
        tagline: values.tagline.trim() || undefined,
        description: values.description.trim() || undefined,
        state: values.state.trim(),
        location: values.location.trim() || undefined,
        contact_email: values.contact_email.trim() || undefined,
        contact_phone: values.contact_phone.trim() || undefined,
        logo: logo ?? undefined,
        cover_image: coverImage ?? undefined,
      }).unwrap();

      toast.success(
        "Zone request submitted! It will go live once approved by an admin."
      );
      onClose();
      methods.reset();
      setLogo(null);
      setCoverImage(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data: { message?: string } }).data?.message ??
                "Failed to submit zone request"
            )
          : "Failed to submit zone request";
      toast.error(message);
    }
  };

  const subdomainHint = subdomain.trim()
    ? `Your zone will be live at ${subdomain.trim().toLowerCase()}.${
        window.location.hostname === "localhost"
          ? "localhost"
          : window.location.host
      }`
    : null;

  return (
    <Modal
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onClose={onClose}
      title="Create a School Zone"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-5 py-4"
        >
          <p className="text-sm text-muted-foreground font-medium">
            Create a campus marketplace for your school. A platform admin will
            review and approve your request, and you'll become the school rep.
          </p>

          <div className="space-y-4">
            <FormInput
              label="School Name"
              name="name"
              placeholder="e.g. University of Lagos"
              rules={{ required: "School name is required" }}
            />
            <FormInput
              label="Subdomain"
              name="subdomain"
              placeholder="e.g. unilag"
              rules={{
                required: "Subdomain is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message:
                    "Only lowercase letters, numbers, and dashes allowed",
                },
              }}
            />
            {subdomainHint && (
              <p className="text-xs text-muted-foreground font-medium">
                {subdomainHint}
              </p>
            )}
            <FormInput
              label="Tagline"
              name="tagline"
              placeholder="e.g. Shop from verified campus vendors"
            />
            <FormTextarea
              label="Description"
              name="description"
              placeholder="Tell students what this zone is about..."
            />
            <FormInput
              label="State"
              name="state"
              placeholder="e.g. Lagos"
              rules={{ required: "State is required" }}
            />
            <FormInput
              label="Location / Campus"
              name="location"
              placeholder="e.g. Akoka, Yaba"
            />
            <FormInput
              label="Contact Email"
              name="contact_email"
              type="email"
              placeholder="rep@school.edu.ng"
            />
            <FormInput
              label="Contact Phone"
              name="contact_phone"
              placeholder="e.g. 08012345678"
            />

            {/* Logo upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Logo
              </label>
              {logo ? (
                <div className="relative w-24 h-24 rounded-sm overflow-hidden border border-border/60">
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    className="absolute top-1 right-1 bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-sm py-4 cursor-pointer hover:border-primary/40 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {uploading ? "Uploading..." : "Upload logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading || !canUpload}
                  />
                </label>
              )}
            </div>

            {/* Cover upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Cover Image
              </label>
              {coverImage ? (
                <div className="relative rounded-sm overflow-hidden border border-border/60">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-sm py-6 cursor-pointer hover:border-primary/40 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {uploading ? "Uploading..." : "Upload cover image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploading || !canUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading}
              isLoading={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
