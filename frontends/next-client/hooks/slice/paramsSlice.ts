import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface ParamsState {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  searchTerm: string;
  orderBy: string;
  filterBy: string;
}

const initialState: ParamsState = {
  pageNumber: 1,
  pageSize: 12,
  pageCount: 1,
  searchTerm: "",
  orderBy: "",
  filterBy: "",
};

export const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setPageNumber: (
      state: Partial<ParamsState>,
      action: PayloadAction<number>
    ) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (
      state: Partial<ParamsState>,
      action: PayloadAction<number>
    ) => {
      state.pageSize = action.payload;
    },
    setPageCount: (
      state: Partial<ParamsState>,
      action: PayloadAction<number>
    ) => {
      state.pageCount = action.payload;
      if (state.pageCount == 1) {
        state.pageNumber = 1;
      }
    },
    setSearchTerm: (
      state: Partial<ParamsState>,
      action: PayloadAction<string>
    ) => {
      state.searchTerm = action.payload;
    },
    setResetTerm: () => initialState,
    setOrderBy: (
      state: Partial<ParamsState>,
      action: PayloadAction<string>
    ) => {
      state.orderBy = action.payload;
    },
    setFilterBy: (
      state: Partial<ParamsState>,
      action: PayloadAction<string>
    ) => {
      state.filterBy = action.payload;
    },
  },
});

export const {
  setPageNumber,
  setPageSize,
  setPageCount,
  setSearchTerm,
  setResetTerm,
  setOrderBy,
  setFilterBy,
} = paramsSlice.actions;

export default paramsSlice.reducer;
