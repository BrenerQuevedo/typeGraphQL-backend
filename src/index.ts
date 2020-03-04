import "reflect-metadata"

import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import {createConnection} from "typeorm";


@Resolver()
class TestResolver {
    @Query(() => String)
    async helloWorld() {
        return "Hello World"
    }
}
const main = async () => {

    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "test",
        password: "test",
        database: "typegraphql",
        entities:["src/entity/*.*"],
        synchronize: true,
        logging: true,
    });


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