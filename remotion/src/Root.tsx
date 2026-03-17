import { Composition } from "remotion";
import { ProductDemo } from "./ProductDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProductDemo"
      component={ProductDemo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
