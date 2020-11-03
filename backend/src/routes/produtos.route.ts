import { NextFunction, Request, Response } from "express";
import Produto from "../models/produto.model";
import sequelize from "../sequelize";
const express = require('express');

const produtoRouter = express.Router();

produtoRouter.post('/produto', async (req: Request, res: Response, next: NextFunction) => {
    let { nome, preco, status, descricao, imagem, tags } = req.body;
    if (!nome) return res.status(405).send('Exceção de validação');
    if (isNaN(preco)) return res.status(405).send('Exceção de validação');
    status = status || 'ativo';
    if (status != 'ativo' && status != 'inativo') return res.status(405).send('Exceção de validação');
    if (preco < 0) return res.status(405).send('Preço inválido');
    try {
        // await sequelize.databaseVersion();
        let regProduto = new Produto({
            nome,
            descricao,
            preco,
            imagem,
            tags_str: tags ? JSON.stringify(tags) : '[]',
            status
        });
        await regProduto.save();
        return res.status(200).send(regProduto.json);
    } catch (error) {
        console.error(error.stack)
        return res.status(500).send(error.message);
    }
});

produtoRouter.put('/produto', async (req: Request, res: Response, next: NextFunction) => {
    let { id, nome, preco, status, descricao, imagem, tags } = req.body;
    if (isNaN(id)) return res.status(400).send('ID inválido fornecido');
    if (status != undefined && (status != 'ativo' && status != 'inativo')) return res.status(405).send('Exceção de validação');
    if (nome != undefined && !nome) return res.status(405).send('Nome inválido'); // nome vazio    
    if (preco != undefined) {
        if (isNaN(preco)) {
            return res.status(405).send('Exceção de validação');
        }
        preco = parseFloat(preco);
        if (preco && preco < 0) return res.status(405).send('Exceção de validação');
    }
    try {
        let regProduto = await Produto.findOne({ where: { id } });
        if (!regProduto) return res.status(404).send('Produto não encontrado');
        if (nome) regProduto.nome = nome;
        if (descricao) regProduto.descricao = descricao;
        if (preco || preco == 0) regProduto.preco = preco;
        if (imagem) regProduto.imagem = imagem;
        if (tags) regProduto.tags = tags;
        if (status) regProduto.status;
        await regProduto.save();
        return res.status(200).send(regProduto.json);
    } catch (error) {
        return res.status(500).send('Falha ao salvar produto');
    }
});

produtoRouter.get('/produtos', async (req: Request, res: Response, next: NextFunction) => {
    let json = (await Produto.findAll({})).map((produto: Produto) => produto.json);
    return res.send(json);
});

produtoRouter.get('/produtos/compra', async (req: Request, res: Response, next: NextFunction) => {
    let json = (await Produto.findAll({ where: { status: 'ativo' } })).map((produto: Produto) => produto.json);
    return res.send(json);
});

produtoRouter.get('/produto/:produtoId', async (req: Request, res: Response, next: NextFunction) => {
    let produtoId = parseInt(req.params.produtoId);
    if (isNaN(produtoId)) return res.status(400).send('ID inválido fornecido');
    let produto = await Produto.findOne({ where: { id: produtoId } });
    if (!produto) return res.status(404).send({ message: 'Produto não encontrado' });
    return res.status(200).send(produto.json);
});
produtoRouter.delete('/produto/:produtoId', async (req: Request, res: Response, next: NextFunction) => {
    let produtoId = parseInt(req.params.produtoId);
    if (isNaN(produtoId)) return res.status(400).send('ID inválido fornecido');
    let produto = await Produto.findOne({ where: { id: produtoId } });
    if (produto) {
        await produto.destroy();
        return res.status(200).send(produto.json);
    } else {
        return res.status(404).send({ message: 'Produto não encontrado' });
    }
});


export { produtoRouter };