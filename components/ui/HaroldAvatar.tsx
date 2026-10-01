"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";

export interface HaroldAvatarProps {
  /** World-space point to reach toward. The caller may mutate this vector each frame. */
  target: Vector3;
  /** Movement intensity from 0 to 1; controls the gentle floating leg pose. */
  energy?: number;
  reducedMotion?: boolean;
  /** Freeze the current head and leg pose, including the animation clock. */
  paused?: boolean;
}

function createResources() {
  const geometries = {
    round: new SphereGeometry(1, 20, 14),
    sleeve: new CylinderGeometry(0.84, 1, 1, 14),
    box: new BoxGeometry(1, 1, 1),
    hair: new SphereGeometry(1, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.39),
    smile: new TubeGeometry(
      new QuadraticBezierCurve3(
        new Vector3(-0.098, -0.132, 0.251),
        new Vector3(0, -0.187, 0.285),
        new Vector3(0.098, -0.132, 0.251),
      ),
      16,
      0.01,
      5,
      false,
    ),
  };
  const materials = {
    skin: new MeshStandardMaterial({ color: "#c48d69", roughness: 0.72 }),
    skinWarm: new MeshStandardMaterial({ color: "#b67a5b", roughness: 0.76 }),
    shirt: new MeshStandardMaterial({ color: "#f4f0e5", roughness: 0.88 }),
    collar: new MeshStandardMaterial({ color: "#fffaf0", roughness: 0.83 }),
    embroidery: new MeshStandardMaterial({ color: "#cfba92", roughness: 0.8 }),
    hair: new MeshStandardMaterial({ color: "#171b23", roughness: 0.76 }),
    hairSheen: new MeshStandardMaterial({ color: "#272b33", roughness: 0.68 }),
    trousers: new MeshStandardMaterial({ color: "#30343c", roughness: 0.91 }),
    shoes: new MeshStandardMaterial({ color: "#181b22", roughness: 0.4 }),
    eyeWhite: new MeshStandardMaterial({ color: "#f7f3e9", roughness: 0.45 }),
    iris: new MeshStandardMaterial({ color: "#392920", roughness: 0.45 }),
    pupil: new MeshStandardMaterial({ color: "#111319", roughness: 0.34 }),
    mouth: new MeshStandardMaterial({ color: "#794a3e", roughness: 0.85 }),
  };
  return { geometries, materials };
}

type Resources = ReturnType<typeof createResources>;

/** Map a shared unit cylinder's local Y axis between two joint positions. */
function placeSegment(mesh: Mesh, start: Vector3, end: Vector3, radius: number, scratch: Vector3) {
  scratch.subVectors(end, start);
  const length = scratch.length();
  mesh.position.copy(start).addScaledVector(scratch, 0.5);
  mesh.scale.set(radius, length, radius);
  mesh.quaternion.setFromUnitVectors(UP, scratch.divideScalar(Math.max(length, 0.0001)));
}

const UP = new Vector3(0, 1, 0);
const UPPER_ARM = 0.385;
const FOREARM = 0.37;

