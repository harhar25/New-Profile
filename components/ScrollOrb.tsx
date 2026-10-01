'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Eye, EyeOff, Pause, Play } from 'lucide-react';
import { Component, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, MathUtils, Mesh, Vector3 } from 'three';
import HaroldAvatar from '@/components/ui/HaroldAvatar';

const ZOOM = 60;
const POINTS = 40;
const mediaQuery = '(prefers-reduced-motion: reduce)';

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(mediaQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function FlightScene({ paused, reducedMotion }: { paused: boolean; reducedMotion: boolean }) {
  const orb = useRef<Group>(null);
  const avatar = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const sparks = useRef<Group>(null);
  const halo = useRef<Mesh>(null);
  const motion = useRef({ progress: 0, x: 0, y: 0, pointerActive: false });
  const flight = useRef({ progress: 0, time: 0, initialized: false, width: 0, height: 0 });
  const viewport = useThree((state) => state.viewport);
  const invalidate = useThree((state) => state.invalidate);
  const target = useMemo(() => new Vector3(), []);
  const scratch = useMemo(() => ({ start: new Vector3(), end: new Vector3(), point: new Vector3() }), []);
  const strands = useMemo(() => [0, 1].map(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(POINTS * 3), 3));
    return new Line(geometry, new LineBasicMaterial({
      color: '#e8c593', transparent: true, opacity: 0.48,
      blending: AdditiveBlending, depthWrite: false,
    }));
  }), []);

  useEffect(() => () => strands.forEach((strand) => {
    strand.geometry.dispose();
    strand.material.dispose();
  }), [strands]);

  useEffect(() => {
    const updateScroll = () => {
      const length = document.documentElement.scrollHeight - window.innerHeight;
      motion.current.progress = length > 0 ? MathUtils.clamp(window.scrollY / length, 0, 1) : 0;
    };
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || paused || reducedMotion) return;
      motion.current.x = event.clientX - window.innerWidth / 2;
      motion.current.y = window.innerHeight / 2 - event.clientY;
      motion.current.pointerActive = true;
    };
    const clearPointer = () => { motion.current.pointerActive = false; };
    const observer = new ResizeObserver(updateScroll);
    observer.observe(document.body);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('blur', clearPointer);
    document.addEventListener('pointerleave', clearPointer);
    invalidate();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('pointerleave', clearPointer);
    };
  }, [paused, reducedMotion, invalidate]);

  useFrame((_, rawDelta) => {
    if (!orb.current || !avatar.current) return;
    const state = flight.current;
    const width = viewport.width * ZOOM;
    const height = viewport.height * ZOOM;
    const resized = state.width !== width || state.height !== height;
    if (paused && state.initialized && !resized) return;
    const delta = Math.min(rawDelta, 0.05);
    const immediate = !state.initialized || reducedMotion || resized;
    const easing = immediate ? 1 : 1 - Math.exp(-4 * delta);
    if (!reducedMotion && !paused) state.time += delta;
    if (!paused || !state.initialized) {
      state.progress = MathUtils.lerp(state.progress, reducedMotion ? 0 : motion.current.progress, easing);
    }
    const progress = state.progress;
    const time = state.time;
    const mobile = width < 700;
    const heightScale = Math.min(1, height / 650);
    const personScale = (mobile ? 0.65 : 1) * heightScale;
    const orbScale = (mobile ? 0.57 : 0.9) * heightScale;

    // Mostly 300px apart, with two close passes at different depths.
    const crossing = Math.pow(Math.sin(progress * Math.PI * 2), 10);
    const separation = (mobile ? Math.min(150, width * 0.4) : 300) * (1 - crossing * 0.67);
    const angle = progress * Math.PI * 4;
    const halfX = Math.cos(angle) * separation / 2;
    const topMargin = Math.min(155, height * 0.27);
    const bottomMargin = Math.min(120, height * 0.25);
    const verticalTravel = Math.max(0, (height - topMargin - bottomMargin) / 2 - 8);
    const halfY = Math.sin(angle) * Math.min(separation / 2, verticalTravel);
    const margin = mobile ? 48 : 85;
    const availableX = Math.max(0, width / 2 - separation / 2 - margin);
    const centerX = Math.cos(progress * Math.PI * 4) * availableX * 0.91;
    const centerY = MathUtils.clamp(
      (mobile ? -0.23 : -0.18) * height + Math.sin(progress * Math.PI * 6) * height * (mobile ? 0.12 : 0.24),
      -height / 2 + Math.abs(halfY) + bottomMargin,
      height / 2 - Math.abs(halfY) - topMargin,
    );
    const float = reducedMotion ? 0 : Math.sin(time * 1.25) * (mobile ? 5 : 9);
    const orbX = centerX + halfX;
    const orbY = centerY + halfY + float;
    const distance = Math.hypot(motion.current.x - orbX, motion.current.y - orbY);
    const influence = !reducedMotion && motion.current.pointerActive ? Math.max(0, 1 - distance / 320) : 0;
    const pullX = (motion.current.x - orbX) * influence * 0.16;
    const pullY = (motion.current.y - orbY) * influence * 0.16;

    orb.current.position.lerp(scratch.point.set((orbX + pullX) / ZOOM, (orbY + pullY) / ZOOM, Math.sin(angle) * 0.9 + crossing * 0.55), easing);
    orb.current.scale.setScalar(orbScale);
    orb.current.rotation.set(reducedMotion ? 0.25 : time * 0.12 + influence * 0.2, progress * Math.PI * 5 + time * 0.16, 0.12);
    target.copy(orb.current.position);

    const avatarY = MathUtils.clamp(centerY - halfY - float * 0.75 - 15, -height / 2 + bottomMargin, height / 2 - topMargin);
    avatar.current.position.lerp(scratch.point.set((centerX - halfX - pullX * 0.18) / ZOOM, avatarY / ZOOM, -Math.sin(angle) * 0.75 - crossing * 0.55), easing);
    avatar.current.scale.setScalar(personScale);
    const direction = Math.sign(orb.current.position.x - avatar.current.position.x);
    avatar.current.rotation.y = immediate ? direction * 0.32 : MathUtils.damp(avatar.current.rotation.y, direction * 0.32, 4, delta);
    avatar.current.rotation.z = reducedMotion ? -0.05 : Math.sin(time * 0.8) * 0.04 - Math.sin(angle) * 0.09;
    avatar.current.updateWorldMatrix(true, true);

    if (ring.current) ring.current.rotation.set(time * 0.23, progress * 3 + time * 0.13, -time * 0.17);
    if (halo.current) halo.current.scale.setScalar(1 + influence * 0.15 + Math.sin(time * 2) * 0.025);

    state.initialized = true;
    state.width = width;
    state.height = height;
  }, -3);

  useFrame(() => {
    if (!avatar.current) return;
    const time = flight.current.time;
    const mobile = viewport.width * ZOOM < 700;
    strands.forEach((strand, index) => {
      const hand = avatar.current?.getObjectByName(index === 0 ? 'harold-left-palm' : 'harold-right-palm');
      if (hand) hand.getWorldPosition(scratch.start);
      else scratch.start.copy(avatar.current!.position);
      scratch.end.copy(target);
      const positions = strand.geometry.getAttribute('position') as BufferAttribute;
      for (let i = 0; i < POINTS; i++) {
        const t = i / (POINTS - 1);
        scratch.point.lerpVectors(scratch.start, scratch.end, t);
        const arc = Math.sin(t * Math.PI);
        scratch.point.y += arc * (0.16 + index * 0.13) + Math.sin(t * 10 - time * 2.4 + index) * arc * 0.045;
        scratch.point.z += arc * 0.3;
        positions.setXYZ(i, scratch.point.x, scratch.point.y, scratch.point.z);
      }
      positions.needsUpdate = true;
      strand.material.opacity = mobile ? 0.3 : 0.48;
      strand.frustumCulled = false;
      const spark = sparks.current?.children[index];
      if (spark) {
        const t = reducedMotion ? 0.65 : (time * 0.35 + index * 0.5) % 1;
        spark.position.lerpVectors(scratch.start, scratch.end, t);
        spark.position.y += Math.sin(t * Math.PI) * (0.16 + index * 0.13);
        spark.position.z += Math.sin(t * Math.PI) * 0.3;
        spark.scale.setScalar(0.7 + Math.sin(t * Math.PI) * 0.5);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 4, 7]} intensity={3.1} color="#fff3df" />
      <directionalLight position={[-4, 1, 3]} intensity={1.7} color="#c2d4ef" />
      <group ref={avatar} name="harold-flight">
        <HaroldAvatar target={target} energy={0.8} reducedMotion={reducedMotion} paused={paused} />
      </group>
      {strands.map((strand, index) => <primitive key={index} object={strand} />)}
      <group ref={sparks}>
        {[0, 1].map((index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshBasicMaterial color="#ffe9c2" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      <group ref={orb} name="controlled-orb">
        <mesh>
          <sphereGeometry args={[0.68, 40, 32]} />
          <meshPhysicalMaterial color="#c4a27a" metalness={0.58} roughness={0.23} clearcoat={0.9} clearcoatRoughness={0.12} />
        </mesh>
        <group ref={ring}>
          <mesh rotation={[0.8, 0.4, 0.5]}>
            <torusGeometry args={[0.91, 0.016, 8, 80]} />
            <meshStandardMaterial color="#f0dfc5" metalness={0.65} roughness={0.25} />
          </mesh>
          <mesh rotation={[-0.5, 0.7, -0.65]}>
            <torusGeometry args={[1.08, 0.01, 8, 80]} />
            <meshStandardMaterial color="#bda17f" metalness={0.55} roughness={0.3} transparent opacity={0.8} />
          </mesh>
        </group>
        <mesh ref={halo} rotation={[0.2, 0.4, 0]}>
          <torusGeometry args={[0.73, 0.006, 6, 80]} />
          <meshBasicMaterial color="#fff1d4" transparent opacity={0.65} />
        </mesh>
      </group>
    </>
  );
}

export default function ScrollOrb() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(mediaQuery).matches, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const stopped = paused || !pageVisible;

  return (
    <>
      {!hidden && (
        <div className="scroll-orb" aria-hidden="true">
          <SceneBoundary>
            <Canvas
              orthographic
              camera={{ position: [0, 0, 20], zoom: ZOOM, near: 0.1, far: 100 }}
              dpr={[1, 1.5]}
              frameloop={stopped || reducedMotion ? 'demand' : 'always'}
              gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
              fallback={<span />}
            >
              <FlightScene paused={stopped} reducedMotion={reducedMotion} />
            </Canvas>
          </SceneBoundary>
        </div>
      )}
      <div className="flight-controls" role="group" aria-label="Floating avatar controls">
        {!hidden && !reducedMotion && (
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume floating avatar' : 'Pause floating avatar'} aria-pressed={paused}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        )}
        <button type="button" onClick={() => setHidden((value) => !value)} aria-label={hidden ? 'Show floating avatar' : 'Hide floating avatar'} aria-pressed={hidden}>
          {hidden ? <Eye size={13} /> : <EyeOff size={13} />}
          <span>{hidden ? 'Show 3D' : 'Hide 3D'}</span>
        </button>
      </div>
    </>
  );
}
