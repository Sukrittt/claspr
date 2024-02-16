import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { getShortenedText } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { useUpdateNoteCover } from "@/hooks/note";
import { useDebounce } from "@/hooks/use-debounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UnsplashImage, useUnsplashImages } from "@/hooks/use-unsplash-images";

interface UnsplashImagePickerProps {
  noteId: string;
  closePopover: () => void;
}

export const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({
  closePopover,
  noteId,
}) => {
  const { mutate: updateCover } = useUpdateNoteCover({ closePopover });
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 500);
  const { getUnsplashPhotos } = useUnsplashImages();

  const {
    data: images,
    isFetching,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ["unsplashImages", debouncedQuery],
    queryFn: () => getUnsplashPhotos(debouncedQuery),
  });

  async function handleUpdateCover(coverImage: string) {
    updateCover({
      coverImage,
      noteId,
    });
  }

  useEffect(() => {
    if (debouncedQuery) {
      refetchImages();
    }
  }, [debouncedQuery, refetchImages]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 pt-1"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Input
          autoFocus
          placeholder="Search for an image.."
          className="text-[13px] h-8"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isFetching ? (
          <div className="h-[300px] grid place-items-center">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-800" />
          </div>
        ) : !images || images.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center">
            No results found.
          </p>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <UnsplashImageCard
                  key={image.id}
                  image={image}
                  onSubmit={handleUpdateCover}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

interface UnsplashImageProps {
  image: UnsplashImage;
  onSubmit: (coverImage: string) => void;
}

const UnsplashImageCard: React.FC<UnsplashImageProps> = ({
  image,
  onSubmit,
}) => {
  return (
    <div
      key={image.id}
      className="cursor-pointer"
      onClick={() => onSubmit(image.imageUrl)}
    >
      <div className="relative h-16 w-30">
        <Image
          className="rounded-md object-cover"
          src={image.imageUrl}
          alt={image.alt}
          fill
        />
      </div>
      <p className="text-muted-foreground text-xs pt-2">
        By{" "}
        <Link
          href={image.creatorLink}
          target="_blank"
          className="underline hover:text-muted transition"
        >
          {getShortenedText(image.creatorName, 8)}
        </Link>
      </p>
    </div>
  );
};
