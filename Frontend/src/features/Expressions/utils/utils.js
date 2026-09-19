import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";
export const init = async ({landmarkerRef,videoRef,streamRef}) => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        }
      );

      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });

      videoRef.current.srcObject = streamRef.current;

      await videoRef.current.play();

      
    };

   export  const detect = ({landmarkerRef,videoRef, setExpression}) => {
      if (!landmarkerRef.current || !videoRef.current) return;

      const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      let currentExpression = "neutral";

      if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
          blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const browDownLeft = getScore("browDownLeft");
        const browDownRight = getScore("browDownRight");
        const mouthLowerDownLeft = getScore("mouthLowerDownLeft");
        const mouthLowerDownRight = getScore("mouthLowerDownRight");
        const mouthDimpleLeft = getScore("mouthDimpleLeft");
        const mouthDimpleRight = getScore("mouthDimpleRight");

        const smileScore = smileLeft + smileRight;
        const frownScore = frownLeft + frownRight;
        const browDownScore = browDownLeft + browDownRight;
        const mouthDownScore = mouthLowerDownLeft + mouthLowerDownRight;
        const dimpleScore = mouthDimpleLeft + mouthDimpleRight;
        const sadnessSignal = frownScore + browDownScore + mouthDownScore + dimpleScore;

        const isHappy = smileScore > 0.7 && frownScore < 0.5;
        const isSurprised = jawOpen > 0.18 && browUp > 0.1;
        const isSad =
          !isHappy &&
          !isSurprised &&
          (frownScore > 0.08 ||
            browDownScore > 0.08 ||
            mouthDownScore > 0.08 ||
            dimpleScore > 0.08) &&
          sadnessSignal > 0.25;

        if (isHappy) {
          currentExpression = "happy";
        } else if (isSurprised) {
          currentExpression = "surprised";
        } else if (isSad) {
          currentExpression = "sad";
        }

        setExpression(currentExpression);
      }
      return currentExpression

    
    };