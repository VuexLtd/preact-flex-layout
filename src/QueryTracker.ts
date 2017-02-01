import { MediaTracker } from './MediaTracker';

export const mediaQueries = {
    xs: '(max-width: 599px)',
    'gt-xs': '(min-width: 600px)',
    sm: '(min-width: 600px) and (max-width: 959px)',
    'gt-sm': '(min-width: 960px)',
    md: '(min-width: 960px) and (max-width: 1279px)' ,
    'gt-md': '(min-width: 1280px)',
    lg: '(min-width: 1280px) and (max-width: 1919px)',
    'gt-lg': '(min-width: 1920px)',
    xl: '(min-width: 1920px)',
};

export class QueryTracker {
    private mediaTrackers = new Map<string, MediaTracker>();
    private trackingQueries = new Set<string>();
    private preFlushQueries = new Set<string>();

    constructor(private cb: () => void) {
    }

    public track(query: string): boolean {
        this.preFlushQueries.add(query);

        let mediaTracker = this.mediaTrackers.get(query);
        // If we are already tracking this query, don't add a new listener;
        if (mediaTracker && this.trackingQueries.has(query)) {
            return mediaTracker.mediaQuery.matches;
        }

        if (!mediaTracker) {
            mediaTracker = new MediaTracker(mediaQueries[query]);
            this.mediaTrackers.set(query, mediaTracker);
        }

        mediaTracker.addListener(() => this.cb());

        this.trackingQueries.add(query);

        return mediaTracker.mediaQuery.matches;
    }

    public untrack(query: string) {
        this.mediaTrackers.get(query).removeAllListeners();
        this.trackingQueries.delete(query);
    }

    public flush() {
        Array.from(this.trackingQueries)
            .filter(query => !this.preFlushQueries.has(query))
            .forEach(query => this.untrack(query))

        this.preFlushQueries.clear();
    }

    public clear() {
        this.mediaTrackers.forEach(tracker => tracker.removeAllListeners());
        this.trackingQueries.clear();
    }
}
