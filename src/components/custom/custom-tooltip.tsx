import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomToolTipProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  text: string;
}

export const CustomTooltip: React.FC<CustomToolTipProps> = ({
  children,
  text,
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs" {...props}>
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