function ReachingArm({
  side,
  target,
  avatar,
  resources,
}: {
  side: -1 | 1;
  target: Vector3;
  avatar: RefObject<Group | null>;
  resources: Resources;
}) {
  const upper = useRef<Mesh>(null);
  const lower = useRef<Mesh>(null);
  const elbowMesh = useRef<Mesh>(null);
  const hand = useRef<Group>(null);
  const { geometries: g, materials: m } = resources;
  const vectors = useRef({
    shoulder: new Vector3(side * 0.35, 0.355, 0.015),
    aim: new Vector3(),
    direction: new Vector3(),
    bend: new Vector3(),
    elbow: new Vector3(),
    wrist: new Vector3(),
    scratch: new Vector3(),
  });

  useFrame(() => {
    if (!avatar.current || !upper.current || !lower.current || !elbowMesh.current || !hand.current) return;
    const { shoulder, aim, direction, bend, elbow, wrist, scratch } = vectors.current;
    avatar.current.updateWorldMatrix(true, false);
    avatar.current.worldToLocal(aim.copy(target));
    // Spread the hands slightly so both arms remain readable as they reach.
    aim.x += side * 0.12;
    aim.z += 0.12;
    direction.subVectors(aim, shoulder);
    const distance = MathUtils.clamp(direction.length(), 0.22, UPPER_ARM + FOREARM - 0.016);
    if (direction.lengthSq() < 0.0001) direction.set(side, 0.1, 0.5);
    direction.normalize();
    // A front-facing bend pole keeps sleeves and hands clear of the shirt.
    bend.set(side * 0.35, -0.7, 1.1).addScaledVector(direction, -direction.dot(scratch.set(side * 0.35, -0.7, 1.1)));
    if (bend.lengthSq() < 0.001) bend.set(0, 0, 1).addScaledVector(direction, -direction.z);
    bend.normalize();
    const along = (UPPER_ARM * UPPER_ARM - FOREARM * FOREARM + distance * distance) / (2 * distance);
    const outward = Math.sqrt(Math.max(0, UPPER_ARM * UPPER_ARM - along * along));
    elbow.copy(shoulder).addScaledVector(direction, along).addScaledVector(bend, outward);
    wrist.copy(shoulder).addScaledVector(direction, distance);
    placeSegment(upper.current, shoulder, elbow, 0.115, scratch);
    placeSegment(lower.current, elbow, wrist, 0.093, scratch);
    elbowMesh.current.position.copy(elbow);
    hand.current.position.copy(wrist);
    hand.current.quaternion.copy(lower.current.quaternion);
  }, -1);

  return (
    <group>
      <mesh geometry={g.round} material={m.shirt} position={[side * 0.35, 0.355, 0.015]} scale={[0.13, 0.14, 0.13]} />
      <mesh ref={upper} geometry={g.sleeve} material={m.shirt} />
      <mesh ref={elbowMesh} geometry={g.round} material={m.shirt} scale={[0.1, 0.1, 0.1]} />
      <mesh ref={lower} geometry={g.sleeve} material={m.shirt} />
      <group ref={hand}>
        <mesh geometry={g.sleeve} material={m.collar} scale={[0.092, 0.074, 0.092]} position={[0, -0.02, 0]} />
        <mesh name={side === -1 ? "harold-left-palm" : "harold-right-palm"} geometry={g.round} material={m.skin} scale={[0.071, 0.093, 0.046]} position={[0, 0.067, 0]} />
        {[-1, 0, 1].map((finger) => (
          <mesh key={finger} geometry={g.round} material={m.skin} position={[finger * 0.036, 0.144 - Math.abs(finger) * 0.008, 0.004]} scale={[0.022, 0.052, 0.024]} rotation={[0, 0, -finger * 0.09]} />
        ))}
        <mesh geometry={g.round} material={m.skin} position={[side * 0.071, 0.074, 0.025]} scale={[0.031, 0.055, 0.03]} rotation={[0.25, 0, -side * 0.5]} />
      </group>
    </group>
  );
}

/**
 * A procedural, portrait-inspired Harold: ivory barong, dark trousers, side-parted hair.
 * Render inside an R3F Canvas with scene lighting. Faces +Z, Y is up, and spans
 * roughly -1.35 to +1.33 in Y. Apply position/rotation/scale on a parent group.
 * `target` is WORLD space, including when the avatar's parent is transformed.
 * Palms are named `harold-left-palm` and `harold-right-palm` for world-space effects.
 * Geometries and materials are shared throughout this instance and disposed on unmount.
 */
