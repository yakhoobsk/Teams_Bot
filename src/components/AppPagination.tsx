import React from "react";
import { Pagination } from "antd";

interface PaginationProps {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    onChange: (page: number, limit: number) => void;
}

const AppPagination: React.FC<PaginationProps> = ({
    totalRecords,
    currentPage,
    pageSize,
    onChange,
}) => {
    const handleChange = (page: number, pageSize: number) => {
        onChange(page, pageSize);
    };

    return (
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
            onChange={handleChange}
            onShowSizeChange={handleChange}
        />
    );
};

export default AppPagination;