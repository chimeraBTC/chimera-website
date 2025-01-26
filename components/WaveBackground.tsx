'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom material for the wireframe effect
const TopographyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.5, 0.5, 0.6),
    uLineWidth: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    
    // Improved noise function for more natural terrain
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vUv = uv;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Create terrain-like elevation using FBM noise
      float elevation = fbm(modelPosition.xz * 0.5 + uTime * 0.05);
      elevation = pow(elevation, 1.5) * 2.0; // Make peaks sharper
      
      modelPosition.y += elevation;
      vElevation = elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    uniform float uLineWidth;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Create contour lines based on elevation
      float contour = abs(fract(vElevation * 8.0) - 0.5); // Increased frequency for more lines
      
      // Sharp line effect with thinner lines
      float lineAlpha = 1.0 - smoothstep(0.0, 0.02, contour);
      
      // Add glow effect
      float glow = 1.0 - smoothstep(0.0, 0.2, contour);
      
      // Elevation-based color variation
      vec3 color = mix(uColor * 0.5, uColor * 1.2, vElevation * 0.5 + 0.5);
      
      // Final color with lines and glow
      gl_FragColor = vec4(color, mix(glow * 0.2, 1.0, lineAlpha) * 0.6);
    }
  `
);

extend({ TopographyMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'topographyMaterial': any;
    }
  }
}

const TopographyPlane = () => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime * 0.15; // Even slower movement
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[3, 3, 3]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10, 250, 250]} /> {/* Higher resolution */}
      <topographyMaterial ref={materialRef} transparent={true} />
    </mesh>
  );
};

const WaveBackground = () => {
  return (
    <div className="fixed inset-0" style={{ 
      zIndex: -1, 
      background: 'linear-gradient(to bottom, #000000, #0a0a1a)',
      opacity: 0.2
    }}>
      <Canvas
        camera={{ position: [0, 8, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 15, 5]} intensity={0.7} />
        <directionalLight position={[-5, 15, -5]} intensity={0.3} />
        <TopographyPlane />
      </Canvas>
    </div>
  );
};

export default WaveBackground;
