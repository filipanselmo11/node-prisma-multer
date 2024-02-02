const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'uploads/');
    },

    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post('/uploadFile', upload.single('file'), async (request, response) => {
    try {
        const { filename } = request.file;
        const file = await prisma.file.create({
            data: {
                name: filename,
            },
        });

        response.status(201).json({ fileId: file.id });
    } catch(error) {
        console.error(error);
        response.status(500).json({ error: 'Erro ao fazer upload do arquivo '});
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});