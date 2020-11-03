import { Model, Table, Column, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Carrinho from './carrinho.model';
import Produto from './produto.model';
@Table export default class ItemCarrinho extends Model<ItemCarrinho> {
    @Column
    quantidade!: number;
    @Column

    @ForeignKey(() => Produto)
    produtoId!: number;
    @BelongsTo(() => Produto, { foreignKey: "produtoId" })
    public produto: Produto;

    @Column
    @ForeignKey(() => Carrinho)
    carrinhoId!: number;

    get json() {
        let json: any = this.toJSON();
        json.produto = this.produto?.json;
        return json;
    }
}