import { useState } from "react";
import { current_page, Items_Per_Page } from "../constants/AppConstants";


export const usePagination =  <T,>(data: T[], itemsPerPage: number = Items_Per_Page) => {
    const [currentPage, setCurrentPage] = useState(current_page);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get the paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        paginatedData,
        handlePageChange,
        resetPage
    };
};

