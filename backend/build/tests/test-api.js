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
const test_context_1 = __importDefault(require("./test-context"));
/** Obs.: Testes simplificados apenas para demonstração. */
let testeAPI = () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(30000);
        // recria a base de dados.
        // Em uma aplicação real deverá ser restrita a um ambiente de testes.
        let ret = yield sequelize_1.default.sync({ force: true });
    }));
    it(`${test_context_1.default.numTeste} - Deve criar um produto`, () => __awaiter(void 0, void 0, void 0, function* () {
        // monta os dados do produto a ser criado
        let resProd = yield test_context_1.default.criarProduto('teste01');
    }));
    it(`${test_context_1.default.numTeste} - Deve atualizar um produto`, () => __awaiter(void 0, void 0, void 0, function* () {
        let prodParaAtualizar = yield test_context_1.default.criarProduto('produto_para_atualizar_01');
        // monta os dados do produto a ser atualizado
        yield test_context_1.default.atualizarProduto({
            id: prodParaAtualizar.produto.id,
            imagem: 'http://www.imagens.com./produtos/produto_teste_01_alterado.jpg',
            nome: 'Produto teste #1 alterado',
            descricao: 'Descrição do produto teste #1 alterado',
            preco: 33.56,
            status: 'ativo',
            tags: [{ id: 2, name: 'tag3' }, { id: 4, name: 'tag4' }]
        });
    }));
    it(`${test_context_1.default.numTeste} - Deve buscar os produtos`, () => __awaiter(void 0, void 0, void 0, function* () {
        // faz uma consulta por produtos
        let resProdutos1 = yield test_context_1.default.buscarProdutos();
        // cria um produto.
        yield test_context_1.default.criarProduto('teste_03');
        // faz uma segunda consulta por produtos
        let resProdutos2 = yield test_context_1.default.buscarProdutos();
        // verifica se a segunda consulta possui um produto a mais
        expect(resProdutos1.produtos.length).toBe(resProdutos2.produtos.length - 1);
    }));
    it(`${test_context_1.default.numTeste} - Deve buscar os produtos para compra (ativos)`, () => __awaiter(void 0, void 0, void 0, function* () {
        // faz uma consulta por produtos ativos
        let resProdutos1 = yield test_context_1.default.buscarProdutos(true);
        // cria um produto ativo.
        yield test_context_1.default.criarProduto('teste_01_ativo', { status: 'ativo' });
        // cria um produto inativo.
        yield test_context_1.default.criarProduto('teste_01_inativo', { status: 'inativo' });
        // faz uma segunda consulta por produtos ativos
        let resProdutos2 = yield test_context_1.default.buscarProdutos(true);
        // verifica se a segunda consulta possui apenas um produto a mais
        expect(resProdutos1.produtos.length).toBe(resProdutos2.produtos.length - 1);
        // busca produtos inativos na consulta
        let possuiInativos = !!resProdutos2.produtos.find((produto) => produto.status == 'inativo');
        expect(possuiInativos).toBe(false);
    }));
    it(`${test_context_1.default.numTeste} - Deve buscar produtos por id.`, () => __awaiter(void 0, void 0, void 0, function* () {
        let criacao1 = yield test_context_1.default.criarProduto('teste_04_busca');
        let criacao2 = yield test_context_1.default.criarProduto('teste_05_busca');
        // busca dois produtos inseridos anteriormente.
        let busca1 = yield test_context_1.default.buscarProduto(criacao1.produto.id);
        let busca2 = yield test_context_1.default.buscarProduto(criacao2.produto.id);
        expect(busca1.produto.id).not.toEqual(busca2.produto.id);
        expect(busca1.produto.nome).not.toEqual(busca2.produto.nome);
        expect(busca1.produto.descricao).not.toEqual(busca2.produto.descricao);
    }));
    it(`${test_context_1.default.numTeste} - Deve deletar um produto`, () => __awaiter(void 0, void 0, void 0, function* () {
        // cria um produto
        let criacao1 = yield test_context_1.default.criarProduto('teste_06_delecao');
        // faz uma consulta por produtos antes da deleção
        let listaAntes = yield test_context_1.default.buscarProdutos();
        // deleta um produto.
        let delecao = yield test_context_1.default.deletarProduto(criacao1.produto.id);
        // faz uma consulta por produtos após a deleção
        let listaDepois = yield test_context_1.default.buscarProdutos();
        // verifica se a segunda consulta possui um produto a menos
        expect(listaDepois.produtos.length).toBe(listaAntes.produtos.length - 1);
        let busca1 = yield test_context_1.default.get(`/produto/${criacao1.produto.id}`);
        expect(busca1.status).toBe(404);
    }));
    it(`${test_context_1.default.numTeste} - Deve buscar o carrinho`, () => __awaiter(void 0, void 0, void 0, function* () {
        let resCarrinho = yield test_context_1.default.buscarCarrinho();
    }));
    it(`${test_context_1.default.numTeste} - Deve inserir produtos no carrinho`, () => __awaiter(void 0, void 0, void 0, function* () {
        // busca o carrinho
        let antes = yield test_context_1.default.buscarCarrinho();
        // cria produtos para inserir no carrinho
        let create1 = yield test_context_1.default.criarProduto('teste_01_carrinho');
        let insert1 = yield test_context_1.default.adicionarProdutoNoCarrinho(create1.produto.id, 3);
        // verifica se a inserção do produto no carrinho retornou o carrinhoId correto
        expect(insert1.carrinhoId).toBe(antes.carrinho.id);
        let create2 = yield test_context_1.default.criarProduto('test_02_carrinho');
        let insert2 = yield test_context_1.default.adicionarProdutoNoCarrinho(create2.produto.id, 2);
        // verifica se a inserção do produto no carrinho retornou o carrinhoId correto
        expect(insert2.carrinhoId).toBe(antes.carrinho.id);
        // busca o carrinho novamente
        let depois = yield test_context_1.default.buscarCarrinho();
        // verifica se a segunda consulta possui dois itens a mais que a primeira
        expect(antes.carrinho.itens.length).toBe(depois.carrinho.itens.length - 2);
        // verifica se um produto está no carrinho
        function validaItensCarrinho(carrinho, produto, quantidade) {
            let itensFiltrados = carrinho.itens.filter((item) => {
                return (item === null || item === void 0 ? void 0 : item.produto.id) == produto.id; // filtra itens do carrinho relacionados a produtos com dado produtoId
            });
            expect(itensFiltrados.length).toBe(1); // verifica se achou o item com o produto
            let itemFiltrado = itensFiltrados[0];
            expect(itemFiltrado.quantidade).toBe(quantidade);
            expect(itemFiltrado.produto.nome).toBe(produto.nome); //  verifica se o produto no item possui o mesmo nome
        }
        validaItensCarrinho(depois.carrinho, create1.produto, insert1.quantidade);
        validaItensCarrinho(depois.carrinho, create2.produto, insert2.quantidade);
        // TODO: insere mais produtos para verificar se incrementou
    }));
    it(`${test_context_1.default.numTeste} - Deve limpar o carrinho`, () => __awaiter(void 0, void 0, void 0, function* () {
        // cria produtos para inserir no carrinho
        let create1 = yield test_context_1.default.criarProduto('teste_01_limpa_carrinho');
        let create2 = yield test_context_1.default.criarProduto('teste_02_limpa_carrinho');
        let insert1 = yield test_context_1.default.adicionarProdutoNoCarrinho(create1.produto.id, 3);
        let insert2 = yield test_context_1.default.adicionarProdutoNoCarrinho(create1.produto.id, 1);
        // busca o carrinho e verifica se está vazio    
        let resEsvaziar = yield test_context_1.default.esvaziarCarrinho();
        let depois = yield test_context_1.default.buscarCarrinho();
        expect(depois.carrinho.itens.length).toBe(0);
    }));
    it(`${test_context_1.default.numTeste} - Deve buscar pedidos.`, () => __awaiter(void 0, void 0, void 0, function* () {
        let resPedido = yield test_context_1.default.buscaPedidos();
    }));
    it(`${test_context_1.default.numTeste} - Deve finalizar um pedido.`, () => __awaiter(void 0, void 0, void 0, function* () {
        // esvazia o carrinho
        let resEsvaziar = yield test_context_1.default.esvaziarCarrinho();
        // busca o carrinho
        let resCarrinho1 = yield test_context_1.default.buscarCarrinho();
        // busca os pedidos
        let resPedidos1 = yield test_context_1.default.buscaPedidos();
        // cria produtos
        let resCreate1 = yield test_context_1.default.criarProduto('teste_finalizar_pedido_01');
        let resCreate2 = yield test_context_1.default.criarProduto('teste_finalizar_pedido_02');
        // adiciona produtos no carrinho
        let resInserir1 = yield test_context_1.default.adicionarProdutoNoCarrinho(resCreate1.produto.id, 4);
        let resInserir2 = yield test_context_1.default.adicionarProdutoNoCarrinho(resCreate2.produto.id, 6);
        // finaliza pedido
        let resFinaliza = yield test_context_1.default.finalizarPedido(resCarrinho1.carrinho.id, 'dinheiro', 'Rua das Camélias, 7, Cidade das Flores');
        // busca o pedido criado
        let resPedido = yield test_context_1.default.buscaPedido(resFinaliza.pedidoId);
        // deve haver dois itens no pedido
        expect(resPedido.pedido.itens.length).toBe(2);
        // busca o carrinho novamente
        let resCarrinho2 = yield test_context_1.default.buscarCarrinho();
        // verifica se o carrinho está vazio
        expect(resCarrinho2.carrinho.itens.length).toBe(0);
        // busca os pedidos novamente
        let resPedidos2 = yield test_context_1.default.buscaPedidos();
        // verifica se há um pedido a mais
        expect(resPedidos1.pedidos.length).toBe(resPedidos2.pedidos.length - 1);
    }));
    it(`${test_context_1.default.numTeste} - Deve mudar o status dos pedido.`, () => __awaiter(void 0, void 0, void 0, function* () {
        // cria produtos
        let resCreate1 = yield test_context_1.default.criarProduto('teste_muda_satus_pedido_01');
        let resCreate2 = yield test_context_1.default.criarProduto('teste_muda_satus_pedido_02');
        let resCarrinho1 = yield test_context_1.default.buscarCarrinho();
        // esvazia o carrinho
        let resEsvaziar = yield test_context_1.default.esvaziarCarrinho();
        // busca o carrinho
        // adiciona produtos no carrinho
        let resInserir1 = yield test_context_1.default.adicionarProdutoNoCarrinho(resCreate1.produto.id, 4);
        let resInserir2 = yield test_context_1.default.adicionarProdutoNoCarrinho(resCreate2.produto.id, 6);
        // finaliza pedido
        let resFinaliza = yield test_context_1.default.finalizarPedido(resCarrinho1.carrinho.id, 'cartao', 'Rua das Camélias, 7, Cidade das Flores');
        // testa mudança de status
        let testaStatus = (pedidoId, statusEnvio, statusEsperado, statusCodeEsperado) => __awaiter(void 0, void 0, void 0, function* () {
            // busca o status      
            let resStatus = yield test_context_1.default.put('/pedido/status', { pedidoId, status: statusEnvio });
            // verifica se recebeu o código esperado
            expect(resStatus.status).toBe(statusCodeEsperado);
            // busca o pedido
            let resPedido = yield test_context_1.default.buscaPedido(pedidoId);
            // verifica se contém o status esperado
            expect(resPedido.pedido.status).toBe(statusEsperado);
        });
        // partindo do princípio de que o pedido fechado como 'novo' 
        // testa primeiro as transições de status que devem retornar erro e as permitidas
        yield testaStatus(resFinaliza.pedidoId, 'aceito', 'aceito', 200);
        yield testaStatus(resFinaliza.pedidoId, 'saiu_pra_entrega', 'saiu_pra_entrega', 200);
        yield testaStatus(resFinaliza.pedidoId, 'entregue', 'entregue', 200);
        yield testaStatus(resFinaliza.pedidoId, 'cancelado', 'cancelado', 200);
        yield testaStatus(resFinaliza.pedidoId, 'novo', 'cancelado', 400);
        // TODO: testar outros cenários
    }));
    afterAll(done => {
        test_context_1.default.server.close();
        done();
    });
};
exports.default = testeAPI;
//# sourceMappingURL=test-api.js.map