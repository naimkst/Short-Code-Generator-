import { InputType, OmitType } from "@nestjs/graphql";
import { UserEntity } from "../entities/user.entity";


@InputType()
export class CreateUserDto extends OmitType(UserEntity, ["id"], InputType) {}