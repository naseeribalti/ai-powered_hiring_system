import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = true,
    totalItems = 0,
    itemsPerPage = 10
}) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="d-flex justify-content-between align-items-center">
            {showInfo && (
                <div className="pagination-info">
                    <small className="text-muted">
                        Showing {startItem} to {endItem} of {totalItems} entries
                    </small>
                </div>
            )}

            <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    </li>

                    {visiblePages.map((page, index) => (
                        <li
                            key={index}
                            className={`page-item ${page === currentPage ? 'active' : ''
                                } ${page === '...' ? 'disabled' : ''}`}
                        >
                            {page === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
