import { Composition } from "remotion";
import { VinhetaRaquel } from "./Vinheta";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VinhetaRaquel"
        component={VinhetaRaquel}
        durationInFrames={150}  // 5 segundos a 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
