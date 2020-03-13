import {
    Resolver,
    Query,
    Ctx
} from "type-graphql";

import { User } from "../../entity/User";
import { MyContext } from "../types/MyContext";


@Resolver()
export class FetchResolver {
    @Query(() => User, {nullable: true})
    async fetch(@Ctx() context: MyContext) : Promise<User | undefined> {
        if(!context.req.session!.userId) {
            return undefined;
        }
        
        return User.findOne(context.req.session!.userId);
    }


}