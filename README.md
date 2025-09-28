# Sistema de Alocação Dinâmica de Turmas

Backend completo para gerenciamento dinâmico de alocação de salas em uma faculdade, desenvolvido com Node.js, TypeScript, Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **TypeORM** - ORM para TypeScript
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Jest** - Testes
- **ESLint + Prettier** - Qualidade de código

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- Sistema de login com JWT
- Perfis de usuário (Admin, Coordenador)
- Middleware de autenticação

### 📚 Gestão de Cursos
- CRUD completo de cursos
- Controle de duração e taxa de evasão
- Relacionamento com turmas

### 🎓 Gestão de Turmas
- CRUD de turmas por curso
- Controle de turnos (Manhã, Tarde, Noite)
- Acompanhamento de quantidade de alunos

### 🏢 Gestão de Salas
- CRUD de salas por bloco
- Configurações dinâmicas por período
- Tipos de sala (Pequena, Média, Grande, Laboratório)

### ⚙️ Configurações Dinâmicas
- Configurações de sala por ano/semestre
- Mudanças de área e tipo ao longo do tempo
- Histórico de configurações

### 📊 Relatórios e Previsões
- Cálculo de capacidade de salas
- Previsões de ocupação
- Relatórios de estatísticas
- Detecção de conflitos

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### 1. Clone e instale dependências
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Configuração do Banco de Dados

#### 2.1. Instalar PostgreSQL (se não tiver)

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Baixe e instale do site oficial: https://www.postgresql.org/download/

#### 2.2. Criar banco de dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql, criar banco
CREATE DATABASE alocacao_turmas;
CREATE USER app_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE alocacao_turmas TO app_user;
\q
```

#### 2.3. Configurar variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Configure o arquivo `.env`:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=app_user
DB_PASSWORD=sua_senha_segura
DB_DATABASE=alocacao_turmas

# JWT (gere uma chave segura)
JWT_SECRET=sua_chave_jwt_muito_segura_aqui_com_mais_de_32_caracteres
JWT_EXPIRES_IN=24h
```

> **💡 Dica:** Para gerar um JWT_SECRET seguro, use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Executar as migrações

```bash
# Gerar migração inicial (primeira vez)
npm run migration:generate src/migrations/InitialMigration

# Executar migrações no banco
npm run migration:run

# Verificar se as tabelas foram criadas
psql -U joaovitorvogelvieira -d alocacao_turmas -c "\dt"
```

### 4. Popular banco com dados iniciais

```bash
# Executar script de seed
npm run seed
```

**O que o seed cria:**
- 2 usuários (admin e coordenador)
- 4 cursos de exemplo
- 10 salas em diferentes blocos
- Configurações de sala para 2024/1
- 7 turmas distribuídas pelos cursos

### 5. Iniciar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Verificar se está funcionando
curl http://localhost:3000/api/health

# Produção
npm run build
npm start
```

**Saída esperada:**
```
🚀 Servidor rodando na porta 3000
📚 Documentação disponível em: http://localhost:3000/api-docs
✅ Conectado ao banco de dados PostgreSQL
```

## 📖 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3000/api-docs
- **JSON Schema**: http://localhost:3000/api-docs.json
- **Health Check**: http://localhost:3000/api/health

### Exemplos de Uso

#### 🔐 Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","senha":"admin123"}'

# Resposta:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "nome": "Administrador",
      "perfil": "admin"
    }
  }
}
```

#### 👤 Listar Usuários (com token)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 📚 Criar Curso
```bash
curl -X POST http://localhost:3000/api/cursos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Engenharia Civil",
    "duracao": 10,
    "evasao": 15.5
  }'
```

