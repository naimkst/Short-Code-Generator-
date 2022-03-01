
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ShorterEntity {

  @Field(() => Int)
  id: number;
  
  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  short_url: string;

  @Field(() => String, { nullable: true })
  unique_url: string;

  @Field(() => Boolean, { nullable: true })
  public: boolean;

  @Field(() => Boolean, { nullable: true })
  expire_date: boolean;

  @Field(() => String, { nullable: true })
  visits: string;

  @Field(() => Int, { nullable: true })
  userId: number;

  @Field(()=> Int, { nullable: true })
  status: number;

  @Field(()=> Boolean, { nullable: true })
  published: boolean;
  
}