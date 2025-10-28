import { NextResponse } from 'next/server';
import { dummyData } from '@/lib/dummy-data';

export async function POST() {
  try {
    // Dummy seeding - data is already initialized in dummyData
    const stats = await dummyData.getStats();

    return NextResponse.json({
      message: 'Dummy data seeded successfully',
      stats,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
