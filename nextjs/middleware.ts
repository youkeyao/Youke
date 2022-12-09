import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    if (req.cookies.has('token')) {
      const res = await fetch(req.nextUrl.origin+"/api/login", {
        body: JSON.stringify({token: req.cookies.get('token').value}),
        method: 'POST'
      });
      if (res.ok) {
        console.log('auth ' + req.nextUrl);
        return NextResponse.next();
      }
    }
    console.log('block ' + req.nextUrl);
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);
  }
  else if (req.nextUrl.pathname.startsWith('/icloud')) {
    if (req.cookies.has('token')) {
      const res = await fetch(req.nextUrl.origin+"/api/login", {
        body: JSON.stringify({token: req.cookies.get('token').value}),
        method: 'POST'
      });
      if (res.ok) {
        return NextResponse.next();
      }
    }
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl);
  }
  else if (req.nextUrl.pathname === '/login') {
    if (req.cookies.has('token')) {
      const res = await fetch(req.nextUrl.origin+"/api/login", {
        body: JSON.stringify({token: req.cookies.get('token').value}),
        method: 'POST'
      });
      if (res.status === 200) {
        req.nextUrl.pathname = '/icloud';
        return NextResponse.redirect(req.nextUrl);
      }
    }
  }
}