export default function HaroldAvatar({ target, energy = 0.35, reducedMotion = false, paused = false }: HaroldAvatarProps) {
  const avatar = useRef<Group>(null);
  const head = useRef<Group>(null);
  const resources = useMemo(() => createResources(), []);
  const { geometries: g, materials: m } = resources;
  const leftHip = useRef<Group>(null);
  const rightHip = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const localTarget = useRef(new Vector3());
  const pose = useRef({ time: 0, initialized: false });

  useEffect(() => () => {
    Object.values(resources.geometries).forEach((geometry) => geometry.dispose());
    Object.values(resources.materials).forEach((material) => material.dispose());
  }, [resources]);

  useFrame((_, delta) => {
    if (!avatar.current || !head.current) return;
    if (paused && pose.current.initialized) return;
    const dt = Math.min(delta, 0.05);
    if (!paused && !reducedMotion) pose.current.time += dt;
    const movement = reducedMotion ? 0 : MathUtils.clamp(energy, 0, 1);
    avatar.current.updateWorldMatrix(true, false);
    avatar.current.worldToLocal(localTarget.current.copy(target));
    const look = MathUtils.clamp(Math.atan2(localTarget.current.x, Math.max(1, localTarget.current.z)), -0.34, 0.34);
    head.current.rotation.y = !pose.current.initialized || reducedMotion
      ? look
      : MathUtils.damp(head.current.rotation.y, look, 5, dt);
    head.current.rotation.z = reducedMotion ? 0 : Math.sin(pose.current.time * 0.9) * 0.016;
    for (const side of [-1, 1]) {
      const hip = side === -1 ? leftHip.current : rightHip.current;
      const knee = side === -1 ? leftKnee.current : rightKnee.current;
      if (!hip || !knee) continue;
      const wave = Math.sin(pose.current.time * 2.1 + (side === -1 ? Math.PI : 0));
      hip.rotation.x = wave * 0.2 * movement;
      hip.rotation.z = side * (0.035 + movement * 0.025);
      knee.rotation.x = reducedMotion ? 0.04 : 0.09 + (wave + 1) * 0.09 * movement;
    }
    pose.current.initialized = true;
  }, -2);

  return (
    <group ref={avatar} name="Harold-avatar" dispose={null}>
      <mesh geometry={g.round} material={m.trousers} position={[0, -0.405, -0.005]} scale={[0.31, 0.17, 0.19]} />
      {([-1, 1] as const).map((side) => (
        <group key={side} ref={side === -1 ? leftHip : rightHip} position={[side * 0.155, -0.39, 0]}>
          <mesh geometry={g.sleeve} material={m.trousers} position={[0, -0.205, 0]} scale={[0.12, 0.41, 0.123]} />
          <group ref={side === -1 ? leftKnee : rightKnee} position={[0, -0.41, 0]}>
            <mesh geometry={g.round} material={m.trousers} scale={[0.107, 0.11, 0.11]} />
            <mesh geometry={g.sleeve} material={m.trousers} position={[0, -0.19, 0]} scale={[0.103, 0.38, 0.107]} />
            <mesh geometry={g.round} material={m.shoes} position={[0, -0.445, 0.065]} scale={[0.114, 0.094, 0.194]} />
            <mesh geometry={g.box} material={m.shoes} position={[0, -0.488, 0.065]} scale={[0.205, 0.043, 0.29]} />
          </group>
        </group>
      ))}

      <mesh geometry={g.sleeve} material={m.shirt} position={[0, 0.025, 0]} scale={[0.36, 0.85, 0.215]} />
      <mesh geometry={g.round} material={m.shirt} position={[0, 0.345, 0]} scale={[0.355, 0.16, 0.212]} />
      <mesh geometry={g.sleeve} material={m.skin} position={[0, 0.51, 0]} scale={[0.125, 0.21, 0.115]} />
      <mesh geometry={g.box} material={m.collar} position={[0, 0.005, 0.212]} scale={[0.05, 0.8, 0.012]} />
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh geometry={g.box} material={m.collar} position={[side * 0.082, 0.435, 0.13]} rotation={[0.18, side * -0.15, side * 0.48]} scale={[0.11, 0.18, 0.045]} />
          <mesh geometry={g.box} material={m.embroidery} position={[side * 0.1, 0.025, 0.2]} scale={[0.01, 0.73, 0.008]} />
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <group key={row} position={[side * 0.12, 0.31 - row * 0.12, 0.202]}>
              <mesh geometry={g.round} material={m.embroidery} rotation={[0, 0, side * 0.58]} scale={[0.012, 0.043, 0.006]} position={[side * 0.01, 0, 0]} />
              <mesh geometry={g.round} material={m.embroidery} rotation={[0, 0, -side * 0.58]} scale={[0.011, 0.036, 0.006]} position={[side * 0.04, -0.035, -0.004]} />
            </group>
          ))}
        </group>
      ))}
      {[0.32, 0.14, -0.04, -0.22].map((y) => (
        <mesh key={y} geometry={g.round} material={m.collar} position={[0, y, 0.228]} scale={[0.023, 0.023, 0.014]} />
      ))}

      <group ref={head} position={[0, 0.89, 0]}>
        <mesh geometry={g.round} material={m.skin} scale={[0.298, 0.365, 0.273]} />
        <mesh geometry={g.round} material={m.skin} position={[0, -0.135, 0.056]} scale={[0.236, 0.213, 0.211]} />
        {([-1, 1] as const).map((side) => (
          <group key={side}>
            <mesh geometry={g.round} material={m.skin} position={[side * 0.292, -0.005, -0.005]} scale={[0.055, 0.085, 0.05]} />
            <mesh geometry={g.round} material={m.skinWarm} position={[side * 0.309, -0.005, 0.028]} scale={[0.022, 0.044, 0.018]} />
            <mesh geometry={g.round} material={m.eyeWhite} position={[side * 0.11, 0.052, 0.252]} scale={[0.065, 0.031, 0.025]} />
            <mesh geometry={g.round} material={m.iris} position={[side * 0.11, 0.052, 0.272]} scale={[0.023, 0.025, 0.012]} />
            <mesh geometry={g.round} material={m.pupil} position={[side * 0.11, 0.053, 0.281]} scale={[0.012, 0.017, 0.006]} />
            <mesh geometry={g.round} material={m.eyeWhite} position={[side * 0.11 - 0.006, 0.062, 0.287]} scale={[0.005, 0.006, 0.004]} />
            <mesh geometry={g.round} material={m.hair} position={[side * 0.113, 0.109, 0.252]} rotation={[0, 0, side * -0.1]} scale={[0.072, 0.014, 0.021]} />
            <mesh geometry={g.round} material={m.hair} position={[side * 0.275, 0.132, -0.014]} scale={[0.033, 0.128, 0.084]} />
          </group>
        ))}
        <mesh geometry={g.round} material={m.skin} position={[0, -0.014, 0.268]} scale={[0.043, 0.073, 0.062]} />
        <mesh geometry={g.round} material={m.skinWarm} position={[0, -0.069, 0.285]} scale={[0.043, 0.018, 0.023]} />
        <mesh geometry={g.smile} material={m.mouth} />
        <mesh geometry={g.round} material={m.eyeWhite} position={[0, -0.141, 0.264]} scale={[0.068, 0.013, 0.014]} />
        <mesh geometry={g.round} material={m.hair} position={[0, 0.07, -0.155]} scale={[0.293, 0.303, 0.15]} />
        <mesh geometry={g.hair} material={m.hair} position={[0, 0.068, -0.016]} scale={[0.313, 0.345, 0.287]} />
        <mesh geometry={g.round} material={m.hair} position={[-0.07, 0.276, 0.114]} rotation={[0.12, 0.12, 0.19]} scale={[0.234, 0.085, 0.137]} />
        <mesh geometry={g.round} material={m.hairSheen} position={[-0.08, 0.313, 0.104]} rotation={[0.12, 0.2, 0.2]} scale={[0.204, 0.02, 0.097]} />
        <mesh geometry={g.round} material={m.hair} position={[0.172, 0.273, 0.075]} rotation={[0, 0, -0.25]} scale={[0.108, 0.063, 0.155]} />
      </group>

      <ReachingArm side={-1} target={target} avatar={avatar} resources={resources} />
      <ReachingArm side={1} target={target} avatar={avatar} resources={resources} />
    </group>
  );
}
