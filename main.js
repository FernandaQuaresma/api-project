const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors");

rotas.use(cors());
rotas.use(express.json());

const conexaoComBanco = new Sequelize("projeto", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

const Nota = conexaoComBanco.define("nota", {
    nome_aluno: {
        type: Sequelize.STRING,
    },
    nome_professor: {
        type: Sequelize.STRING,
    },
    nota: {
        type: Sequelize.FLOAT,
    },
    materia: {
        type: Sequelize.STRING,
    },
}, { 
    timestamps: true 
});

Nota.sync({ force: false });

rotas.get("/", function (req, res) {
    res.send("Rota principal");
});

rotas.post("/salvar", async function (req, res) {
    const { nome_aluno, nome_professor, nota, materia } = req.body;

    try {
        if (!nome_aluno || !nome_professor || !nota || !materia) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
        }

        const novaNota = await Nota.create({ nome_aluno, nome_professor, nota, materia });

        res.json({
            resposta: "Nota cadastrada com sucesso",
            nota: novaNota,
        });
    } catch (error) {
        console.error("Erro ao cadastrar nota:", error);
        res.status(500).json({ message: `Erro ao cadastrar nota: ${error}` });
    }
});

rotas.get("/mostrar", async function (req, res) {
    try {
        const notas = await Nota.findAll();
        const notasJSON = notas.map(nota => nota.get());
        res.json(notasJSON);
    } catch (error) {
        console.error("Erro ao buscar notas:", error);
        res.status(500).json({ message: `Erro ao buscar notas: ${error}` });
    }
});

rotas.listen(3031, function () {
    console.log("Servidor rodando na porta 3031");
});
