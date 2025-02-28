import { Controller, Post, Param, UseGuards, Get, Req } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @UseGuards(JwtGuard)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.friendService.findAll(req.user!.id);
  }

  @Get(':id')
  findFriend(@Param('id') id: string) {
    return this.friendService.findFriend(+id);
  }

  @Post('request/:receiverId')
  @UseGuards(JwtGuard)
  sendFriendRequest(@Param('receiverId') receiverId: number, @Req() req: AuthenticatedRequest) {
    return this.friendService.sendFriendRequest(req.user!.id, receiverId);
  }

  @Post('accept/:requestId')
  @UseGuards(JwtGuard)
  acceptFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.acceptFriendRequest(requestId);
  }

  @Post('reject/:requestId')
  @UseGuards(JwtGuard)
  rejectFriendRequest(@Param('requestId') requestId: number) {
    return this.friendService.rejectFriendRequest(requestId);
  }
}