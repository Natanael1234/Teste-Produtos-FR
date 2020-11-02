import { NextFunction, Request, Response } from "express";
import db, { pedidos } from "./mockDB";
const express = require('express');

const pedidoRouter = express.Router();

pedidoRouter.get('/pedidos', async (req: Request, res: Response, next: NextFunction) => {
    let pedidos = await db.getPedidos();
    res.status(200).send(pedidos);
});

pedidoRouter.get('/pedido/:pedidoId', async (req: Request, res: Response, next: NextFunction) => {
    let pedidoId = parseInt(req.params.pedidoId);
    if (!Number.isInteger(pedidoId)) return res.status(400).send('Id de pedido inválido');    
    let pedido = await db.getPedido(pedidoId);
    if (!pedido) return res.status(404).send('Pedido não encontrado');
    return res.status(200).send(pedido);
});

pedidoRouter.post('/pedido/finalizar', async (req: Request, res: Response, next: NextFunction) => {
    let { carrinhoId, formaDePagamento, enderecoDeEntrega } = req.body;
    if (!carrinhoId || !Number.isInteger(carrinhoId)) return res.status(400).send('Id do carrinho inválido');
    if (formaDePagamento != 'dinheiro' && formaDePagamento != 'cartao') return res.status(400).send('Forma de pagamento inválida');
    if (!enderecoDeEntrega || typeof enderecoDeEntrega != 'string') return res.status(400).send('Endereço de entrega inválido');

    let carrinho = await db.getCarrinho();
    let itensCarrinho = await db.getItensCarrinho(carrinho.id);
    let pedido:any = { 
        formaDePagamento, 
        enderecoDeEntrega,
        itens: [],
        status:'novo',
        valorTotal: 0
    };
    
    for (let itemCarrinho of itensCarrinho) {
        let item = {
            nome: itemCarrinho.produto.nome,
            preco: itemCarrinho.produto.preco,
            quantidade: itemCarrinho.quantidade,
            produtoId: itemCarrinho.produto.id
        };
        pedido.itens.push(item);
        // calcula o valor total dos itens do pedido  
        pedido.valorTotal += (item.preco * item.quantidade)
    }
    if (pedido.valorTotal < 10) {
        return res.status(400).send('Não é permitido finalizar pedido abaixo de R$10,00.');
    }
    try {
        let pedidoSalvo = await db.salvaPedido(pedido);        
        await db.deleteItemsCarrinho(carrinho.id);
        return res.status(200).send({ pedidoId: pedidoSalvo.id });
    } catch (error) {
        if (error.status) return res.status(error.status).send(error.message);
        console.error(error)
        return res.status(500).send('Erro interno');
    }
});

pedidoRouter.put('/pedido/status', async (req: Request, res: Response, next: NextFunction) => {
    let { pedidoId, status } = req.body;    
    if (!Number.isInteger(pedidoId)) return res.status(400).send('Id de pedido inválido');
    if (!['novo', 'aceito', 'saiu_pra_entrega', 'entregue', 'cancelado'].includes(status))
        return res.status(400).send('Status inválido');
    let pedido = await db.getPedido(pedidoId);        
    if (!pedido) return res.status(404).send('Pedido não encontrado');

    // Qualquer status -> Cancelado 
    // Novo -> Aceito 
    // Aceito -> Saiu pra entrega 
    // Saiu pra entrega -> Entregue 
    if (status=='cancelado' || 
        (pedido.status == 'novo' && status == 'aceito') ||
        (pedido.status == 'aceito' && status == 'saiu_pra_entrega') ||
        (pedido.status == 'saiu_pra_entrega' && status == 'entregue')) {
        try {            
            pedido.status = status;
            let pedidoSalvo = await db.salvaPedido(pedido);  
            return res.status(200).send({ sucesso: true });
        } catch (error) {
            if (error.status) return res.status(error.status).send(error.message);
            return res.status(500).send('Erro interno');
        }        
    } 
    else {
        return res.status(400).send('Mudança de status não permitida');
    }

});

export { pedidoRouter };