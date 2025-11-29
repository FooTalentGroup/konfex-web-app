import {  Lato, Poppins } from "next/font/google";
import '../styles/globals.css';

export const lato = Lato({
  weight: ["400", "700"],
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
});

export const poppins = Poppins({
  weight: ["400"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

