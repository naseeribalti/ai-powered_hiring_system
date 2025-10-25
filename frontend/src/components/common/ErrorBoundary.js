import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="card border-danger">
                                    <div className="card-body text-center">
                                        <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                                        <h4 className="card-title text-danger">Something went wrong</h4>
                                        <p className="card-text">
                                            We're sorry, but something unexpected happened. Please try refreshing the page.
                                        </p>

                                        {process.env.NODE_ENV === 'development' && this.state.error && (
                                            <div className="mt-3">
                                                <details className="text-start">
                                                    <summary className="btn btn-outline-secondary btn-sm">
                                                        Show Error Details
                                                    </summary>
                                                    <div className="mt-2 p-2 bg-light border rounded">
                                                        <pre className="small text-danger mb-2">
                                                            {this.state.error.toString()}
                                                        </pre>
                                                        <pre className="small text-muted">
                                                            {this.state.errorInfo.componentStack}
                                                        </pre>
                                                    </div>
                                                </details>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => window.location.reload()}
                                            >
                                                <i className="fas fa-refresh me-1"></i>
                                                Refresh Page
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => window.history.back()}
                                            >
                                                <i className="fas fa-arrow-left me-1"></i>
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
