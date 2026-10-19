import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('mail_copy_history');
      localStorage.removeItem('remix_active_tempmail_account');
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-lg font-bold">Temporary Display Issue</h2>
            <p className="text-xs text-slate-300">
              The application encountered a display glitch. Click the button below to restore the application.
            </p>
            {this.state.error && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4 stroke-[2]" />
              <span>Restore & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
