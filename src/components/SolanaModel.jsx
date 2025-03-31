import React, { useRef } from "react";
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
  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 45 }} style={{ width: "529px", height: "451px" }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <Model />
      <OrbitControls />
    </Canvas>
  );
};

export default SolanaModel;
