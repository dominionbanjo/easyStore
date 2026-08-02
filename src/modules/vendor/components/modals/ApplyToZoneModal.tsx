import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
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
  course: string;
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
      course: "",
      student_id_number: "",
      delivery_fee: null,
    },
  });

  const [idImage, setIdImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const canUpload = useMemo(() => Boolean(cloudinaryData), [cloudinaryData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (!canUpload) {
      toast.error("Upload service unavailable");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(
        file,
        cloudinaryData as CloudinaryConfig
      );
      setIdImage(uploaded.url);
      toast.success("School ID uploaded");
    } catch {
      toast.error("Failed to upload school ID image");
    } finally {
      setUploading(false);
      e.target.value = "";
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
        course: values.course.trim(),
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
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-5 py-4"
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

            {/* School ID Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                School ID Image <span className="text-destructive">*</span>
              </label>
              {idImage ? (
                <div className="relative rounded-sm overflow-hidden border border-border/60">
                  <img
                    src={idImage}
                    alt="School ID preview"
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setIdImage(null)}
                    className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-sm hover:bg-destructive/90"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-sm py-8 cursor-pointer hover:border-primary/40 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {uploading ? "Uploading..." : "Upload school ID image"}
                  </span>
                  <span className="text-[11px] text-muted-foreground/70">
                    PNG/JPG up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
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
              Submit Application
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
