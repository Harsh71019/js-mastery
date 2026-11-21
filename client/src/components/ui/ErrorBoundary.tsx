import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  private handleGoHome = (): void => {
    window.location.href = '/'
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-bg-primary text-text-primary">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0e0e0e] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red mb-4">
              <AlertTriangle size={24} />
            </div>
            
            <h2 className="text-base font-bold font-geist uppercase tracking-wider text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
              An unexpected client error occurred while rendering this view. You can reload the component or return to the dashboard.
            </p>

            {this.state.error?.message && (
              <div className="w-full mb-6 p-3 rounded-lg bg-black/60 border border-white/5 text-left font-mono text-[11px] text-accent-red/90 break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-1.5 font-geist text-xs"
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-1.5 font-geist text-xs"
              >
                <Home size={14} />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
