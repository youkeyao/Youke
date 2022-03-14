import { NextRequest, NextResponse } from 'next/server';

import { isValid } from '../login';

export function middleware(req: NextRequest) {
  console.log(new Date(Date.now()).toLocaleString());
  if (!isValid(req.cookies.token)) {
    console.log('block ' + req.nextUrl);
    return new Response('token error', {
      status: 403,
    })
  }
  else {
    console.log('auth ' + req.nextUrl);
    return NextResponse.next();
  }
}