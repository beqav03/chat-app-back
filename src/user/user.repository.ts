import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
var bcrypt = require('bcryptjs');

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

  async remove(id: number) {
    return await this.userRepo.softDelete({id});
  }
}
