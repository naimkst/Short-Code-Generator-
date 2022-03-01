import { Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterResolver } from './shorter.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [ShorterService, ShorterResolver],
  imports: [DatabaseModule]
})
export class ShorterModule {}
