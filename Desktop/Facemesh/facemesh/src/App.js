import React, { useRef, useEffect, useState, useCallback } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

import { drawMesh, getEAR, getFaceDirection, isSmiling } from "./utilities";

import Dashboard from "./components/Dashboard";
import AlertBanner from "./components/AlertBanner";
import "./App.css";

const EAR_THRESHOLD = 0.25;
const BLINK_CONSEC = 2;
const MAX_GRAPH_POINTS = 50;

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const blinkFrames = useRef(0);
  const intervalRef = useRef(null);

  const [ear, setEar] = useState(0.3);
  const [blinkCount, setBlinkCount] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [smiling, setSmiling] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [attentionData, setAttentionData] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);

  const detect = useCallback(async (net) => {
    if (
      !webcamRef.current ||
      !webcamRef.current.video ||
      webcamRef.current.video.readyState !== 4
    ) {
      return;
    }

    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) return;

    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    if (!canvasRef.current) return;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // ✅ Correct syntax for createDetector()
    const faces = await net.estimateFaces(video);

    if (!faces || faces.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    // ✅ Compatible with both old and new versions
    const keypoints =
      faces[0].keypoints?.map((p) => [p.x, p.y, p.z || 0]) ||
      faces[0].scaledMesh;

    if (!keypoints || keypoints.length === 0) return;

    // Draw face mesh
    drawMesh(
      [
        {
          scaledMesh: keypoints,
        },
      ],
      ctx,
    );

    // EAR calculation
    const earVal = getEAR(keypoints);
    setEar(earVal);

    // Blink detection
    if (earVal < EAR_THRESHOLD) {
      blinkFrames.current += 1;
    } else {
      if (blinkFrames.current >= BLINK_CONSEC) {
        setBlinkCount((prev) => prev + 1);
      }
      blinkFrames.current = 0;
    }

    // Drowsiness detection
    setDrowsy(blinkFrames.current > 10);

    // Face direction
    setDirection(getFaceDirection(keypoints));

    // Smile detection
    setSmiling(isSmiling(keypoints));

    // Graph data
    setAttentionData((prev) => {
      const next = [
        ...prev,
        {
          time: Date.now(),
          ear: parseFloat(earVal.toFixed(3)),
        },
      ];

      return next.length > MAX_GRAPH_POINTS
        ? next.slice(-MAX_GRAPH_POINTS)
        : next;
    });
  }, []);

  useEffect(() => {
    const runFacemesh = async () => {
      try {
        console.log("Loading FaceMesh model...");

        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

        const detectorConfig = {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        };

        const net = await faceLandmarksDetection.createDetector(
          model,
          detectorConfig,
        );

        console.log("FaceMesh model loaded successfully");

        setModelLoaded(true);

        intervalRef.current = setInterval(() => {
          detect(net);
        }, 100);
      } catch (error) {
        console.error("FaceMesh loading failed:", error);
      }
    };

    runFacemesh();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [detect]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Loading Message */}
        {!modelLoaded && (
          <div
            style={{
              position: "absolute",
              zIndex: 100,
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              color: "aqua",
              fontSize: "20px",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            ⏳ Loading FaceMesh model...
          </div>
        )}

        {/* Webcam */}
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 10,
            width: 640,
            height: 480,
          }}
        />

        {/* Dashboard */}
        <Dashboard
          ear={ear}
          blinkCount={blinkCount}
          direction={direction}
          smiling={smiling}
          attentionData={attentionData}
          drowsy={drowsy}
        />

        {/* Alert Banner */}
        <AlertBanner drowsy={drowsy} direction={direction} />
      </header>
    </div>
  );
}

export default App;
