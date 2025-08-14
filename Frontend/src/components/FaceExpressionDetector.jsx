import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./facialExpression.css";

const FaceExpressionDetector = ({
  setSongs,
  setCurrentMood: setAppCurrentMood,
}) => {
  const videoRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      startVideo();
    } catch (error) {
      console.error("Error loading models:", error);
      setIsLoading(false);
      alert("Failed to load AI models. Please check the console for details.");
    }
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setVideoReady(true);
            setIsLoading(false);
          };
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setIsLoading(false);
        alert(
          "Failed to access camera. Please ensure you have granted camera permissions and try again."
        );
      });
  };

  const detectMood = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      alert("Video not ready. Please wait and try again.");
      return;
    }

    setIsDetecting(true);
    setCurrentMood(null);

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        alert(
          "No face detected. Please ensure your face is visible in the camera and try again."
        );
        setIsDetecting(false);
        return;
      }

      let mostProbableExpression = 0;
      let _expression = "";

      for (const [expression, value] of Object.entries(
        detections[0].expressions
      )) {
        if (value > mostProbableExpression) {
          mostProbableExpression = value;
          _expression = expression;
        }
      }

      setCurrentMood(_expression);

      const response = await axios.get(
        `http://localhost:3000/songs?mood=${_expression}`
      );
      setSongs(response.data.songs);

      if (setAppCurrentMood) {
        setAppCurrentMood(_expression);
      }
    } catch (error) {
      console.error("Error detecting mood or fetching songs:", error);
      if (error.code === "ERR_NETWORK") {
        alert(
          "Cannot connect to the backend server. Please ensure the backend is running on http://localhost:3000"
        );
      } else {
        alert(
          "An error occurred during mood detection. Please check the console for details."
        );
      }
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="mood-element">
      <div className="video-container">
        <video ref={videoRef} autoPlay muted className="user-video-feed" />
        {isLoading && (
          <div className="video-overlay loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading AI models...</p>
          </div>
        )}
        {isDetecting && (
          <div className="video-overlay detecting-overlay">
            <div className="detecting-animation">
              <div className="scan-line"></div>
            </div>
            <p>Analyzing facial expressions...</p>
          </div>
        )}
        <div className="video-frame"></div>
      </div>

      <div className="controls-section">
        <button
          onClick={detectMood}
          disabled={!videoReady || isDetecting}
          className="detect-button"
        >
          {isDetecting ? (
            <>
              <div className="button-spinner"></div>
              Analyzing...
            </>
          ) : (
            "Detect Mood"
          )}
        </button>

        {currentMood && (
          <div className="mood-result">
            <div className="mood-text">
              <span className="mood-label">Detected Mood</span>
              <span className="mood-value">{formatMoodName(currentMood)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const formatMoodName = (mood) => {
  return mood.charAt(0).toUpperCase() + mood.slice(1);
};

export default FaceExpressionDetector;
