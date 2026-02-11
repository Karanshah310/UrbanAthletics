import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const ShoeModel = () => {
  const { scene } = useGLTF("/models/shoe.glb");
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive object={scene} scale={2.5} rotation={[0, Math.PI / 4, 0]} />
    </Float>
  );
};

useGLTF.preload("/models/shoe.glb");

const Shoe3DViewer = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-background border border-border">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={45} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FF6B00" />
          <ShoeModel />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/90 border border-border backdrop-blur-sm text-sm text-muted-foreground">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default Shoe3DViewer;
