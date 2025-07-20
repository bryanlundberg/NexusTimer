import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  upload_prefix: 'https://api-eu.cloudinary.com'
});

export const POST = async (request: Request) => {

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const path = formData.get('path') as string;
  const filename = formData.get('filename') as string | null;

  if (!file) {
    return NextResponse.json({
      error: 'No file provided'
    }, { status: 400 });
  }

  if (!path) {
    return NextResponse.json({
      error: 'No path provided'
    }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadOptions: any = {
      folder: path,
      resource_type: 'auto'
    };

    if (filename) {
      uploadOptions.public_id = filename;
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({
      error: 'Failed to upload image'
    }, { status: 500 });
  }
}