#### 🏢 Buscar Salas com Filtros
```bash
curl -X GET "http://localhost:3000/api/salas?bloco=A&page=1&limit=5" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Endpoints Principais

#### 🔐 Autenticação
```
POST /api/auth/login - Login do usuário
POST /api/auth/register - Registro (apenas admin)
```

#### 👤 Usuários
```
GET    /api/users - Listar usuários
POST   /api/users - Criar usuário
GET    /api/users/:id - Buscar usuário
PUT    /api/users/:id - Atualizar usuário
DELETE /api/users/:id - Deletar usuário
```

#### 📚 Cursos
```
GET    /api/cursos - Listar cursos
POST   /api/cursos - Criar curso
GET    /api/cursos/:id - Buscar curso
PUT    /api/cursos/:id - Atualizar curso
DELETE /api/cursos/:id - Deletar curso
GET    /api/cursos/:id/estatisticas - Estatísticas do curso
```

#### 🎓 Turmas
```
GET    /api/turmas - Listar turmas
POST   /api/turmas - Criar turma
GET    /api/turmas/:id - Buscar turma
PUT    /api/turmas/:id - Atualizar turma
DELETE /api/turmas/:id - Deletar turma
```

#### 🏢 Salas
```
GET    /api/salas - Listar salas
POST   /api/salas - Criar sala
GET    /api/salas/:id - Buscar sala
PUT    /api/salas/:id - Atualizar sala
DELETE /api/salas/:id - Deletar sala
GET    /api/salas/relatorio-ocupacao - Relatório de ocupação
```

#### ⚙️ Configurações
```
GET    /api/configuracoes - Listar configurações
POST   /api/configuracoes - Criar configuração
GET    /api/configuracoes/:id - Buscar configuração
PUT    /api/configuracoes/:id - Atualizar configuração
DELETE /api/configuracoes/:id - Deletar configuração
```

#### 📊 Previsões
```
GET    /api/previsoes - Listar previsões
POST   /api/previsoes - Criar previsão
GET    /api/previsoes/:id - Buscar previsão
PUT    /api/previsoes/:id - Atualizar previsão
DELETE /api/previsoes/:id - Deletar previsão
POST   /api/previsoes/gerar-alocacao - Gerar alocação automática
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor em modo desenvolvimento
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor em produção
npm run migration:generate # Gerar nova migração
npm run migration:run      # Executar migrações
npm run migration:revert   # Reverter última migração
npm run seed         # Popular banco com dados iniciais
npm test             # Executar testes
npm run lint         # Verificar código com ESLint
npm run format       # Formatar código com Prettier
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database, swagger)
├── controllers/     # Controladores HTTP
├── entities/        # Entidades do banco (TypeORM)
├── middlewares/     # Middlewares (auth, error handling)
├── repositories/    # Repositórios de dados
├── routes/          # Definição de rotas
├── scripts/         # Scripts utilitários (seed)
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Funções utilitárias
├── app.ts           # Configuração do Express
└── server.ts        # Servidor principal
```

## 👥 Usuários Padrão (após seed)

| Username | Senha | Perfil |
|----------|-------|--------|
| admin | admin123 | Administrador |
| coordenador | coord123 | Coordenador |

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Middleware de autenticação/autorização
- Headers de segurança com Helmet
- CORS configurado
- Validação de entrada

## 📊 Funcionalidades Avançadas

### Alocação Dinâmica
- Algoritmo inteligente para alocação de salas
- Considera capacidade, tipo de sala e conflitos
- Otimização por turno e período

### Previsões
- Cálculo de evasão por curso
- Previsão de ocupação futura
- Alertas de superlotação

### Relatórios
- Estatísticas detalhadas por curso
- Relatórios de ocupação de salas
- Análise de eficiência de alocação

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Troubleshooting

### Problemas Comuns

#### ❌ Erro: "Cannot find type definition file for 'bcryptjs'"
```bash
npm install --save-dev @types/bcryptjs
```

#### ❌ Erro de conexão com PostgreSQL
1. Verifique se o PostgreSQL está rodando:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Teste a conexão:
   ```bash
   psql -U app_user -d alocacao_turmas -h localhost
   ```

3. Verifique as credenciais no `.env`

#### ❌ Erro: "Migration not found"
```bash
# Gerar nova migração
npm run migration:generate src/migrations/NomeDaMigracao

# Verificar migrações pendentes
npm run typeorm -- migration:show -d src/config/database.ts
```

#### ❌ Porta já está em uso
```bash
# Encontrar processo usando a porta
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)

# Ou usar outra porta no .env
PORT=3001
```

#### ❌ Problemas com JWT
- Certifique-se que `JWT_SECRET` tem pelo menos 32 caracteres
- Gere um novo secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Logs e Debug

```bash
# Ver logs detalhados
DEBUG=* npm run dev

# Testar endpoints
curl -X GET http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","senha":"admin123"}'
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação da API em `/api-docs`
2. Consulte os logs do servidor
3. Verifique a seção de troubleshooting acima
4. Abra uma issue no repositório

---

Desenvolvido com ❤️ para otimizar a gestão acadêmica
