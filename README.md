# 🍽️ São Pedro Fusion - Menu Digital

Sistema de menu digital multilíngue moderno e elegante desenvolvido para o **São Pedro Fusion Restaurante**.

---

## 📋 Visão Geral

Menu digital completo que permite aos clientes visualizar o cardápio em **6 idiomas diferentes** através de um QR Code. A aplicação possui um design elegante com paleta de cores sofisticada (verde escuro, dourado e creme).

### Demonstração

- **Menu Público:** `https://seu-dominio.vercel.app/`
- **Painel Admin:** `https://seu-dominio.vercel.app/admin`

---

## ✨ Funcionalidades

### Para Clientes

- ✅ **Seleção de Idioma:** 6 idiomas disponíveis (Português, English, Español, Français, Deutsch, Italiano)
- ✅ **Navegação por Categorias:** Entradas, Pratos Principais, Pinsas Romanas, Sobremesas, Bebidas
- ✅ **Informações Detalhadas:** Nome, descrição, preço e ícones de filtros alimentares
- ✅ **Filtros Alimentares:** Vegetariano, Vegano, Sem Glúten, Picante
- ✅ **Itens em Destaque:** Pratos especiais marcados com estrela dourada
- ✅ **Design Responsivo:** Otimizado para mobile (QR Code)

### Para Administradores

- ✅ **Painel Administrativo Completo**
- ✅ **Gerenciamento de Categorias:** Visualizar todas as categorias
- ✅ **Gerenciamento de Itens:** Adicionar, editar e excluir itens do menu
- ✅ **Toggle de Disponibilidade:** Marcar itens como "Esgotado" rapidamente
- ✅ **Sistema de Traduções:** Adicionar traduções para todos os idiomas suportados
- ✅ **Upload de Imagens:** Campo para URL de imagens dos pratos
- ✅ **Filtros Alimentares:** Marcar opções vegetariano, vegano, sem glúten, picante
- ✅ **Itens em Destaque:** Destacar pratos especiais

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19 + Vite** - SPA rápida e moderna
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilos utilitários
- **shadcn/ui** - Componentes UI modernos
- **tRPC** - Comunicação type-safe
- **Wouter** - Roteamento leve

### Backend
- **Node.js + Express 4** - API server
- **tRPC 11** - Procedures tipadas end-to-end
- **Supabase** - Banco de dados Postgres gerenciado

### Design
- **Paleta de Cores:** Verde escuro (#1a4d2e), Dourado (#c9a961), Creme (#f5f1e8)
- **Tipografia:** Pacifico (script), Playfair Display (display), Inter (body)
- **Ícones:** Lucide React

---

## 📁 Estrutura do Projeto

```
sao-pedro-menu/
├── client/                    # Frontend React
│   ├── public/               # Arquivos estáticos
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       │   ├── ui/          # Componentes shadcn/ui
│       │   └── MenuItemForm.tsx  # Formulário de item
│       ├── pages/           # Páginas da aplicação
│       │   ├── LanguageSelector.tsx  # Seletor de idiomas
│       │   ├── Menu.tsx     # Menu público
│       │   └── Admin.tsx    # Painel administrativo
│       ├── lib/             # Utilitários
│       │   └── trpc.ts      # Cliente tRPC
│       ├── App.tsx          # Rotas
│       └── index.css        # Estilos globais
├── server/                   # Backend Node.js
│   ├── supabase.ts          # Cliente e queries Supabase
│   ├── routers.ts           # Procedures tRPC
│   └── _core/               # Infraestrutura (auth, context, etc.)
└── shared/                  # Tipos compartilhados
    └── types.ts             # Tipos do menu e traduções
```

---

## 🚀 Deploy na Vercel

### Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Banco de dados Supabase configurado

### Passo a Passo

#### 1. Preparar o Projeto

```bash
# Instalar dependências
pnpm install

# Testar build localmente
pnpm build
```

#### 2. Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

#### 3. Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings → Environment Variables** e adicione:

```
SUPABASE_URL=https://codaniddkekifbbgbmcs.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
VITE_SUPABASE_URL=https://codaniddkekifbbgbmcs.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

#### 4. Deploy via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

---

## 🗄️ Banco de Dados

### Estrutura das Tabelas

#### `categories`
- Categorias do menu (Entradas, Pratos Principais, etc.)

#### `menu_items`
- Itens do cardápio com todas as informações

#### `translations`
- Traduções de categorias e itens para múltiplos idiomas

### Schema SQL

O schema completo está disponível nos arquivos antigos fornecidos. Execute-o no painel SQL do Supabase.

---

## 📱 QR Code

### Gerar QR Code

Você pode usar qualquer gerador de QR Code online:

1. **QR Code Generator:** https://www.qr-code-generator.com/
2. **QR Code Monkey:** https://www.qrcode-monkey.com/
3. **Canva:** https://www.canva.com/qr-code-generator/

### Configuração Recomendada

- **URL:** `https://seu-dominio.vercel.app/`
- **Tamanho:** Mínimo 5x5 cm para impressão
- **Formato:** PNG ou SVG (alta resolução)
- **Correção de Erro:** Nível M ou H (para maior durabilidade)

---

## 🎨 Personalização

### Alterar Paleta de Cores

Edite o arquivo `client/src/index.css`:

```css
:root {
  --primary: oklch(0.35 0.15 145);     /* Verde escuro */
  --accent: oklch(0.75 0.12 85);       /* Dourado */
  --background: oklch(0.98 0.01 85);   /* Creme */
}
```

### Alterar Tipografia

As fontes são importadas do Google Fonts no `client/src/index.css`. Para mudar:

```css
@import url('https://fonts.googleapis.com/css2?family=SuaFonte&display=swap');
```

---

## 🔒 Segurança

- ✅ **Autenticação Supabase** para o painel admin
- ✅ **Procedures protegidas** com tRPC
- ✅ **Validação de dados** com Zod
- ✅ **Row Level Security** no Supabase

---

## 📝 Licença

Este projeto foi desenvolvido especificamente para o **São Pedro Fusion Restaurante**.

---

## 🤝 Suporte

Para dúvidas ou suporte técnico:

- **Documentação Supabase:** https://supabase.com/docs
- **Documentação Vercel:** https://vercel.com/docs

---

**Desenvolvido com ❤️ para o São Pedro Fusion Restaurante**
