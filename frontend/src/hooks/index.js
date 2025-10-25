import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

// Custom hook for API calls with loading states
export const useApi = (queryKey, queryFn, options = {}) => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery(queryKey, queryFn, {
        retry: 1,
        refetchOnWindowFocus: false,
        ...options
    });

    return {
        data,
        loading: isLoading,
        error,
        refetch
    };
};

// Custom hook for mutations with toast notifications
export const useMutationWithToast = (mutationFn, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation(mutationFn, {
        onSuccess: (data, variables, context) => {
            if (options.successMessage) {
                toast.success(options.successMessage);
            }
            if (options.invalidateQueries) {
                queryClient.invalidateQueries(options.invalidateQueries);
            }
            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            const message = error.response?.data?.message || options.errorMessage || 'An error occurred';
            toast.error(message);
            if (options.onError) {
                options.onError(error, variables, context);
            }
        },
        ...options
    });
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

// Custom hook for debounced search
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom hook for pagination
export const usePagination = (data, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data?.slice(startIndex, endIndex) || [];

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToNextPage = () => {
        goToPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        goToPage(currentPage - 1);
    };

    return {
        currentData,
        currentPage,
        totalPages,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
    };
};
