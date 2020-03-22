import {Resolver, Mutation, Ctx} from "type-graphql"
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutResolver {
    @Mutation()
    async logout(@Ctx() context:MyContext) {
         context.req.session!.destroy(err => {
             if (err) {
                console.log(err)
             }
         });
    }
}