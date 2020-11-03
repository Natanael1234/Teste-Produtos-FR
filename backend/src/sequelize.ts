import {Sequelize} from 'sequelize-typescript';
import Carrinho from './models/carrinho.model';
import ItemCarrinho from './models/item-carrinho.model';
import ItemPedido from './models/item-pedido.model';
import Pedido from './models/pedido.model';
import Produto from './models/produto.model';
const sequelize = new Sequelize({
  dialect: 'mysql',
  logging: false,
  database: 'teste-produtos-fr',
  port: 3306,
  username: 'root',
  password: 'next'//,  
  // models,
});

sequelize.addModels([
  Produto, 
  Carrinho, 
  ItemCarrinho,
  Pedido,
  ItemPedido
]); 

export {
  Produto, 
  Carrinho, 
  ItemCarrinho,
  Pedido,
  ItemPedido
};
export default sequelize;