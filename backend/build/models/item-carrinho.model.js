"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const carrinho_model_1 = __importDefault(require("./carrinho.model"));
const produto_model_1 = __importDefault(require("./produto.model"));
let ItemCarrinho = class ItemCarrinho extends sequelize_typescript_1.Model {
    get json() {
        var _a;
        let json = this.toJSON();
        json.produto = (_a = this.produto) === null || _a === void 0 ? void 0 : _a.json;
        return json;
    }
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemCarrinho.prototype, "quantidade", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => produto_model_1.default),
    __metadata("design:type", Number)
], ItemCarrinho.prototype, "produtoId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => produto_model_1.default, { foreignKey: "produtoId" }),
    __metadata("design:type", produto_model_1.default)
], ItemCarrinho.prototype, "produto", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => carrinho_model_1.default),
    __metadata("design:type", Number)
], ItemCarrinho.prototype, "carrinhoId", void 0);
ItemCarrinho = __decorate([
    sequelize_typescript_1.Table
], ItemCarrinho);
exports.default = ItemCarrinho;
//# sourceMappingURL=item-carrinho.model.js.map