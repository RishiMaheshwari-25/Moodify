
import { useEffect, useRef, useState } from "react";

import { detect,init } from "../utils/utils";

export default function FaceExpression({ onMoodDetected = () => {}, loading = false }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const [expression, setExpression] = useState("Preparing camera...");
  const [isReady, setIsReady] = useState(false);
  const streamRef=useRef(null)
 
  useEffect(() => {
 
   

    let isMounted = true;

    init({landmarkerRef,videoRef,streamRef}).then(() => {
      if (isMounted) setIsReady(true);
    }).catch(() => {
      if (isMounted) setExpression("Camera unavailable");
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
          isMounted = false;
    };
  }, []);
  async function handleClick(){
    const expression =detect({landmarkerRef,videoRef,setExpression})
    if (expression !== "neutral") onMoodDetected(expression)
  }

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px" }}
        playsInline
      />

      <h2>{expression}</h2>
      <button onClick={handleClick} disabled={!isReady || loading || expression === "Camera unavailable"}>
        {loading ? "Finding your song..." : isReady ? "Detect Expression" : "Preparing camera..."}
      </button>
    </div>
  );
}
