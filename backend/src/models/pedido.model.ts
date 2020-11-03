import { Model, Table, Column, HasMany, DataType } from 'sequelize-typescript';
import ItemPedido from './item-pedido.model';
@Table export default class Pedido extends Model<Pedido> {
  @HasMany(() => ItemPedido)
  itens: ItemPedido[];
  @Column
  formaDePagamento!: 'dinheiro' | 'cartao';
  @Column
  enderecoDeEntrega!: string;
  @Column({ type: DataType.FLOAT })
  valorTotal!: number;
  @Column
  status!: 'novo' | 'aceito' | 'saiu_pra_entrega' | 'entregue' | 'cancelado';
  get json(): any {
    let json: any = this.toJSON();    
    json.itens = this.itens?.map((item: ItemPedido) => item.json) || []
    return json;
  }
}