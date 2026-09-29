'use client';

/*
 * Adapted from the MIT-licensed Vuesic InfiniteGallery by Aryan Pandey.
 * https://github.com/aryanp4ndey/Vuesic
 * The interaction and render loop have been rewritten for an embedded page section.
 */

import Image from 'next/image';
import type React from 'react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export type GalleryImage = string | { src: string; alt?: string };

interface Range {
  start: number;
  end: number;
}

interface InfiniteGalleryProps {
  images: GalleryImage[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: { fadeIn: Range; fadeOut: Range };
  blurSettings?: { blurIn: Range; blurOut: Range; maxBlur: number };
  className?: string;
  style?: React.CSSProperties;
  paused?: boolean;
  describedBy?: string;
}

interface PlaneData {
  depth: number;
  imageIndex: number;
  x: number;
  y: number;
}

const defaultFade = {
  fadeIn: { start: 0.02, end: 0.13 },
  fadeOut: { start: 0.78, end: 0.98 },
};

const defaultBlur = {
  blurIn: { start: 0, end: 0.12 },
  blurOut: { start: 0.72, end: 1 },
  maxBlur: 2.4,
};

function normalizeImages(images: GalleryImage[]) {
  return images.map((image) => (typeof image === 'string' ? { src: image, alt: '' } : image));
}

function mapRange(value: number, range: Range, invert = false) {
  if (range.end === range.start) return invert ? 0 : 1;
  const progress = THREE.MathUtils.clamp((value - range.start) / (range.end - range.start), 0, 1);
  return invert ? 1 - progress : progress;
}

function createGalleryMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      map: { value: null },
      opacity: { value: 0 },
      blurAmount: { value: 0 },
      texelSize: { value: new THREE.Vector2(1 / 1200, 1 / 1200) },
      scrollForce: { value: 0 },
      time: { value: 0 },
      isHovered: { value: 0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float force = clamp(scrollForce, -2.2, 2.2);
        float edge = pow(length(pos.xy), 2.0);
        float ripple = (sin(pos.x * 3.0 + time * 1.4) + sin(pos.y * 3.4 - time)) * 0.012;
        float hoverWave = sin(pos.x * 4.0 + time * 5.0) * smoothstep(-0.5, 0.5, pos.x) * 0.07 * isHovered;
        pos.z -= edge * force * 0.11 + ripple * abs(force) + hoverWave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform vec2 texelSize;
      varying vec2 vUv;

      void main() {
        vec2 spread = texelSize * blurAmount;
        vec4 color = texture2D(map, vUv) * 0.28;
        color += texture2D(map, vUv + vec2(spread.x, 0.0)) * 0.12;
        color += texture2D(map, vUv - vec2(spread.x, 0.0)) * 0.12;
        color += texture2D(map, vUv + vec2(0.0, spread.y)) * 0.12;
        color += texture2D(map, vUv - vec2(0.0, spread.y)) * 0.12;
        color += texture2D(map, vUv + spread) * 0.06;
        color += texture2D(map, vUv - spread) * 0.06;
        color += texture2D(map, vUv + vec2(spread.x, -spread.y)) * 0.06;
        color += texture2D(map, vUv + vec2(-spread.x, spread.y)) * 0.06;
        float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        vec3 warmMono = vec3(luma * 0.92, luma * 0.87, luma * 0.79);
        color.rgb = mix(warmMono, color.rgb, 0.24);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
}

function GalleryScene({
  images,
  speed,
  zSpacing,
  visibleCount,
  falloff,
  fadeSettings,
  blurSettings,
  paused,
  describedBy,
}: Required<Pick<InfiniteGalleryProps, 'speed' | 'zSpacing' | 'visibleCount' | 'falloff' | 'fadeSettings' | 'blurSettings' | 'paused'>> &
  Pick<InfiniteGalleryProps, 'images' | 'describedBy'>) {
  const { gl } = useThree();
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const textures = useTexture(normalizedImages.map((image) => image.src));
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const velocity = useRef(0);
  const lastInteraction = useRef(0);
  const lastTouchY = useRef<number | null>(null);
  const depthRange = Math.max(falloff.far - falloff.near, visibleCount * zSpacing);

  const spatialPositions = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, index) => {
        const goldenAngle = index * 2.399963;
        const lane = 1.5 + (index % 3) * 1.15;
        return {
          x: Math.sin(goldenAngle) * lane,
          y: Math.cos(goldenAngle * 0.78) * (1.1 + (index % 4) * 0.55),
        };
      }),
    [visibleCount]
  );

  const planeData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, index) => ({
      depth: (index * zSpacing) % depthRange,
      imageIndex: index % Math.max(normalizedImages.length, 1),
      x: spatialPositions[index]?.x ?? 0,
      y: spatialPositions[index]?.y ?? 0,
    }))
  );

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createGalleryMaterial()),
    [visibleCount]
  );

  const setTexture = useCallback(
    (index: number, imageIndex: number) => {
      const texture = textures[imageIndex];
      const material = materials[index];
      const mesh = meshRefs.current[index];
      if (!texture || !material || !mesh) return;

      texture.colorSpace = THREE.SRGBColorSpace;
      material.uniforms.map.value = texture;
      const image = (texture.image ?? {}) as { width?: number; height?: number };
      const width = typeof image.width === 'number' ? image.width : 1;
      const height = typeof image.height === 'number' && image.height > 0 ? image.height : 1;
      material.uniforms.texelSize.value.set(1 / width, 1 / height);
      const aspect = width / height;
      const base = 2.7;
      mesh.scale.set(aspect >= 1 ? base * aspect : base, aspect >= 1 ? base : base / aspect, 1);
    },
    [materials, textures]
  );

  useEffect(() => {
    planeData.current = Array.from({ length: visibleCount }, (_, index) => ({
      depth: (index * zSpacing) % depthRange,
      imageIndex: index % Math.max(normalizedImages.length, 1),
      x: spatialPositions[index]?.x ?? 0,
      y: spatialPositions[index]?.y ?? 0,
    }));
    planeData.current.forEach((plane, index) => setTexture(index, plane.imageIndex));
  }, [depthRange, normalizedImages.length, setTexture, spatialPositions, visibleCount, zSpacing]);

  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive three-dimensional gallery of Harold Madjos portfolio moments');
    if (describedBy) canvas.setAttribute('aria-describedby', describedBy);

    const interact = (amount: number) => {
      velocity.current = THREE.MathUtils.clamp(velocity.current + amount * speed, -7, 7);
      lastInteraction.current = performance.now();
    };
    const handleWheel = (event: WheelEvent) => interact(event.deltaY * 0.0035);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
        interact(-1.5);
      }
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        interact(1.5);
      }
    };
    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY.current = event.touches[0]?.clientY ?? null;
      lastInteraction.current = performance.now();
    };
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined || lastTouchY.current === null) return;
      interact((lastTouchY.current - currentY) * 0.018);
      lastTouchY.current = currentY;
    };
    const handleTouchEnd = () => {
      lastTouchY.current = null;
    };

    canvas.addEventListener('wheel', handleWheel, { passive: true });
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [describedBy, gl, speed]);

  useFrame((state, delta) => {
    const elapsedSinceInput = performance.now() - lastInteraction.current;
    if (!paused && elapsedSinceInput > 3000) velocity.current += 0.14 * delta * speed;
    velocity.current *= Math.pow(0.94, delta * 60);
    const force = velocity.current;

    planeData.current.forEach((plane, index) => {
      const mesh = meshRefs.current[index];
      const material = materials[index];
      if (!mesh || !material) return;

      let depth = plane.depth - force * delta * 6;
      let wrapped = false;
      while (depth < 0) {
        depth += depthRange;
        plane.imageIndex = (plane.imageIndex + visibleCount) % normalizedImages.length;
        wrapped = true;
      }
      while (depth >= depthRange) {
        depth -= depthRange;
        plane.imageIndex = (plane.imageIndex - visibleCount + normalizedImages.length * 10) % normalizedImages.length;
        wrapped = true;
      }
      plane.depth = depth;
      if (wrapped) setTexture(index, plane.imageIndex);

      const normalizedDepth = depth / depthRange;
      let opacity = 1;
      if (normalizedDepth < fadeSettings.fadeIn.end) opacity = mapRange(normalizedDepth, fadeSettings.fadeIn);
      if (normalizedDepth > fadeSettings.fadeOut.start) opacity = mapRange(normalizedDepth, fadeSettings.fadeOut, true);

      let blur = 0;
      if (normalizedDepth < blurSettings.blurIn.end) blur = mapRange(normalizedDepth, blurSettings.blurIn, true) * blurSettings.maxBlur;
      if (normalizedDepth > blurSettings.blurOut.start) blur = mapRange(normalizedDepth, blurSettings.blurOut) * blurSettings.maxBlur;

      material.uniforms.opacity.value = THREE.MathUtils.clamp(opacity, 0, 1);
      material.uniforms.blurAmount.value = Math.max(0, blur);
      material.uniforms.scrollForce.value = force;
      material.uniforms.time.value = state.clock.elapsedTime;
      mesh.position.set(plane.x, plane.y, -(falloff.near + depth));
    });
  });

  return (
    <>
      {planeData.current.map((plane, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            meshRefs.current[index] = mesh;
            if (mesh) setTexture(index, plane.imageIndex);
          }}
          position={[plane.x, plane.y, -(falloff.near + plane.depth)]}
          material={materials[index]}
          onPointerEnter={() => {
            materials[index].uniforms.isHovered.value = 1;
          }}
          onPointerLeave={() => {
            materials[index].uniforms.isHovered.value = 0;
          }}
        >
          <planeGeometry args={[1, 1, 20, 20]} />
        </mesh>
      ))}
    </>
  );
}

