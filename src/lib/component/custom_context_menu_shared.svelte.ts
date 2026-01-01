import { writable } from "svelte/store";

interface targetObject {
  target: HTMLElement | null
}

export const contextMenuObject = writable<targetObject>({
  target: null
});
