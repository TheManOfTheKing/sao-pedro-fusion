# 🎨 Guia de Personalização - Menu Digital para Restaurantes

Este guia explica como personalizar esta aplicação para vendê-la a outros restaurantes. O sistema foi projetado para ser facilmente adaptável a diferentes identidades visuais e necessidades.

---

## 📋 Checklist de Personalização

Ao adaptar para um novo cliente, siga esta ordem:

- [ ] 1. Coletar informações do cliente
- [ ] 2. Personalizar identidade visual
- [ ] 3. Configurar banco de dados
- [ ] 4. Popular com dados do cliente
- [ ] 5. Testar em diferentes dispositivos
- [ ] 6. Fazer deploy
- [ ] 7. Gerar e entregar QR Code

---

## 1️⃣ Coletar Informações do Cliente

### Informações Básicas
- **Nome do restaurante**
- **Tipo de cozinha** (italiana, japonesa, brasileira, fusion, etc.)
- **Logo** (formato PNG ou SVG, fundo transparente)
- **Cores da marca** (primária, secundária, acento)
- **Cardápio atual** (PDF, fotos ou lista)

### Informações Técnicas
- **Idiomas necessários** (quais idiomas os clientes falam?)
- **Fotos dos pratos** (URLs ou arquivos)
- **Domínio personalizado** (opcional)

---

## 2️⃣ Personalizar Identidade Visual

### A. Alterar Nome e Logo

#### Arquivo: `client/src/const.ts`

```typescript
export const APP_TITLE = "Nome do Restaurante";
export const APP_LOGO = "/logo-restaurante.png";
```

#### Adicionar Logo
1. Coloque o arquivo do logo em `client/public/`
2. Renomeie para algo único: `logo-restaurante-nome.png`
3. Atualize a referência em `const.ts`

### B. Personalizar Paleta de Cores

#### Arquivo: `client/src/index.css`

Substitua as cores no bloco `:root`:

```css
:root {
  /* Exemplo: Restaurante Japonês (tons de vermelho e preto) */
  --primary: oklch(0.25 0.08 20);        /* Preto suave */
  --accent: oklch(0.55 0.22 25);         /* Vermelho */
  --background: oklch(0.98 0.01 85);     /* Branco creme */
  
  /* Exemplo: Restaurante Italiano (verde, branco, vermelho) */
  --primary: oklch(0.35 0.15 145);       /* Verde */
  --accent: oklch(0.55 0.25 25);         /* Vermelho */
  --background: oklch(0.99 0.01 85);     /* Branco */
  
  /* Exemplo: Restaurante Brasileiro (amarelo e verde) */
  --primary: oklch(0.45 0.18 145);       /* Verde */
  --accent: oklch(0.75 0.15 95);         /* Amarelo dourado */
  --background: oklch(0.97 0.02 85);     /* Creme */
}
```

#### Ferramenta para Converter Cores

