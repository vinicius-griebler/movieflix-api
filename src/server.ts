import express from "express";
import { PrismaClient } from '../src/generated/prisma';

const port = 4000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    console.log(movies)
    res.json(movies);
});

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        //  case insensitive - se a busca for feita por john wick ou John wick ou JOHN WICK, o registro vai ser retornado na consulta

        // case sensitive - se buscar por john wick e no banco estiver como John Wick, não vai ser retornado a consulta

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: { title: { equals: title, mode: "insensitive" } },
        });

        if (movieWithSameTitle) {
            return res.status(409).send({ message: "Já existe um filme cadastrado com esse titulo" });
        }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date)
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Falha ao cadastrar um filme" });
    };

    res.status(201).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});