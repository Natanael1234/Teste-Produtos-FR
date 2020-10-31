import { NextFunction, Request, Response } from "express";
import db from "./mockDB";
const express = require('express');

const produtoRouter = express.Router();

produtoRouter.post('/produto', async (req: Request, res: Response, next:NextFunction)=>{            
    if(!req.body.nome) return res.status(405).send('Exceção de validação');
    if(isNaN(req.body.preco)) return res.status(405).send('Exceção de validação');
    let status = !req.body.status ? 'ativo' : req.body.status;
    if (status != 'ativo' && status != 'inativo')  return res.status(405).send('Exceção de validação');
    let preco = parseFloat(req.body.preco);
    if(preco < 0) return res.status(405).send('Exceção de validação');
    let produtoSalvo = await db.salvarProduto(req.body);   
    return res.status(200).send(produtoSalvo); 
});

produtoRouter.put('/produto', async (req: Request, res: Response, next:NextFunction)=> {      
    if(isNaN(req.body.id)) return res.status(400).send('ID inválido fornecido');
    let status = req.body.status;
    if (status != undefined && (status != 'ativo' && status != 'inativo')) return res.status(405).send('Exceção de validação');
    if(req.body.nome != undefined && !req.body.nome) return res.status(405).send('Exceção de validação');
    let preco;
    if (req.body.preco!=undefined) {
        if(isNaN(req.body.preco)) {
            return res.status(405).send('Exceção de validação');
        }
        preco = parseFloat(req.body.preco);
        if(preco && preco < 0) return res.status(405).send('Exceção de validação');
    } 
    let produtoSalvo = await db.salvarProduto(req.body);
    return res.status(200).send(produtoSalvo); 
});

produtoRouter.get('/produtos', async (req: Request, res: Response, next:NextFunction)=> {            
    return res.send(await db.getProdutos());
});

produtoRouter.get('/produtos/compra', async (req: Request, res: Response, next:NextFunction)=> {
    console.log('db.produtos.length', db.produtos.length)
    return res.send(await db.getProdutos(true));
});

produtoRouter.get('/produto/:produtoId', async (req: Request, res: Response, next:NextFunction)=> {
    let produtoId = parseInt(req.params.produtoId);
    if(isNaN(produtoId)) return res.status(400).send('ID inválido fornecido');
    if (produtoId > 10)  {
        return res.status(404).send({message:'Produto não encontrado'});
    } else {
        let produto = await db.getProduto(produtoId);  
        if (!produto) return res.status(404).send({message:'Produto não encontrado'});
        return res.status(200).send(produto);
    }
});
produtoRouter.delete('/produto/:produtoId', async (req: Request, res: Response, next:NextFunction)=> {
    let produtoId = parseInt(req.params.produtoId);
    if(isNaN(produtoId)) return res.status(400).send('ID inválido fornecido');    
    let produto = await db.deleteProduto(produtoId);
    if (produto) {
        return res.status(200).send(produto);
    } else {
        return res.status(404).send({message:'Produto não encontrado'});
    }    
});


export { produtoRouter };