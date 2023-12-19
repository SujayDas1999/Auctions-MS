"use client";

import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import { Auction, PagedResult } from "@/types";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionsAction";
import Filters from "./Filters";
import qs from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { setPageCount, setPageNumber } from "@/hooks/slice/paramsSlice";
import { RootState } from "@/store/store";
import { PayloadAction } from "@reduxjs/toolkit";
import EmptyFilter from "../components/EmptyFilter";

export default function Listings() {
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useSelector((state: RootState) => state.params);
  const dispatch = useDispatch();
  const url = qs.stringifyUrl({
    url: "",
    query: { ...params },
  });

  function setPageNumberLocal(pageNumber: number) {
    const action: PayloadAction<number> = {
      type: "PAGE_NUMBER",
      payload: pageNumber,
    };

    dispatch(setPageNumber(action.payload));
  }

  useEffect(() => {
    getData(url).then((data: PagedResult<Auction>) => {
      setData(data);
      dispatch(setPageCount(data.pageCount));
    });
  }, [url]);

  return (
    <>
      <Filters pageCount={data?.pageCount} />
      {data?.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data?.results &&
              data?.results.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
          </div>
          <div className="flex justify-center mt-4">
            <AppPagination
              setPageNumberParent={setPageNumberLocal}
              currentPage={params.pageNumber}
              pageCount={params.pageCount}
            />
          </div>
        </>
      )}
    </>
  );
}
