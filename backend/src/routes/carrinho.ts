import { NextFunction, Request, Response } from "express";
import db from "./mockDB";
const express = require('express');

const carrinhoRouter = express.Router()

/** Busca o carrinho e seus itens. */
carrinhoRouter.get('/carrinho', async (req: Request, res: Response, next:NextFunction)=> {
    let carrinho = await db.getCarrinho();
    carrinho.itens = await db.getItensCarrinho(carrinho.id);    
    return res.send(carrinho);
});

/** Esvazia os itens do carrinho. */
carrinhoRouter.delete('/carrinho', async (req: Request, res: Response, next:NextFunction)=> {
    let carrinho = await db.getCarrinho();
    let result = await db.deleteItemsCarrinho(carrinho.id);
    res.status(200).send({sucesso:true});
});

/** Insere uma quantidade de um produto no carrinho. */
carrinhoRouter.post('/carrinho/add/produto', async (req: Request, res: Response, next:NextFunction)=> {
    let produtoId = req.body.produtoId;
    let quantidade = req.body.quantidade;
    if(!Number.isInteger(produtoId)) return res.status(400).send('Parâmetros inválidos');
    if(!Number.isInteger(quantidade)) return res.status(400).send('Parâmetros inválidos');
    let produto = await db.getProduto(produtoId);
    if (!produto) return res.status(404).send({message:'Produto não encontrado'});
    let carrinho = await db.getCarrinho();
    
    let itemCarrinho = await db.getItemCarrinho(carrinho.id, produto.id);    
    if (!itemCarrinho) {
        await db.salvaItemCarrinho({ carrinhoId: carrinho.id, produtoId, quantidade });
    }
    return res.status(200).send({carrinhoId:carrinho.id});    
});

export { carrinhoRouter };