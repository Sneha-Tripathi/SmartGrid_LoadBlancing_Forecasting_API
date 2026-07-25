import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

export default class ErrorBoundary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("React Error Boundary");
    console.error(error);
    console.error(info);
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {

    if (this.state.hasError) {

      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );

    }

    return this.props.children;
  }
}