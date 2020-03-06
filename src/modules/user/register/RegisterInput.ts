import { Length, IsEmail } from "class-validator";

import { InputType, Field } from "type-graphql";
import { validateEmail } from "./validateEmail";

@InputType()
export class RegisterInput {
    @Field()
    @Length(1, 40)
    firstName: string;
 
    @Field()
    @Length(1, 30)
    lastName: string;

    @Field()
    @IsEmail()
    @validateEmail({message: "Email already in use"})
    email: string;

    @Field()
    password: string;
}