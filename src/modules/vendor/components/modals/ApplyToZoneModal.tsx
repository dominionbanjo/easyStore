import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import ImageUploadBox from "@/components/shared/ImageUploadBox";
import type { ISchoolZone } from "@/types/SchoolZone/schoolZoneTypes";
import { useApplyToZoneMutation } from "@/services/schoolZoneApi";
import {
  useGetCloudinarySignatureQuery,
  type CloudinaryConfig,
} from "@/services/cloudinaryApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

interface ApplyToZoneModalProps {
  zone: ISchoolZone | null;
  isOpen: boolean;
  onClose: () => void;
}

type ApplyFormValues = {
  department: string;
  student_id_number: string;
  delivery_fee: number | null;
};

export default function ApplyToZoneModal({
  zone,
  isOpen,
  onClose,
}: ApplyToZoneModalProps) {
  const [apply, { isLoading }] = useApplyToZoneMutation();
  const { data: cloudinaryData } = useGetCloudinarySignatureQuery();

  const methods = useForm<ApplyFormValues>({
    defaultValues: {
      department: "",
      student_id_number: "",
      delivery_fee: null,
    },
  });

  const [idImage, setIdImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const canUpload = useMemo(() => Boolean(cloudinaryData), [cloudinaryData]);

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (!canUpload) {
      toast.error("Upload service unavailable");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const uploaded = await uploadToCloudinary(
        file,
        cloudinaryData as CloudinaryConfig,
        { onProgress: setUploadProgress }
      );
      setIdImage(uploaded.url);
      toast.success("School ID uploaded");
    } catch {
      toast.error("Failed to upload school ID image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (values: ApplyFormValues) => {
    if (!idImage) {
      toast.error("Upload your school ID image");
      return;
    }
    if (!zone) return;

    try {
      const result = await apply({
        zoneId: zone.id,
        department: values.department.trim(),
        student_id_number: values.student_id_number.trim(),
        school_id_image: idImage,
        delivery_fee: Number(values.delivery_fee ?? 0),
      }).unwrap();

      toast.success(result.data?.message || "Application submitted");
      onClose();
      methods.reset();
      setIdImage(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String((err as { data: { message?: string } }).data?.message ?? "Failed to apply")
          : "Failed to apply";
      toast.error(message);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onClose={onClose}
      title={`Join ${zone?.name ?? "zone"}`}
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
            form="apply-to-zone-form"
            size="sm"
            className="h-9"
            disabled={isLoading || uploading}
            isLoading={isLoading}
          >
            Submit Application
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form
          id="apply-to-zone-form"
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-5 px-6 py-5"
        >
          {zone && (
            <p className="text-sm text-muted-foreground font-medium">
              Join <span className="font-bold text-foreground">{zone.name}</span>{" "}
              as a verified vendor. Your application will be reviewed by the
              school rep.
            </p>
          )}

          <div className="space-y-4">
            <FormInput
              label="Department"
              name="department"
              placeholder="e.g. Computer Science"
              rules={{ required: "Department is required" }}
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

            {/* School ID Upload */}
            <ImageUploadBox
              label="School ID Image"
              required
              previewUrl={idImage}
              uploading={uploading}
              progress={uploadProgress}
              disabled={!canUpload}
              onRemove={() => setIdImage(null)}
              onFileSelect={handleUpload}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
