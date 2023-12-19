"use client";

import {
  setFilterBy,
  setOrderBy,
  setPageSize,
} from "@/hooks/slice/paramsSlice";
import { RootState } from "@/store/store";
import { GrClearOption } from "react-icons/gr";
import { FaCarSide, FaFire } from "react-icons/fa6";
import { AiTwotoneStop, AiOutlineSortAscending } from "react-icons/ai";
import { BsFillStopCircleFill } from "react-icons/bs";
import { Button, ButtonGroup } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const pageSizeButtons = [4, 8, 12];
const orderButtons = [
  {
    label: "Alphabetical",
    icon: AiOutlineSortAscending,
    value: "make",
  },
  {
    label: "Recently Added",
    icon: BsFillStopCircleFill,
    value: "new",
  },
  {
    label: "None",
    icon: GrClearOption,
    value: "",
  },
];

const filterButtons = [
  {
    label: "All",
    icon: FaCarSide,
    value: "",
  },
  {
    label: "Ending < 6 Hours",
    icon: FaFire,
    value: "endingSoon",
  },
  {
    label: "Finished",
    icon: AiTwotoneStop,
    value: "finished",
  },
];

type Props = {
  pageCount: number | undefined;
};

export default function Filters({ pageCount }: Props) {
  const params = useSelector((state: RootState) => state.params);
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-8">
          <span className="uppercase text-sm text-gray-500">Filters</span>
          <Button.Group>
            {filterButtons.map(({ icon: Icon, label, value }) => (
              <Button
                name={label}
                key={value}
                onClick={() => dispatch(setFilterBy(value))}
                color={`${params.filterBy === value ? "red" : "gray"}`}
              >
                <Icon className="mr-3 h-4 w-4" /> {label}
              </Button>
            ))}
          </Button.Group>
        </div>
        <div className="space-x-8">
          <span className="uppercase text-sm text-gray-500">Order By</span>
          <Button.Group>
            {orderButtons.map(({ icon: Icon, label, value }) => (
              <Button
                name={label}
                key={value}
                onClick={() => dispatch(setOrderBy(value))}
                color={`${params.orderBy === value ? "red" : "gray"}`}
              >
                <Icon className="mr-3 h-4 w-4" /> {label}
              </Button>
            ))}
          </Button.Group>
        </div>

        <div className="space-x-8">
          <span className="uppercase text-sm text-gray-500">Page Size</span>
          <ButtonGroup>
            {pageSizeButtons.map((value, i) => (
              <Button
                key={i}
                onClick={() =>
                  dispatch(
                    setPageSize({
                      pageCount: pageCount ?? 10,
                      pageSize: value,
                    })
                  )
                }
                color={`${params.pageSize === value ? "red" : "gray"}`}
                className="focus:ring-0"
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}
