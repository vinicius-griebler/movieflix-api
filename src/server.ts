import express from "express";
import { PrismaClient } from '../src/generated/prisma';

const port = 4000;
const app = express();
const prisma = new PrismaClient();

app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include:{
        genres: true,
        languages: true
        }
    });
    console.log(movies)
    res.json(movies);
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});