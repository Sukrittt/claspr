import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { IntroScene } from "./scenes/IntroScene";
import { ClassroomScene } from "./scenes/ClassroomScene";
import { AICompanionScene } from "./scenes/AICompanionScene";
import { AssignmentsScene } from "./scenes/AssignmentsScene";
import { NotesScene } from "./scenes/NotesScene";
import { OutroScene } from "./scenes/OutroScene";

const T = 20;
const timing = linearTiming({ durationInFrames: T });

// Adjust durations to account for 5 extra frames per transition (20 vs 15)
// Original total with 15-frame transitions: 900
// New: need to subtract 5*5 = 25 more frames from scenes
const S1 = 125;
const S2 = 155;
const S3 = 185;
const S4 = 155;
const S5 = 180;
const S6 = 150;

export const ProductDemo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={S1}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />
      <TransitionSeries.Sequence durationInFrames={S2}>
        <ClassroomScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-left" })}
        timing={timing}
      />
      <TransitionSeries.Sequence durationInFrames={S3}>
        <AICompanionScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={timing}
      />
      <TransitionSeries.Sequence durationInFrames={S4}>
        <AssignmentsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />
      <TransitionSeries.Sequence durationInFrames={S5}>
        <NotesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={timing}
      />
      <TransitionSeries.Sequence durationInFrames={S6}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
