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
        fill
        alt={alt}
        priority
        quality={100}
      />
    </div>
  );
};
