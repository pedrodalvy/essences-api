# Essences API

## Descrição

Api Criada com o propósito de simular um gateway para o GB API. A API contém as seguintes funcionalidades:

- Rate limiting
- Cache de requisições
- Autenticação JWT

## Índice

- [Documentação](#documentação)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
  - [Descrição das variáveis de ambiente](#descrição-das-variáveis-de-ambiente)   
- [Uso](#uso)
- [Testes](#testes)

## Documentação

A documentação completa da API está disponível no [Design Document](https://github.com/pedrodalvy/essences-api/blob/main/docs/DesignDocument.md) do projeto.

> Uma instância temporária da aplicação foi criada no GCP. O Swagger pode ser acessado em `https://essences-api-539666516417.us-central1.run.app/docs`, permitindo testes tanto por ele quanto diretamente via`https://essences-api-539666516417.us-central1.run.app/api`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (Versão 22 ou superior)
- [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)
- [Makefile](https://www.gnu.org/software/make/)

## Instalação

Clone este repositório e instale as dependências:

```bash
git clone git@github.com:pedrodalvy/essences-api.git
cd essences-api
yarn install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto utilizando o `.env.example` como base.

### Descrição das variáveis de ambiente

| Variável            | Descrição                                    | Exemplo                                                         | 
|---------------------|----------------------------------------------|-----------------------------------------------------------------|
| GB_BASE_URL         | URL da API do GB                             | `http://...`                                                    |
| GB_AUTH_TOKEN       | Token de autenticação do GB                  | Token em formato Base64                                         |
| CACHE_TTL_IN_MS     | Tempo de expiração do cache em milissegundos | `1800000` # 30 minutos                                          |
| REDIS_HOST          | Host do Redis                                | `cache` # Valor informado no docker-compose                     |
| REDIS_PORT          | Porta do Redis                               | `6379` # Valor informado no docker-compose                      |
| REDIS_USERNAME      | Usuário do Redis                             | Usuário utilizado apenas em ambiente de produção                |
| REDIS_PASSWORD      | Password do Redis                            | Password utilizado apenas em ambiente de produção               |
| JWT_SECRET          | Secret usado para gerar o token JWT          | `any-secret`                                                    |
| JWT_TTL_IN_SECONDS  | Tempo de expiração do token JWT              | `3600` # 1 hora                                                 |
| THROTTLER_TTL_IN_MS | Tempo de expiração do limiter                | `60000` # 1 minuto (60 * 1000)                                  |
| THROTTLER_LIMIT     | Limite de requisições por minuto             | `5` # 5 requisições por minuto                                  |
| THROTTLER_STORE_URL | URL do Redis para armazenar o limiter        | `redis://cache:6379` # Valor informado no docker-compose        |
| LOG_LEVEL           | Nível de log                                 | [`fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silence`] |

> **Nota**: Certifique-se de utilizar valores reais para as variáveis `GB_BASE_URL` e `GB_AUTH_TOKEN`.

## Uso

Para iniciar o servidor:

```bash
make dev # Inicializa a aplicação em modo de desenvolvimento, com hot reloading habilitado
# ou
make prod # Inicializa a aplicação em modo de produção, sem hot reloading habilitado
```

A API estará disponível em: `http://localhost:3000/api`
> Utilize o Swagger para verificar todos os endpoints da API `http://localhost:3000/docs`.

## Testes

Para rodar os testes:

```bash
yarn test:cov # Executa os testes de cobertura
# ou
make test-e2e # Executa os testes end-to-end (Com mock para requisições HTTP)
```
