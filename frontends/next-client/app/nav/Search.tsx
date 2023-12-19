"use client";

import { setResetTerm, setSearchTerm } from "@/hooks/slice/paramsSlice";
import { RootState } from "@/store/store";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export default function Search() {
  const searchValue = useSelector(
    (state: RootState) => state.params.searchTerm
  );
  const dispatch = useDispatch();

  const onChange = (e: string) => {
    dispatch(setSearchTerm(e));
  };

  return (
    <>
      <button onClick={() => dispatch(setResetTerm())}>
        <div className="flex items-center gap-2 text-3xl font-semibold text-red-500">
          <IoMdSpeedometer />
          <div>MotorMagnet</div>
        </div>
      </button>
      <div className="flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm">
        <input
          type="text"
          placeholder="Search for cars by Make, Model or Color"
          value={searchValue}
          className="flex-grow pl-5 bg-transparent focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-sm"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          onClick={() => dispatch(setSearchTerm(searchValue))}
          className="pr-8"
        >
          <FaSearch />
        </button>
      </div>
    </>
  );
}
