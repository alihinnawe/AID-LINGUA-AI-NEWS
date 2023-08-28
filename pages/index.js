import Image from "next/image";
import MainPage from "../components/MainPage/index.js";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <MainPage />
    </div>
  );
}
