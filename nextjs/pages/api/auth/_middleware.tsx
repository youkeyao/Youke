import { NextRequest, NextResponse } from 'next/server';

import { isValid } from '../login';

export function middleware(req: NextRequest) {
  if (!isValid(req.cookies.token)) {
    return new Response('token error', {
      status: 403,
    })
  }
  else {
    return NextResponse.next();
  }
}