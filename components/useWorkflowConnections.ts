'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from 'react';
import { connectionError, type WorkflowEdge, type WorkflowNode } from '@/lib/automationPlayground';

type Point = { x: number; y: number };
type WirePreview = { source: string; point: Point; target: string | null; error: string | null };
type WireDrag = {
  source: string; pointer: number; element: HTMLButtonElement; touch: boolean;
  start: Point; client: Point; moved: boolean; frame: number;
};
type Options = {
  canvas: RefObject<HTMLDivElement | null>; viewport: RefObject<HTMLDivElement | null>;
  nodes: WorkflowNode[]; edges: WorkflowEdge[]; zoom: number; disabled: boolean;
  onConnect: (source: string, target: string) => void; onNotice: (message: string) => void;
};

function releaseDrag(gesture: WireDrag | null) {
  if (!gesture) return;
  cancelAnimationFrame(gesture.frame);
  if (gesture.element.hasPointerCapture(gesture.pointer)) gesture.element.releasePointerCapture(gesture.pointer);
}

export function useWorkflowConnections({ canvas, viewport, nodes, edges, zoom, disabled, onConnect, onNotice }: Options) {
  const [source, setSource] = useState<string | null>(null);
  const [preview, setPreview] = useState<WirePreview | null>(null);
  const drag = useRef<WireDrag | null>(null);
  const suppressClick = useRef(false);

  const clear = useCallback(() => {
    const gesture = drag.current;
    drag.current = null;
    if (gesture) suppressClick.current = true;
    releaseDrag(gesture);
    setPreview(null);
    setSource(null);
  }, []);

  const cancel = useCallback(() => { clear(); onNotice('Connection cancelled.'); }, [clear, onNotice]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (drag.current || source)) { event.preventDefault(); cancel(); }
    };
    const blur = () => { if (drag.current) cancel(); };
    const hidden = () => { if (document.hidden) blur(); };
    window.addEventListener('keydown', escape);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [source, cancel]);

  useEffect(() => () => { const gesture = drag.current; drag.current = null; releaseDrag(gesture); }, []);

  function updatePreview(gesture: WireDrag): WirePreview | null {
    const surface = canvas.current, view = viewport.current;
    if (!surface || !view) return null;
    const bounds = surface.getBoundingClientRect(), visible = view.getBoundingClientRect();
    const local = (point: Point): Point => ({ x: (point.x - bounds.left) / zoom, y: (point.y - bounds.top) / zoom });
    const { x, y } = gesture.client;
    let target: HTMLButtonElement | null = null;
    let nearest = gesture.touch ? 30 : 22;
    // Pointer capture keeps events on the output; hit-test the visible inputs independently.
    if (x >= visible.left && x <= visible.right && y >= visible.top && y <= visible.bottom && view.contains(document.elementFromPoint(x, y))) {
      for (const port of surface.querySelectorAll<HTMLButtonElement>('[data-input-node]')) {
        const rect = port.getBoundingClientRect();
        const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
        if (distance < nearest) { nearest = distance; target = port; }
      }
    }
    const id = target?.dataset.inputNode ?? null;
    const rect = target?.getBoundingClientRect();
    const next = {
      source: gesture.source,
      point: local(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : gesture.client),
      target: id,
      error: id ? connectionError(nodes, edges, gesture.source, id) : null,
    };
    setPreview(next);
    return next;
  }

  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (disabled || event.button !== 0 || !event.isPrimary || drag.current) return;
    event.preventDefault();
    suppressClick.current = false;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    const gesture: WireDrag = {
      source: id, pointer: event.pointerId, element: event.currentTarget, touch: event.pointerType === 'touch',
      start: { x: event.clientX, y: event.clientY }, client: { x: event.clientX, y: event.clientY }, moved: false, frame: 0,
    };
    drag.current = gesture;
    updatePreview(gesture);
    let previousTime = 0;
    const pan = (time: number) => {
      if (drag.current !== gesture) return;
      const view = viewport.current;
      const elapsed = previousTime ? Math.min(32, time - previousTime) : 16;
      previousTime = time;
      if (view && gesture.moved) {
        const rect = view.getBoundingClientRect(), { x, y } = gesture.client;
        const nearCanvas = x >= rect.left - 30 && x <= rect.right + 30 && y >= rect.top - 30 && y <= rect.bottom + 30;
        if (nearCanvas) {
          const speed = (position: number, min: number, max: number) => position < min + 40 ? -Math.min(1, (min + 40 - position) / 40) : position > max - 40 ? Math.min(1, (position - max + 40) / 40) : 0;
          const left = view.scrollLeft, top = view.scrollTop;
          view.scrollLeft += speed(x, rect.left, rect.right) * elapsed * .65;
          view.scrollTop += speed(y, rect.top, rect.bottom) * elapsed * .65;
          if (left !== view.scrollLeft || top !== view.scrollTop) updatePreview(gesture);
        }
      }
      gesture.frame = requestAnimationFrame(pan);
    };
    gesture.frame = requestAnimationFrame(pan);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    event.preventDefault();
    gesture.client = { x: event.clientX, y: event.clientY };
    gesture.moved ||= Math.hypot(event.clientX - gesture.start.x, event.clientY - gesture.start.y) > 4;
    if (gesture.moved) setSource(gesture.source);
    updatePreview(gesture);
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    gesture.client = { x: event.clientX, y: event.clientY };
    gesture.moved ||= Math.hypot(event.clientX - gesture.start.x, event.clientY - gesture.start.y) > 4;
    const final = updatePreview(gesture);
    drag.current = null;
    releaseDrag(gesture);
    setPreview(null);
    // A short press remains a normal click, including keyboard and assistive controls.
    if (!gesture.moved) return;
    suppressClick.current = true;
    setSource(null);
    if (final?.target) onConnect(gesture.source, final.target);
    else onNotice('Connection cancelled. Drop the wire onto an input port to connect steps.');
  }

  function cancelPointer(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointer === event.pointerId) cancel();
  }

  function selectOutput(event: MouseEvent<HTMLButtonElement>, node: WorkflowNode) {
    if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
    if (disabled) return;
    setSource(source === node.id ? null : node.id);
    onNotice(source === node.id ? 'Connection cancelled.' : `Output selected: ${node.label}. Drag to an input, or click an input port. Press Escape to cancel.`);
  }

  function selectInput(id: string) {
    if (!disabled && source) onConnect(source, id);
    else if (!disabled) onNotice('Drag from an output port to this input, or click an output first.');
  }

  function refresh() { if (drag.current) updatePreview(drag.current); }

  return { source: preview?.source ?? source, preview, clear, cancel, start, move, finish, cancelPointer, selectOutput, selectInput, refresh };
}
