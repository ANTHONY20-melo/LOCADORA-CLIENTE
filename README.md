# DriveNow - Locadora de Carros 🚗

Aplicação web moderna para aluguel de carros, com autenticação segura, painelad admin e sistema de reservas.

## Estrutura do Projeto

```
NOVO2.0/
├── frontend/                    # Aplicação Cliente (HTML, CSS, JS)
│   ├── pages/                  # Páginas HTML
│   │   ├── index.html         # Página principal/landing page
│   │   ├── login.html         # Página de autenticação
│   │   └── admin.html         # Painel administrativo
│   ├── assets/                # Recursos do frontend
│   │   ├── css/
│   │   │   ├── style.css      # Estilos globais e landing page
│   │   │   └── admin.css      # Estilos do painel admin
│   │   └── js/
│   │       ├── script.js      # Lógica da página principal
│   │       ├── login.js       # Lógica de autenticação
│   │       └── admin.js       # Lógica do painel admin
│   └── utils/
│       └── api.js             # Utilitários de requisições HTTP
│
├── backend/                    # API Node.js/Express
│   ├── routes/                # Rotas da API
│   │   ├── auth.js           # Rotas de autenticação (login, registro)
│   │   ├── cars.js           # Rotas de carros
│   │   └── reservations.js   # Rotas de reservas
│   ├── middleware/            # Middlewares
│   │   └── auth.js           # Middleware de autenticação JWT
│   ├── database/              # Gerenciamento do banco de dados
│   │   ├── db.js             # Configuração do SQLite
│   │   └── seedData.js       # Dados iniciais (seed)
│   ├── server.js             # Arquivo principal do servidor
│   └── .env                  # Variáveis de ambiente
│
├── package.json              # Dependências do projeto
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Este arquivo
```

## Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilos responsivos
- **JavaScript Vanilla** - Interatividade
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia

### Backend  
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite3** - Banco de dados
- **JWT** - Autenticação segura
- **bcrypt** - Criptografia de senhas
- **CORS** - Segurança cross-origin

## Instalação

### Pré-requisitos
- Node.js v14+
- npm ou yarn

### Passos

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**
Crie um arquivo `.env` na pasta `backend/` com:
```
PORT=3000
SECRET_KEY=sua_chave_secreta_super_segura_aqui
DATABASE_PATH=./drivenow.db
NODE_ENV=development
API_URL=http://localhost:3000
```

3. **Iniciar o servidor**
```bash
npm start
# ou
node backend/server.js
```

4. **Abrir o navegador**
```
http://localhost:3000
```

## Funcionalidades

### 👤 Autenticação
- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Gestão de tokens JWT
- ✅ Senhas criptografadas com bcrypt

### 🚗 Catálogo de Carros
- ✅ Listagem dinâmica de veículos
- ✅ Filtros por características
- ✅ Imagens e descrições
- ✅ Preços diários

### 📋 Reservas
- ✅ Criação de reservas
- ✅ Histórico de reservas
- ✅ Status de reserva (Ativa, Concluído, Agendado)

### 🔐 Painel Admin
- ✅ Dashboard com estatísticas
- ✅ Gestão de veículos
- ✅ Visualização de reservas
- ✅ Controle de acesso restrito

### 💰 Planos de Assinatura
- ✅ Plano Plus: 5% desconto
- ✅ Plano Pro: 15% desconto
- ✅ Plano Max: 30% desconto

## Usuário Padrão

O sistema cria automaticamente um usuário admin ao iniciar:

```
Email: admin
Senha: 123
```

## APIs Disponíveis

### POST /api/register
Registra novo usuário
```json
{
  "email": "user@example.com",
  "password": "senhaSegura"
}
```

### POST /api/login
Autentica usuário
```json
{
  "email": "admin",
  "password": "123"
}
```

### GET /api/cars
Lista todos os carros disponíveis

### POST /api/reserve (Autenticado)
Cria uma reserva
```json
{
  "carId": 1
}
```

## Segurança

- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Tokens JWT com expiração (2 horas)
- ✅ CORS habilitado para requisições cross-origin
- ✅ Validação de entrada nos endpoints
- ✅ Middleware de autenticação em rotas protegidas

## Próximas Melhorias

- [ ] Sistema de pagamento
- [ ] Renovação automática de tokens
- [ ] Sistema de notificações por email
- [ ] Analytics e relatórios
- [ ] App mobile
- [ ] Testes automatizados
- [ ] Deploy em produção

## Contribuição

1. Faça um Fork
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

ISC

## Contato

- Email: contato@drivenow.com.br
- Telefone: 0800 123 4567

---

**Desenvolvido com ❤️ usando Node.js e JavaScript**
