import axios from "axios";
import React, { useEffect, useState } from "react";
import { Auction, AuctionResult } from "../Models/SearchResult";
import AuctionCard from "./AuctionCard";

export default function ListAuctions() {
  const [auctions, setAuctions] = useState<AuctionResult | null>(null);

  const fetchSearchData = async () => {
    await axios
      .get(
        `http://localhost:6001/search?filterBy=&orderBy=new&pageCount=1&pageNumber=1&pageSize=100&searchTerm=`
      )
      .then((res) => {
        setAuctions(res.data);
      });
  };

  useEffect(() => {
    fetchSearchData();
  }, []);
  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {auctions &&
          auctions.results.map((auction: Auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
      </div>
    </>
  );
}
