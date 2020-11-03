import { Model, Table, Column, DataType } from 'sequelize-typescript';
@Table
export default class Produto extends Model<Produto> {
  @Column
  nome!: string;
  @Column
  descricao!: string;
  @Column({ type: DataType.FLOAT })
  preco!: number;
  @Column
  imagem!: string;
  @Column
  tags_str!: string;
  @Column
  status!: 'ativo' | 'inativo';
  get tags(): { id: number, name: string }[] {
    let tags = this.getDataValue('tags_str');
    return tags ? JSON.parse(tags) : [];
  }
  set tags(tags: { id: number, name: string }[]) {
    this.setDataValue('tags_str', tags ? JSON.stringify(tags) : null);
  }
  get json() {
    let json: any = this.toJSON();
    json.tags = this.tags;
    delete json.tags_str;
    return json;
  }
}