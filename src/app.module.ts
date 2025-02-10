import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './frined/friend.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ConfigModule.forRoot(),TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
  }),
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'defaultSecret',
    global: true,
  }),
  MulterModule.register({
    dest: './uploads', // Path where files will be stored
  }),
  UserModule,AuthModule,ChatModule,FriendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
