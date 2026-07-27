import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_COOLDOWN_MS = 5000;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      canRetry: true,
      offline: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("\u{1F6A8} React Error Boundary caught an error:");
    console.error(error);
    console.error("Component Stack:", info?.componentStack);

    this.setState({ errorInfo: info });

    // Report to monitoring service (placeholder)
    this.reportError(error, info);

    // Check if offline
    if (!navigator.onLine) {
      this.setState({ offline: true });
    }

    // Listen for online events
    window.addEventListener("online", this.handleOnline);
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline);
  }

  handleOnline = () => {
    this.setState({ offline: false });
    this.resetErrorBoundary();
  };

  reportError = (error, info) => {
    try {
      const errorReport = {
        message: error?.message || "Unknown error",
        stack: error?.stack,
        componentStack: info?.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };
      // Store in session for debugging
      sessionStorage.setItem("sg-last-error", JSON.stringify(errorReport));
      // In production, send to error tracking service
      // analyticsService.reportError(errorReport);
    } catch (e) {
      console.warn("Failed to report error:", e);
    }
  };

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRetry = () => {
    const { retryCount } = this.state;
    const newCount = retryCount + 1;

    if (newCount >= MAX_RETRY_ATTEMPTS) {
      this.setState({
        canRetry: false,
        retryCount: newCount,
      });
      // Re-enable retry after cooldown
      setTimeout(() => {
        this.setState({ canRetry: true });
      }, RETRY_COOLDOWN_MS);
    } else {
      this.setState({ retryCount: newCount });
    }

    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          canRetry={this.state.canRetry}
          offline={this.state.offline}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onReset={this.resetErrorBoundary}
          onHardReset={this.handleHardReset}
        />
      );
    }

    return this.props.children;
  }
}
