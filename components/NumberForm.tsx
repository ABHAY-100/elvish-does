"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NumberFormProps {
  onLogout: () => void;
}

export default function NumberForm({ onLogout }: NumberFormProps) {
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [value, setValue] = useState<number>(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/update-aura", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, value }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error:", errorText);
      alert("Failed to update aura value.");
      return;
    }

    onLogout();

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <select
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
        className="border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none"
      >
        <option value="add" className="text-black">
          + aura
        </option>
        <option value="subtract" className="text-black">
          - aura
        </option>
      </select>
      <input
        type="number"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
        className="border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none"
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder="aura value here!"
        required
      />
      <button
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
        type="submit"
        className="bg-white text-black h-[40px] font-bold"
      >
        Submit
      </button>
    </form>
  );
}
