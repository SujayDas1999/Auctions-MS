"use client";

import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  currentPage: number;
  pageCount: number | undefined;
  setPageNumberParent: (pageNumber: number) => void;
};

export default function AppPagination({
  currentPage,
  pageCount,
  setPageNumberParent,
}: Props) {
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={pageCount ?? 10}
        onPageChange={(e) => setPageNumberParent(e)}
        className="text-blue-500 mb-5"
      />
    </div>
  );
}
