import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import * as nodemailer from 'nodemailer';
import * as randomstring from 'randomstring';
import { UserVerifyDto } from './dto/user-email-verification-dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Get All Users
  getAllUsers(): Promise<UserEntity[]> {
    return this.databaseService.user.findMany();
  }

  //Find By Email
  async findOne(email: string): Promise<UserEntity> {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  //User Regisration
  async userRegister(user: CreateUserDto): Promise<UserEntity> {
    const hashPassword = await bcrypt.hash(user.password, 12);
    const randomEmailCode = randomstring.generate(4);

    console.log(randomEmailCode);

    const createUser = await this.databaseService.user.create({
      data: {
        ...user,
        password: hashPassword,
        verify_code: randomEmailCode,
        status: 0,
        email_verify_status: 0,
      },
    });

    if (createUser) {
      //Email Verification

      let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASSWORD, // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: user.email, // list of receivers
        subject: 'Verification Code ✔', // Subject line
        text: randomEmailCode, // plain text body
        html: randomEmailCode, // html body
      });

      return createUser;
    } else {
      throw new BadRequestException('Something is wrong!');
    }
  }

  //Email Verification with code verification
  async emailVerification(
    email: string,
    user: UserVerifyDto,
  ): Promise<UserEntity> {
    const getUser = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (getUser.email == email && getUser.verify_code == user.verify_code) {
      return this.databaseService.user.update({
        where: { email },
        data: {
          email_verify_status: 1,
          status: 1,
        },
      });
    } else {
      throw new BadRequestException('Something is wrong!');
    }
  }
}
