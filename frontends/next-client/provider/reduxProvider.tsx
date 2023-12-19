"use client";

import Navbar from "@/app/nav/Navbar";
import { store } from "@/store/store";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Navbar />
      <main className="container mx-auto px-5 pt-10">{children}</main>
    </Provider>
  );
}
