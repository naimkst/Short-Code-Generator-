import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { DatabaseService } from 'src/database/database.service';
import { CreateShorterDto } from './dto/create-shorter-dto';
import { ShorterEntity } from './entities/shorter.entity';
import * as jwt from 'jsonwebtoken';

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

  //Create Shorter Link for UserEntity
  async createShorterForUser(context, shorter: CreateShorterDto): Promise<ShorterEntity>{

    //Random Link ID
    const randomEmailCode = randomstring.generate(6);

    //Get JWT Token
    const cookie = context.req.cookies['jwt']
    const decoded = jwt.verify(cookie, process.env.JWT_TOKEN);
    const getEmail = decoded['email'];

    //Find User
    const getUser = await this.databaseService.user.findUnique({where: {email: getEmail}});

    console.log(getUser);
    return this.databaseService.shorter.create({
      data:{
        ...shorter,
        published: true,
        short_url: randomEmailCode,
        userId: getUser.id,
        status: 1
      }
    });
  }
}
