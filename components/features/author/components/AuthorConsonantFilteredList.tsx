import Link from "next/link";
import { cn } from "@/lib/utils";
import { Author } from "@/models/author";

interface AuthorConsonantFilteredListProps {
  items: Author[][];
  consonant?: string;
  className?: string;
}

export default function AuthorConsonantFilteredList({
  items,
  consonant,
  className = "",
}: AuthorConsonantFilteredListProps) {
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
            {item.map((author) => (
              <div
                key={`item-${author.id}`}
                className="flex w-full items-center"
              >
                <Link
                  href={`/author/${author.id}`}
                  className="group flex items-center gap-2 transition-colors"
                >
                  <span className="shrink-0 font-serif text-lg font-semibold leading-6 text-gray-2 transition-colors group-hover:text-primary">
                    {author.authorName}
                  </span>
                  <span className="truncate font-serif text-sm font-semibold leading-6 text-gray-4 transition-colors group-hover:text-primary">
                    {author.authorNameEn}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
