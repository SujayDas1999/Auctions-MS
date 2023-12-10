import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import ListAuctions from "./components/ListAuctions";

export default function MyApp() {
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-s">
        <main className="container mx-auto px-5 pt-10">
          <ListAuctions />
        </main>
      </h1>
    </div>
  );
}
