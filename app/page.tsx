"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentValue = async () => {
    try {
      // Append a timestamp to the URL to bypass cache
      const response = await fetch(`/api/get-aura?timestamp=${new Date().getTime()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched current value:", data.currentValue);
        setCurrentValue(data.currentValue);
      } else {
        console.error("Failed to fetch current value");
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error("Error fetching current value:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWithRetry = async () => {
      let retries = 3;
      while (retries > 0) {
        try {
          await fetchCurrentValue();
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error("Max retries reached. Unable to fetch current value.", error);
          } else {
            console.log(`Retrying... Attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    };

    fetchWithRetry();

    const intervalId = setInterval(fetchWithRetry, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen">
        <h1
          data-aos="fade-up"
          data-aos-duration="1000"
          className="text-5xl font-bold tracking-wide mt-[10px]"
        >
          {loading ? "..." : currentValue}{" "}
          <span className="text-4xl">aura</span>
        </h1>
        <a
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="100"
          href="https://www.instagram.com/elvin_j_alapatt"
          target="_blank"
          className="text-[18px] opacity-90 tracking-wide mt-[7px]"
        >
          @elvish_bai
        </a>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Link
          href="/secret-key"
          className="bg-white text-black flex items-center justify-center w-full h-[42px] font-bold"
        >
          Update Aura
        </Link>
      </div>
    </>
  );
}
