import { app, server } from "../app";
import request from "supertest";
import { produtos } from "../routes/mockDB";
// import { Produto, Tag } from "./test-helper";

let numTeste = 1;

export class Tag {   constructor (public id:number, public name:string) {} }

export class Produto {
  id:number;
  nome:string;
  descricao:string;
  preco:number;
  imagem: string;
  // tags:{id:number, name:string}[];
  tags:Tag[];
  status:'ativo'|'inativo';
}

/** Obs.: Testes simplificados apenas para demonstração. */

describe("POST / - a simple api endpoint", () => {
  let id1:number;
  let id2:number;
  let numProdutos:number; 

  it(`${numTeste++} - Deve criar um produto`, async () => { 
    // monta os dados do produto a ser criado
    let dadosProduto:any = {};
    dadosProduto.imagem = 'http://www.imagens.com./produtos/produto_teste01.jpg'
    dadosProduto.nome = 'Produto #1';
    dadosProduto.descricao = 'Descrição do produto #1';
    dadosProduto.preco = 33.56;
    dadosProduto.status = 'ativo';
    dadosProduto.tags = [{id:1, name:'tag1'}, {id:2, name:'tag2'}];    
    // faz a requisição de criação do produto
    const res = await request(app)
      .post("/produto")
      .send(dadosProduto);
    // testa o resultado da requisição
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');      
    let body = res.body;
    expect(Number.isInteger(body.id)).toBe(true);    
    expect(body.id).toBeGreaterThan(0);
    id1 = body.id;
    expect(body.imagem).toBe(dadosProduto.imagem);
    expect(body.nome).toBe(dadosProduto.nome);
    expect(body.descricao).toBe(dadosProduto.descricao);
    expect(typeof body.preco == 'number').toBe(true);
    expect(body.id).toBeGreaterThanOrEqual(0);
    expect(body.tags?.length).toBe(2);
    expect(body.tags[0].id).toBe(dadosProduto.tags[0].id);
    expect(body.tags[0].name).toBe(dadosProduto.tags[0].name);
    expect(body.tags[1].id).toBe(dadosProduto.tags[1].id);
    expect(body.tags[1].name).toBe(dadosProduto.tags[1].name);
    expect(body.status).toBe(dadosProduto.status);
  });  

  it(`${numTeste++} - Deve atualizar um produto`, async () => { 
    // monta os dados do produto a ser atualizado
    let dadosProduto:any = {};
    dadosProduto.id = id1; 
    dadosProduto.imagem = 'http://www.imagens.com./produtos/produto_teste_01_alterado.jpg'
    dadosProduto.nome = 'Produto teste #1 alterado';
    dadosProduto.descricao = 'Descrição do produto teste #1 alterado';
    dadosProduto.preco = 33.56;
    dadosProduto.status = 'ativo';
    dadosProduto.tags = [{id:2, name:'tag3'}, {id:4, name:'tag4'}]; 
    // faz a requisição de atualização do produto
    
    let res = await request(app)
      .put("/produto")
      .send(dadosProduto);
    // testa o resultado da requisição
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    let body = res.body;
    expect(Number.isInteger(body.id)).toBe(true);    
    expect(body.id).toBeGreaterThan(0);    
    expect(body.imagem).toBe(dadosProduto.imagem);
    expect(body.nome).toBe(dadosProduto.nome);
    expect(body.descricao).toBe(dadosProduto.descricao);
    expect(typeof body.preco == 'number').toBe(true);
    expect(body.id).toBeGreaterThanOrEqual(0);
    expect(body.tags?.length).toBe(2);
    expect(body.tags[0].id).toBe(dadosProduto.tags[0].id);
    expect(body.tags[0].name).toBe(dadosProduto.tags[0].name);
    expect(body.tags[1].id).toBe(dadosProduto.tags[1].id);
    expect(body.tags[1].name).toBe(dadosProduto.tags[1].name);
    expect(body.status).toBe(dadosProduto.status);
  });
    
  it(`${numTeste++} - Deve buscar os produtos`, async () => {
    // faz uma consulta por produtos
    let resProdutos1 = await request(app).get('/produtos');      
    expect(resProdutos1.status).toBe(200);
    expect(resProdutos1.type).toBe('application/json');
    let body = resProdutos1.body;    
    expect(Array.isArray(resProdutos1.body)).toBe(true);    
    
    // cria um produto.
    let dadosProduto:any = {};
    dadosProduto.imagem = 'http://www.imagens.com./produtos/produto_teste_03.jpg'
    dadosProduto.nome = 'Produto teste #3';
    dadosProduto.descricao = 'Descrição do produto teste #3';
    dadosProduto.preco = 33.56;
    dadosProduto.status = 'ativo';
    dadosProduto.tags = [{id:2, name:'tag3'}, {id:4, name:'tag4'}]; 
    let res = await request(app)
      .post("/produto")
      .send(dadosProduto);   
    id2 = res.body.id;

    // faz uma segunda consulta por produtos
    let resProdutos2 = await request(app).get('/produtos');
    expect(resProdutos2.type).toBe('application/json');
    body = resProdutos2.body;    
    expect(Array.isArray(resProdutos2.body)).toBe(true);    
    
    // verifica se a segunda consulta possui um produto a mais
    expect(resProdutos1.body.length).toBe(resProdutos2.body.length - 1); 

  });

  it(`${numTeste++} - Deve buscar produtos por id.`, async ()=>{
    // busca dois produtos inseridos anteriormente.
    let res1 = await request(app).get(`/produto/${id1}`);
    let res2 = await request(app).get(`/produto/${id2}`);
    let prod1 = res1.body;
    let prod2 = res2.body;
    expect(prod1.id).not.toEqual(prod2.id);
    expect(prod1.nome).not.toEqual(prod2.nome);
    expect(prod1.descricao).not.toEqual(prod2.descricao);
  });

  it(`${numTeste++} - Deve deletar um produto`, async () => {
    // faz uma consulta por produtos
    let resProdutos1 = await request(app).get('/produtos');      
    expect(resProdutos1.status).toBe(200);
    expect(resProdutos1.type).toBe('application/json');
    let body = resProdutos1.body;    
    expect(Array.isArray(resProdutos1.body)).toBe(true);    
    
    // deleta um produto.
    let res = await request(app).delete(`/produto/${id2}`);
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body.id).toBe(id2);

    // faz uma segunda consulta por produtos
    let resProdutos2 = await request(app).get('/produtos');
    expect(resProdutos2.type).toBe('application/json');
    
    // verifica se a segunda consulta possui um produto a menos
    expect(resProdutos2.body.length).toBe(resProdutos1.body.length - 1);

    let resProduto = await request(app).get(`/produto/${id2}`);
    expect(resProduto.status).toBe(404);

  });

  afterAll(done => {
    server.close();
    done();
  });

});