Use o site [OKLCH Color Picker](https://oklch.com/) para converter HEX/RGB para OKLCH.

### C. Alterar Tipografia

#### Arquivo: `client/index.html`

Substitua as fontes do Google Fonts:

```html
<!-- Exemplo: Restaurante Japonês -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@300;400;600&display=swap" rel="stylesheet">

<!-- Exemplo: Restaurante Italiano -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">

<!-- Exemplo: Restaurante Mexicano -->
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
```

#### Arquivo: `client/src/index.css`

Atualize as variáveis de fonte:

```css
:root {
  /* Restaurante Japonês */
  --font-display: 'Noto Serif JP', serif;
  --font-heading: 'Noto Serif JP', serif;
  --font-sans: 'Noto Sans JP', sans-serif;
  
  /* Restaurante Italiano */
  --font-display: 'Cormorant Garamond', serif;
  --font-heading: 'Cormorant Garamond', serif;
  --font-sans: 'Montserrat', sans-serif;
}
```

### D. Personalizar Página de Idiomas

#### Arquivo: `client/src/pages/LanguageSelector.tsx`

Ajuste o subtítulo e descrição:

```typescript
// Linha ~30
<p className="text-lg text-muted-foreground mb-8">
  Cozinha Japonesa Autêntica  {/* Personalize aqui */}
</p>

// Linha ~80 (rodapé)
<p className="text-sm text-muted-foreground">
  Especialidades em sushi e sashimi  {/* Personalize aqui */}
</p>
```

---

## 3️⃣ Configurar Banco de Dados

### A. Limpar Dados de Exemplo

Execute no painel **Database** do Manus:

```sql
-- Limpar todos os dados de exemplo
DELETE FROM translations;
DELETE FROM menu_items;
DELETE FROM categories;
```

### B. Criar Categorias do Cliente

```sql
-- Exemplo: Restaurante Japonês
INSERT INTO categories (namePt, slug, displayOrder, isActive) VALUES
('Entradas', 'entradas', 1, 1),
('Sushi', 'sushi', 2, 1),
('Sashimi', 'sashimi', 3, 1),
('Hot Rolls', 'hot-rolls', 4, 1),
('Sobremesas', 'sobremesas', 5, 1),
('Bebidas', 'bebidas', 6, 1);

-- Exemplo: Restaurante Mexicano
INSERT INTO categories (namePt, slug, displayOrder, isActive) VALUES
('Antojitos', 'antojitos', 1, 1),
('Tacos', 'tacos', 2, 1),
('Burritos', 'burritos', 3, 1),
('Quesadillas', 'quesadillas', 4, 1),
('Sobremesas', 'sobremesas', 5, 1),
('Bebidas', 'bebidas', 6, 1);
```

---

## 4️⃣ Popular com Dados do Cliente

### Opção A: Usar o Painel Admin

1. Acesse `/admin`
2. Clique em **"Novo Item"**
3. Preencha manualmente cada prato

**Vantagem:** Interface visual, fácil para o cliente aprender
**Desvantagem:** Demorado para menus grandes

### Opção B: Importar via SQL

Prepare um script SQL com todos os itens:

```sql
-- Exemplo de item
INSERT INTO menu_items (
  categoryId, namePt, descriptionPt, price, 
  imageUrl, isVegetarian, isVegan, isGlutenFree, 
  isSpicy, isFeatured, isAvailable, displayOrder
) VALUES (
  1, 
  'Gyoza', 
  'Dumplings japoneses recheados com carne de porco e vegetais', 
  850,  -- €8.50 em centavos
  'https://exemplo.com/gyoza.jpg',
  0, 0, 0, 0, 1, 1, 1
);

-- Adicionar tradução em inglês
INSERT INTO translations (entityType, entityId, fieldName, language, translatedText) VALUES
('menu_item', LAST_INSERT_ID(), 'name', 'en', 'Gyoza'),
('menu_item', LAST_INSERT_ID(), 'description', 'en', 'Japanese dumplings filled with pork and vegetables');
```

### Opção C: Criar Script de Importação

Crie um arquivo CSV com os dados e um script Node.js para importar:

```csv
categoria,nome,descricao,preco,imagem,vegetariano,vegano,sem_gluten,picante,destaque
Entradas,Gyoza,Dumplings japoneses,8.50,https://...,0,0,0,0,1
```

---

## 5️⃣ Configurar Idiomas

### Idiomas Mais Comuns por Tipo de Restaurante

- **Italiano:** PT, EN, IT, ES, FR
- **Japonês:** PT, EN, JA, ES, FR
- **Mexicano:** PT, EN, ES, FR
- **Brasileiro:** PT, EN, ES, IT
- **Francês:** PT, EN, FR, IT, ES
- **Árabe:** PT, EN, AR, FR

### Adicionar Novo Idioma

1. **Editar Schema** (`drizzle/schema.ts`):
```typescript
language: mysqlEnum("language", ["pt", "en", "es", "fr", "de", "it", "ja", "ar"]).notNull(),
```

2. **Aplicar Migração:**
```bash
pnpm db:push
```

3. **Adicionar na Interface** (`client/src/pages/LanguageSelector.tsx`):
```typescript
const languages = [
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  // ...
];
```

4. **Adicionar no Formulário** (`client/src/components/MenuItemForm.tsx`):
```typescript
const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  // ...
];
```

---

## 6️⃣ Testar

### Checklist de Testes

- [ ] Página de seleção de idiomas carrega corretamente
- [ ] Todos os idiomas funcionam
- [ ] Navegação entre categorias funciona
- [ ] Itens aparecem com informações corretas
- [ ] Ícones de filtros alimentares aparecem
- [ ] Preços estão formatados corretamente
- [ ] Painel admin carrega
- [ ] Adicionar novo item funciona
- [ ] Editar item funciona
- [ ] Toggle de disponibilidade funciona
- [ ] Traduções são salvas corretamente
- [ ] Design responsivo em mobile
- [ ] QR Code redireciona corretamente

### Testar em Dispositivos

- **Desktop:** Chrome, Firefox, Safari
- **Mobile:** iPhone (Safari), Android (Chrome)
- **Tablet:** iPad, Android tablet

---

## 7️⃣ Deploy

### Criar Checkpoint

1. No painel Manus, clique em **"Save Checkpoint"**
2. Descrição: `"Menu [Nome do Restaurante] - Versão 1.0"`

### Publicar

1. Clique em **"Publish"**
2. Aguarde o deploy (2-3 minutos)
3. Teste o link público: `https://nome-restaurante.manus.space`

### Domínio Personalizado

1. Acesse **Settings → Domains**
2. Adicione o domínio do cliente
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

---

## 8️⃣ Gerar QR Code

### Ferramentas Recomendadas

- **QR Code Generator:** https://www.qr-code-generator.com/
- **QR Code Monkey:** https://www.qrcode-monkey.com/
- **Canva:** https://www.canva.com/qr-code-generator/

### Configurações

- **URL:** `https://dominio-do-cliente.com/`
- **Tamanho:** 10x10 cm (mínimo 5x5 cm)
- **Formato:** PNG (alta resolução) ou SVG
- **Correção de Erro:** Nível H (30% de redundância)
- **Cores:** Personalize com as cores da marca

### Design do QR Code

Crie um design atraente no Canva:

1. Adicione o logo do restaurante no centro
2. Adicione texto: *"Escaneie para ver nosso menu"*
3. Use as cores da marca
4. Exporte em alta resolução (300 DPI)

### Impressão

- **Material:** Acrílico 3mm, PVC rígido ou adesivo vinílico
- **Tamanho:** A5 (14,8 x 21 cm) ou 15x15 cm
- **Quantidade:** 1 por mesa + 1 na entrada + 1 no balcão
- **Acabamento:** Laminação fosca ou brilhante

---

## 💰 Modelo de Precificação

### Sugestão de Pacotes

#### Pacote Básico - R$ 500 (setup único)
- ✅ Personalização visual (cores, logo, fontes)
- ✅ Até 3 idiomas
- ✅ Até 50 itens no menu
- ✅ Painel admin
- ✅ QR Code (design simples)
- ✅ Deploy no subdomínio Manus
- ✅ Treinamento básico (1h)

#### Pacote Profissional - R$ 800 (setup único)
- ✅ Tudo do Pacote Básico
- ✅ Até 6 idiomas
- ✅ Itens ilimitados
- ✅ Domínio personalizado
- ✅ QR Code (design premium)
- ✅ Fotos profissionais (até 20 pratos)
- ✅ Treinamento completo (2h)
- ✅ Suporte por 30 dias

#### Pacote Premium - R$ 1.500 (setup único)
- ✅ Tudo do Pacote Profissional
- ✅ Idiomas ilimitados
- ✅ Integração com redes sociais
- ✅ Analytics personalizado
- ✅ Fotos profissionais (ilimitadas)
- ✅ QR Codes personalizados (impressos)
- ✅ Treinamento presencial
- ✅ Suporte por 90 dias

### Mensalidade (Opcional)

- **Manutenção:** R$ 50/mês (atualizações do menu, suporte)
- **Hospedagem:** Incluída no preço (via Manus)

---

## 🎯 Dicas de Vendas

### Argumentos de Venda

1. **Economia:** Elimina custos de impressão de cardápios físicos
2. **Atualização Fácil:** Mude preços e itens em tempo real
3. **Multilíngue:** Atenda turistas sem contratar tradutores
4. **Sustentabilidade:** Solução ecológica, sem papel
5. **Profissional:** Design moderno e elegante
6. **Higiene:** Reduz contato físico (pós-pandemia)

### Público-Alvo

- Restaurantes em áreas turísticas
- Restaurantes de culinária internacional
- Bares e cafeterias modernas
- Food trucks e quiosques
- Hotéis e resorts

---

## 📞 Suporte ao Cliente

### Treinamento

Prepare um vídeo tutorial mostrando:
1. Como acessar o painel admin
2. Como adicionar um novo item
3. Como editar um item existente
4. Como marcar item como esgotado
5. Como adicionar traduções

### Documentação

Forneça ao cliente:
- Link para o README.md
- Vídeo tutorial
- Contato de suporte (WhatsApp, email)

---

## ✅ Checklist Final de Entrega

- [ ] Aplicação personalizada com identidade visual do cliente
- [ ] Banco de dados populado com todos os itens do menu
- [ ] Traduções completas para todos os idiomas
- [ ] Fotos de todos os pratos (se contratado)
- [ ] Deploy realizado e testado
- [ ] QR Codes gerados e entregues (físico ou digital)
- [ ] Treinamento realizado
- [ ] Credenciais de acesso entregues
- [ ] Documentação entregue
- [ ] Contrato de manutenção assinado (se aplicável)

---

**Boa sorte com suas vendas! 🚀**
