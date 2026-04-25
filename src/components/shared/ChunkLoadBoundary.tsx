import { Component, type ErrorInfo, type ReactNode } from "react";
import { forceAppReload, isChunkLoadLikeError } from "@/routes/lazyWithRecovery";

interface ChunkLoadBoundaryProps {
  children: ReactNode;
}

interface ChunkLoadBoundaryState {
  hasError: boolean;
  isChunkLoadError: boolean;
}

class ChunkLoadBoundary extends Component<
  ChunkLoadBoundaryProps,
  ChunkLoadBoundaryState
> {
  state: ChunkLoadBoundaryState = {
    hasError: false,
    isChunkLoadError: false,
  };

  static getDerivedStateFromError(error: unknown): ChunkLoadBoundaryState {
    return {
      hasError: true,
      isChunkLoadError: isChunkLoadLikeError(error),
    };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[ChunkLoadBoundary]", error, errorInfo);
    }

    if (isChunkLoadLikeError(error)) {
      this.handleReload();
    }
  }

  handleReload = () => {
    forceAppReload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.state.isChunkLoadError) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-3">
            <h2 className="text-xl font-semibold">Refreshing application...</h2>
            <p className="text-sm text-muted-foreground animate-pulse">
              Updating to the latest version. Please wait...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading this page.
        </p>
      </div>
    );
  }
}

export default ChunkLoadBoundary;
