import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateShorterDto } from './dto/create-shorter-dto';
import { ShorterEntity } from './entities/shorter.entity';
import { ShorterService } from './shorter.service';

@Resolver(()=> ShorterEntity)
export class ShorterResolver {
  constructor(private readonly shorterService: ShorterService){}
  
  //Get All ShorterEntity
  @Query(() => [ShorterEntity])
  getAllShorder(): Promise<ShorterEntity[]> {
    return this.shorterService.getAllShorder();
  }

  //Create Shorter Link
  @Mutation(() => ShorterEntity)
  createShorter(@Args('shorter') shorter: CreateShorterDto): Promise<ShorterEntity> {
    return this.shorterService.createShorter(shorter);
  } 
}
