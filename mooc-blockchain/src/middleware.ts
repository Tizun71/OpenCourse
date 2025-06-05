import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || '';
  const { pathname } = request.nextUrl;

  if (pathname.includes('/dashboard') || pathname.includes('/instructor')){
    if (!token){
      const url = request.nextUrl.clone();
      url.pathname = '/homepage';
      return NextResponse.redirect(url);
    }
  }

  const decodedToken = jwtDecode(token) as JwtPayload & {
    role: string | string[];
  };

  const userRoles = decodedToken.role;

  if (pathname.includes('/dashboard') && !userRoles.includes("ADMIN")) {
    const url = request.nextUrl.clone();
    url.pathname = '/homepage';
    return NextResponse.redirect(url);
  }
  
  if (pathname.includes('/instructor') && !userRoles.includes("INSTRUCTOR")) {
    const url = request.nextUrl.clone();
    url.pathname = '/homepage';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/instructor/:path*'],
};
