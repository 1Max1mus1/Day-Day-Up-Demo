import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter = {
      level: searchParams.get('level') || undefined,
      category: searchParams.get('category') || undefined,
      limit: parseInt(searchParams.get('limit') || '100'),
      since: searchParams.get('since') ? parseInt(searchParams.get('since')!) : undefined
    };

    // 清理undefined值
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof typeof filter] === undefined) {
        delete filter[key as keyof typeof filter];
      }
    });

    const logs = logger.getLogs(filter);
    
    return NextResponse.json(logs);
  } catch (error) {
    logger.error('DEV_API', 'Failed to get logs', error);
    return NextResponse.json(
      { error: 'Failed to get logs' },
      { status: 500 }
    );
  }
}