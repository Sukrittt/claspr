import Image from "next/image";

interface CoverDisplayProps {
  coverImage: string;
  alt: string;
}

export const CoverDisplay: React.FC<CoverDisplayProps> = ({
  coverImage,
  alt,
}) => {
  return (
    <div className="h-44 border-b relative">
      <Image
        src={coverImage}
        className="object-cover"
        alt={alt}
        priority
        fill
        quality={100}
      />
    </div>
  );
};
