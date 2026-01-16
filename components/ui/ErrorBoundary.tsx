/**
 * File: components/ui/ErrorBoundary.tsx
 * Version: 0.7.3
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Using React.Component explicitly to resolve TypeScript property identification issues for state and props.
export class ErrorBoundary extends React.Component<Props, State> {
  // Explicitly declare state and props to fix compiler identification issues on the inherited class
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Initialize the explicitly declared state property
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleFactoryReset = () => {
    if (window.confirm("This will clear all settings and custom text. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  public render() {
    // Accessed 'state' via the explicit class property declaration
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center text-white">
          <div className="max-w-md w-full space-y-6 p-8 bg-[#0a0a0c] border border-red-500/30 rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-red-400 uppercase tracking-widest mb-2">System Error</h1>
              <p className="text-white/50 text-xs font-medium leading-relaxed">
                The visual engine encountered an unexpected state.
              </p>
            </div>
            {/* Accessing error property from the explicitly declared state object */}
            {this.state.error && (
              <div className="text-left bg-black/40 p-4 rounded-xl border border-white/5 overflow-auto max-h-32">
                <code className="text-[10px] font-mono text-red-300/80 block whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-[0.2em] text-xs shadow-lg shadow-white/10"
              >
                Reload Application
              </button>
              <button
                onClick={this.handleFactoryReset}
                className="w-full py-3 bg-red-500/10 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-colors uppercase tracking-widest text-[10px]"
              >
                Factory Reset Settings
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Accessed 'props' via the explicit class property declaration
    return this.props.children;
  }
}
