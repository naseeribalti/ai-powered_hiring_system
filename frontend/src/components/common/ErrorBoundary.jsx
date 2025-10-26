import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="u-card p-5 text-center">
                                <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                                <h2 className="mb-3">Something went wrong</h2>
                                <p className="text-muted mb-4">
                                    We're sorry — an unexpected error occurred. Please try refreshing the page.
                                </p>
                                {this.state.error && (
                                    <details className="text-left text-muted" style={{ fontSize: '0.875rem', textAlign: 'left' }}>
                                        <summary className="mb-2" style={{ cursor: 'pointer' }}>Error details</summary>
                                        <pre className="p-3 bg-light" style={{ fontSize: '0.75rem', overflow: 'auto' }}>
                                            {this.state.error.toString()}
                                        </pre>
                                    </details>
                                )}
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
