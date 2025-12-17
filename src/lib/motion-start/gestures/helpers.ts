export function isPointerEvent(event: unknown): event is PointerEvent {
  return typeof window !== "undefined" && typeof PointerEvent !== "undefined" && event instanceof PointerEvent;
}

export function isTouchEvent(event: unknown): event is TouchEvent {
  return typeof window !== "undefined" && typeof TouchEvent !== "undefined" && event instanceof TouchEvent;
}

export function isMouseButton(event: unknown): boolean {
  // MouseEvent: 0=left,1=middle,2=right
  if (typeof window !== "undefined" && typeof MouseEvent !== "undefined" && event instanceof MouseEvent) {
    return event.button >= 0 && event.button <= 2;
  }
  return false;
}
