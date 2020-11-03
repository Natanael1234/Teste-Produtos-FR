"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produtoRouter = void 0;
const produto_model_1 = __importDefault(require("../models/produto.model"));
const express = require('express');
const produtoRouter = express.Router();
exports.produtoRouter = produtoRouter;
produtoRouter.post('/produto', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { nome, preco, status, descricao, imagem, tags } = req.body;
    if (!nome)
        return res.status(405).send('Exceção de validação');
    if (isNaN(preco))
        return res.status(405).send('Exceção de validação');
    status = status || 'ativo';
    if (status != 'ativo' && status != 'inativo')
        return res.status(405).send('Exceção de validação');
    if (preco < 0)
        return res.status(405).send('Preço inválido');
    try {
        // await sequelize.databaseVersion();
        let regProduto = new produto_model_1.default({
            nome,
            descricao,
            preco,
            imagem,
            tags_str: tags ? JSON.stringify(tags) : '[]',
            status
        });
        yield regProduto.save();
        return res.status(200).send(regProduto.json);
    }
    catch (error) {
        console.error(error.stack);
        return res.status(500).send(error.message);
    }
}));
produtoRouter.put('/produto', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, nome, preco, status, descricao, imagem, tags } = req.body;
    if (isNaN(id))
        return res.status(400).send('ID inválido fornecido');
    if (status != undefined && (status != 'ativo' && status != 'inativo'))
        return res.status(405).send('Exceção de validação');
    if (nome != undefined && !nome)
        return res.status(405).send('Nome inválido'); // nome vazio    
    if (preco != undefined) {
        if (isNaN(preco)) {
            return res.status(405).send('Exceção de validação');
        }
        preco = parseFloat(preco);
        if (preco && preco < 0)
            return res.status(405).send('Exceção de validação');
    }
    try {
        let regProduto = yield produto_model_1.default.findOne({ where: { id } });
        if (!regProduto)
            return res.status(404).send('Produto não encontrado');
        if (nome)
            regProduto.nome = nome;
        if (descricao)
            regProduto.descricao = descricao;
        if (preco || preco == 0)
            regProduto.preco = preco;
        if (imagem)
            regProduto.imagem = imagem;
        if (tags)
            regProduto.tags = tags;
        if (status)
            regProduto.status;
        yield regProduto.save();
        return res.status(200).send(regProduto.json);
    }
    catch (error) {
        return res.status(500).send('Falha ao salvar produto');
    }
}));
produtoRouter.get('/produtos', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let json = (yield produto_model_1.default.findAll({})).map((produto) => produto.json);
    return res.send(json);
}));
produtoRouter.get('/produtos/compra', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let json = (yield produto_model_1.default.findAll({ where: { status: 'ativo' } })).map((produto) => produto.json);
    return res.send(json);
}));
produtoRouter.get('/produto/:produtoId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let produtoId = parseInt(req.params.produtoId);
    if (isNaN(produtoId))
        return res.status(400).send('ID inválido fornecido');
    let produto = yield produto_model_1.default.findOne({ where: { id: produtoId } });
    if (!produto)
        return res.status(404).send({ message: 'Produto não encontrado' });
    return res.status(200).send(produto.json);
}));
produtoRouter.delete('/produto/:produtoId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let produtoId = parseInt(req.params.produtoId);
    if (isNaN(produtoId))
        return res.status(400).send('ID inválido fornecido');
    let produto = yield produto_model_1.default.findOne({ where: { id: produtoId } });
    if (produto) {
        yield produto.destroy();
        return res.status(200).send(produto.json);
    }
    else {
        return res.status(404).send({ message: 'Produto não encontrado' });
    }
}));
//# sourceMappingURL=produtos.route.js.map