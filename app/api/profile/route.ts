import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    // For now, return the default structure
    const defaultProfile = {
      personalInfo: {
        fullName: 'Your Name',
        title: 'BS Computer Science | GHL Expert',
        bio: 'Passionate about automation and digital solutions.',
        email: 'your.email@example.com',
        phone: '+1 (555) 000-0000',
        location: 'Your Location',
      },
      skills: [],
      experiences: [],
      projects: [],
    };

    return NextResponse.json(defaultProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // In a real application, save to database
    // For now, just return success
    return NextResponse.json(
      { message: 'Profile updated successfully', data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
