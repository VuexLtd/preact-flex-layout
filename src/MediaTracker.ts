export class MediaTracker {
    public mediaQuery: MediaQueryList;
    private listeners = new Set<MediaQueryListListener>();

    constructor(query: string) {
        this.mediaQuery = window.matchMedia(query);
    }

    addListener(listener: MediaQueryListListener) {
        this.mediaQuery.addListener(listener);
        this.listeners.add(listener);
    }

    removeListener(listener: MediaQueryListListener) {
        this.mediaQuery.removeListener(listener);
        this.listeners.delete(listener);
    }

    removeAllListeners() {
        this.listeners.forEach(listener => this.mediaQuery.removeListener(listener));
        this.listeners.clear();
    }
}
