import { Component, ReactNode } from "react";

type State = { hasError: boolean };
type Props = {
  children: ReactNode;
  onError: (message: string) => void;
};

export default class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
