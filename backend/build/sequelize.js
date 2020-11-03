"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemPedido = exports.Pedido = exports.ItemCarrinho = exports.Carrinho = exports.Produto = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const carrinho_model_1 = __importDefault(require("./models/carrinho.model"));
exports.Carrinho = carrinho_model_1.default;
const item_carrinho_model_1 = __importDefault(require("./models/item-carrinho.model"));
exports.ItemCarrinho = item_carrinho_model_1.default;
const item_pedido_model_1 = __importDefault(require("./models/item-pedido.model"));
exports.ItemPedido = item_pedido_model_1.default;
const pedido_model_1 = __importDefault(require("./models/pedido.model"));
exports.Pedido = pedido_model_1.default;
const produto_model_1 = __importDefault(require("./models/produto.model"));
exports.Produto = produto_model_1.default;
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    logging: false,
    database: 'teste-produtos-fr',
    port: 3306,
    username: 'root',
    password: 'next' //,  
    // models,
});
sequelize.addModels([
    produto_model_1.default,
    carrinho_model_1.default,
    item_carrinho_model_1.default,
    pedido_model_1.default,
    item_pedido_model_1.default
]);
exports.default = sequelize;
//# sourceMappingURL=sequelize.js.map