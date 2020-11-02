class MockDB {
    private produtoId = 1;
    private pedidoId = 1;
    private itemCarrinhoId = 1;
    private carrinhoId = 1;
    produtos:any = [];
    itensCarrinho:any = [];
    carrinhos:any = [];
    pedidos:any = [];
    
    constructor() {
        this.produtos.push(this.mockProduto());
        this.produtos.push(this.mockProduto());
        this.produtos.push(this.mockProduto());
        this.produtos.push(this.mockProduto());
        this.produtos.push(this.mockProduto());        
        // this.carrinhos.push(this.mockCarrinho());
    }

    mockProduto(ativo?:boolean, preco?:number) : any {
        let id = this.produtoId++;
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

    mockItemCarrinho (carrinhoId:number, produtoId:number, quantidade:number) {
        let id = this.itemCarrinhoId++; 
        return {
            id,
            quantidade,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            produtoId,
            carrinhoId
        }
    }

    mockCarrinho() : any {
        let id = this.carrinhoId++;
        return  { 
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()      
        };
    }

    async salvarProduto (produto:any): Promise<any> {
        if (produto.id) {
            let idx = this.produtos.findIndex((produtoSalvo:any)=>produto.id==produtoSalvo.id);
            if(idx<-1) {
                let error:any = new Error('Produto não encontrado');
                error['status'] = 404;
                throw error;
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

    copyProduto (produto:any) {
        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            imagem: produto.imagem,
            tags: produto.tags.map((tag:any)=>{return {id:tag.id, name:tag.name}}),
            status: produto.status,
        };
    }
    async getProdutos (apenasAtivos?:boolean) : Promise<any[]> {
        if (apenasAtivos) return this.produtos
            .filter((produto:any)=>produto.status)
            .map(this.copyProduto);
        return this.produtos;    
    }

    async getProduto (produtoId:number) : Promise<any> {
        let produto = this.produtos.find((produto:any)=>produto.id == produtoId)
        if (produto) return this.copyProduto(produto);
        return null;
    }

    async deleteProduto (produtoId:number) : Promise<any> {
        let idx = this.produtos.findIndex((produto:any)=>produtoId==produto.id);
        let produto = this.produtos[idx];
        if (idx > -1) {
            this.produtos.splice(idx, 1);
        }
        return produto;
    }

    async getCarrinho () : Promise<any> {
        let carrinho = this.carrinhos.length > 0 ? this.carrinhos[0] : null;
        if (!carrinho) {
            carrinho = this.mockCarrinho();
            this.carrinhos.push(carrinho);
        }
        let id = carrinho.id;        
        let createdAt = carrinho.createdAt;
        let updatedAt = carrinho.updatedAt;
        return { id, createdAt, updatedAt };
    }

    async salvarCarrinho (carrinho:any) : Promise<any> {        
        if (carrinho.id) {
            let idx = this.carrinhos.findIndex((carrinhoSalvo:any)=>carrinho.id==carrinhoSalvo.id);
            if(idx<0) {
                let carrinhoSalvo = this.mockCarrinho();
                this.carrinhos.push(carrinhoSalvo);
                return carrinhoSalvo;
            } else {
                let carrinhoSalvo = this.carrinhos[idx]; 
                carrinhoSalvo.updatedAt = new Date().toISOString();
                return carrinhoSalvo;
            }
        } else {
            let carrinhoSalvo = this.mockCarrinho();
            this.carrinhos.push(carrinhoSalvo);
            return carrinhoSalvo;
        }
    }   

    async salvaItemCarrinho (itemCarrinho:any) {
        // console.log('ITEMCARRINHO', itemCarrinho.carrinhoId, itemCarrinho.produtoId)
        if (itemCarrinho.id) {
            let idx = this.itensCarrinho.findIndex((itemCarrinhoSalvo:any)=>itemCarrinhoSalvo.id==itemCarrinho.id);
            if (idx < 0)  {             
                let error:any = new Error('Item não encontrado');
                error['status'] = 404;
                throw error;
            }            
            let itemCarrinhoSalvo = this.itensCarrinho[idx];
            itemCarrinhoSalvo.updatedAt = new Date().toISOString();
            itemCarrinhoSalvo.quantidade = itemCarrinho.quantidade;            
        } else {            
            let dadosItemCarrinho = this.mockItemCarrinho(itemCarrinho.carrinhoId, itemCarrinho.produtoId, itemCarrinho.quantidade);
            this.itensCarrinho.push(dadosItemCarrinho);
            itemCarrinho = dadosItemCarrinho;
        }
        return {
            id: itemCarrinho.id,
            quantidade: itemCarrinho.quantidade,
            createdAt: itemCarrinho.createdAt,
            updatedAt: itemCarrinho.updatedAt,
            produtoId: itemCarrinho.produtoId,
            carrinhoId: itemCarrinho.carrinhoId
        };
    }

    copyItemCarrinho (itemCarrinho:any) {
        return {
            id:itemCarrinho.id,
            quantidade:itemCarrinho.quantidade,
            createdAt:itemCarrinho.createdAt,
            updatedAt:itemCarrinho.updatedAt,
            produtoId:itemCarrinho.produtoId,
            carrinhoId:itemCarrinho.carrinhoId
        }
    }

    async getItemCarrinho (carrinhoId:number, produtoId:number) : Promise<any> {
        let itemCarrinho = this.itensCarrinho
            .find((itemCarrinho:any)=>{
                return itemCarrinho.carrinhoId == carrinhoId && itemCarrinho.produtoId == produtoId;
            });        
        if(itemCarrinho) {
            itemCarrinho = this.copyItemCarrinho(itemCarrinho);
            itemCarrinho.produto = await this.getProduto(itemCarrinho.produtoId);
        }
        return itemCarrinho;
    }

    async getItensCarrinho (carrinhoId:number) {
        // let itens = this.itensCarrinho
        //     .filter((itemCarrinho:any)=>itemCarrinho.carrinhoId==carrinhoId);
        let itens = this.itensCarrinho.map((itemCarrinho:any)=>{
            if (itemCarrinho) {
                itemCarrinho = this.copyItemCarrinho(itemCarrinho);                
            }
            return itemCarrinho;
        });
        for(let item of itens) {
            item.produto = await this.getProduto(item.produtoId);                    
        }
        return itens;            
    }

    async deleteItemsCarrinho (carrinhoId:number) {
        let qtd = this.itensCarrinho.length;
        this.itensCarrinho = this.itensCarrinho.filter((itemCarrinho:any)=>itemCarrinho.carrinhoId!=carrinhoId);
        qtd = qtd - this.itensCarrinho.length;
        return qtd;
    }

    async getPedidos () : Promise<any[]> {
        return this.pedidos;
    }

    

}
let db = new MockDB();
export = db;