'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react';
import type { WorkflowNode } from '@/lib/automationPlayground';

type Point = { x: number; y: number };
type Gesture = {
  pointer: number; element: HTMLElement; start: Point; moved: boolean;
} & ({ kind: 'node'; id: string; offset: Point } | { kind: 'pan'; scroll: Point });
type Options = {
  canvas: RefObject<HTMLDivElement | null>; viewport: RefObject<HTMLDivElement | null>;
  zoom: number; disabled: boolean; maxX: number; maxY: number;
  onMove: (id: string, x: number, y: number) => void;
};

export function useWorkflowCanvas({ canvas, viewport, zoom, disabled, maxX, maxY, onMove }: Options) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef<string | null>(null);

  const clear = useCallback(() => {
    const current = gesture.current;
    gesture.current = null;
    if (current?.kind === 'node' && current.moved) suppressClick.current = current.id;
    if (current?.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer);
    setDragging(null);
    setPanning(false);
  }, []);

  useEffect(() => {
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && gesture.current) { event.preventDefault(); clear(); }
    };
    const blur = () => { if (gesture.current) clear(); };
    const hidden = () => { if (document.hidden) blur(); };
    window.addEventListener('keydown', escape);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', hidden);
      const current = gesture.current;
      gesture.current = null;
      if (current?.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer);
    };
  }, [clear]);

  function startNode(event: PointerEvent<HTMLButtonElement>, node: WorkflowNode) {
    const surface = canvas.current;
    if (!surface || disabled || gesture.current || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = surface.getBoundingClientRect();
    suppressClick.current = null;
    gesture.current = {
      kind: 'node', id: node.id, pointer: event.pointerId, element: event.currentTarget,
      start: { x: event.clientX, y: event.clientY }, moved: false,
      offset: { x: (event.clientX - rect.left) / zoom - node.x, y: (event.clientY - rect.top) / zoom - node.y },
    };
  }

  function startPan(event: PointerEvent<HTMLDivElement>) {
    const view = viewport.current;
    if (!view || disabled || gesture.current || event.button !== 0 || !event.isPrimary) return;
    if ((event.target as Element).closest('[data-workflow-node]')) return;
    const rect = view.getBoundingClientRect();
    // Leave the browser's scrollbars available alongside drag-to-pan.
    if (event.clientX >= rect.left + view.clientWidth || event.clientY >= rect.top + view.clientHeight) return;
    event.preventDefault();
    view.focus({ preventScroll: true });
    view.setPointerCapture(event.pointerId);
    gesture.current = {
      kind: 'pan', pointer: event.pointerId, element: view, moved: false,
      start: { x: event.clientX, y: event.clientY }, scroll: { x: view.scrollLeft, y: view.scrollTop },
    };
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointer) return;
    event.preventDefault();
    const dx = event.clientX - current.start.x, dy = event.clientY - current.start.y;
    current.moved ||= Math.hypot(dx, dy) > 4;
    if (!current.moved) return;
    if (current.kind === 'pan') {
      viewport.current?.scrollTo({ left: current.scroll.x - dx, top: current.scroll.y - dy, behavior: 'instant' });
      setPanning(true);
    } else if (canvas.current) {
      const rect = canvas.current.getBoundingClientRect();
      onMove(current.id, Math.max(12, Math.min(maxX, (event.clientX - rect.left) / zoom - current.offset.x)), Math.max(12, Math.min(maxY, (event.clientY - rect.top) / zoom - current.offset.y)));
      setDragging(current.id);
    }
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointer !== event.pointerId) return;
    move(event);
    clear();
  }

  function cancelPointer(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointer === event.pointerId) clear();
  }

  function consumeClick(event: MouseEvent<HTMLButtonElement>, id: string) {
    if (event.detail !== 0 && suppressClick.current === id) {
      suppressClick.current = null;
      event.preventDefault();
      return true;
    }
    return false;
  }

  function nudge(event: KeyboardEvent<HTMLButtonElement>, node: WorkflowNode) {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!direction) return;
    event.preventDefault();
    const distance = event.shiftKey ? 30 : 10;
    onMove(node.id, Math.max(12, Math.min(maxX, node.x + direction[0] * distance)), Math.max(12, Math.min(maxY, node.y + direction[1] * distance)));
  }

  return { dragging, panning, clear, startNode, startPan, move, finish, cancelPointer, consumeClick, nudge };
}
