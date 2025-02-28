import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { FriendRepository } from './friend.repository';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepo: FriendRepository,
    private readonly userRepository: UserRepository,
    private readonly chatGateway: ChatGateway,
  ) {}

  async findAll(userId: number) {
    return this.userRepository.allFriends(userId);
  }

  async findFriend(id: number) {
    return this.userRepository.allFriends(id);
  }

  async sendFriendRequest(senderId: number, receiverId: number) {
    const request = await this.friendRepo.sendFriendRequest(senderId, receiverId);
    this.chatGateway.server.emit('friend_request', { senderId, receiverId, status: 'pending' });
    return request;
  }

  async acceptFriendRequest(requestId: number) {
    const response = await this.friendRepo.acceptFriendRequest(requestId);
    if (!response) throw new BadRequestException('Could not be accepted');
    this.chatGateway.server.emit('friend_status', { requestId, status: 'accepted' });
    return 'accepted';
  }

  async rejectFriendRequest(requestId: number) {
    const response = await this.friendRepo.rejectFriendRequest(requestId);
    if (!response) throw new BadRequestException('Could not be rejected');
    this.chatGateway.server.emit('friend_status', { requestId, status: 'rejected' });
    return 'rejected';
  }
}