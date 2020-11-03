import { NextFunction, Request, Response } from "express";
import Carrinho from "../models/carrinho.model";
import ItemCarrinho from "../models/item-carrinho.model";
import Produto from "../models/produto.model";
const express = require('express');

const carrinhoRouter = express.Router()

/** Busca o carrinho e seus itens. */
carrinhoRouter.get('/carrinho', async (req: Request, res: Response, next: NextFunction) => {
    let carrinho = await Carrinho.findOne({
        include: [
            {
                model: ItemCarrinho,
                include: [{
                    model: Produto
                }]
            }
        ]
    });
    if (!carrinho) {
        carrinho = new Carrinho({});
        await carrinho.save();
    }
    return res.status(200).send(carrinho.json);
});

/** Esvazia os itens do carrinho. */
carrinhoRouter.delete('/carrinho', async (req: Request, res: Response, next: NextFunction) => {
    let carrinho = await Carrinho.findOne({});
    if (carrinho) {
        let redDelete = await ItemCarrinho.destroy({ where: { carrinhoId: carrinho.id } });
    }
    res.status(200).send({ sucesso: true });
});

/** Insere uma quantidade de um produto no carrinho. */
carrinhoRouter.post('/carrinho/add/produto', async (req: Request, res: Response, next: NextFunction) => {
    let produtoId = req.body.produtoId;
    let quantidade = req.body.quantidade;
    if (!Number.isInteger(produtoId)) return res.status(400).send('Parâmetros inválidos');
    if (!Number.isInteger(quantidade)) return res.status(400).send('Parâmetros inválidos');
    let produto = await Produto.findOne({ where: { id: produtoId } });
    if (!produto) return res.status(404).send({ message: 'Produto não encontrado' });
    let carrinho = await Carrinho.findOne({});
    let itemCarrinho;
    // se o carrinho não existe
    if (!carrinho) {
        carrinho = new Carrinho({});
        await carrinho.save();
    }
    // se o carrinho já existe
    else {
        // se o carrinho já existe verifica se o item já não existe.
        itemCarrinho = await ItemCarrinho.findOne({
            where: {
                produtoId: produto.id,
                carrinhoId: carrinho.id
            }
        });
        // se encontrou o item no carrinho
        if (itemCarrinho) {
            // adiciona a quantidade ao item tomando cuidado de evitar quantidade negativa.
            itemCarrinho.quantidade = Math.max(0, itemCarrinho.quantidade + quantidade);
            await itemCarrinho.save();
        }
    }
    // se o item ainda não existe no carrinho
    if (!itemCarrinho) {
        // evita quantidade negativa
        quantidade = Math.max(0, quantidade);
        // cria e insere o item no carrinho.
        itemCarrinho = new ItemCarrinho({
            quantidade,
            produtoId,
            carrinhoId: carrinho.id
        });
        await itemCarrinho.save();
    }
    return res.status(200).send({ carrinhoId: carrinho.id });
});

export { carrinhoRouter };