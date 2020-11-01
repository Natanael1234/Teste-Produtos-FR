import ctx from '../test-context';

let numTeste = 1;

/** Obs.: Testes simplificados apenas para demonstração. */

describe("Teste da API", () => {
  
  let numProdutos:number;   

  it(`${numTeste++} - Deve criar um produto`, async () => { 
    // monta os dados do produto a ser criado
    let resProd = await ctx.criarProdutoSimplificado('teste01');
  });  

  it(`${numTeste++} - Deve atualizar um produto`, async () => { 

    let prodParaAtualizar = await ctx.criarProdutoSimplificado('produto_para_atualizar_01');

    // monta os dados do produto a ser atualizado
    await ctx.atualizarProduto({
      id:  prodParaAtualizar.produto.id,
      imagem:  'http://www.imagens.com./produtos/produto_teste_01_alterado.jpg',
      nome:  'Produto teste #1 alterado',
      descricao:  'Descrição do produto teste #1 alterado',
      preco:  33.56,
      status:  'ativo',
      tags:  [{id:2, name:'tag3'}, {id:4, name:'tag4'}]
    });    
    
  });
    
  it(`${numTeste++} - Deve buscar os produtos`, async () => {
    // faz uma consulta por produtos
    let resProdutos1 = await ctx.buscarProdutos();      
    
    // cria um produto.
    await ctx.criarProdutoSimplificado('teste_03');

    // faz uma segunda consulta por produtos
    let resProdutos2 = await ctx.buscarProdutos();
    
    // verifica se a segunda consulta possui um produto a mais
    expect(resProdutos1.produtos.length).toBe(resProdutos2.produtos.length - 1); 

  });

  it(`${numTeste++} - Deve buscar produtos por id.`, async ()=>{
    let criacao1 = await ctx.criarProdutoSimplificado('teste_04_busca');
    let criacao2 = await ctx.criarProdutoSimplificado('teste_05_busca');

    // busca dois produtos inseridos anteriormente.
    let busca1 = await ctx.buscarProduto(criacao1.produto.id);
    let busca2 = await ctx.buscarProduto(criacao2.produto.id);
    
    expect(busca1.produto.id).not.toEqual(busca2.produto.id);
    expect(busca1.produto.nome).not.toEqual(busca2.produto.nome);
    expect(busca1.produto.descricao).not.toEqual(busca2.produto.descricao);
  });

  it(`${numTeste++} - Deve deletar um produto`, async () => {
    // cria um produto
    let criacao1 = await ctx.criarProdutoSimplificado('teste_06_delecao');

    // faz uma consulta por produtos antes da deleção
    let listaAntes = await ctx.buscarProdutos();       
    
    // deleta um produto.
    let delecao = await ctx.deletarProduto(criacao1.produto.id);
    
    // faz uma consulta por produtos após a deleção
    let listaDepois = await ctx.buscarProdutos();
        
    // verifica se a segunda consulta possui um produto a menos
    expect(listaDepois.produtos.length).toBe(listaAntes.produtos.length - 1);

    let busca1 = await ctx.get(`/produto/${criacao1.produto.id}`);
    expect(busca1.status).toBe(404);

  });

  it(`${numTeste++} - Deve buscar o carrinho`, async () => {
    let resCarrinho = await ctx.buscarCarrinho();
  }); 

  it (`${numTeste++} - Deve inserir produtos no carrinho`, async ()=>{   

    // busca o carrinho
    let antes = await ctx.buscarCarrinho();

    // cria produtos para inserir no carrinho
    let create1 = await ctx.criarProdutoSimplificado('teste_01_carrinho');
    let insert1 = await ctx.adicionarProdutoNoCarrinho(create1.produto.id, 3);
    // verifica se a inserção do produto no carrinho retornou o carrinhoId correto
    expect(insert1.carrinhoId).toBe(antes.carrinho.id);

    let create2 = await ctx.criarProdutoSimplificado('test_02_carrinho');    
    let insert2 = await ctx.adicionarProdutoNoCarrinho(create2.produto.id, 2); 
    // verifica se a inserção do produto no carrinho retornou o carrinhoId correto
    expect(insert2.carrinhoId).toBe(antes.carrinho.id);          
        
    // busca o carrinho novamente
    let depois = await ctx.buscarCarrinho();

    // verifica se a segunda consulta possui dois itens a mais que a primeira
    expect(antes.carrinho.itens.length).toBe(depois.carrinho.itens.length - 2);

    // verifica se um produto está no carrinho
    function validaItensCarrinho (carrinho:any, produto:any, quantidade:number) {                  
      let itensFiltrados = carrinho.itens.filter((item:any)=>{ // para cada item do carrinho verifica         
        return item?.produto.id == produto.id; // filtra itens do carrinho relacionados a produtos com dado produtoId
      });
      expect(itensFiltrados.length).toBe(1); // verifica se achou o item com o produto
      let itemFiltrado = itensFiltrados[0]; 
      expect(itemFiltrado.quantidade).toBe(quantidade);
      expect(itemFiltrado.produto.nome).toBe(produto.nome); //  verifica se o produto no item possui o mesmo nome
    }
    
    validaItensCarrinho(depois.carrinho, create1.produto, insert1.quantidade);
    validaItensCarrinho(depois.carrinho, create2.produto, insert2.quantidade);

    // TODO: insere mais produtos para verificar se incrementou
    
  });
  
  it(`${numTeste++} - Deve limpar o carrinho`, async () => {
    // cria produtos para inserir no carrinho
    let create1 = await ctx.criarProdutoSimplificado('teste_01_limpa_carrinho');
    let create2 = await ctx.criarProdutoSimplificado('teste_02_limpa_carrinho');
    let insert1 = await ctx.adicionarProdutoNoCarrinho(create1.produto.id, 3);
    let insert2 = await ctx.adicionarProdutoNoCarrinho(create1.produto.id, 1);
    // busca o carrinho e verifica se está vazio    
    let resEsvaziar = await ctx.esvaziarCarrinho();    
    let depois = await ctx.buscarCarrinho();
    expect(depois.carrinho.itens.length).toBe(0);
  }); 

  afterAll(done => {
    ctx.server.close();
    done();
  });

});