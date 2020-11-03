import { sequelize } from "../sequelize";

/** Gera as tabelas do banco de dados. ATENÇÃO: Apaga as tabelas já existentes. */
let initDB = () => {  

    it ('Deve gerar as tabelas no banco de dados', async ()=>{
        try {
          jest.setTimeout(30000);
          console.log('Inicializando base de dados...')
          let ret = await sequelize.sync({ force: true });
          expect(ret).toBeTruthy();
        } catch (error) {
          expect(error).toBeFalsy();
          console.error(error);
        }
    })
};
export default initDB;