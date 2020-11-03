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
const item_pedido_model_1 = __importDefault(require("./item-pedido.model"));
let Pedido = class Pedido extends sequelize_typescript_1.Model {
    get json() {
        var _a;
        let json = this.toJSON();
        json.itens = ((_a = this.itens) === null || _a === void 0 ? void 0 : _a.map((item) => item.json)) || [];
        return json;
    }
};
__decorate([
    sequelize_typescript_1.HasMany(() => item_pedido_model_1.default),
    __metadata("design:type", Array)
], Pedido.prototype, "itens", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Pedido.prototype, "formaDePagamento", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Pedido.prototype, "enderecoDeEntrega", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], Pedido.prototype, "valorTotal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Pedido.prototype, "status", void 0);
Pedido = __decorate([
    sequelize_typescript_1.Table
], Pedido);
exports.default = Pedido;
//# sourceMappingURL=pedido.model.js.map