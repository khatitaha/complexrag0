import { LRUCache } from 'lru-cache'
import { NextRequest, NextResponse } from 'next/server'

type RateLimitOptions = {
    uniqueTokenPerInterval?: number
    interval?: number
}

export function rateLimit(options?: RateLimitOptions) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500, // Max 500 unique tokens per interval
        ttl: options?.interval || 60000, // 1 minute
    })

    return {
        check: (req: NextRequest, limit: number, token = req.ip ?? '127.0.0.1') => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0]
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount)
            }
            tokenCount[0] += 1

            const currentUsage = tokenCount[0]
            const isRateLimited = currentUsage >= limit
            
            return new Promise<void>((resolve, reject) => {
                if (isRateLimited) {
                    reject()
                } else {
                    resolve()
                }
            })
        },
    }
}
