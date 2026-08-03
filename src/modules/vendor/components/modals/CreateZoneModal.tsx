import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Navigation } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import ImageUploadBox from "@/components/shared/ImageUploadBox";
import { NigeriaData } from "@/utils/nigeria-data";
import {
  useCreateZoneMutation,
  useLazyCheckZoneSubdomainQuery,
} from "@/services/schoolZoneApi";
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
  contact_email: string;
  contact_phone: string;
  department: string;
  course: string;
  student_id_number: string;
  delivery_fee: number | null;
};

export default function CreateZoneModal({
  isOpen,
  onClose,
}: CreateZoneModalProps) {
  const [create, { isLoading }] = useCreateZoneMutation();
  const [checkSubdomain] = useLazyCheckZoneSubdomainQuery();
  const { data: cloudinaryData } = useGetCloudinarySignatureQuery();

  const [subdomainStatus, setSubdomainStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const methods = useForm<CreateZoneFormValues>({
    defaultValues: {
      name: "",
      subdomain: "",
      tagline: "",
      description: "",
      state: "",
      contact_email: "",
      contact_phone: "",
      department: "",
      course: "",
      student_id_number: "",
      delivery_fee: null,
    },
  });
  const subdomain = methods.watch("subdomain");

  useEffect(() => {
    const clean = subdomain.trim().toLowerCase();
    if (clean.length < 2) {
      setSubdomainStatus("idle");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(clean)) {
      setSubdomainStatus("taken");
      return;
    }

    setSubdomainStatus("checking");

    const timer = setTimeout(async () => {
      try {
        await checkSubdomain({ subdomain: clean }).unwrap();
        setSubdomainStatus("available");
      } catch {
        setSubdomainStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain, checkSubdomain]);

  const stateOptions = NigeriaData.getStates().map((s) => ({
    label: s.name,
    value: s.isoCode,
  }));

  const [logo, setLogo] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [schoolIdImage, setSchoolIdImage] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSchoolId, setUploadingSchoolId] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [schoolIdProgress, setSchoolIdProgress] = useState(0);

  const canUpload = Boolean(cloudinaryData);

  const uploadImage = async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size cannot exceed 5MB");
    }
    if (!canUpload) {
      throw new Error("Upload service unavailable");
    }
    const uploaded = await uploadToCloudinary(
      file,
      cloudinaryData as CloudinaryConfig,
      { onProgress }
    );
    return uploaded.url;
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    setLogoProgress(0);
    try {
      setLogo(await uploadImage(file, setLogoProgress));
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      setLogoProgress(0);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setCoverProgress(0);
    try {
      setCoverImage(await uploadImage(file, setCoverProgress));
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload cover image"
      );
    } finally {
      setUploadingCover(false);
      setCoverProgress(0);
    }
  };

  const handleSchoolIdUpload = async (file: File) => {
    setUploadingSchoolId(true);
    setSchoolIdProgress(0);
    try {
      setSchoolIdImage(await uploadImage(file, setSchoolIdProgress));
      toast.success("School ID uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload school ID"
      );
    } finally {
      setUploadingSchoolId(false);
      setSchoolIdProgress(0);
    }
  };

  const handleSubmit = async (values: CreateZoneFormValues) => {
    const stateName =
      NigeriaData.getStateByCode(values.state)?.name ?? values.state;

    if (subdomainStatus === "checking") {
      toast.error("Please wait — checking subdomain availability");
      return;
    }
    if (subdomainStatus === "taken") {
      toast.error("This subdomain is not available. Please choose another.");
      return;
    }

    if (!values.department.trim()) {
      toast.error("Department is required");
      return;
    }
    if (!values.course.trim()) {
      toast.error("Course of study is required");
      return;
    }
    if (!values.student_id_number.trim()) {
      toast.error("Student ID number is required");
      return;
    }
    if (!schoolIdImage) {
      toast.error("Upload your school ID image");
      return;
    }
    const fee = Number(values.delivery_fee ?? 0);
    if (!values.delivery_fee || Number.isNaN(fee) || fee < 0) {
      toast.error("Enter a valid delivery fee");
      return;
    }

    try {
      await create({
        name: values.name.trim(),
        subdomain: values.subdomain.trim().toLowerCase(),
        tagline: values.tagline.trim() || undefined,
        description: values.description.trim() || undefined,
        state: values.state.trim(),
        location: stateName,
        contact_email: values.contact_email.trim() || undefined,
        contact_phone: values.contact_phone.trim() || undefined,
        logo: logo ?? undefined,
        cover_image: coverImage ?? undefined,
        department: values.department.trim(),
        course: values.course.trim(),
        student_id_number: values.student_id_number.trim(),
        school_id_image: schoolIdImage,
        delivery_fee: fee,
      }).unwrap();

      toast.success(
        "Zone request submitted! It will go live once approved by an admin."
      );
      onClose();
      methods.reset();
      setLogo(null);
      setCoverImage(null);
      setSchoolIdImage(null);
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
      footer={
        <div className="flex justify-end gap-3 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-zone-form"
            size="sm"
            className="h-9"
            disabled={
              isLoading || uploadingLogo || uploadingCover || uploadingSchoolId
            }
            isLoading={isLoading}
          >
            Submit Request
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form
          id="create-zone-form"
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-5 px-6 py-5"
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
            <div className="relative">
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
              {subdomainStatus !== "idle" && (
                <div className="absolute right-3 top-[38px] text-xs">
                  {subdomainStatus === "checking" && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <span className="h-3 w-3 animate-spin rounded-sm border-2 border-primary/20 border-t-primary" />
                      Checking...
                    </span>
                  )}
                  {subdomainStatus === "available" && (
                    <span className="text-green-600 font-bold">Available</span>
                  )}
                  {subdomainStatus === "taken" && (
                    <span className="text-destructive font-bold">Unavailable</span>
                  )}
                </div>
              )}
            </div>
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
            <FormSelect
              label="State"
              name="state"
              options={stateOptions}
              isSearchable
              icon={<Navigation className="h-4 w-4 text-primary" />}
              placeholder="Select State"
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

            {/* ── School rep verification (same as joining a zone) ── */}
            <div className="border border-border/40 rounded-sm p-4 space-y-4 bg-muted/20">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Your School Details
              </p>
              <FormInput
                label="Department"
                name="department"
                placeholder="e.g. Computer Science"
                rules={{ required: "Department is required" }}
              />
              <FormInput
                label="Course of Study"
                name="course"
                placeholder="e.g. B.Sc. Computer Science"
                rules={{ required: "Course of study is required" }}
              />
              <FormInput
                label="Student ID Number"
                name="student_id_number"
                placeholder="e.g. 2020/12345"
                rules={{ required: "Student ID number is required" }}
              />
              <FormPriceInput
                label="Delivery Fee (₦)"
                name="delivery_fee"
                placeholder="e.g. 500"
              />

              {/* School ID upload */}
              <ImageUploadBox
                label="School ID Image"
                required
                previewUrl={schoolIdImage}
                uploading={uploadingSchoolId}
                progress={schoolIdProgress}
                disabled={!canUpload}
                onRemove={() => setSchoolIdImage(null)}
                onFileSelect={handleSchoolIdUpload}
              />
            </div>

            {/* Logo upload */}
            <ImageUploadBox
              label="Logo"
              compact
              previewUrl={logo}
              uploading={uploadingLogo}
              progress={logoProgress}
              disabled={!canUpload}
              onRemove={() => setLogo(null)}
              onFileSelect={handleLogoUpload}
            />

            {/* Cover upload */}
            <ImageUploadBox
              label="Cover Image"
              previewUrl={coverImage}
              uploading={uploadingCover}
              progress={coverProgress}
              disabled={!canUpload}
              onRemove={() => setCoverImage(null)}
              onFileSelect={handleCoverUpload}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
