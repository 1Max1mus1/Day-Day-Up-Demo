import { NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const stats = cacheManager.getStats();
    
    logger.debug('DEV_API', 'Cache stats requested', stats);
    
    return NextResponse.json(stats);
  } catch (error) {
    logger.error('DEV_API', 'Failed to get cache stats', error);
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}