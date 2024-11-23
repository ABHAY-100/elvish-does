"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatNumber(num: number): string {
  const absNum = Math.abs(num);
  if (absNum >= 1e100) return num > 0 ? "+∞" : "-∞";
  if (absNum >= 1e99) return (num / 1e99).toFixed(1) + " GoP";
  if (absNum >= 1e98) return (num / 1e98).toFixed(1) + " GoO";
  if (absNum >= 1e63) return (num / 1e63).toFixed(1) + " Y";
  if (absNum >= 1e60) return (num / 1e60).toFixed(1) + " Z";
  if (absNum >= 1e57) return (num / 1e57).toFixed(1) + " E";
  if (absNum >= 1e54) return (num / 1e54).toFixed(1) + " P";
  if (absNum >= 1e51) return (num / 1e51).toFixed(1) + " T";
  if (absNum >= 1e48) return (num / 1e48).toFixed(1) + " G";
  if (absNum >= 1e45) return (num / 1e45).toFixed(1) + " M";
  if (absNum >= 1e42) return (num / 1e42).toFixed(1) + " k";
  if (absNum >= 1e39) return (num / 1e39).toFixed(1) + " h";
  if (absNum >= 1e36) return (num / 1e36).toFixed(1) + " da";
  if (absNum >= 1e33) return (num / 1e33).toFixed(1) + " C";
  if (absNum >= 1e30) return (num / 1e30).toFixed(1) + " m";
  if (absNum >= 1e27) return (num / 1e27).toFixed(1) + " µ";
  if (absNum >= 1e24) return (num / 1e24).toFixed(1) + " n";
  if (absNum >= 1e21) return (num / 1e21).toFixed(1) + " p";
  if (absNum >= 1e18) return (num / 1e18).toFixed(1) + " f";
  if (absNum >= 1e15) return (num / 1e15).toFixed(1) + " a";
  if (absNum >= 1e12) return (num / 1e12).toFixed(1) + " z";
  if (absNum >= 1e9) return (num / 1e9).toFixed(1) + " y";
  if (absNum >= 1e6) return (num / 1e6).toFixed(1) + " M";
  if (absNum >= 1e3) return (num / 1e3).toFixed(1) + " k";
  return num.toFixed(1);
}

export default function Home() {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/get-aura', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (mounted) {
          setCurrentValue(data.currentValue);
          setLoading(false);
          setError(null);
          return true;
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : "Failed to fetch data");
          setLoading(false);
        }
        return false;
      }
    };

    const setupSSE = async () => {
      if (!mounted) return;

      try {
        // First try to get initial data
        const success = await fetchInitialData();
        if (!success) return;

        // Then set up SSE for updates
        eventSource = new EventSource('/api/get-aura?sse=true');

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              throw new Error(data.error);
            }
            if (mounted) {
              setCurrentValue(data.currentValue);
              setLoading(false);
              setError(null);
            }
          } catch (error) {
            if (mounted) {
              setError(error instanceof Error ? error.message : "Failed to process data");
              eventSource?.close();
              retryTimeout = setTimeout(setupSSE, 2000);
            }
          }
        };

        eventSource.onerror = () => {
          if (mounted) {
            eventSource?.close();
            retryTimeout = setTimeout(setupSSE, 2000);
          }
        };
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : "Connection error");
          retryTimeout = setTimeout(setupSSE, 2000);
        }
      }
    };

    setupSSE();

    return () => {
      mounted = false;
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen">
        <h1
          data-aos="fade-up"
          data-aos-duration="1000"
          className="text-5xl font-bold tracking-wide mt-[10px]"
        >
          {loading ? "..." : formatNumber(currentValue || 0)}{" "}
          <span className="text-4xl">aura</span>
        </h1>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
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
