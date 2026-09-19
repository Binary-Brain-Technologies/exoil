/** Tiny shared store for the journey's scroll progress (0–1), read by the WebGL layer every frame. */
type Listener = (p: number) => void;

let value = 0;
const listeners = new Set<Listener>();

export const journeyProgress = {
  get: () => value,
  set(p: number) {
    value = p;
    for (const l of listeners) l(p);
  },
  subscribe(l: Listener) {
    listeners.add(l);
    l(value);
    return () => {
      listeners.delete(l);
    };
  },
};
