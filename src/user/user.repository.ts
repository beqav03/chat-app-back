import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
var bcrypt = require('bcryptjs');
import * as crypto from 'crypto';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
  async findAll() {
    return await this.userRepo
    .createQueryBuilder('user')
    .getMany();
  }

  async findOne(id: number) {
    return await this.userRepo
    .createQueryBuilder('user')
    .andWhere('user.id = :id', {id})
    .getOne();
  }

  async findByEmailAndPassword(email: string) {
    return this.userRepo.findOne({ where:  { email: email }, select: { email: true, password: true, loginAttempts: true, name: true, id: true, role: true } });
  }

  async create(data: CreateUserDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 15);
    const newUser = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? UserRole.USER,
    });

    const saved = await this.userRepo.save(newUser);
    return saved;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.userRepo
    .createQueryBuilder('user')
    .update()
    .set(data)
    .andWhere('user.id = :id', {id})
    .execute();

    return this.userRepo.findOneBy({id});
  }

  async updatePassword(email: number, oldPassword: string, newPassword: string) {
  const user = await this.userRepo
    .createQueryBuilder('user')
    .andWhere('user.email = :email', {email})
    .getOne();

  if (oldPassword !== user?.password) {
    throw new BadRequestException('Passwords do not match');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 15);
  await this.userRepo.update(user.id, { password: newHashedPassword });
  }

  async updateToken(id: number, data: UpdateUserDto) {
    await this.userRepo
    .createQueryBuilder('user')
    .update()
    .set(data)
    .andWhere('user.id = :id', {id})
    .execute();
  }

  async clearToken(email: string) {
    await this.userRepo
    .createQueryBuilder('user')
    .update()
    .set({ token: null })
    .andWhere('user.email = :email', {email})
    .execute();
  }

  async updateProfilePicture(userId: number, profilePicture: string) {
    await this.userRepo
      .createQueryBuilder('user')
      .update()
      .set({ profilePicture })
      .andWhere('user.id = :id', { id: userId })
      .execute();
  }

  async updateEmail(userId: number, newEmail: string) {
    const verificationCode = crypto.randomInt(1000, 9999).toString();
    await this.userRepo
      .createQueryBuilder('user')
      .update()
      .set({ pendingEmail: newEmail, emailVerificationCode: verificationCode })
      .andWhere('user.id = :id', { id: userId })
      .execute();

    // Simulate sending an email (replace this with an actual email service)
    console.log(`Verification code sent to ${newEmail}: ${verificationCode}`);
  }

  async searchUsers(keyword: string): Promise<User[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.lastname LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.email LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async remove(id: number) {
    return await this.userRepo.softDelete({id});
  }
}
