import React from "react";
import { useDispatch } from "react-redux";
import Heading from "./Heading";
import { Button } from "flowbite-react";
import { setResetTerm } from "@/hooks/slice/paramsSlice";

type Props = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
};

export default function EmptyFilter({
  title = "No matches for this filer",
  subtitle = "Try changing & resetting the filter",
  showReset,
}: Props) {
  const dispatch = useDispatch();
  return (
    <div className="h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg">
      <Heading title={title} subtitle={subtitle} center />
      <div className="mt-4">
        {showReset && (
          <Button outline onClick={() => dispatch(setResetTerm())}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
