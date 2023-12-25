import axios from "axios";
import React, { useEffect, useState } from "react";
import { Auction, PagedResult } from "../types/SearchResult";
import AuctionCard from "./AuctionCard";
import { getData } from "../api/search";
import Filters from "./Filters";
import AppPagination from "./AppPagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import queryString from "query-string";
import { setPageCount } from "../hooks/slices/paramsSlice";

export default function ListAuctions() {
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useSelector((state: RootState) => state.params);
  const qs = queryString.stringifyUrl({
    url: "",
    query: { ...params },
  });
  const dispatch = useDispatch();

  const fetchSearchData = async () => {
    getData(qs)
      .then((data: PagedResult<Auction>) => {
        setData(data);
        dispatch(setPageCount(data.pageCount));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSearchData();
  }, [qs, params]);

  return (
    <>
      <Filters pageCount={data?.pageCount} />
      <div className="grid grid-cols-4 gap-6">
        {data?.results &&
          data.results.map((auction: Auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
      </div>
      <div>
        <AppPagination
          currentPage={params.pageNumber}
          pageCount={params.pageCount}
        />
      </div>
    </>
  );
}
