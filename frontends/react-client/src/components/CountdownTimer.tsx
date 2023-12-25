import React from "react";

import ReactDOM from "react-dom";
import Countdown, { zeroPad } from "react-countdown";
import { CountdownModel } from "../types/Countdown";

type Props = {
  auctionEnd: string;
};

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: CountdownModel) => {
  return (
    <div
      className={`
      border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
      ${
        completed
          ? "bg-red-600"
          : days === 0 && hours < 10
          ? "bg-amber-600"
          : "bg-green-600"
      }
    `}
    >
      {completed ? (
        <span>Auction Finished</span>
      ) : (
        <span suppressHydrationWarning>
          {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
    </div>
  );
};

export default function CountdownTimer({ auctionEnd }: Props) {
  return (
    <>
      <Countdown date={auctionEnd} renderer={renderer} />{" "}
    </>
  );
}
