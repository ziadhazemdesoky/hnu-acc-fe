// src/components/ErrorBoundary.js
import React from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Unhandled error:", error, errorInfo);
    toast.error("حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.");
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1 className="text-center mt-10">حدث خطأ غير متوقع.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
