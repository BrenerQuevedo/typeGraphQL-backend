import { Min } from "class-validator";

import { InputType, Field } from "type-graphql";

@InputType()
export class PasswordInput {
 
    @Field()
    @Min(6)
    password: string;
}