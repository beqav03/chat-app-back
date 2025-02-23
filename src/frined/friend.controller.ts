import { Controller, Post, Param, UseGuards, Get, Req } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserGuard } from 'src/auth/guards/user.guard';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get(':id')
  findFriend(@Param('id') id: string) {
    return this.friendService.findFriend(+id);
  }

  @UseGuards(UserGuard)
  @Post('request/:receiverId')
  sendFriendRequest(@Param('receiverId') receiverId: number, @Req() req: AuthenticatedRequest) {
    if (!req.user) throw new Error('User not found in request');
    return this.friendService.sendFriendRequest(req.user.id, receiverId);
  }

  @UseGuards(UserGuard)
  @Post('accept/:requestId')
  acceptFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.acceptFriendRequest(requestId);
  }
  @UseGuards(UserGuard)
  @Post('reject/:requestId')
  rejectFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.rejectFriendRequest(requestId);
  }
}