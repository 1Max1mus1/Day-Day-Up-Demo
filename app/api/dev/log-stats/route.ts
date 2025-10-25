import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const stats = logger.getStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    logger.error('DEV_API', 'Failed to get log stats', error);
    return NextResponse.json(
      { error: 'Failed to get log stats' },
      { status: 500 }
    );
  }
}