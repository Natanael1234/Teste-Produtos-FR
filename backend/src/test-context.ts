import { app, server } from "./app";
import request from "supertest";
import { validaComparacaoProdutos, validaEstruturaCarrinho } from "./test-validators";

class TestContext {

    app = app;
    server = server;
    request = request;

    async get (url:string) {
        return await request(app).get(url);
    }

    async post (url:string, dados:any) {
        return await request(app).post(url).send(dados);
    }

    async put (url:string, dados:any) {
        return await request(app).put(url).send(dados);
    }

    async delete (url:string) {
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

    /** Cria um produto via API e efetua os testes básicos. */
    async criarProduto(dados: {
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

    async criarProdutoSimplificado(cod: string, options?: {
        status?: 'ativo' | 'inativo',
        preco?: number,
        tags: { id: number, name: string }[]
    }) {
        return await this.criarProduto({
            imagem: `http://www.imagens.com./produtos/produto_${cod}.jpg`,
            nome: `Produto #${cod}`,
            descricao: `Descrição do produto #${cod}`,
            preco: options?.preco != undefined ? options.preco : Math.round(Math.random() * 10000) / 100,
            status: options?.status == 'inativo' ? 'inativo' : 'ativo',
            tags: options?.tags || [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }]
        });
    }
    
    async buscarProdutos () {
        let response = await this.get('/produtos');
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produtos:any[] = response.body;    
        expect(Array.isArray(produtos)).toBe(true);
        return {response, produtos};
    }

    async buscarProduto (produtoId:number) {
        let response = await this.get(`/produto/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produto:any = response.body;        
        expect(produto.id).toBe(produtoId);
        return {response, produto};
    }

    async deletarProduto (produtoId:number) {
        let response = await this.delete(`/produto/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        let produto:any = response.body;        
        expect(produto.id).toBe(produtoId);
        return {response, produto};
    }

    /** Insere um produto no carrinho via API e efetua os testes básicos. */
    async adicionarProdutoNoCarrinho(produtoId: number, quantidade: number) {
        let response = await this.post('/carrinho/add/produto', {produtoId, quantidade});  // efetua a requisição
        // efetua testes básicos
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let carrinhoId = response.body.carrinhoId;
        expect(Number.isInteger(carrinhoId)).toBe(true); // se recebeu carrinhoId no retorno
        expect(carrinhoId).toBeGreaterThan(0); // se o carrinhoId é maior que 0
        return { response, carrinhoId, quantidade };
    };

    /** Busca carrinho via API e efetua os testes básicos. */
    async buscarCarrinho () {  
        let response = await this.get('/carrinho');
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json
        let carrinho = response.body;
        validaEstruturaCarrinho(carrinho);
        return {response, carrinho};
    }

    /** Esvazia carrinho via API e efetua os testes básicos. */
    async esvaziarCarrinho () {  
        let response = await this.delete('/carrinho');
        expect(response.status).toBe(200); // se status 200
        expect(response.type).toBe('application/json'); // se application/json        
        expect(response.body.sucesso).toBe(true);
        return {response};
    }


}

let testContext = new TestContext();

export = testContext;