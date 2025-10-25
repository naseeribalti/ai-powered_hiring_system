import React from 'react';

const SearchFilter = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange,
    filterOptions = [],
    placeholder = "Search...",
    showClearButton = true
}) => {
    const handleClear = () => {
        onSearchChange('');
        onFilterChange('all');
    };

    return (
        <div className="search-filter-container mb-4">
            <div className="row">
                <div className="col-md-8 mb-3 mb-md-0">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {showClearButton && (searchTerm || filterStatus !== 'all') && (
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={handleClear}
                                title="Clear filters"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => onFilterChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
