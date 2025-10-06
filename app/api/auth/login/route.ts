import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.AUTH_USERNAME || 'COORDENADOR';
    const validPassword = process.env.AUTH_PASSWORD || 'SAEB2025FGV';

    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ success: true });
      
      // Define cookie com sessão
      response.cookies.set('saeb-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Cookie de sessão - expira quando o navegador fecha
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
