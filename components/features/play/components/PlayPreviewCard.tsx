import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Play } from "@/models/play";
import { Card, CardContent } from "@/components/ui/card";
import Cart from "@/components/icons/Cart";

interface PlayPreviewCardProps {
  play: Play;
}

export default function PlayPreviewCard({ play }: PlayPreviewCardProps) {
  const { title, author, keyword, line1, id, salesStatus, attachmentUrl } =
    play;
  const authorName = author?.authorName ?? "작가 미지정";

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-0">
        {/* Main card */}
        <Link
          href={`/play/${id}`}
          className="overflow-hidden group relative box-border flex aspect-[220/300] w-full cursor-pointer justify-between rounded-[4px] bg-primary px-4 py-8 transition-all duration-500 ease-in-out lg:hover:bg-[#EDE0DE] lg:px-7 lg:py-[60px]"
        >
          {salesStatus === "판매함" && !!attachmentUrl && (
            <div className="absolute top-2.5 right-2.5 lg:top-4 lg:right-4 ">
              <Cart color="white" size={20} />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 lg:group-hover:hidden">
            <span className="line-clamp-2 font-serif text-xl font-bold text-white">
              {title}
            </span>
            <div className="font-semibold text-orange-1">{authorName}</div>
          </div>
          <div className="hidden flex-1 overflow-hidden lg:group-hover:flex items-start">
            <p className="line-clamp-9 lg:line-clamp-6 font-serif text-sm font-bold text-primary sm:text-base xl:text-xl leading-tight">
              {line1}
            </p>
          </div>
        </Link>

        {/* keyword */}
        <div className="flex flex-wrap gap-1.5">
          {keyword.map((kw, index) => (
            <Link
              key={`${play.id}-${kw}-${index}`}
              href={`/search?keyword=${encodeURIComponent(kw)}`}
              className="inline-flex"
            >
              <Badge
                variant="outline"
                size="md"
                className="transition-all duration-500 ease-in-out md:hover:bg-primary md:hover:text-white"
              >
                {kw}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
