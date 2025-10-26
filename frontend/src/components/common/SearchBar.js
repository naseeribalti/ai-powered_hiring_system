import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({
    placeholder = 'Search...',
    value = '',
    onChange,
    onSearch,
    suggestions = [],
    onSuggestionClick = null,
    loading = false,
    icon = <FaSearch />,
    className = '',
    withLocation = false,
    withFilters = false,
    filters = []
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [locationValue, setLocationValue] = useState('');
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({
                query: value,
                location: locationValue
            });
        }
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        onChange({ target: { value: '' } });
        setLocationValue('');
    };

    const searchBarClasses = [
        'search-bar',
        isFocused && 'search-bar-focused',
        withLocation && 'search-bar-with-location',
        withFilters && 'search-bar-with-filters',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={searchBarClasses} ref={searchRef}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <span className="search-input-icon">{icon}</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowSuggestions(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                    />
                    {value && (
                        <button
                            type="button"
                            className="search-clear-button"
                            onClick={handleClear}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {withLocation && (
                    <div className="search-location-wrapper">
                        <span className="search-input-icon">
                            <FaMapMarkerAlt />
                        </span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="City, state, or remote"
                            value={locationValue}
                            onChange={(e) => setLocationValue(e.target.value)}
                        />
                    </div>
                )}

                <button type="submit" className="search-submit-button" disabled={loading}>
                    {loading ? (
                        <span className="search-loading"></span>
                    ) : (
                        <>
                            <FaSearch />
                            <span>Search</span>
                        </>
                    )}
                </button>
            </form>

            {withFilters && filters.length > 0 && (
                <div className="search-filters">
                    {filters.map((filter, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`search-filter-chip ${filter.active ? 'active' : ''}`}
                            onClick={filter.onClick}
                        >
                            {filter.icon && <span className="filter-icon">{filter.icon}</span>}
                            <span>{filter.label}</span>
                            {filter.count && <span className="filter-count">{filter.count}</span>}
                        </button>
                    ))}
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="search-suggestion-item"
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.icon && (
                                <span className="suggestion-icon">{suggestion.icon}</span>
                            )}
                            <div className="suggestion-content">
                                <div className="suggestion-title">{suggestion.title}</div>
                                {suggestion.subtitle && (
                                    <div className="suggestion-subtitle">{suggestion.subtitle}</div>
                                )}
                            </div>
                            {suggestion.badge && (
                                <span className="suggestion-badge">{suggestion.badge}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
