
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserEntity {

  @Field(() => Int)
  id: number;
  
  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  first_name: string;

  @Field(() => String, { nullable: true })
  last_name: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => Int, { nullable: true })
  status: number;

  @Field(()=> String, { nullable: true })
  verify_code: string;

  @Field(()=> Int, { nullable: true })
  email_verify_status: number;
  
}