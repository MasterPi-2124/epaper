import '@/styles/globals.css'
import "@/styles/header.css";
import "@/styles/pip.css";
import "@/styles/auth.css";
import "@/styles/new-quiz.css";
import "@/styles/menu.css";
import "@/styles/homepage.css";
import "@/styles/button.css";
import "@/styles/main-container.css";
import "@/styles/modal.css";
import "@/styles/dashboard.css";
import "@/styles/wheelpicker.css";
import "@/styles/time-slider.css";
import "@/styles/notiflix.css";
import "@/styles/update.css";

import localFont from 'next/font/local';
import { ThemeProvider } from "next-themes";
import { PiPProvider } from '../services/pip';
import PiPComponent from '../components/pip'; // Your PiP component

const segoe = localFont({
  src: [
    {
      path: '../assets/fonts/SegoeUI-Bold.woff2',
      weight: '800',
      style: "normal"
    },
    {
      path: '../assets/fonts/SegoeUI-Light.woff2',
      weight: '200',
      style: "normal"
    },
    {
      path: '../assets/fonts/SegoeUI-LightItalic.woff2',
      weight: '200',
      style: "italic"
    },
    {
      path: '../assets/fonts/SegoeUI-Semibold.woff2',
      weight: '600',
      style: "normal"
    },
    {
      path: '../assets/fonts/SegoeUI.woff2',
      weight: '400',
      style: "normal"
    }
  ],
  variable: '--font-segoe',
  fallback: ['ui-sans-serif'],
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <PiPProvider>
        <div className={`${segoe.variable} font-segoe`}>
          <Component {...pageProps} />
          <PiPComponent />
        </div>
      </PiPProvider>
    </ThemeProvider>
  );
}