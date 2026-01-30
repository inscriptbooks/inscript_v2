import Link from "next/link";
import { Play } from "@/models/play";
import { cn } from "@/lib/utils";

interface PlayConsonantFilteredListProps {
  items: Play[][];
  consonant?: string;
  className?: string;
}

export default function PlayConsonantFilteredList({
  items,
  consonant,
  className = "",
}: PlayConsonantFilteredListProps) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex flex-col items-start border-b border-primary px-5 py-5">
        <div className="font-serif text-xl font-bold leading-6 text-primary">
          {consonant}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {items.map((item, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex flex-1 flex-col gap-2.5 px-5"
          >
            {item.map((item) => (
              <div
                key={`item-${item.id}`}
                className="line-clamp-1 font-serif text-lg font-semibold leading-6 text-gray-2"
              >
                <Link
                  href={`/play/${item.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
