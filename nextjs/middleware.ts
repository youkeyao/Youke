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
  else if (req.nextUrl.pathname.startsWith('/icloud')) {
    const verified = await isValid(req.cookies.get('token')?.value);
    if (verified) {
      return NextResponse.next();
    }
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl);
  }
  else if (req.nextUrl.pathname === '/login') {
    const verified = await isValid(req.cookies.get('token')?.value);
    if (verified) {
      req.nextUrl.pathname = '/icloud';
      return NextResponse.redirect(req.nextUrl);
    }
    return NextResponse.next();
  }
}
