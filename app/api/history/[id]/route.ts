import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    logger.debug('API', 'History detail requested', { id });
    
    const historyEntry = cacheManager.getHistoryById(id);
    
    if (!historyEntry) {
      return NextResponse.json(
        { 
          success: false,
          error: '历史记录不存在'
        },
        { status: 404 }
      );
    }

    logger.debug('API', 'History detail retrieved', { id, type: historyEntry.type });

    return NextResponse.json({
      success: true,
      data: historyEntry
    });
  } catch (error) {
    logger.error('API', 'History detail query failed', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '历史记录详情查询失败'
      },
      { status: 500 }
    );
  }
}