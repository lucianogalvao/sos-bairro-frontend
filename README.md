# SOS Bairro – Frontend

**Desenvolvido por:**  
**Luciano Galvão Jr**
**Projeto para o TCC da Pós-Graduação de Desenvolvimento FullStack da PUC/RS**  
[LinkedIn](https://www.linkedin.com/in/lucianogalvaao/) • [GitHub](https://github.com/LucianoGalvao)

---

## 📌 Sobre o projeto

O **SOS Bairro – Frontend** é a interface web da plataforma **SOS Bairro**, responsável por toda a experiência do usuário final.

---

## 🚀 Tecnologias utilizadas

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nextjs,typescript,tailwind,git,html,css,js" />
</p>

Principais libs/ferramentas:

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Material UI (MUI)**
- **TanStack Query (React Query)**
- **Zustand**
- **Google Maps API / Places API**
- **JWT via cookies (HTTP-only)**
- **BFF** com rotas `route.ts` no Next.js

---

## ⚙️ Requisitos

- **Node.js:** `v20.19.4`
- **npm** (ou equivalente, se preferir)

---

## 📦 Instalação

```bash
npm install
```

Acesse:
• http://localhost:8000

⸻

## 🔧 Variáveis de ambiente

```bash
cp .env.example .env
```

Copie o arquivo .env (ou ajuste conforme seu padrão) e configure as variáveis do projeto.

Exemplo (ajuste para o seu ambiente):

```
NEXT_PUBLIC_APP_URL=http://localhost:8000
```

Observação: o projeto também utiliza variáveis internas via env (@/shared/lib/env). Garanta que os valores necessários estejam configurados no ambient

## 🧭 Estrutura do projeto

Organização baseada em feature-based para facilitar evolução e manutenção:

- app/ Rotas e páginas usando Next.js App Router

- app/api/ Rotas do BFF (proxy + auth via cookies) para falar com o backend

- src/features/ Módulos por domínio (ocorrências, usuários, perfil, dashboard, admin, etc.)

- src/components/C omponentes reutilizáveis

- src/shared/ Utilitários, helpers, serviços HTTP, tipos e validações

- src/store/ Estado global (Zustand)

## 🧱 BFF (Backend for Frontend)

O frontend possui rotas em app/api/\*\*/route.ts para:

- Reaproveitar cookies e autenticação
- Evitar expor URLs do backend diretamente no client
- Centralizar validações e padronizar erros

Exemplos de uso:

- Upload de imagem (Cloudinary)
- PATCH/DELETE via proxy autenticado
- Integração com endpoints do backend

## ✨ Funcionalidades

- Autenticação e sessão via cookies
- CRUD de ocorrências (criar, listar, atualizar status, deletar)
- Edição de ocorrência (PATCH)
- Painel administrativo:
- Usuários: promover/revogar moderador
- Categorias: criar e excluir (com validação por quantidade de ocorrências)
- Perfil:
- Edição de nome e endereço
- Upload de avatar
- NotFound customizado e responsivo
- UI responsiva e consistente com tema do projeto

## 🧪 Boas práticas

- Componentização e reutilização
- Separação de responsabilidades (services, queries, UI)
- Hooks customizados
- Tipagem forte com TypeScript
- Feedback visual (loading/erro/sucesso)
- Controle de permissões por role (ADMIN/MODERADOR/MORADOR)
