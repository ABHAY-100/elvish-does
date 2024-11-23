"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SecretKeyEntry = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const correctKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      if (!correctKey) {
        throw new Error("Authentication configuration error");
      }

      if (key === correctKey) {
        setIsAuthenticated(true);
        await router.push("/update-aura");
      } else {
        setError("Wrong key! Give it another go!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen gap-4">
      <h1
        data-aos="fade-up"
        data-aos-duration="1000"
        className="text-2xl text-center"
      >
        u can find the key beyond the doors!
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="100"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="try guessing the key!"
          className="border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none"
          required
          id="secret-key-input"
          name="secret-key"
          disabled={isSubmitting}
        />
        <button
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          type="submit"
          className="bg-white text-black h-[40px] font-bold disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Checking..." : "Give It a Try!"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-sm text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecretKeyEntry;
