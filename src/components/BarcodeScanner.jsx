import { useEffect, useRef, useState } from "react";

/** Uses the browser's built-in barcode scanner when available. */
export default function BarcodeScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const onDetectedRef = useRef(onDetected);
  const [status, setStatus] = useState("starting");

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    let active = true;
    let stream;
    let animationFrame;
    let videoElement;
    const stopCamera = () => {
      stream?.getTracks().forEach((track) => track.stop());
      if (videoElement) videoElement.srcObject = null;
    };

    const start = async () => {
      if (!("BarcodeDetector" in window)) {
        setStatus("unsupported");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }

      try {
        const detector = new window.BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "itf"],
        });
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        videoElement = videoRef.current;
        videoElement.srcObject = stream;
        await videoElement.play();
        setStatus("scanning");

        const scanFrame = async () => {
          if (!active || !videoRef.current) return;
          try {
            const detections = await detector.detect(videoRef.current);
            const code = detections[0]?.rawValue;
            if (code) {
              setStatus("found");
              stopCamera();
              onDetectedRef.current(code);
              return;
            }
          } catch {
            setStatus("scan-error");
            stopCamera();
            return;
          }
          animationFrame = window.requestAnimationFrame(scanFrame);
        };
        scanFrame();
      } catch (error) {
        if (!active) return;
        stopCamera();
        setStatus(error?.name === "NotAllowedError" ? "denied" : "unavailable");
      }
    };

    start();
    return () => {
      active = false;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      stopCamera();
    };
  }, []);

  const statusText = {
    starting: "Starting the camera…",
    scanning: "Point your camera at a product barcode.",
    found: "Barcode found. Looking up the product…",
    unsupported: "Barcode scanning is not supported in this browser. Use manual barcode entry below.",
    unavailable: "The camera is unavailable. Use manual barcode entry below.",
    denied: "Camera permission was denied. You can still enter the barcode manually below.",
    "scan-error": "The barcode could not be read. Try again or enter it manually below.",
  }[status];

  return (
    <section className="scanner-panel" aria-label="Barcode scanner">
      <div className="scanner-heading">
        <h3>Scan a product barcode</h3>
        <button type="button" className="inline-link-button" onClick={onClose}>Close scanner</button>
      </div>
      <video ref={videoRef} className="scanner-video" aria-label="Camera preview" playsInline muted hidden={status !== "scanning"} />
      <p role="status">{statusText}</p>
    </section>
  );
}
