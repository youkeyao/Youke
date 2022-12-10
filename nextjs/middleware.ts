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
    else if (req.nextUrl.searchParams.has('username') && req.nextUrl.searchParams.has('password')) {
      const res = await fetch(req.nextUrl.origin+"/api/login", {
        body: JSON.stringify({username: req.nextUrl.searchParams.get('username'), password: req.nextUrl.searchParams.get('password')}),
        method: 'POST'
      });
      if (res.ok) {
        const response = NextResponse.next();
        response.headers.set('set-cookie', res.headers.get('set-cookie'));
        return response;
      }
      req.nextUrl.searchParams.delete('username');
      req.nextUrl.searchParams.delete('password');
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
