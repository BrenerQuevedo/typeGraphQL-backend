import {
    Resolver,
    Mutation,
    Arg
} from "type-graphql";

import { redis } from "../../redis";
import { User } from "../../entity/User";


@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string,): Promise<Boolean> {

        const userId = await redis.get(token)

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