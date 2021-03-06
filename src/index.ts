import "reflect-metadata"

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors";


import { redis } from "./redis";

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
        resolvers: [__dirname + "/modules/**/*.ts"],
        authChecker: ({context: {req}}) => {
            return !!req.session.userId;
        }
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

    app.use(
        session({
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
               maxAge: 1000 * 60 * 60 * 24 * 7 * 365 //7 ANOS,
           },
        })
    );
    


    apolloServer.applyMiddleware({ app })

    app.listen(3000, () => {
        console.log("server on http://localhost:3000/graphql")
    })
}

main();