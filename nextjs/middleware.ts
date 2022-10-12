import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/auth') || req.nextUrl.pathname.startsWith('/icloud')) {
    const res = await fetch(req.nextUrl.origin+"/api/login", {
      body: JSON.stringify({token: req.cookies.get('token')
    }), method: 'POST'});
    if (res.status !== 200) {
      console.log('block ' + req.nextUrl);
      req.nextUrl.pathname = '/login';
      return NextResponse.redirect(req.nextUrl);
    }
    console.log('auth ' + req.nextUrl);
  }
  else if (req.nextUrl.pathname === '/login') {
    const res = await fetch(req.nextUrl.origin+"/api/login", {
      body: JSON.stringify({token: req.cookies.get('token')
    }), method: 'POST'});
    if (res.status === 200) {
      req.nextUrl.pathname = '/icloud';
      return NextResponse.redirect(req.nextUrl);
    }
  }
}
