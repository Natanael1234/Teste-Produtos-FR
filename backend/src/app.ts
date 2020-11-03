  
import express, { NextFunction, Request, Response } from 'express';
import { carrinhoRouter } from './routes/carrinho.route';
import { produtoRouter } from './routes/produtos.route';
import { pedidoRouter } from './routes/pedido.route';
import sequelize from './sequelize';


var cors = require('cors');
const bodyParser = require('body-parser');

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
const port: number = 3000;

app.use(produtoRouter);
app.use(carrinhoRouter);
app.use(pedidoRouter);

let server = app.listen(port, () => {
    console.log(`Servidor - ouvindo na porta: ${port}`);
});

export { app, server };