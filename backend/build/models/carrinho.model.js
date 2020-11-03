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
const item_carrinho_model_1 = __importDefault(require("./item-carrinho.model"));
let Carrinho = class Carrinho extends sequelize_typescript_1.Model {
    get json() {
        var _a;
        let json = this.toJSON();
        json.itens = ((_a = this.itens) === null || _a === void 0 ? void 0 : _a.map((item) => item.json)) || [];
        return json;
    }
};
__decorate([
    sequelize_typescript_1.HasMany(() => item_carrinho_model_1.default),
    __metadata("design:type", Array)
], Carrinho.prototype, "itens", void 0);
Carrinho = __decorate([
    sequelize_typescript_1.Table
], Carrinho);
exports.default = Carrinho;
//# sourceMappingURL=carrinho.model.js.map