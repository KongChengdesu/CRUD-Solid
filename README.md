Collecting workspace information```markdown
# CRUD-Solid

Este projeto é uma API para gerenciar recursos em pods Solid utilizando o framework Express. Abaixo estão os detalhes de todos os endpoints disponíveis.

## Endpoints

### Autenticação

#### `GET /auth/login`
- **Descrição**: Inicia o processo de login no Solid.
- **Parâmetros**: Nenhum.
- **Resposta**: Redireciona o usuário para o provedor de identidade Solid.

#### `GET /auth/callback`
- **Descrição**: Callback para lidar com o redirecionamento após o login no Solid.
- **Parâmetros**:
  - `sessionId` (query): ID da sessão.
- **Resposta**: Retorna uma mensagem indicando o WebID do usuário logado.

---

### Operações com Recursos

#### `POST /op/create`
- **Descrição**: Cria um novo recurso no pod Solid.
- **Parâmetros**:
  - **Body**:
    - `sessionId` (string): ID da sessão do usuário.
    - `podUrl` (string): URL do pod onde o recurso será criado.
    - `data` (object): Dados do recurso a ser criado, contendo:
      - `name` (string): Nome do recurso.
      - `description` (string): Descrição do recurso.
- **Resposta**:
  - `201 Created`: Recurso criado com sucesso.
  - `401 Unauthorized`: Usuário não está logado.
  - `500 Internal Server Error`: Erro ao criar o recurso.

#### `GET /op/read`
- **Descrição**: Lê um recurso do pod Solid.
- **Parâmetros**:
  - **Query**:
    - `sessionId` (string): ID da sessão do usuário.
    - `resourceUrl` (string): URL do recurso a ser lido.
- **Resposta**:
  - `200 OK`: Retorna os dados do recurso.
  - `401 Unauthorized`: Usuário não está logado.
  - `500 Internal Server Error`: Erro ao ler o recurso.

#### `PUT /op/update`
- **Descrição**: Atualiza um recurso existente no pod Solid.
- **Parâmetros**:
  - **Body**:
    - `sessionId` (string): ID da sessão do usuário.
    - `resourceUrl` (string): URL do recurso a ser atualizado.
    - `data` (object): Dados atualizados do recurso, contendo:
      - `name` (string): Novo nome do recurso.
      - `description` (string): Nova descrição do recurso.
- **Resposta**:
  - `200 OK`: Recurso atualizado com sucesso.
  - `401 Unauthorized`: Usuário não está logado.
  - `404 Not Found`: Recurso não encontrado.
  - `500 Internal Server Error`: Erro ao atualizar o recurso.

#### `DELETE /op/delete`
- **Descrição**: Deleta um recurso do pod Solid.
- **Parâmetros**:
  - **Body**:
    - `sessionId` (string): ID da sessão do usuário.
    - `resourceUrl` (string): URL do recurso a ser deletado.
- **Resposta**:
  - `200 OK`: Recurso deletado com sucesso.
  - `401 Unauthorized`: Usuário não está logado.
  - `500 Internal Server Error`: Erro ao deletar o recurso.

---

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```

3. O servidor estará disponível em `http://localhost:3000`.

---

## Dependências

- `express`
- `@inrupt/solid-client`
- `@inrupt/solid-client-authn-node`
- `dotenv`

Para mais informações, consulte o arquivo [package.json](package.json).

---
