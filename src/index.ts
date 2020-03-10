import "reflect-metadata"

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/register";
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors";


import { redis } from "./redis"
import { LoginResolver } from "./modules/user/Login";

const main = async () => {

    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "test",
        password: "test",
        database: "typegraphql",
        entities: ["src/entity/*.*"],
        synchronize: true,
        logging: true,
    });


    const schema = await buildSchema({
        resolvers: [RegisterResolver, LoginResolver],
    });

    const apolloServer = new ApolloServer({
        schema,
        //acesso a key context para o acesso dos Resolvers, 
        //Apollo Server dá acesso ao req obj, garantindo acesso ao dados da session
        context: ({ req }: any) => ({ req })
    });

    const app = Express();

    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
    }))

    const RedisStore = connectRedis(session);


    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: (redis as any),
        }),
        name: "qlid",
        secret: "testeteste",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    };

    app.use(session(sessionOption));

    apolloServer.applyMiddleware({ app })

    app.listen(3000, () => {
        console.log("server on http://localhost:3000/graphql")
    })
}

main();