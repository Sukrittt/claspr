import { cn } from "@/lib/utils";
import { useUpdateNoteCover } from "@/hooks/note";
import { GradientColor, gradientColors } from "@/config/utils";

interface ChooseGradientProps {
  noteId: string;
  closePopover: () => void;
}

export const ChooseGradient: React.FC<ChooseGradientProps> = ({
  noteId,
  closePopover,
}) => {
  const { mutate: updateCover } = useUpdateNoteCover({ closePopover });

  const handleUpdateCover = (gradientColor: GradientColor) => {
    updateCover({
      noteId,
      gradientClass: gradientColor.gradientClass,
    });
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {gradientColors.map((color) => (
          <div
            key={color.id}
            className={cn(
              "h-14 rounded-md cursor-pointer",
              color.gradientClass
            )}
            onClick={() => handleUpdateCover(color)}
          />
        ))}
      </div>
    </div>
  );
};
