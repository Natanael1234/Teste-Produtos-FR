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
exports.carrinhoRouter = void 0;
const carrinho_model_1 = __importDefault(require("../models/carrinho.model"));
const item_carrinho_model_1 = __importDefault(require("../models/item-carrinho.model"));
const produto_model_1 = __importDefault(require("../models/produto.model"));
const express = require('express');
const carrinhoRouter = express.Router();
exports.carrinhoRouter = carrinhoRouter;
/** Busca o carrinho e seus itens. */
carrinhoRouter.get('/carrinho', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let carrinho = yield carrinho_model_1.default.findOne({
        include: [
            {
                model: item_carrinho_model_1.default,
                include: [{
                        model: produto_model_1.default
                    }]
            }
        ]
    });
    if (!carrinho) {
        carrinho = new carrinho_model_1.default({});
        yield carrinho.save();
    }
    return res.status(200).send(carrinho.json);
}));
/** Esvazia os itens do carrinho. */
carrinhoRouter.delete('/carrinho', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let carrinho = yield carrinho_model_1.default.findOne({});
    if (carrinho) {
        let redDelete = yield item_carrinho_model_1.default.destroy({ where: { carrinhoId: carrinho.id } });
    }
    res.status(200).send({ sucesso: true });
}));
/** Insere uma quantidade de um produto no carrinho. */
carrinhoRouter.post('/carrinho/add/produto', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let produtoId = req.body.produtoId;
    let quantidade = req.body.quantidade;
    if (!Number.isInteger(produtoId))
        return res.status(400).send('Parâmetros inválidos');
    if (!Number.isInteger(quantidade))
        return res.status(400).send('Parâmetros inválidos');
    let produto = yield produto_model_1.default.findOne({ where: { id: produtoId } });
    if (!produto)
        return res.status(404).send({ message: 'Produto não encontrado' });
    let carrinho = yield carrinho_model_1.default.findOne({});
    let itemCarrinho;
    // se o carrinho não existe
    if (!carrinho) {
        carrinho = new carrinho_model_1.default({});
        yield carrinho.save();
    }
    // se o carrinho já existe
    else {
        // se o carrinho já existe verifica se o item já não existe.
        itemCarrinho = yield item_carrinho_model_1.default.findOne({
            where: {
                produtoId: produto.id,
                carrinhoId: carrinho.id
            }
        });
        // se encontrou o item no carrinho
        if (itemCarrinho) {
            // adiciona a quantidade ao item tomando cuidado de evitar quantidade negativa.
            itemCarrinho.quantidade = Math.max(0, itemCarrinho.quantidade + quantidade);
            yield itemCarrinho.save();
        }
    }
    // se o item ainda não existe no carrinho
    if (!itemCarrinho) {
        // evita quantidade negativa
        quantidade = Math.max(0, quantidade);
        // cria e insere o item no carrinho.
        itemCarrinho = new item_carrinho_model_1.default({
            quantidade,
            produtoId,
            carrinhoId: carrinho.id
        });
        yield itemCarrinho.save();
    }
    return res.status(200).send({ carrinhoId: carrinho.id });
}));
//# sourceMappingURL=carrinho.route.js.map