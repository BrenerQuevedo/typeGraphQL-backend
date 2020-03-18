import {
    Resolver,
    Mutation,
    Arg
} from "type-graphql";

import { redis } from "../../redis";
import { User } from "../../entity/User";
import { confirmationPrefix } from "../constants/redisPrefixes";


@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string,): Promise<Boolean> {

        const userId = await redis.get(confirmationPrefix + token)

        if (!userId) {
            return false;
        }

        //update do estado de confirmação do email
        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        //deleta o token após a confirmação
        await redis.del(token);

        return true;
    }
}