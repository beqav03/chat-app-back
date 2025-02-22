import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Friend } from "./entities/friend.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class FriendRepository {
    constructor(        
        @InjectRepository(Friend) private readonly friendRepo: Repository<Friend>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async sendFriendRequest(senderId: number, receiverId: number) {
        const sender = await this.userRepo.findOne({ where: { id: senderId } });
        const receiver = await this.userRepo.findOne({ where: { id: receiverId } });
    
        if (!sender || !receiver) {
          throw new NotFoundException('Sender or Receiver not found');
        } else if (sender === receiver) {
          throw new NotFoundException('Sender and Receiver are the same');
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
          relations: ['sender', 'receiver'],
        });
    
        if (!request) throw new NotFoundException('Friend request not found');
        if (request.status === 'accepted') {
          throw new BadRequestException('Friend request already accepted');
        }
    
        request.status = 'accepted';
        return this.friendRepo.save(request);
    }
    
    async rejectFriendRequest(requestId: number) {
        const request = await this.friendRepo.findOne({
          where: { id: requestId },
          relations: ['sender', 'receiver'],
        });
    
        if (!request) throw new NotFoundException('Friend request not found');
        if (request.status === 'rejected') {
          throw new BadRequestException('Friend request already rejected');
        }
    
        request.status = 'rejected';
        return this.friendRepo.save(request);
    }
}
