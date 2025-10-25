import { NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    cacheManager.clear();
    logger.info('DEV_API', 'Cache cleared manually');
    
    return NextResponse.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    logger.error('DEV_API', 'Failed to clear cache', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}