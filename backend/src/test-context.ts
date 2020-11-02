import { app, server } from "./app";
import request from "supertest";
import { validaComparacaoProdutos, validaEstruturaCarrinho, validaEstruturaPedido } from "./test-validators";

class TestContext {

    app = app;
    server = server;
    request = request;

    async get(url: string) {
        return await request(app).get(url);
    }

    async post(url: string, dados: any) {
        return await request(app).post(url).send(dados);
    }

    async put(url: string, dados: any) {
        return await request(app).put(url).send(dados);
    }

    async delete(url: string) {
        return await request(app).delete(url);
    }

    /** Atualiza um produto via API e efetua os testes básicos. */
    async atualizarProduto(dados: {
        id: number,
        nome?: string,
        descricao?: string,
        imagem?: string,
        preco?: number,
        status?: 'ativo' | 'inativo',
        tags?: { id: number, name: string }[]
    }) {
        // cria produtos para inserir no carrinho
        let response = await this.put("/produto", dados);
        // efetua testes básicos
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let produto = response.body; // obtém o produto a partir do corpo da resposta
        validaComparacaoProdutos(dados, produto);
        return { dados, response, produto };
    }

    /**
     * Cria um produto e salva via API.
     * @param dados 
     */
    async criarProdutoCompleto(dados: {
        id?: number,
        nome: string,
        descricao: string,
        imagem: string,
        preco: number,
        status?: 'ativo' | 'inativo',
        tags?: { id: number, name: string }[]
    }) {
        // cria produtos para inserir no carrinho
        let response = await this.post("/produto", dados);
        // efetua testes básicos
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let produto = response.body; // obtém o produto a partir do corpo da resposta
        validaComparacaoProdutos(dados, produto);
        return { dados, response, produto };
    }

    /**
     * Cria um produto e salva via API.
     * @param slug slug parta customizar nome, descrição e imagem do produto.
     * @param options 
     */
    async criarProduto(slug: string, options?: {
        status?: 'ativo' | 'inativo',
        preco?: number,
        tags: { id: number, name: string }[]
    }) {
        return await this.criarProdutoCompleto({
            imagem: `http://www.imagens.com./produtos/produto_${slug}.jpg`,
            nome: `Produto #${slug}`,
            descricao: `Descrição do produto #${slug}`,
            preco: options?.preco != undefined ? options.preco : Math.round(Math.random() * 10000) / 100,
            status: options?.status == 'inativo' ? 'inativo' : 'ativo',
            tags: options?.tags || [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }]
        });
    }

    /** Busca os produtos */
    async buscarProdutos() {
        let response = await this.get('/produtos');
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produtos: any[] = response.body;
        expect(Array.isArray(produtos)).toBe(true);
        return { response, produtos };
    }

    /**
     * busca um Produto.
     * @param produtoId id do produto a ser buscado.
     */
    async buscarProduto(produtoId: number) {
        let response = await this.get(`/produto/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produto: any = response.body;
        expect(produto.id).toBe(produtoId);
        return { response, produto };
    }

    /**
     * Deleta um produto.
     * @param produtoId id do produto a ser deletado.
     */
    async deletarProduto(produtoId: number) {
        let response = await this.delete(`/produto/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produto: any = response.body;
        expect(produto.id).toBe(produtoId);
        return { response, produto };
    }

    /** Insere um produto no carrinho via API e efetua os testes básicos. */
    async adicionarProdutoNoCarrinho(produtoId: number, quantidade: number) {
        let response = await this.post('/carrinho/add/produto', { produtoId, quantidade });  // efetua a requisição
        // efetua testes básicos
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let carrinhoId = response.body.carrinhoId;
        expect(Number.isInteger(carrinhoId)).toBe(true); // se recebeu carrinhoId no retorno
        expect(carrinhoId).toBeGreaterThan(0); // se o carrinhoId é maior que 0
        return { response, carrinhoId, quantidade };
    };

    /** Busca carrinho via API e efetua os testes básicos. */
    async buscarCarrinho() {
        let response = await this.get('/carrinho');
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let carrinho = response.body;
        validaEstruturaCarrinho(carrinho);
        return { response, carrinho };
    }

    /** Esvazia carrinho via API e efetua os testes básicos. */
    async esvaziarCarrinho() {
        let response = await this.delete('/carrinho');
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json        
        expect(response.body.sucesso).toBe(true);
        return { response };
    }

    /** Busca pedidos. */
    async buscaPedidos() {
        let response = await this.get('/pedidos');
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        for (let pedido of response.body) {
            expect(pedido).toBeTruthy();
            validaEstruturaPedido(pedido);
        }
        let pedidos = response.body;
        return { response, pedidos };
    }

    /** 
     * Busca um pedido por id
     * @param pedidoId id do pedido.
     */
    async buscaPedido (pedidoId:number) {
        let response = await this.get(`/pedido/${pedidoId}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');        
        let pedido = response.body;
        validaEstruturaPedido(pedido);        
        return { response, pedido };
    }

    /**
     * Finaliza um pedido e esvazia o carrinho.
     * @param carrinhoId id do carrinho.
     * @param formaDePagamento forma de pagamento.
     * @param enderecoDeEntrega endereço de entrega.
     */
    async finalizarPedido(carrinhoId: number, formaDePagamento: 'dinheiro' | 'cartao', enderecoDeEntrega: string) {
        let response = await this.post('/pedido/finalizar', { carrinhoId, formaDePagamento, enderecoDeEntrega });
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let pedidoId = response.body.pedidoId;
        expect(pedidoId).toBeTruthy();
        expect(Number.isInteger(pedidoId)).toBe(true);
        return { response, pedidoId };
    }

    /**
     * Muda o status de um pedido.
     * @param pedidoId id do pedido.
     * @param status status do pedido.
     */
    async mudaStatusDoPedido(pedidoId: number, status: 'novo' | 'aceito' | 'saiu_pra_entrega' | 'entregue' | 'cancelado') {
        let response = await this.post('/pedido/status', { pedidoId, status });
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.body.sucesso).toBe(true)
        return { response };
    }
    


}

let testContext = new TestContext();

export = testContext;