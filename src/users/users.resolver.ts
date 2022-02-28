import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user-dto';
import { UserVerifyDto } from './dto/user-email-verification-dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity])
  getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  //Find by email address
  @Query(() => UserEntity)
  findOne(@Args("email") email: string) {
      return this.usersService.findOne(email)
  }

  //User Registration
  @Mutation(() => UserEntity)
  async userRegister(@Args('user') user: CreateUserDto): Promise<UserEntity> {
    return this.usersService.userRegister(user);
  }

  //EMAIL Verification
  @Mutation(() => UserEntity)
  async userEmailVerification(@Args('email') email: string, @Args('user') user: UserVerifyDto): Promise<UserEntity>{
    return this.usersService.emailVerification(email, user);
  }
}
