"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("../sequelize"));
/** Gera as tabelas do banco de dados. ATENÇÃO: Apaga as tabelas já existentes. */
let initDB = () => {
    it('Deve gerar as tabelas no banco de dados', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            jest.setTimeout(30000);
            console.log('Inicializando base de dados...');
            let ret = yield sequelize_1.default.sync({ force: true });
            expect(ret).toBeTruthy();
        }
        catch (error) {
            expect(error).toBeFalsy();
            console.error(error);
        }
    }));
};
exports.default = initDB;
//# sourceMappingURL=init-database.js.map