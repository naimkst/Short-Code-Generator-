import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [
    UsersService, 
    UsersResolver
  ],
  imports: [
    DatabaseModule,
  ]
})
export class UsersModule {}
