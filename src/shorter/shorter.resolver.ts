import { UseGuards } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth.guard';
import { SuperGuard } from 'src/super.guard';
import { CreateShorterDto } from './dto/create-shorter-dto';
import { ShorterEntity } from './entities/shorter.entity';
import { ShorterService } from './shorter.service';

@Resolver(()=> ShorterEntity)
export class ShorterResolver {
  constructor(private readonly shorterService: ShorterService){}
  
  //Get All ShorterEntity
  @UseGuards(AuthGuard)
  @Query(() => [ShorterEntity])
  getAllShorder(@Context() context: GraphQLExecutionContext): Promise<ShorterEntity[]> {
    return this.shorterService.getAllShorder(context);
  }

  //Create Shorter Link
  @Mutation(() => ShorterEntity)
  createShorter(@Args('shorter') shorter: CreateShorterDto): Promise<ShorterEntity> {
    return this.shorterService.createShorter(shorter);
  } 

  //Create Shorter Link for UserEntity
  @UseGuards(AuthGuard)
  @Mutation(() => ShorterEntity)
  createShorterForUser(@Context() context: GraphQLExecutionContext, @Args('shorter') shorter: CreateShorterDto): Promise<ShorterEntity> {
    return this.shorterService.createShorterForUser(context, shorter);
  } 

  //All Shorter links for admin
  @UseGuards(SuperGuard)
  @Query(() => [ShorterEntity])
  getAllShorderForAdmin(): Promise<ShorterEntity[]> {
    return this.shorterService.getAllShorderForAdmin();
  }


}
