import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db/mongodb';
import User from '@/models/user';
import { Resend } from 'resend';
import Email from '@/components/email/email';
import { auth } from '@/auth';

const resend = new Resend(
  process.env.RESEND_API_KEY || 'development-placeholder-no-email-sent'
);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(0, Number(searchParams.get('page')) || 0);
    const PER_PAGE = 50

    const users = await User.find().limit(PER_PAGE).skip(page * PER_PAGE).sort({ createdAt: -1 })
    const docsCount = await User.find().countDocuments()

    return NextResponse.json({
      events: users,
      page: page,
      pages: Math.max(0, Math.floor((docsCount / PER_PAGE) - 1)),
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { email, createdAt, updatedAt, __v, ...rest } = body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: session.user.id },
      { ...rest },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}