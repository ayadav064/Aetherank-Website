import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

export default class AdminErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AdminErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center p-6">
          <div className="bg-white border border-red-200 rounded shadow-sm p-6 max-w-lg w-full">
            <h2 className="text-[#1d2327] font-bold text-lg mb-2">Admin Panel Error</h2>
            <p className="text-[#646970] text-sm mb-4">
              Something went wrong loading this page. Open your browser's developer console (F12) for the full error details.
            </p>
            <pre className="bg-[#f0f0f1] rounded p-3 text-xs text-red-700 overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => this.setState({ error: null })}
                className="px-3 py-1.5 bg-[#2271b1] text-white text-sm rounded hover:bg-[#135e96]"
              >
                Try Again
              </button>
              <a href="/admin" className="px-3 py-1.5 bg-white border border-[#c3c4c7] text-[#1d2327] text-sm rounded hover:bg-[#f0f0f1]">
                Back to Login
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
