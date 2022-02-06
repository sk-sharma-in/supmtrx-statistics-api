import CacheManager from 'cache-manager';

/**
 * Local in-memory storage is utilised to just retain the registerd token.
 */
export const storage = CacheManager.caching({
   store: 'memory',
    ttl: 3600
});

