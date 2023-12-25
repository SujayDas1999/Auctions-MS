import { Pagination } from "flowbite-react";
import React from "react";
import { useDispatch } from "react-redux";
import { setPageNumber } from "../hooks/slices/paramsSlice";

type Props = {
  currentPage: number;
  pageCount: number;
};

export default function AppPagination({ currentPage, pageCount }: Props) {
  const dispatch = useDispatch();
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={pageCount ?? 10}
        onPageChange={(e) => dispatch(setPageNumber(e))}
        className="text-blue-500 mb-5"
      />
    </div>
  );
}
