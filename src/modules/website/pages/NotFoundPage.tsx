import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/">
        <Button className="bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
