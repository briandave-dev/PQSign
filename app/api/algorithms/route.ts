import { NextRequest, NextResponse } from 'next/server';
import algorithms from '@/data/algorithms.json';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(algorithms);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
