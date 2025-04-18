// Provides a component to catch JavaScript errors anywhere in its child component tree.
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;