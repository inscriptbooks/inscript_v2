import { PlayPreviewCard } from "@/components/features/play";
import { ShowMoreButton } from "@/components/common";
import { Play } from "@/models/play";
import { Card, CardContent } from "@/components/ui/card";

interface PlayAlbumListProps {
  playList: Play[];
  onMoreClick?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export default function PlayAlbumList({
  playList,
  onMoreClick,
  hasNextPage,
  isFetchingNextPage,
}: PlayAlbumListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:gap-6">
      {playList.map((play) => (
        <PlayPreviewCard key={play.id} play={play} />
      ))}

      {hasNextPage && (
        <Card className="lg:hidden">
          <CardContent className="aspect-[220/300] p-0">
            <ShowMoreButton
              type="mobile"
              onClick={onMoreClick}
              disabled={isFetchingNextPage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
