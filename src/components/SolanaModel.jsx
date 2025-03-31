import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("/models/SolanaCoin.glb");
  const modelRef = useRef();

  // Rotate the model continuously
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Adjust speed as needed
    }
  });

  return <primitive object={scene} ref={modelRef} scale={2} />;
};

const SolanaModel = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 529, height: 451 });
  const [scale, setScale] = useState(2);
  const [cameraPosition, setCameraPosition] = useState([0, 3, 6]);

  // Function to update size and scale based on screen width
  const updateSize = () => {
    if (window.innerWidth < 768) {
      setCanvasSize({ width: window.innerWidth * 0.9, height: 300 });
      setScale(1.2); // Smaller model scale for mobile
      setCameraPosition([0, 2, 4]); // Move camera closer on mobile
    } else {
      setCanvasSize({ width: 529, height: 451 });
      setScale(2);
      setCameraPosition([0, 3, 6]);
    }
  };

  // Run on mount and when window resizes
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Canvas camera={{ position: cameraPosition, fov: 45 }} style={{ width: canvasSize.width, height: canvasSize.height }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <Model scale={scale} />
      <OrbitControls />
    </Canvas>
  );
};

export default SolanaModel;
