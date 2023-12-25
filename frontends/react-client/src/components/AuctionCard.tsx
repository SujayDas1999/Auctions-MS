import React from "react";
import { Auction } from "../types/SearchResult";
import CountdownTimer from "./CountdownTimer";

type Props = {
  auction: Auction;
};

export default function AuctionCard({ auction }: Props) {
  return (
    <>
      <a href="#">
        <div className="w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden">
          <div>
            <img
              src={auction.imageUrl}
              alt={auction.id}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="absolute bottom-2 left-2">
              <CountdownTimer auctionEnd={auction.auctionEnd} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-gray-700 text-sm">
            {auction.make} {auction.model}
          </h3>
          <p className="font-semibold text-sm">{auction.year}</p>
        </div>
      </a>
    </>
  );
}
