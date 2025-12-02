# Documentação Completa do Sistema de Alocação Dinâmica de Turmas

## Visão Geral

Este sistema foi desenvolvido para gerenciar de forma dinâmica a alocação de turmas em salas de aula de uma instituição de ensino superior. O backend é responsável por toda a lógica de negócio, persistência de dados, autenticação, geração de previsões e exportação de relatórios, integrando-se facilmente com o front-end.

---

## Tecnologias Utilizadas

- **Node.js** (v18+): Ambiente de execução JavaScript/TypeScript.
- **TypeScript**: Tipagem estática e maior robustez no desenvolvimento.
- **Express.js**: Framework web para APIs REST.
- **PostgreSQL**: Banco de dados relacional robusto e escalável.
- **TypeORM**: ORM para integração entre TypeScript e PostgreSQL.
- **JWT**: Autenticação segura baseada em tokens.
- **Swagger**: Documentação automática da API.
- **Jest**: Testes automatizados.
- **ESLint + Prettier**: Padronização e qualidade de código.
- **Docker + Docker Compose**: Containerização e orquestração do ambiente.

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (database, swagger)
│   ├── controllers/      # Controladores HTTP
│   ├── entities/         # Entidades do banco (TypeORM)
│   ├── middlewares/      # Middlewares (auth, error handling)
│   ├── repositories/     # Repositórios de dados
│   ├── routes/           # Definição de rotas
│   ├── scripts/          # Scripts utilitários (seed, migrations)
│   ├── services/         # Lógica de negócio
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Funções utilitárias
│   ├── validators/       # Validações customizadas
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Servidor principal
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── jest.config.json      # Configuração de testes
├── .env                  # Variáveis de ambiente
├── Dockerfile            # Build do container
├── docker-compose.yml    # Orquestração de containers
└── README.md             # Documentação principal
```

---

## Principais Funcionalidades

- **Autenticação e Autorização**: Login via JWT, perfis de usuário (admin, coordenador), middleware de proteção de rotas.
- **Gestão de Cursos**: CRUD completo, controle de duração, taxa de evasão, relacionamento com turmas.
- **Gestão de Turmas**: CRUD, controle de turnos, quantidade de alunos, vínculo com cursos.
- **Gestão de Salas**: CRUD, configuração dinâmica por período, tipos de sala (P, M, G, Laboratório).
- **Configurações Dinâmicas**: Permite alterar regras de alocação por ano/semestre.
- **Previsões de Alocação**: Algoritmo inteligente para prever ocupação de salas, considerando capacidade, área, evasão e conflitos.
- **Exportação de Relatórios**: Exportação de previsões em formato Excel via Adapter.
- **Relatórios e Estatísticas**: Análise de ocupação, eficiência, alertas de superlotação.
- **Testes Automatizados**: Cobertura de testes unitários e integração.

---

## Padrões de Projeto e Arquitetura

- **MVC (Model-View-Controller)**: Separação clara entre entidades, repositórios, serviços, controllers e rotas.
- **Factory**: Centraliza criação de repositórios (`RepositoryFactory`).
- **Strategy**: Permite múltiplas lógicas de alocação (`AlocacaoStrategy`).
- **Adapter**: Exportação de dados para Excel (`PrevisaoExportAdapter`).
- **SOLID**: SRP (responsabilidade única), OCP (aberto para extensão, fechado para modificação).

---

## Fluxo de Funcionamento

1. **Usuário realiza login** e recebe um token JWT.
2. **Ações CRUD**: Usuário pode cadastrar, editar, listar e excluir cursos, turmas, salas e configurações.
3. **Geração de Previsão**: Usuário solicita previsão de alocação; o sistema processa dados, aplica estratégia e retorna resultado.
4. **Exportação**: Usuário pode exportar a previsão em formato Excel.
5. **Relatórios**: Usuário acessa estatísticas e relatórios detalhados.

---

## Endpoints Principais

- `/api/auth/login` — Login do usuário
- `/api/users` — Gestão de usuários
- `/api/cursos` — Gestão de cursos
- `/api/turmas` — Gestão de turmas
- `/api/salas` — Gestão de salas
- `/api/configuracoes` — Configurações dinâmicas
- `/api/previsoes` — Previsões de alocação
- `/api/previsoes/:id/exportar` — Exportação de previsão em Excel

---

## Exemplo de Exportação de Previsão

```typescript
// Chamada ao endpoint
fetch('/api/previsoes/123/exportar')
  .then(res => res.json())
  .then(data => exportarParaExcel(data, 'previsao.xlsx'));

// Função de exportação (front-end)
function exportarParaExcel(dados, nomeArquivo) {
  // Utiliza SheetJS ou similar
}
```

---

## Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Middleware de autenticação/autorização
- Headers de segurança (Helmet)
- CORS configurado
- Validação de entrada

---

## Testes e Qualidade

- Testes unitários e de integração com Jest
- Lint e formatação automática
- Cobertura de código

---

## Docker e Deploy

- Dockerfile para build do backend
- docker-compose para orquestração (banco + app)
- Scripts para rodar migrations e seed automaticamente
- Ambiente pronto para produção ou desenvolvimento

---

## Como Contribuir

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## Considerações Finais

O sistema foi projetado para ser flexível, escalável e seguro, facilitando a gestão acadêmica e a tomada de decisão baseada em dados. Todas as integrações e padrões adotados garantem facilidade de manutenção e evolução futura.

---

Desenvolvido com ❤️ para otimizar a gestão acadêmica.
