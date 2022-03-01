import { InputType, OmitType } from "@nestjs/graphql";
import { ShorterEntity } from "../entities/shorter.entity";

@InputType()
export class CreateShorterDto extends OmitType(ShorterEntity, ["id"], InputType) {}