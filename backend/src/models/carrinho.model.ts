import { Model, Table, Column, HasMany } from 'sequelize-typescript';
import ItemCarrinho from './item-carrinho.model';
@Table export default class Carrinho extends Model<Carrinho> {
    @HasMany(() => ItemCarrinho)
    itens: ItemCarrinho[];
    get json() {
        let json: any = this.toJSON();
        json.itens = this.itens?.map((item: ItemCarrinho) => item.json) || []
        return json;
    }
}