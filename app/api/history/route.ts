import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') as 'concept-analysis' | 'learning-path' | 'test-generation' | null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search') || undefined;
    const fromCache = searchParams.get('fromCache') ? searchParams.get('fromCache') === 'true' : undefined;
    
    logger.info('API', 'History query request', {
      type,
      limit,
      search: search ? `"${search}"` : undefined,
      fromCache
    });

    const history = cacheManager.getHistory({
      type: type || undefined,
      limit,
      search,
      fromCache
    });

    logger.debug('API', 'History query result', {
      totalResults: history.length,
      filters: { type, limit, search, fromCache }
    });

    return NextResponse.json({
      success: true,
      data: history,
      total: history.length
    });
  } catch (error) {
    logger.error('API', 'History query failed', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '历史记录查询失败'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 删除特定历史记录（这里需要扩展cacheManager）
      logger.info('API', 'Delete specific history entry', { id });
      return NextResponse.json({
        success: false,
        error: '删除单个历史记录功能暂未实现'
      }, { status: 501 });
    } else {
      // 清空所有历史记录
      cacheManager.clearHistory();
      logger.info('API', 'All history cleared');
      
      return NextResponse.json({
        success: true,
        message: '历史记录已清空'
      });
    }
  } catch (error) {
    logger.error('API', 'History deletion failed', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '删除历史记录失败'
      },
      { status: 500 }
    );
  }
}