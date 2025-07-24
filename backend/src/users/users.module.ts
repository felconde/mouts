import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './repositories/user.repository.interface';
import { CacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    'IUserRepository',
    UserService,
  ],
})
export class UsersModule {} 