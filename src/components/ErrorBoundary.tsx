"use client";
import React, { ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps<T extends Error> = {
  onError?: (error: any, info: ErrorInfo) => void;
  fallback?: ReactNode;
  children?: ReactNode;
};
class ErrorBoundary<T extends Error> extends React.Component<
  ErrorBoundaryProps<T>,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps<T>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    this.props?.onError && this.props.onError(error, info);
  }

  render() {
    if (this.state.hasError && !!this.props?.fallback) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
