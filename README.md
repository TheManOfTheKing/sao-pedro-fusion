# 🍽️ São Pedro Fusion - Menu Digital

Menu digital multilíngue moderno e elegante para restaurantes, desenvolvido especialmente para o **São Pedro Fusion Restaurante**.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Painel Administrativo](#painel-administrativo)
- [Personalização](#personalização)
- [Deploy](#deploy)
- [QR Code](#qr-code)

---

## 🎯 Visão Geral

Sistema completo de menu digital que permite aos clientes visualizar o cardápio em **6 idiomas diferentes** através de um QR Code. A aplicação possui um design elegante inspirado na identidade visual do restaurante, com paleta de cores sofisticada (verde escuro, dourado e creme).

### Demonstração

- **Menu Público:** `https://seu-dominio.com/`
- **Painel Admin:** `https://seu-dominio.com/admin`

---

## ✨ Funcionalidades

### Para Clientes

- ✅ **Seleção de Idioma:** 6 idiomas disponíveis (Português, English, Español, Français, Deutsch, Italiano)
- ✅ **Navegação por Categorias:** Entradas, Pratos Principais, Pinsas Romanas, Sobremesas, Bebidas
- ✅ **Informações Detalhadas:** Nome, descrição, preço e ícones de filtros alimentares
- ✅ **Filtros Alimentares:** Vegetariano, Vegano, Sem Glúten, Picante
- ✅ **Itens em Destaque:** Pratos especiais marcados com estrela dourada
- ✅ **Design Responsivo:** Otimizado para mobile (QR Code)
- ✅ **Troca de Idioma Instantânea:** Botão flutuante no menu

### Para Administradores

- ✅ **Painel Administrativo Completo**
- ✅ **Gerenciamento de Categorias:** Visualizar todas as categorias e número de itens
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
- **Supabase** - Autenticação nativa + Postgres gerenciado

### Design
- **Paleta de Cores:** Verde escuro (#1a4d2e), Dourado (#c9a961), Creme (#f5f1e8)
- **Tipografia:** Pacifico (display), Playfair Display (headings), Inter (body)
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
│   ├── db.ts                # Acesso ao Postgres (Supabase)
│   ├── routers.ts           # Procedures tRPC
│   └── _core/               # Infraestrutura (Supabase auth, context, etc.)
├── supabase/                # Scripts SQL (schema e políticas)
└── shared/                  # Tipos compartilhados
```

---

## 🚀 Como Usar

### Acesso ao Menu Público

1. **Gere um QR Code** apontando para: `https://seu-dominio.com/`
2. Cliente escaneia o QR Code
3. Seleciona o idioma desejado
4. Navega pelo menu completo

### Acesso ao Painel Admin

1. Acesse: `https://seu-dominio.com/admin`
2. Faça login com seu e-mail e senha cadastrados no Supabase
3. Gerencie categorias e itens do menu

---

## 🎛️ Painel Administrativo

### Gerenciar Itens do Menu

#### Adicionar Novo Item

1. Clique em **"Novo Item"**
2. Preencha as informações básicas:
   - **Categoria:** Selecione a categoria
   - **Nome (PT):** Nome do prato em português
   - **Descrição (PT):** Descrição detalhada
   - **Preço:** Valor em euros (ex: 12.50)
   - **URL da Imagem:** Link da foto do prato
3. Marque as opções alimentares (se aplicável):
   - 🌱 Vegetariano
   - 🌿 Vegano
   - 🌾 Sem Glúten
   - 🌶️ Picante
4. Defina o status:
   - ⭐ Item em Destaque
   - ✅ Disponível
5. Adicione traduções na aba **"Traduções"**:
   - Nome e descrição em cada idioma
6. Clique em **"Criar Item"**

#### Editar Item Existente

1. Clique no ícone de **lápis** (✏️) ao lado do item
2. Modifique as informações desejadas
3. Clique em **"Atualizar Item"**

#### Marcar como Esgotado

1. Use o **toggle** ao lado do item
2. O status muda instantaneamente de "Disponível" para "Esgotado"

---

## 🎨 Personalização

### Alterar Paleta de Cores

Edite o arquivo `client/src/index.css`:

```css
:root {
  --primary: oklch(0.35 0.15 145);     /* Verde escuro */
  --accent: oklch(0.75 0.12 85);       /* Dourado */
  --background: oklch(0.97 0.02 85);   /* Creme */
  /* ... */
}
```

### Alterar Tipografia

Edite o arquivo `client/index.html` para mudar as fontes do Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte&display=swap" rel="stylesheet">
```

### Adicionar Novos Idiomas

1. No Supabase, execute um `ALTER TYPE language ADD VALUE 'xx'` (substitua `xx` pelo código do idioma).
2. Adicione o idioma em `client/src/pages/LanguageSelector.tsx`:
   ```typescript
   { code: "ja", name: "日本語", flag: "🇯🇵" }
   ```

---

## 🌐 Deploy

O projeto pode ser publicado em qualquer infraestrutura. Sugestão de fluxo:

1. **Backend (Express/tRPC):**
   - Faça deploy em um provedor Node (Render, Railway, Fly.io, etc.).
   - Defina as variáveis `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `ADMIN_EMAIL` e eventuais integrações opcionais.

2. **Frontend (Vite/React):**
   - Execute `pnpm build` dentro de `client/` e publique o diretório `dist` em Vercel, Netlify ou hospedagem estática de sua preferência.
   - Configure as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_APP_TITLE`.

3. **Banco de Dados / Supabase:**
   - Utilize o script `supabase/schema.sql` para criar as tabelas.
   - Acesse o dashboard do Supabase para gerenciar usuários, políticas e storage, se necessário.

---

## 📱 QR Code

### Gerar QR Code

Você pode usar qualquer gerador de QR Code online:

1. **QR Code Generator:** https://www.qr-code-generator.com/
2. **QR Code Monkey:** https://www.qrcode-monkey.com/
3. **Canva:** https://www.canva.com/qr-code-generator/

### Configuração Recomendada

- **URL:** `https://seu-dominio.com/`
- **Tamanho:** Mínimo 5x5 cm para impressão
- **Formato:** PNG ou SVG (alta resolução)
- **Correção de Erro:** Nível M ou H (para maior durabilidade)

### Impressão

- Imprima o QR Code em **material durável** (acrílico, PVC)
- Coloque em **local visível** nas mesas do restaurante
- Adicione texto explicativo: *"Escaneie para ver nosso menu"*

---

## 📊 Banco de Dados

### Estrutura das Tabelas

#### `categories`
- Categorias do menu (Entradas, Pratos Principais, etc.)

#### `menu_items`
- Itens do cardápio com todas as informações

#### `translations`
- Traduções de categorias e itens para múltiplos idiomas

### Backup

Use o painel do Supabase em **Database → Backups** para exportar o dump do Postgres ou configure um job automático via `pg_dump`.

---

## 🔒 Segurança

- ✅ **Autenticação Supabase** para o painel admin
- ✅ **Procedures protegidas** com tRPC
- ✅ **Validação de dados** com Zod
- ✅ **Sanitização de inputs** automática

---

## 📝 Licença

Este projeto foi desenvolvido especificamente para o **São Pedro Fusion Restaurante**.

Para usar este código como base para outros restaurantes, você tem total liberdade para:
- ✅ Modificar o design e cores
- ✅ Adicionar/remover funcionalidades
- ✅ Vender como solução para outros clientes
- ✅ Personalizar completamente

---

## 🤝 Suporte

Para dúvidas ou suporte técnico:

- **Documentação Supabase:** https://supabase.com/docs
- **Comunidade Supabase:** https://github.com/supabase/supabase/discussions

---

## 🎉 Próximos Passos

Sugestões de melhorias futuras:

- [ ] Integração com sistema de pedidos online
- [ ] Notificações push para novos pratos
- [ ] Sistema de avaliações dos clientes
- [ ] Galeria de fotos dos pratos
- [ ] Integração com redes sociais
- [ ] Analytics de visualizações do menu
- [ ] Modo escuro/claro
- [ ] Busca de pratos por ingredientes

---

**Desenvolvido com ❤️ para o São Pedro Fusion Restaurante**
