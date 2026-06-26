import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_ORG_ID;
  const vercelToken = process.env.VERCEL_TOKEN;

  if (!projectId) {
    return NextResponse.json(
      { error: 'VERCEL_PROJECT_ID environment variable is not defined.' },
      { status: 400 }
    );
  }

  if (!vercelToken) {
    return NextResponse.json(
      { error: 'VERCEL_TOKEN environment variable is not defined.' },
      { status: 400 }
    );
  }

  const url = new URL(`https://api.vercel.com/v1/projects/${projectId}/unpause`);
  if (teamId) {
    url.searchParams.append('teamId', teamId);
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vercelToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: 'Failed to unpause project via Vercel API',
          details: errorData,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Project unpaused successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
