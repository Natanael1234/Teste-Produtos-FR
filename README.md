# Leia Me

## Instalando dependências globais

É necessário ter o NodeJS instalado. Esse projeto foi testado com Node v12.18.3 instalado.

Abra um terminal e execute os seguintes comandos:


'npm i -g nodemon'

'npm i -g jest'


## Instalando as dependências locais do backend

Abra a pasta backend e execute:

'npm i'

## Banco de dados

O banco de dados (em localhost) é configurado no arquivo src/sequelize.js com as seguintes configurações:

'{
  dialect: 'mysql',
  logging: false,
  database: 'teste-produtos-fr',
  port: 3306,
  username: 'root',
  password: 'next'
}'

Os scripts do banco se encontram na pasta datavase

## Executando o Build

Abra um terminal na pasta backend e execute o seguinte comando:

'npm start'

A partir de agora o servidor receberá as requisições em localhost:3000.

## Depurar 

Para depurar o backend primeiro abra um terminal, na pasta backend, e execute o comando:

'npm start'

Em seguida abra o Visual Studio Code executar a confirguração de depuração 'Express Debug'.

## Executar Testes Automatizados

Delete o conteúdo da pasta build.

Para executar os testes automatizados abra um terminal, na pasta backend e execute o comando:

'npm run test'

## Documentação

Um arquivo OpenApi/Swagger, com a especificação da api, se encontra na pasta docs.

Nesta pasta também se encontram os arquivos do postman necessários para testar.
