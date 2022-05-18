import preload from "../preload";

declare global {
    interface Window {
        api: typeof preload;
    }
}
