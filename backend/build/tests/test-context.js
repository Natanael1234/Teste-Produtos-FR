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
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const test_validators_1 = require("./test-validators");
class TestContext {
    constructor() {
        this._numTeste = 1;
        this.app = app_1.app;
        this.server = app_1.server;
        this.request = supertest_1.default;
    }
    get numTeste() {
        return this._numTeste++;
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield supertest_1.default(app_1.app).get(url);
        });
    }
    post(url, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield supertest_1.default(app_1.app).post(url).send(dados);
        });
    }
    put(url, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield supertest_1.default(app_1.app).put(url).send(dados);
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield supertest_1.default(app_1.app).delete(url);
        });
    }
    /** Atualiza um produto via API e efetua os testes básicos. */
    atualizarProduto(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            // cria produtos para inserir no carrinho
            let response = yield this.put("/produto", dados);
            // efetua testes básicos
            expect(response.status).toBe(200); // se status 200
            expect(response.type).toBe('application/json'); // se application/json
            let produto = response.body; // obtém o produto a partir do corpo da resposta
            test_validators_1.validaComparacaoProdutos(dados, produto);
            return { dados, response, produto };
        });
    }
    /**
     * Cria um produto e salva via API.
     * @param dados
     */
    criarProdutoCompleto(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            // cria produtos para inserir no carrinho
            let response = yield this.post("/produto", dados);
            // efetua testes básicos
            expect(response.status).toBe(200); // se status 200
            expect(response.type).toBe('application/json'); // se application/json
            let produto = response.body; // obtém o produto a partir do corpo da resposta
            test_validators_1.validaComparacaoProdutos(dados, produto);
            return { dados, response, produto };
        });
    }
    /**
     * Cria um produto e salva via API.
     * @param slug slug parta customizar nome, descrição e imagem do produto.
     * @param options
     */
    criarProduto(slug, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criarProdutoCompleto({
                imagem: `http://www.imagens.com./produtos/produto_${slug}.jpg`,
                nome: `Produto #${slug}`,
                descricao: `Descrição do produto #${slug}`,
                preco: (options === null || options === void 0 ? void 0 : options.preco) != undefined ? options.preco : Math.round(Math.random() * 10000) / 100,
                status: (options === null || options === void 0 ? void 0 : options.status) == 'inativo' ? 'inativo' : 'ativo',
                tags: (options === null || options === void 0 ? void 0 : options.tags) || [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }]
            });
        });
    }
    /** Busca os produtos */
    buscarProdutos(ativos) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.get(ativos == true ? '/produtos/compra' : '/produtos');
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            let produtos = response.body;
            expect(Array.isArray(produtos)).toBe(true);
            return { response, produtos };
        });
    }
    /**
     * busca um Produto.
     * @param produtoId id do produto a ser buscado.
     */
    buscarProduto(produtoId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.get(`/produto/${produtoId}`);
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            let produto = response.body;
            expect(produto.id).toBe(produtoId);
            return { response, produto };
        });
    }
    /**
     * Deleta um produto.
     * @param produtoId id do produto a ser deletado.
     */
    deletarProduto(produtoId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.delete(`/produto/${produtoId}`);
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            let produto = response.body;
            expect(produto.id).toBe(produtoId);
            return { response, produto };
        });
    }
    /** Insere um produto no carrinho via API e efetua os testes básicos. */
    adicionarProdutoNoCarrinho(produtoId, quantidade) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.post('/carrinho/add/produto', { produtoId, quantidade }); // efetua a requisição
            // efetua testes básicos
            expect(response.status).toBe(200); // se status 200
            expect(response.type).toBe('application/json'); // se application/json
            let carrinhoId = response.body.carrinhoId;
            expect(Number.isInteger(carrinhoId)).toBe(true); // se recebeu carrinhoId no retorno
            expect(carrinhoId).toBeGreaterThan(0); // se o carrinhoId é maior que 0
            return { response, carrinhoId, quantidade };
        });
    }
    ;
    /** Busca carrinho via API e efetua os testes básicos. */
    buscarCarrinho() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.get('/carrinho');
            expect(response.status).toBe(200); // se status 200
            expect(response.type).toBe('application/json'); // se application/json
            let carrinho = response.body;
            test_validators_1.validaEstruturaCarrinho(carrinho);
            return { response, carrinho };
        });
    }
    /** Esvazia carrinho via API e efetua os testes básicos. */
    esvaziarCarrinho() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.delete('/carrinho');
            expect(response.status).toBe(200); // se status 200
            expect(response.type).toBe('application/json'); // se application/json        
            expect(response.body.sucesso).toBe(true);
            return { response };
        });
    }
    /** Busca pedidos. */
    buscaPedidos() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.get('/pedidos');
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            expect(Array.isArray(response.body)).toBe(true);
            for (let pedido of response.body) {
                expect(pedido).toBeTruthy();
                test_validators_1.validaEstruturaPedido(pedido);
            }
            let pedidos = response.body;
            return { response, pedidos };
        });
    }
    /**
     * Busca um pedido por id
     * @param pedidoId id do pedido.
     */
    buscaPedido(pedidoId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.get(`/pedido/${pedidoId}`);
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            let pedido = response.body;
            test_validators_1.validaEstruturaPedido(pedido);
            return { response, pedido };
        });
    }
    /**
     * Finaliza um pedido e esvazia o carrinho.
     * @param carrinhoId id do carrinho.
     * @param formaDePagamento forma de pagamento.
     * @param enderecoDeEntrega endereço de entrega.
     */
    finalizarPedido(carrinhoId, formaDePagamento, enderecoDeEntrega) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.post('/pedido/finalizar', { carrinhoId, formaDePagamento, enderecoDeEntrega });
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            let pedidoId = response.body.pedidoId;
            expect(pedidoId).toBeTruthy();
            expect(Number.isInteger(pedidoId)).toBe(true);
            return { response, pedidoId };
        });
    }
    /**
     * Muda o status de um pedido.
     * @param pedidoId id do pedido.
     * @param status status do pedido.
     */
    mudaStatusDoPedido(pedidoId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.post('/pedido/status', { pedidoId, status });
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            expect(response.body.sucesso).toBe(true);
            return { response };
        });
    }
}
let testContext = new TestContext();
module.exports = testContext;
//# sourceMappingURL=test-context.js.map