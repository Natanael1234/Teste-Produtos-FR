class MockDB {
    private produtoId = 1;
    private pedidoId = 1;
    private carrinhoId = 1;
    produtos:any = [];
    carrinhos:any = [];
    pedidos:any = [];
    
    constructor() {
        this.produtos.push(this.mockProduto(this.produtoId++));
        this.produtos.push(this.mockProduto(this.produtoId++));
        this.produtos.push(this.mockProduto(this.produtoId++));
        this.produtos.push(this.mockProduto(this.produtoId++));
        this.produtos.push(this.mockProduto(this.produtoId++));        
        this.carrinhos.push(this.mockCarrinho(this.carrinhoId++));
    }

    mockProduto(id:number, ativo?:boolean, preco?:number) : any {
        return  {
            id,
            nome: `Produto #${id}`,
            descricao: `Descrição do produto #${id}`,
            preco: preco == undefined ? 25 : preco,
            imagem: `https://images.com/produtos/${id}.jpg`,
            tags: [ { "id": 1, "name": "tag1" }, { "id": 2, "name": "tag2" } ],
            status: ativo == undefined || ativo == true ? 'ativo' : 'inativo'
        };
    }

    mockCarrinho(id:number, ativo?:boolean, preco?:number) : any {
        return  {
            id,
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),            
        };
    }

    async salvarProduto (produto:any): Promise<any> {
        if (produto.id) {
            let idx = this.produtos.findIndex((produtoSalvo:any)=>produto.id==produtoSalvo.id);
            if(idx<-1) {
                let error:any = new Error('Produto não encontrado');
                error['status'] = 404;
            };
            let produtoSalvo = this.produtos[idx];
            if (produto.nome) produtoSalvo.nome = produto.nome;
            if (produto.descricao) produtoSalvo.descricao = produto.descricao;
            if (produto.preco != undefined && produto.preco) produtoSalvo.preco = produto.preco;
            if (produto.imagem) produtoSalvo.imagem = produto.imagem;
            if (produto.tags) produtoSalvo.tags = produto.tags;
            if (produto.status) produtoSalvo.status = produto.status;
            return produto;
        } else {
            produto.id = this.produtoId++;
            this.produtos.push(produto);
            return produto;
        }
    }
    
    async getProdutos (apenasAtivos?:boolean) : Promise<any[]> {
        if (apenasAtivos) return this.produtos.filter((produto:any)=>produto.status);
        return this.produtos;    
    }

    async getProduto (produtoId:number) : Promise<any> {
        return this.produtos.find((produto:any)=>produto.id == produtoId);
    }

    async deleteProduto (produtoId:number) : Promise<any> {
        let idx = this.produtos.findIndex((produto:any)=>produtoId==produto.id);
        let produto = this.produtos[idx];
        console.log(produto.id);
        if (idx > -1) {
            this.produtos.splice(idx, 1);
        }
        return produto;
    }

    async getCarrinho () : Promise<any> {
        let carrinho = this.carrinhos.length > 0 ? this.carrinhos[0] : null;
        if (!carrinho) {
            carrinho = this.mockCarrinho(1);
            this.carrinhos.push(carrinho);
        }
        return carrinho;
    }

    async getPedidos () : Promise<any[]> {
        return this.pedidos;
    }

    

}
let db = new MockDB();
export = db;