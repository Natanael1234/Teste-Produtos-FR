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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let Produto = class Produto extends sequelize_typescript_1.Model {
    get tags() {
        let tags = this.getDataValue('tags_str');
        return tags ? JSON.parse(tags) : [];
    }
    set tags(tags) {
        this.setDataValue('tags_str', tags ? JSON.stringify(tags) : null);
    }
    get json() {
        let json = this.toJSON();
        json.tags = this.tags;
        delete json.tags_str;
        return json;
    }
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "nome", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "descricao", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], Produto.prototype, "preco", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "imagem", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "tags_str", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "status", void 0);
Produto = __decorate([
    sequelize_typescript_1.Table
], Produto);
exports.default = Produto;
//# sourceMappingURL=produto.model.js.map