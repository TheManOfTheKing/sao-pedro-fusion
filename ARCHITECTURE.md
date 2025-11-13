# Arquitetura do Sistema - São Pedro Fusion Menu Digital

## Visão Geral

Este projeto implementa um menu digital multilíngue para restaurantes, com foco em performance, escalabilidade e facilidade de replicação para múltiplos clientes.

## Stack Tecnológica

### Frontend
- **React 19** com **Vite** para desenvolvimento rápido
- **Tailwind CSS 4** para estilização responsiva
- **tRPC** para comunicação type-safe com o backend
- **Wouter** para roteamento leve
- **shadcn/ui** para componentes UI consistentes

### Backend
- **Node.js** com **Express 4**
- **tRPC 11** para APIs type-safe
- **Drizzle ORM** para gerenciamento de banco de dados
- **MySQL/TiDB** como banco de dados principal

### Infraestrutura
- **Manus Platform** para hospedagem e autenticação
- **S3** para armazenamento de imagens dos pratos
- **API de Tradução** (DeepL ou Google Translate) para traduções automáticas

## Estrutura de Dados

### Tabelas Principais

#### `categories`
Armazena as categorias do menu (Entradas, Pratos Principais, Sobremesas, Bebidas, etc.)

```typescript
{
  id: number (PK, auto-increment)
  name_pt: string // Nome em português (idioma base)
  slug: string // URL-friendly identifier
  displayOrder: number // Ordem de exibição
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `menu_items`
Armazena os itens individuais do cardápio

```typescript
{
  id: number (PK, auto-increment)
  categoryId: number (FK -> categories.id)
  name_pt: string // Nome em português
  description_pt: text // Descrição em português
  price: decimal(10,2) // Preço em euros
  imageUrl: string | null // URL da foto do prato no S3
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isSpicy: boolean
  isFeatured: boolean // Destaque do chef
  isAvailable: boolean // Disponível ou esgotado
  displayOrder: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `translations`
Armazena traduções de categorias e itens do menu

```typescript
{
  id: number (PK, auto-increment)
  entityType: enum('category', 'menu_item')
  entityId: number // ID da categoria ou item
  fieldName: enum('name', 'description')
  language: enum('en', 'es', 'fr', 'de', 'it')
  translatedText: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Índices:**
- `(entityType, entityId, fieldName, language)` - UNIQUE
- `(entityType, entityId)` - Para buscar todas as traduções de uma entidade

## Fluxo de Tradução

### Estratégia de Cache
Para evitar custos excessivos com APIs de tradução e melhorar a performance:

1. **Idioma Base:** Português (pt-BR)
2. **Idiomas Suportados:** Inglês (en), Espanhol (es), Francês (fr), Alemão (de), Italiano (it)
3. **Processo:**
   - Ao cadastrar/editar um item, o texto em português é salvo
   - Um job assíncrono gera traduções para todos os idiomas
   - Traduções são armazenadas na tabela `translations`
   - Frontend sempre busca traduções pré-geradas (nunca traduz em tempo real)

### API de Tradução
- **Primeira escolha:** DeepL API (melhor qualidade para idiomas europeus)
- **Fallback:** Google Translate API
- **Rate limiting:** Implementar fila de tradução para evitar exceder limites

## Arquitetura Frontend

### Páginas Principais

1. **Página de Seleção de Idioma (`/`)**
   - Primeira tela após escanear QR Code
   - Botões grandes e claros para cada idioma
   - Design impactante com logo e imagem de fundo

2. **Página do Menu (`/menu/:lang`)**
   - Navegação por categorias (tabs ou sidebar)
   - Lista de itens com fotos, descrições e preços
   - Ícones para filtros alimentares (vegetariano, vegano, etc.)
   - Sem necessidade de autenticação

3. **Painel Administrativo (`/admin`)**
   - Requer autenticação (Manus OAuth)
   - CRUD de categorias e itens
   - Upload de fotos para S3
   - Marcar itens como esgotados
   - Visualizar e editar traduções

### Fluxo de Dados (tRPC)

```typescript
// Buscar menu completo em um idioma específico
trpc.menu.getByLanguage.useQuery({ language: 'en' })
// Retorna: { categories: [...], items: [...] } com traduções aplicadas

// Buscar categoria específica
trpc.menu.getCategory.useQuery({ slug: 'entradas', language: 'en' })

// Admin: Criar novo item
trpc.admin.createMenuItem.useMutation()

// Admin: Atualizar disponibilidade
trpc.admin.updateAvailability.useMutation({ itemId, isAvailable })
```

## Design System

### Paleta de Cores

```css
:root {
  --color-primary: #2d4a3e; /* Verde escuro */
  --color-secondary: #1a5f7a; /* Azul turquesa */
  --color-accent: #d4af37; /* Dourado */
  --color-background: #f5f5dc; /* Creme */
  --color-text: #1a1a1a; /* Preto suave */
}
```

### Tipografia

- **Títulos:** Fonte script elegante (Pacifico, Dancing Script)
- **Corpo:** Fonte serifada (Playfair Display, Lora)
- **UI:** Sans-serif moderna (Montserrat, Open Sans)

### Responsividade

- **Mobile-first:** Design otimizado para telas de 375px+
- **Breakpoints:**
  - `sm`: 640px (tablets pequenos)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktops)

## Modelo de Negócio (White-label)

### Replicação para Novos Clientes

1. **Clonar repositório**
2. **Atualizar variáveis de ambiente:**
   - `VITE_APP_TITLE`: Nome do restaurante
   - `VITE_APP_LOGO`: URL do logo
   - Cores no `index.css`
3. **Popular banco de dados** com o cardápio do cliente
4. **Deploy** em nova instância
5. **Gerar QR Code** com a URL específica

### Custos Estimados por Cliente

- **Hospedagem:** ~$10-20/mês (Render, DigitalOcean)
- **Banco de dados:** Incluído na hospedagem
- **S3:** ~$1-5/mês (dependendo do número de fotos)
- **API de Tradução:** ~$5-10 (custo único para setup inicial)

**Total:** ~$15-30/mês por restaurante

## Performance

### Otimizações

1. **Lazy loading** de imagens dos pratos
2. **Prefetch** de traduções ao selecionar idioma
3. **Service Worker** para cache offline (futuro)
4. **Compressão de imagens** no upload (WebP)
5. **CDN** para assets estáticos

### Métricas Alvo

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

## Segurança

1. **Autenticação:** Apenas para painel admin (Manus OAuth)
2. **Autorização:** Role-based (admin vs user)
3. **Validação:** Zod schemas em todos os inputs tRPC
4. **Rate limiting:** Proteção contra abuso de APIs
5. **HTTPS:** Obrigatório em produção

## Próximas Funcionalidades (Roadmap)

- [ ] Sistema de pedidos online
- [ ] Integração com WhatsApp para reservas
- [ ] Analytics de itens mais visualizados
- [ ] Modo offline (PWA)
- [ ] Suporte a múltiplos menus (almoço, jantar, drinks)
- [ ] Sistema de alergênicos detalhado
- [ ] Integração com POS (Point of Sale)
