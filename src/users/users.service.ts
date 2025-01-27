import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import * as nodemailer from 'nodemailer';
import * as randomstring from 'randomstring';
import { UserVerifyDto } from './dto/user-email-verification-dto';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Get Login Users
  async getUsers(context): Promise<UserEntity[]> {
    const getUserEmail = context.req.cookies['jwt'];
    const decoded = jwt.verify(getUserEmail, process.env.JWT_TOKEN);
    const userEmail = decoded['email'];
    const user = await this.databaseService.user.findMany({
      where: { email: userEmail },
    });
    
    return user;
  }

  //Find By Email
  async findOne(email: string): Promise<UserEntity> {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  //User Regisration
  async userRegister(user: CreateUserDto): Promise<UserEntity> {
    const hashPassword = await bcrypt.hash(user.password, 12);
    const randomEmailCode = randomstring.generate(4);
    
    const existEmail = await this.databaseService.user.findUnique({ where: { email: user['email'] } });

    if (existEmail) {
      throw new BadRequestException('Email already exist');
    }

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

  //User Login
  async userLogin(
    context,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    //Get user from email
    const getUser = await this.databaseService.user.findUnique({
      where: { email },
    });
    
    //JWT token authorize
    var token = await jwt.sign(
      { user: getUser },
      process.env.JWT_TOKEN,
      { expiresIn: '1h' },
    );
    //Again check the email and password
    if (!getUser.email) {
      throw new NotFoundException('User not found');
    }
    //Check User Status
    if (getUser.status == 0 && getUser.email_verify_status == 0) {
      throw new NotFoundException('Please Verfity your email');
    }

    //Condition the password is correct
    if (!(await bcrypt.compare(password, getUser.password))) {
      throw new NotFoundException('Wrong password');
    }
    //Set Cookie
    context.res.cookie('jwt', token);
    //Remove Password Field
    delete getUser.password;
    return getUser;
  }

  //User Logout
  async userLogout(context) {
    const cookieClear = context.res.clearCookie('jwt');
    return {
      message: 'Logout Successfully',
    };
  }

  //User Update
  async userUpdate(id: number, user: UpdateUserDto): Promise<UserEntity> {
    return this.databaseService.user.update({
      where: { id },
      data: {
        ...user,
      }
    });
  }

  //Get All User For Admin
  async getAllUser(): Promise<UserEntity[]> {
    return this.databaseService.user.findMany();
  }
}
