import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize/types";
import Pedido from "../models/pedido.model";
import sequelize, { Carrinho, ItemCarrinho, ItemPedido, Produto } from "../sequelize";
const express = require('express');

const pedidoRouter = express.Router();

pedidoRouter.get('/pedidos', async (req: Request, res: Response, next: NextFunction) => {
    let pedidos = await Pedido.findAll({
        include: [
            {
                model: ItemPedido,
                include: [
                    { model: Produto }
                ]
            }
        ]
    });
    let json = pedidos.map((pedido: Pedido) => pedido.json);
    res.status(200).send(json);
});

pedidoRouter.get('/pedido/:pedidoId', async (req: Request, res: Response, next: NextFunction) => {
    let pedidoId = parseInt(req.params.pedidoId);
    if (!Number.isInteger(pedidoId)) return res.status(400).send('Id de pedido inválido');
    let pedido = await Pedido.findOne({
        where: { id: pedidoId },
        include: [
            {
                model: ItemPedido,
                include: [{
                    model: Produto
                }]
            }
        ]
    });
    if (!pedido) return res.status(404).send('Pedido não encontrado');
    return res.status(200).send(pedido.json);
});

pedidoRouter.post('/pedido/finalizar', async (req: Request, res: Response, next: NextFunction) => {
    let { carrinhoId, formaDePagamento, enderecoDeEntrega } = req.body;
    if (!carrinhoId || !Number.isInteger(carrinhoId)) return res.status(400).send('Id do carrinho inválido');
    if (formaDePagamento != 'dinheiro' && formaDePagamento != 'cartao') return res.status(400).send('Forma de pagamento inválida');
    if (!enderecoDeEntrega || typeof enderecoDeEntrega != 'string') return res.status(400).send('Endereço de entrega inválido');
    //
    let carrinho = await Carrinho.findOne({
        include: [
            {
                model: ItemCarrinho,
                include: [
                    { model: Produto }
                ]
            }
        ]
    });
    if (!carrinho || !carrinho.itens) return res.status(404).send("Carrinho vazio");
    // cria um pedido
    let pedido = new Pedido({
        formaDePagamento,
        enderecoDeEntrega,
        status: 'novo',
        valorTotal: 0
    });
    // cria um item de pedido para cada item do carrinho.
    let itensPedido: ItemPedido[] = carrinho.itens.map((itemCarrinho: ItemCarrinho) => {
        return new ItemPedido({
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
        await sequelize.transaction(async (transaction: Transaction) => {
            // salva o pedido
            await pedido.save({ transaction });
            // para cada item do pedido
            for (let itemPedido of itensPedido) {
                // adiciona o id do pedido nos itens
                itemPedido.pedidoId = pedido.id;
                // salva o item do pedido
                await itemPedido.save({transaction});
            }            
            // remove os itens do carrinho
            await ItemCarrinho.destroy({ transaction, where: { carrinhoId: carrinho.id } });
        });
        return res.status(200).send({ pedidoId: pedido.id });
    } catch (error) {
        console.error(error.stack)
        return res.status(500).send(error.message);
    }
});

pedidoRouter.put('/pedido/status', async (req: Request, res: Response, next: NextFunction) => {
    let { pedidoId, status } = req.body;
    if (!Number.isInteger(pedidoId)) return res.status(400).send('Id de pedido inválido');
    if (!['novo', 'aceito', 'saiu_pra_entrega', 'entregue', 'cancelado'].includes(status))
        return res.status(400).send('Status inválido');
    let pedido = await Pedido.findOne({where:{id:pedidoId}});
    if (!pedido) return res.status(404).send('Pedido não encontrado');

    // Qualquer status -> cancelado 
    // novo -> aceito -> saiu_pra_entrega -> entregue 
    if (status == 'cancelado' ||
        (pedido.status == 'novo' && status == 'aceito') ||
        (pedido.status == 'aceito' && status == 'saiu_pra_entrega') ||
        (pedido.status == 'saiu_pra_entrega' && status == 'entregue')) {
        try {
            pedido.status = status;
            await pedido.save();
            return res.status(200).send({ sucesso: true });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
    else {
        return res.status(400).send('Mudança de status não permitida');
    }

});

export { pedidoRouter };