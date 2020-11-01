/** 
 * Verifica se os dados de um produto (salvo) estão estruturalente correros. 
 * @param produto dados de produto a ter a estrutura validada.
 */
export function validaEstruturaProduto (produto:any) {
    // id
    expect(Number.isInteger(produto.id)).toBe(true); // se produto possui id inteiro  
    expect(produto.id).toBeGreaterThan(0); // se o id do produto é maior que zero.     
    // imagem 
    expect(produto.imagem).toBeTruthy();    
    // nome 
    expect(produto.nome).toBeTruthy();    
    // descrição 
    expect(produto.descricao).toBeTruthy();
    // preço      
    expect(typeof produto.preco == 'number').toBe(true); // produto deve possuir o preço numérico
    expect(produto.preco).toBeGreaterThanOrEqual(0); // produto deve possuir precos maior ou igual a zero
    // tags
    expect(Array.isArray(produto.tags)).toBe(true); // deve possuir o array de tags 
    produto.tags.map((tag: any) => { // estrutura do array de tags
        expect(Number.isInteger(produto.id)).toBe(true);
        expect(produto.id).toBeGreaterThan(0);
        expect(produto.nome).toBeTruthy();
        expect(typeof produto.nome === 'string').toBe(true);
    });        
    // status
    expect(['ativo', 'inativo']).toContain(produto.status);    
}

/** 
 * Verifica se os dados de um produto a ser salvo coincidem com os dados de um produto salvo. 
 * Verifica também se os dados dos produtos estão estruturalmente corretos.
 * @param produtoNaoSalvo dados enviados para salvamento na API.
 * @param produtoSalvo dados salvos e retornados pela API.
 */
export function validaComparacaoProdutos (produtoNaoSalvo:any, produtoSalvo:any) {   
    validaEstruturaProduto(produtoSalvo);
    // se atualizando de produto
    if (produtoNaoSalvo.id) {
        expect(produtoNaoSalvo.id).toBe(produtoSalvo.id);
        if (produtoNaoSalvo.imagem) expect(produtoNaoSalvo.imagem).toBe(produtoSalvo.imagem);
        if (produtoNaoSalvo.nome) expect(produtoNaoSalvo.nome).toBe(produtoSalvo.nome);
        if (produtoNaoSalvo.descricao) expect(produtoNaoSalvo.descricao).toBe(produtoSalvo.descricao);
        if (produtoNaoSalvo.preco) expect(produtoNaoSalvo.preco).toBe(produtoSalvo.preco);
        if (produtoNaoSalvo.status) expect(produtoNaoSalvo.status).toBe(produtoSalvo.status);
    } 
    // se criação de produto
    else {
        expect(produtoNaoSalvo.imagem).toBe(produtoSalvo.imagem);
        expect(produtoNaoSalvo.nome).toBe(produtoSalvo.nome);
        expect(produtoNaoSalvo.descricao).toBe(produtoSalvo.descricao);
        expect(produtoNaoSalvo.preco).toBe(produtoSalvo.preco);
        expect(produtoNaoSalvo.status).toBe(produtoSalvo.status);
    }
    if (!produtoNaoSalvo.tags) { // se não recebeu o array de tags: 
        expect(produtoSalvo.tags.length).toBe(0); // o produto deve possuir array de tags vazio
    }
    else { // se recebeu o array de tags verifica se:
        expect(produtoNaoSalvo.tags.length).toBe(produtoSalvo.tags.length); // o produto deve ter as mesma quantidade de tags recebidas
        // possui as mesmas tags
        produtoSalvo.tags.map((tag1: any) => {
            let tag2: any = produtoNaoSalvo.tags.map((tag2: any) => tag1.id == tag2.id && tag1.name == tag2.name);
            expect(tag2).toBeTruthy();
        });
    }
    
}

/**
 * Verifica se os dados de um carrinho estão estruturalmente corretos.
 * @param carrinho dados do carrinho a sererm validados.
 */
export function validaEstruturaCarrinho (carrinho:any) {
    expect(Number.isInteger(carrinho.id)).toBe(true); // se recebeu id do carrinho
    expect(carrinho.id).toBeGreaterThan(0); // se o id do carrinho é maior que 0
    expect(Array.isArray(carrinho.itens)); // verifica se o carrinho possui um array de itens    
    expect(carrinho.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // data de criação
    expect(carrinho.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // data de atualização        
    for(let item of carrinho.itens) { // para cada item do carrinho verifica se
        expect(item).toBeTruthy(); // item existe;
        expect(Number.isInteger(item.id)).toBe(true); // item possui id inteiro
        expect(item.id).toBeGreaterThan(0); // id do item é maior que 0
        expect(item.produto).toBeTruthy(); // item possui produto
        expect(Number.isInteger(item.produto.id)).toBe(true); // produto possui id inteiro
        expect(item.produto.id).toBeGreaterThan(0); // id do produto é maior que 0
        expect(Number.isInteger(item.quantidade)).toBe(true); // item possui quantidade
        expect(item.quantidade).toBeGreaterThanOrEqual(0); // quantidade do item maior ou igual a 0    
    }
}