import { Injectable, NotFoundException } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { DatabaseService } from 'src/database/database.service';
import { CreateShorterDto } from './dto/create-shorter-dto';
import { ShorterEntity } from './entities/shorter.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ShorterService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Find All Shorter Links
  async getAllShorder(context): Promise<ShorterEntity[]> {
    try {
      const getUserEmail = context.req.cookies['jwt'];
      const decoded = jwt.verify(getUserEmail, process.env.JWT_TOKEN);
      const userEmail = decoded['email'];
      const loginUser = await this.databaseService.user.findMany({
        where: {
          email: userEmail,
        },
      });
      return this.databaseService.shorter.findMany({
        where: {
          userId: loginUser[0]['id'],
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found! You are not logged in!');
    }
  }

  //Create Shorter Link
  async createShorter(shorter: CreateShorterDto): Promise<ShorterEntity> {
    const randomEmailCode = randomstring.generate(6);
    const requestLink = shorter.url;

    try {
      const existingLink = await this.databaseService.shorter.findFirst({
        where: { url: requestLink },
      });

      if (existingLink.url == requestLink && existingLink.url != null) {
        return await this.databaseService.shorter.findFirst({
          where: { url: requestLink },
        });
      }
    } catch (error) {
      return this.databaseService.shorter.create({
        data: {
          ...shorter,
          published: true,
          short_url: randomEmailCode,
        },
      });
    }
  }

  //Create Shorter Link for UserEntity
  async createShorterForUser(
    context,
    shorter: CreateShorterDto,
  ): Promise<ShorterEntity> {
    //Random Link ID
    const randomEmailCode = randomstring.generate(6);

    //Get JWT Token
    const cookie = context.req.cookies['jwt'];
    const decoded = jwt.verify(cookie, process.env.JWT_TOKEN);
    const getEmail = decoded['user']['email'];

    //Find User
    const getUser = await this.databaseService.user.findUnique({
      where: { email: getEmail },
    });

    const requestLink = shorter.url;

    try {
      const existingLink = await this.databaseService.shorter.findFirst({
        where: { url: requestLink },
      });

      if (existingLink.url == requestLink && existingLink.url != null) {
        return await this.databaseService.shorter.findFirst({
          where: { url: requestLink },
        });
      }
    } catch (error) {
      return await this.databaseService.shorter.create({
        data: {
          ...shorter,
          published: true,
          short_url: randomEmailCode,
          userId: getUser.id,
          status: 1,
        },
      });
    }
  }

  //All Shorter links for admin
  async getAllShorderForAdmin(): Promise<ShorterEntity[]> {
    return this.databaseService.shorter.findMany({
      where: {
        published: true,
      },
    });
  }
}
