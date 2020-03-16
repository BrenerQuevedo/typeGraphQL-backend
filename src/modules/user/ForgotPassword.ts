import {
    Resolver,
    Mutation,
    Arg
} from "type-graphql";
import { v4 } from "uuid"

import { sendEmail } from "../utils/sendEmail";
import { User } from "../../entity/User";
import { redis } from "../../redis";



@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string, ): Promise<Boolean> {

        const user = await User.findOne({ where: { email } })

        if (!user) {
            throw new Error("User not found");
        }

        const token = v4();

        await redis.set(token, user.id, "ex", 60 * 60 * 24); // um dia

        await sendEmail(
            email,
            `http://localhost:3000/user/change-password/${token}`);

        return true;
    }
}