function StaticGallery({ images, loading = false }: { images: GalleryImage[]; loading?: boolean }) {
  const normalizedImages = normalizeImages(images).slice(0, 6);
  return (
    <div className={`gallery-static ${loading ? 'is-loading' : ''}`} aria-label={loading ? 'Loading gallery' : 'Gallery images'}>
      {normalizedImages.map((image, index) => (
        <div className="gallery-static-image" key={`${image.src}-${index}`}>
          <Image src={image.src} alt={image.alt ?? ''} fill sizes="(max-width: 700px) 44vw, 25vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed = 1.2,
  zSpacing = 3,
  visibleCount = 10,
  falloff = { near: 0.8, far: 14 },
  fadeSettings = defaultFade,
  blurSettings = defaultBlur,
  className = 'h-screen w-full',
  style,
  paused = false,
  describedBy,
}: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'pending' | 'webgl' | 'static'>('pending');
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setMode('static');
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setMode(context ? 'webgl' : 'static');
    } catch {
      setMode('static');
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {mode === 'webgl' ? (
        <Suspense fallback={<StaticGallery images={images} loading />}>
          <Canvas
            camera={{ position: [0, 0, 0], fov: 52 }}
            dpr={[1, 1.5]}
            frameloop={active ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <GalleryScene
              images={images}
              speed={speed}
              zSpacing={zSpacing}
              visibleCount={visibleCount}
              falloff={falloff}
              fadeSettings={fadeSettings}
              blurSettings={blurSettings}
              paused={paused}
              describedBy={describedBy}
            />
          </Canvas>
        </Suspense>
      ) : (
        <StaticGallery images={images} loading={mode === 'pending'} />
      )}
      <ul className="sr-only">
        {normalizeImages(images).map((image, index) => <li key={`${image.src}-description-${index}`}>{image.alt || `Gallery image ${index + 1}`}</li>)}
      </ul>
    </div>
  );
}
