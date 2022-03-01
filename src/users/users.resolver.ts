import { UseGuards } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { UserVerifyDto } from './dto/user-email-verification-dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity])
  @UseGuards(AuthGuard)
  getAllUsers(@Context() context: GraphQLExecutionContext): Promise<UserEntity[]> {
    return this.usersService.getAllUsers(context);
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

  //User Login
  @Mutation(() => UserEntity)
  async userLogin(@Context() context: GraphQLExecutionContext, @Args('email') email: string, @Args('password') password: string): Promise<UserEntity>{
    return this.usersService.userLogin(context, email, password);
  }

  //User Logout
  @Query(() => UserEntity)
  async userLogout(@Context() context: GraphQLExecutionContext){
    return this.usersService.userLogout(context);
  }
}
