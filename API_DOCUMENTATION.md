# Documentação da API - DriveNow

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Autenticação

#### POST /register
Registra um novo usuário no sistema.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SenhaForte123!"
}
```

**Response (201):**
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "id": 2
}
```

**Erros:**
- `400` - Email e senha são obrigatórios
- `400` - Este e-mail já está cadastrado
- `500` - Erro interno do servidor

---

#### POST /login
Autentica um usuário e retorna um token JWT.

**Request:**
```json
{
  "email": "admin",
  "password": "123"
}
```

**Response (200):**
```json
{
  "message": "Login bem-sucedido!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin"
  }
}
```

**Erros:**
- `401` - Usuário não encontrado
- `401` - Senha incorreta
- `500` - Erro no banco de dados

---

### 2. Carros

#### GET /cars
Lista todos os carros disponíveis na frota.

**Headers:**
```
Sem autenticação obrigatória
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Audi RS7",
    "price": 450.00,
    "seats": 4,
    "luggage": 2,
    "transmission": "Automático",
    "ac": true,
    "image_url": "https://images.unsplash.com/photo-1550355291-bbee04a92027..."
  },
  {
    "id": 2,
    "name": "Range Rover Velar",
    "price": 520.00,
    "seats": 5,
    "luggage": 4,
    "transmission": "Automático",
    "ac": true,
    "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf..."
  }
]
```

**Erros:**
- `500` - Erro ao buscar carros

---

### 3. Reservas

#### POST /reserve
Cria uma nova reserva para um usuário autenticado.

**Autenticação:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "carId": 1
}
```

**Response (201):**
```json
{
  "message": "Reserva confirmada com sucesso!",
  "reservationId": 5
}
```

**Erros:**
- `401` - Acesso negado (sem token)
- `403` - Token inválido ou expirado
- `400` - ID do carro é obrigatório
- `500` - Erro ao criar reserva

---

## Autenticação

### Sistema de Token JWT

A autenticação é baseada em **JSON Web Tokens (JWT)** com as seguintes características:

- **Validade:** 2 horas
- **Algoritmo:** HS256
- **Headers necessários:** `Authorization: Bearer {token}`

### Como usar o token

1. Faça login e obtenha o token
2. Armazene o token no `localStorage` (já feito no frontend)
3. Envie em cada requisição protegida:

```javascript
fetch('http://localhost:3000/api/reserve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ carId: 1 })
})
```

---

## Status Codes

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Acesso negado/Token inválido |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplos de Uso

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin', 
    password: '123' 
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;
localStorage.setItem('driveNowToken', token);

// Fazer uma reserva
const reserveResponse = await fetch('http://localhost:3000/api/reserve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ carId: 1 })
});

const reserveData = await reserveResponse.json();
console.log(reserveData.message);
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"123"}'

# Listar carros
curl http://localhost:3000/api/cars

# Fazer reserva (precisa do token)
curl -X POST http://localhost:3000/api/reserve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{"carId":1}'
```

---

## Fluxo de Autenticação

```
1. Usuário acessa login.html
2. Insere email e senha
3. Frontend envia POST /login
4. Backend valida credenciais
5. Backend retorna token JWT
6. Frontend armazena token no localStorage
7. Token é enviado em próximas requisições protegidas
8. Backend valida token antes de processar
```

---

## Segurança

- Senhas são criptografadas com **bcrypt** (10 rounds)
- Tokens expiram em **2 horas**
- CORS está habilitado apenas para origem local
- Validação de entrada em todos endpoints
- Middleware de autenticação verifica JWT em rotas protegidas

---

## Troubleshooting

### "Token inválido ou expirado"
- O token expirou (2 horas)
- Solução: Faça login novamente para obter novo token

### "Acesso negado. Faça login primeiro"
- Nenhum token foi enviado
- Solução: Certifique-se de enviar o header `Authorization`

### "Erro ao conectar com o servidor"
- Backend não está rodando
- Solução: Execute `node backend/server.js`

### "Este e-mail já está cadastrado"
- Usuário já existe no banco
- Solução: Use outro email ou faça login

---

**Última atualização:** 30/03/2026
