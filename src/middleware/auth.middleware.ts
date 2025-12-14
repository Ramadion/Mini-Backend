import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
    iat?: number;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const decoded = authService.verifyToken(token);
    
    // IMPORTANTE: Asegurarse de que el objeto user tiene la estructura correcta
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
      iat: decoded.iat
    };
    
    console.log('✅ Usuario autenticado:', req.user); // Debug
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ message: 'Se requieren permisos de administrador' });
  }
  next();
};