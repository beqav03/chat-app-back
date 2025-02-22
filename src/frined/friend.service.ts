import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { FriendRepository } from './friend.repository';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepo: FriendRepository,
    private readonly userRepository: UserRepository
  ) {}

  async findFriend(id: number) {
    const friendFound = await this.userRepository.allFriends(id);
  
    return friendFound;
  }

  async sendFriendRequest(senderId: number, receiverId: number) {
    return this.friendRepo.sendFriendRequest(senderId, receiverId);
  }

  async acceptFriendRequest(requestId: number) {
    const response = await this.friendRepo.acceptFriendRequest(requestId);
    if(!response){
      throw new BadRequestException('Could not be accepted');
    } else {
      return 'accepted'
    }
  }

  async rejectFriendRequest(requestId: number) {
    const response = await this.friendRepo.rejectFriendRequest(requestId);
    if(!response){
      throw new BadRequestException('Could not be rejected');
    } else {
      return 'rejected'
    }
  }
}
