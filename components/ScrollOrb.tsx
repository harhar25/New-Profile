'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group } from 'three';

interface MotionTarget {
  scrollProgress: number;
  pointerX: number;
  pointerY: number;
}

function OrbScene() {
  const orb = useRef<Group>(null);
  const target = useRef<MotionTarget>({
    scrollProgress: 0,
    pointerX: 0,
    pointerY: 0,
  });
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      target.current.scrollProgress = motionPreference.matches || scrollableHeight <= 0
        ? 0
        : Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
      invalidate();
    };
    const updatePointer = (event: PointerEvent) => {
      if (motionPreference.matches) return;
      target.current.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      target.current.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
      invalidate();
    };
    const clearPointer = () => {
      target.current.pointerX = 0;
      target.current.pointerY = 0;
      invalidate();
    };
    const updateMotionPreference = () => {
      if (motionPreference.matches) clearPointer();
      updateScroll();
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('blur', clearPointer);
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('blur', clearPointer);
      motionPreference.removeEventListener('change', updateMotionPreference);
    };
  }, [invalidate]);

  useFrame(({ viewport }, delta) => {
    const group = orb.current;
    if (!group) return;

    const { scrollProgress, pointerX, pointerY } = target.current;
    const route = scrollProgress * Math.PI * 4;
    const targetX = Math.sin(route) * viewport.width * 0.34 + pointerX * viewport.width * 0.12;
    const targetY = Math.cos(route * 0.56) * viewport.height * 0.32 - pointerY * viewport.height * 0.12;
    const targetRotationX = pointerY * 0.28;
    const targetRotationY = pointerX * 0.3 + scrollProgress * Math.PI * 2;
    const targetRotationZ = scrollProgress * Math.PI * 1.2;
    const easing = 1 - Math.exp(-5 * delta);

    group.position.x += (targetX - group.position.x) * easing;
    group.position.y += (targetY - group.position.y) * easing;
    group.rotation.x += (targetRotationX - group.rotation.x) * easing;
    group.rotation.y += (targetRotationY - group.rotation.y) * easing;
    group.rotation.z += (targetRotationZ - group.rotation.z) * easing;

    if (
      Math.abs(targetX - group.position.x) > 0.001 ||
      Math.abs(targetY - group.position.y) > 0.001 ||
      Math.abs(targetRotationX - group.rotation.x) > 0.001 ||
      Math.abs(targetRotationY - group.rotation.y) > 0.001 ||
      Math.abs(targetRotationZ - group.rotation.z) > 0.001
    ) {
      invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} />
      <pointLight position={[-3, -2, 3]} intensity={18} color="#bda17f" distance={8} />
      <group ref={orb} scale={0.82}>
        <mesh>
          <sphereGeometry args={[0.68, 48, 48]} />
          <meshPhysicalMaterial
            color="#c4a27a"
            metalness={0.58}
            roughness={0.2}
            clearcoat={0.9}
            clearcoatRoughness={0.12}
          />
        </mesh>
        <mesh rotation={[0.8, 0.4, 0.5]}>
          <torusGeometry args={[0.91, 0.014, 8, 96]} />
          <meshStandardMaterial color="#f0dfc5" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh rotation={[-0.5, 0.7, -0.65]}>
          <torusGeometry args={[1.08, 0.009, 8, 96]} />
          <meshStandardMaterial
            color="#bda17f"
            metalness={0.55}
            roughness={0.3}
            transparent
            opacity={0.75}
          />
        </mesh>
      </group>
    </>
  );
}

export default function ScrollOrb() {
  return (
    <div className="scroll-orb" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100 }}
        dpr={1}
        frameloop="demand"
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <OrbScene />
      </Canvas>
    </div>
  );
}
