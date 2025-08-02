import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db/mongodb';
import User from '@/models/user';
import { Resend } from 'resend';
import Email from '@/components/email/email';

const resend = new Resend(
  process.env.RESEND_API_KEY || 'development-placeholder-no-email-sent'
);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(0, Number(searchParams.get('page')) || 0);
    const PER_PAGE = 50;
    const name = searchParams.get('name') || '';
    const region = searchParams.get('region') || '';

    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (region && region !== 'all') {
      query.timezone = { $regex: `^${region}`, $options: 'i' };
    }

    const [users, docsCount] = await Promise.all([
      User.find(query)
        .limit(PER_PAGE)
        .skip(page * PER_PAGE)
        .sort({ createdAt: -1 }),
      User.find(query).countDocuments()
    ]);

    return NextResponse.json({
      events: users,
      page: page,
      pages: Math.ceil(docsCount / PER_PAGE) - 1 > 0 ? Math.ceil(docsCount / PER_PAGE) - 1 : 0,
      docs: docsCount,
    });
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, image } = await request.json();

    if (!email || !name || !image) {
      return NextResponse.json({ error: 'Incomplete fields' }, { status: 400 });
    }

    await connectDB();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, image });
      await resend.emails.send({
        from: 'NexusTimer <onboarding@nexustimer.com>',
        to: [email],
        subject: 'Welcome to NexusTimer – Let\'s Get Cubing!',
        react: Email({ name }) as React.ReactElement,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
