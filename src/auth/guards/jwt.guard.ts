import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return false; // No authorization header found
    }

    const token = authHeader.split(' ')[1]; // Bearer token format

    if (!token) {
        return false; // No token found
    }

    try {
        const decoded = this.jwtService.verify(token);
        request.user = decoded; // Attach the decoded user to the request
        return true;
    } catch (error) {
        return false; // Invalid or expired token
    }
  }
}
