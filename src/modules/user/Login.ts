import {
    Resolver,
    Query,
    Mutation,
    Arg
} from "type-graphql";

import bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";


@Resolver()
export class LoginResolver {
    @Mutation(() => User)
    async login(
        @Arg("dataInput") { email, firstName, lastName, password }: RegisterInput,

    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save()

        return user;
    }
}