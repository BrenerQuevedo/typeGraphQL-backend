import {
    Resolver,
    Query,
    Mutation,
    Arg,
    UseMiddleware
} from "type-graphql";

import bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/confirmationUrl";



@Resolver()
export class RegisterResolver {
    //pode-se criar diversos middlewares e utilizar na notação
    //logger apenas para teste já que não há args
    @UseMiddleware(isAuth, logger)
    @Query(() => String)
    async helloWorld() {
        return "Hello World"
    }


    @Mutation(() => User)
    async register(
        @Arg("dataInput") { email, firstName, lastName, password }: RegisterInput,

    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save();

        await sendEmail(email, await createConfirmationUrl(user.id));

        return user;
    }
}