import { NextRequest, NextResponse } from 'next/server';
import { isValid } from './pages/api/login';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    const verified = await isValid(req.cookies.get('token')?.value);
    if (verified) {
      console.log('auth ' + req.nextUrl);
      return NextResponse.next();
    }
    console.log('block ' + req.nextUrl);
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);
  }
}
