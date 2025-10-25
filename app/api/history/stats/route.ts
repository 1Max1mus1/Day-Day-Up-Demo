import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.debug('API', 'History stats requested');
    
    const stats = cacheManager.getHistoryStats();
    
    logger.debug('API', 'History stats retrieved', stats);

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('API', 'History stats query failed', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '历史记录统计查询失败'
      },
      { status: 500 }
    );
  }
}