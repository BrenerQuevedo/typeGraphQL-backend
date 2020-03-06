import "reflect-metadata"

import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import { buildSchema } from "type-graphql";
import {createConnection} from "typeorm";
import { RegisterResolver } from "./modules/user/register";


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
        resolvers: [RegisterResolver],
    });

    const apolloServer = new ApolloServer({ schema });

    const app = Express();

    apolloServer.applyMiddleware({ app })

    app.listen(3000, () => {
        console.log("server on http://localhost:3000/graphql")
    })
}

main();