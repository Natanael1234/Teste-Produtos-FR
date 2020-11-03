"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const carrinho_route_1 = require("./routes/carrinho.route");
const produtos_route_1 = require("./routes/produtos.route");
const pedido_route_1 = require("./routes/pedido.route");
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express_1.default();
exports.app = app;
app.use(cors());
app.use(bodyParser.json());
const port = 3000;
app.use(produtos_route_1.produtoRouter);
app.use(carrinho_route_1.carrinhoRouter);
app.use(pedido_route_1.pedidoRouter);
let server = app.listen(port, () => {
    console.log(`Servidor - ouvindo na porta: ${port}`);
});
exports.server = server;
//# sourceMappingURL=app.js.map