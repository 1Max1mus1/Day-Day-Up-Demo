import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    logger.clear();
    
    return NextResponse.json({ success: true, message: 'Logs cleared' });
  } catch (error) {
    logger.error('DEV_API', 'Failed to clear logs', error);
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    );
  }
}