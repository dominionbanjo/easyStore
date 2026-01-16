import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-4 px-4">
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
