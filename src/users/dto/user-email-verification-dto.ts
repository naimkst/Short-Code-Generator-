import { InputType, PartialType } from "@nestjs/graphql";
import { CreateUserDto } from "./create-user-dto";

@InputType()
export class UserVerifyDto extends PartialType(CreateUserDto) {}