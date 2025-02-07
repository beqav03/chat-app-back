import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private readonly friendRepo: Repository<Friend>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or Receiver not found');
    }

    const friendRequest = this.friendRepo.create({
      sender,
      receiver,
      status: 'pending',
    });

    return this.friendRepo.save(friendRequest);
  }

  async acceptFriendRequest(requestId: number) {
    const request = await this.friendRepo.findOne({ 
      where: { id: requestId }, 
      relations: ['sender', 'receiver'] 
    });

    if (!request) throw new NotFoundException('Friend request not found');

    request.status = 'accepted';
    return this.friendRepo.save(request);
  }

  async rejectFriendRequest(requestId: number) {
    const request = await this.friendRepo.findOne({ 
      where: { id: requestId }, 
      relations: ['sender', 'receiver']
    });

    if (!request) throw new NotFoundException('Friend request not found');

    request.status = 'rejected';
    return this.friendRepo.save(request);
  }

  async getFriends(userId: number) {
    return this.friendRepo.find({
      where: [
        { sender: { id: userId }, status: 'accepted' },
        { receiver: { id: userId }, status: 'accepted' },
      ],
      relations: ['sender', 'receiver'],
    });
  }
}
