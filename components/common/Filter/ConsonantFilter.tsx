"use client";

import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/utils";
import { koreanConsonants, englishLetters } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ConsonantFilterProps {
  selectedConsonant?: string;
  onlyKo?: boolean;
  onConsonantSelect?: (consonant?: string) => void;
}

export default function ConsonantFilter({
  selectedConsonant,
  onlyKo = false,
  onConsonantSelect,
}: ConsonantFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleConsonantClick = (character: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (character === selectedConsonant) {
      params.delete("consonant");
      onConsonantSelect?.();
    } else {
      params.set("consonant", character);
      onConsonantSelect?.(character);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-gray-7 px-5 py-6">
      {/* Korean Consonants */}
      {koreanConsonants.map((row, rowIndex) => (
        <div
          key={`korean-row-${rowIndex}`}
          className="flex w-full items-center justify-between lg:hidden"
        >
          {row.map((consonant, consonantIndex) => (
            <button
              type="button"
              key={`korean-${rowIndex}-${consonantIndex}`}
              onClick={() => handleConsonantClick(consonant)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-serif text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:h-10 lg:w-10 lg:text-xl",
                selectedConsonant === consonant &&
                  "bg-primary text-white shadow-md",
              )}
            >
              {consonant}
            </button>
          ))}
        </div>
      ))}

      <div className="hidden w-full items-center justify-between lg:flex">
        {koreanConsonants.map((row, rowIndex) =>
          row.map((consonant, consonantIndex) => (
            <button
              key={`korean-${rowIndex}-${consonantIndex}`}
              onClick={() => handleConsonantClick(consonant)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-serif text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:h-10 lg:w-10 lg:text-xl",
                selectedConsonant === consonant &&
                  "bg-primary text-white shadow-md",
              )}
            >
              {consonant}
            </button>
          )),
        )}
      </div>

      {!onlyKo && (
        <>
          <Divider />

          {englishLetters.map((row, rowIndex) => (
            <div
              key={`english-row-${rowIndex}`}
              className="flex w-full items-center justify-between lg:hidden"
            >
              {row.map((consonant, consonantIndex) => (
                <button
                  key={`english-${rowIndex}-${consonantIndex}`}
                  onClick={() => handleConsonantClick(consonant)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-serif text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:h-10 lg:w-10 lg:text-xl",
                    selectedConsonant === consonant &&
                      "bg-primary text-white shadow-md",
                  )}
                >
                  {consonant}
                </button>
              ))}
            </div>
          ))}

          <div className="hidden w-full items-center justify-between lg:flex">
            {englishLetters.map((row, rowIndex) =>
              row.map((consonant, consonantIndex) => (
                <button
                  key={`english-${rowIndex}-${consonantIndex}`}
                  onClick={() => handleConsonantClick(consonant)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-serif text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:h-10 lg:w-10 lg:text-xl",
                    selectedConsonant === consonant &&
                      "bg-primary text-white shadow-md",
                  )}
                >
                  {consonant}
                </button>
              )),
            )}
          </div>
        </>
      )}
    </div>
  );
}
