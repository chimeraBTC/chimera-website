'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom material for the geometric wireframe effect
const TopographyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#FFAA00"), // Deep orange to match site theme
    uLineWidth: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;
    uniform float uTime;
    
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
      
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vUv = uv;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Create terrain-like elevation
      float elevation = fbm(modelPosition.xz * 0.8 + uTime * 0.1);
      elevation = pow(elevation, 1.5) * 2.5;
      
      modelPosition.y += elevation;
      vElevation = elevation;
      vPosition = modelPosition.xyz;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;
    
    // Function to create sharp grid lines
    float grid(vec2 p, float width) {
      vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
      return min(grid.x, grid.y);
    }
    
    void main() {
      // Create triangular grid pattern
      vec2 coord = vPosition.xz * 2.0;
      vec2 grid1 = coord;
      vec2 grid2 = coord + vec2(0.5); // Offset grid for triangular pattern
      
      // Calculate grid lines with different frequencies
      float line1 = grid(grid1, 1.0);
      float line2 = grid(grid2, 1.0);
      
      // Add elevation-based contours
      float contour = abs(fract(vElevation * 8.0) - 0.5) / fwidth(vElevation);
      
      // Combine grids and contours
      float lines = min(min(line1, line2), contour);
      
      // Create sharp lines with glow
      float lineIntensity = 1.0 - smoothstep(0.0, 1.5, lines);
      float glowIntensity = 1.0 - smoothstep(0.0, 3.0, lines);
      
      // Elevation-based color variation
      vec3 color = mix(uColor * 0.5, uColor * 1.2, vElevation * 0.5 + 0.5);
      
      // Final color with lines and glow
      gl_FragColor = vec4(color, mix(glowIntensity * 0.2, lineIntensity, lineIntensity) * 0.6);
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
      materialRef.current.uTime = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[3, 3, 3]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10, 200, 200]} />
      <topographyMaterial ref={materialRef} transparent={true} />
    </mesh>
  );
};

const WaveBackground = () => {
  return (
    <div className="fixed inset-0" style={{ 
      zIndex: -1, 
      background: 'linear-gradient(to bottom, #000000, #1a0a00)',
      opacity: 0.6
    }}>
      <Canvas
        camera={{ position: [0, 8, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TopographyPlane />
      </Canvas>
    </div>
  );
};

export default WaveBackground;
