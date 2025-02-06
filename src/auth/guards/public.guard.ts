import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(){}
  async canActivate(): Promise<boolean> {
    return true;
  }
}