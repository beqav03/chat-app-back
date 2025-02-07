import { Controller, Post, Param, UseGuards, Get, Req } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

@Controller('friends')
@UseGuards(JwtGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('request/:receiverId')
  sendFriendRequest(@Param('receiverId') receiverId: number, @Req() req: AuthenticatedRequest) {
    if (!req.user) throw new Error('User not found in request');
    return this.friendService.sendFriendRequest(req.user.id, receiverId);
  }

  @Post('accept/:requestId')
  acceptFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.acceptFriendRequest(requestId);
  }

  @Post('reject/:requestId')
  rejectFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.rejectFriendRequest(requestId);
  }

  @Get()
  getFriends(@Req() req: AuthenticatedRequest) {
    if (!req.user) throw new Error('User not found in request');
    return this.friendService.getFriends(req.user.id);
  }
}