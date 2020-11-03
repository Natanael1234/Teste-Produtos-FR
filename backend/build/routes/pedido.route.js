"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.pedidoRouter = void 0;
const pedido_model_1 = __importDefault(require("../models/pedido.model"));
const sequelize_1 = __importStar(require("../sequelize"));
const express = require('express');
const pedidoRouter = express.Router();
exports.pedidoRouter = pedidoRouter;
pedidoRouter.get('/pedidos', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let pedidos = yield pedido_model_1.default.findAll({
        include: [
            {
                model: sequelize_1.ItemPedido,
                include: [
                    { model: sequelize_1.Produto }
                ]
            }
        ]
    });
    let json = pedidos.map((pedido) => pedido.json);
    res.status(200).send(json);
}));
pedidoRouter.get('/pedido/:pedidoId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let pedidoId = parseInt(req.params.pedidoId);
    if (!Number.isInteger(pedidoId))
        return res.status(400).send('Id de pedido inválido');
    let pedido = yield pedido_model_1.default.findOne({
        where: { id: pedidoId },
        include: [
            {
                model: sequelize_1.ItemPedido,
                include: [{
                        model: sequelize_1.Produto
                    }]
            }
        ]
    });
    if (!pedido)
        return res.status(404).send('Pedido não encontrado');
    return res.status(200).send(pedido.json);
}));
pedidoRouter.post('/pedido/finalizar', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { carrinhoId, formaDePagamento, enderecoDeEntrega } = req.body;
    if (!carrinhoId || !Number.isInteger(carrinhoId))
        return res.status(400).send('Id do carrinho inválido');
    if (formaDePagamento != 'dinheiro' && formaDePagamento != 'cartao')
        return res.status(400).send('Forma de pagamento inválida');
    if (!enderecoDeEntrega || typeof enderecoDeEntrega != 'string')
        return res.status(400).send('Endereço de entrega inválido');
    //
    let carrinho = yield sequelize_1.Carrinho.findOne({
        include: [
            {
                model: sequelize_1.ItemCarrinho,
                include: [
                    { model: sequelize_1.Produto }
                ]
            }
        ]
    });
    if (!carrinho || !carrinho.itens)
        return res.status(404).send("Carrinho vazio");
    // cria um pedido
    let pedido = new pedido_model_1.default({
        formaDePagamento,
        enderecoDeEntrega,
        status: 'novo',
        valorTotal: 0
    });
    // cria um item de pedido para cada item do carrinho.
    let itensPedido = carrinho.itens.map((itemCarrinho) => {
        return new sequelize_1.ItemPedido({
            nome: itemCarrinho.produto.nome,
            preco: itemCarrinho.produto.preco,
            quantidade: itemCarrinho.quantidade,
            produtoId: itemCarrinho.produtoId
        });
    });
    // somatório total dos itens do pedido
    let valorTotal = 0;
    for (let itemCarrinho of carrinho.itens) {
        valorTotal += itemCarrinho.quantidade * itemCarrinho.produto.preco;
    }
    pedido.valorTotal = valorTotal;
    if (pedido.valorTotal < 10) {
        return res.status(400).send('Não é permitido finalizar pedido abaixo de R$10,00.');
    }
    try {
        // executa todas as operações ou não executa nenhuma
        yield sequelize_1.default.transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            // salva o pedido
            yield pedido.save({ transaction });
            // para cada item do pedido
            for (let itemPedido of itensPedido) {
                // adiciona o id do pedido nos itens
                itemPedido.pedidoId = pedido.id;
                // salva o item do pedido
                yield itemPedido.save({ transaction });
            }
            // remove os itens do carrinho
            yield sequelize_1.ItemCarrinho.destroy({ transaction, where: { carrinhoId: carrinho.id } });
        }));
        return res.status(200).send({ pedidoId: pedido.id });
    }
    catch (error) {
        console.error(error.stack);
        return res.status(500).send(error.message);
    }
}));
pedidoRouter.put('/pedido/status', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { pedidoId, status } = req.body;
    if (!Number.isInteger(pedidoId))
        return res.status(400).send('Id de pedido inválido');
    if (!['novo', 'aceito', 'saiu_pra_entrega', 'entregue', 'cancelado'].includes(status))
        return res.status(400).send('Status inválido');
    let pedido = yield pedido_model_1.default.findOne({ where: { id: pedidoId } });
    if (!pedido)
        return res.status(404).send('Pedido não encontrado');
    // Qualquer status -> cancelado 
    // novo -> aceito -> saiu_pra_entrega -> entregue 
    if (status == 'cancelado' ||
        (pedido.status == 'novo' && status == 'aceito') ||
        (pedido.status == 'aceito' && status == 'saiu_pra_entrega') ||
        (pedido.status == 'saiu_pra_entrega' && status == 'entregue')) {
        try {
            pedido.status = status;
            yield pedido.save();
            return res.status(200).send({ sucesso: true });
        }
        catch (error) {
            return res.status(500).send(error.message);
        }
    }
    else {
        return res.status(400).send('Mudança de status não permitida');
    }
}));
//# sourceMappingURL=pedido.route.js.map