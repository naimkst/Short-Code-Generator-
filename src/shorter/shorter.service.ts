import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { DatabaseService } from 'src/database/database.service';
import { CreateShorterDto } from './dto/create-shorter-dto';
import { ShorterEntity } from './entities/shorter.entity';

@Injectable()
export class ShorterService {
  constructor(private readonly databaseService: DatabaseService){}

  //Find All Shorter Links
  getAllShorder(): Promise<ShorterEntity[]>{
    return this.databaseService.shorter.findMany();
  }

  //Create Shorter Link
  createShorter(shorter: CreateShorterDto): Promise<ShorterEntity>{
    const randomEmailCode = randomstring.generate(6);
    console.log(randomEmailCode);
    return this.databaseService.shorter.create({
      data:{
        ...shorter,
        published: true,
        short_url: randomEmailCode
      }
    });
  }
}
