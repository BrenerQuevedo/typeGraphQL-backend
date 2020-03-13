import {
    Resolver,
    Mutation,
    Arg,
    Ctx
} from "type-graphql";

import bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { MyContext } from "../types/MyContext";

//nullable: o retorno pode ser nulo 
@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: MyContext
    ): Promise<User | null> {
        const user = await User.findOne({where: {email}});

        if(!user) {
            return null;
        }
           
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return null;
        }

        if(!user.confirmed) {
            return null;
        }

        context.req.session!.userId = user.id;

        return user;
    }
}