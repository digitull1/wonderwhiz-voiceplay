import React, { Component, ErrorInfo } from 'react';
import { toast } from "@/hooks/use-toast";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class BlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Block error:', error, errorInfo);
    toast({
      title: "Oops!",
      description: "Something went wrong loading the blocks. We're working on it!",
      variant: "destructive"
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">
            Something went wrong loading this content.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}