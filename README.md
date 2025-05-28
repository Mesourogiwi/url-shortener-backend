## Descrição 

Esse é um projeto de um desafio técnico que consiste em encurtar URLs, disponibilizar para o usuário, contendo o número de acessos e um tempo de expiração definido por uma variável de ambiente dentro do .env, além de usar Redis para manter um cache das requisições. As tecnologias utilizadas são:
* NestJs
* DrizzleORM
* MySQL
* Redis

## Setup inicial do projeto

Rode o comando

```bash
$ npm install
```

Após isso, suba a imagem do docker que contém o MySQL e o Redis:

```bash
$ docker compose up
```

Também recomendo que adicione um arquivo .env contendo a string de conexão do seu banco e setando os minutos de expiração do link a ser gerado, como mostra no exemplo abaixo:

```
DATABASE_URL=mysql://root:root@127.0.0.1:3307/url-shortener

EXPIRATION_TIME_MINUTES=10
```

## Testes

Para executar testes unitários, e2e e gerar o relatório, rode os comandos:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Funcionalidade

Testei as funcionalidades através do Insomnia

### Criando um link encurtado

![image](https://github.com/user-attachments/assets/0848f30e-d18b-4002-a2db-94f71a4cf1db)

### Listando os links

![image](https://github.com/user-attachments/assets/01eefb4d-628e-4db3-bc2b-7a2766874f04)

### Testando o redirecionamento

![image](https://github.com/user-attachments/assets/deb3b7db-7bd5-41d0-a58c-a82fb27d9ed9)



