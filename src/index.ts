import "reflect-metadata"

import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";

@Resolver()
class TestResolver {
    @Query(() => String)
    async helloWorld() {
        return "Hello World"
    }
}
const main = async () => {
    const schema = await buildSchema({
        resolvers: [TestResolver],
    });

    const apolloServer = new ApolloServer({ schema });

    const app = Express();

    apolloServer.applyMiddleware({ app })

    app.listen(3000, () => {
        console.log("server on http://localhost:3000/graphql")
    })
}

main();