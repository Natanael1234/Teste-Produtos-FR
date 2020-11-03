import { Model, Table, Column, HasMany, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import Pedido from './pedido.model';
import Produto from './produto.model';
@Table export default class ItemPedido extends Model<ItemPedido> {
    @Column
    nome!: string;
    @Column
        ({ type: DataType.FLOAT }) preco!: number;
    @Column quantidade!: number;

    @Column
    @ForeignKey(() => Produto)
    produtoId!: number;
    @BelongsTo(() => Produto, { foreignKey: "produtoId" })
    public produto: Produto;

    @Column
    @ForeignKey(() => Pedido)
    pedidoId!: number;
    get json(): any {
        let json: any = this.toJSON();
        json.produto = this.produto?.json;
        return json;
    }
}