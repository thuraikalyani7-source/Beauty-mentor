import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import femaleModelUrl from "../../asset-inspection/female-base-mesh-base_female.glb?url";

function FemaleModel({ onLoaded }) {
  const gltf = useLoader(GLTFLoader, femaleModelUrl);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return <primitive object={gltf.scene} />;
}

function CameraControls({ controlsRef }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.9;
    controls.maxDistance = 5.5;
    controls.target.set(0, 0.82, 0);
    camera.position.set(0, 0.82, 3.35);
    controls.update();
    controls.saveState();
    controlsRef.current = controls;

    return () => {
      controlsRef.current = null;
      controls.dispose();
    };
  }, [camera, controlsRef, gl]);

  return null;
}

class ModelErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.props.onError(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default function BodyViewer() {
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const markLoaded = () => {
    setIsLoading(false);
    setError(null);
  };

  const retry = () => {
    useLoader.clear(GLTFLoader, femaleModelUrl);
    setError(null);
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <section className="body-viewer" aria-label="3D female model preview">
      <div className="body-viewer-toolbar">
        <span>Drag to rotate · Scroll or pinch to zoom</span>
        <button type="button" onClick={() => controlsRef.current?.reset()}>
          Reset view
        </button>
      </div>
      <div className="body-viewer-canvas">
        <Canvas
          camera={{ position: [0, 0.82, 3.35], fov: 42, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "low-power" }}
        >
          <color attach="background" args={["#f8e8ef"]} />
          <ambientLight intensity={1.35} />
          <directionalLight position={[3, 5, 4]} intensity={2.1} />
          <directionalLight position={[-3, 2, -4]} intensity={0.8} />
          <CameraControls controlsRef={controlsRef} />
          <ModelErrorBoundary key={retryCount} onError={setError}>
            <Suspense fallback={null}>
              <FemaleModel onLoaded={markLoaded} />
            </Suspense>
          </ModelErrorBoundary>
        </Canvas>

        {isLoading && !error && (
          <div className="body-viewer-message" role="status">
            <span className="viewer-spinner" aria-hidden="true" />
            Loading the 3D model…
          </div>
        )}

        {error && (
          <div className="body-viewer-message viewer-error" role="alert">
            <strong>The 3D model could not be loaded.</strong>
            <span>Check that the model file is available, then try again.</span>
            <button type="button" onClick={retry}>Try again</button>
          </div>
        )}
      </div>
      <p className="body-viewer-note">
        Preview only. The 3D model does not select body areas yet; use the interactive SVG map to choose an area.
      </p>
    </section>
  );
}
