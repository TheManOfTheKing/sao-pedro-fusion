# 🔧 Configuração de Variáveis de Ambiente no Vercel

Este guia explica como configurar todas as variáveis de ambiente necessárias para o projeto no Vercel.

---

## 📋 Variáveis Obrigatórias

Estas variáveis são **essenciais** para o funcionamento da aplicação:

### 1. **VITE_SUPABASE_URL**
- **Descrição:** URL do seu projeto Supabase
- **Onde encontrar:** Painel do Supabase → Settings → API → Project URL
- **Exemplo:** `https://codaniddkekifbbgbmcs.supabase.co`
- **Uso:** Frontend (cliente React) e Backend (serverless functions)

### 2. **VITE_SUPABASE_ANON_KEY**
- **Descrição:** Chave pública (anon key) do Supabase
- **Onde encontrar:** Painel do Supabase → Settings → API → Project API keys → `anon` `public`
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Uso:** Frontend (cliente React) e Backend (serverless functions)
- **⚠️ Importante:** Esta é uma chave pública, segura para uso no frontend

### 3. **SUPABASE_URL**
- **Descrição:** Mesma URL do Supabase (para o backend)
- **Valor:** Mesmo valor de `VITE_SUPABASE_URL`
- **Exemplo:** `https://codaniddkekifbbgbmcs.supabase.co`
- **Uso:** Backend (serverless functions)

### 4. **SUPABASE_ANON_KEY**
- **Descrição:** Mesma chave anon do Supabase (para o backend)
- **Valor:** Mesmo valor de `VITE_SUPABASE_ANON_KEY`
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Uso:** Backend (serverless functions)

### 5. **DATABASE_URL**
- **Descrição:** String de conexão do PostgreSQL do Supabase
- **Onde encontrar:** Painel do Supabase → Settings → Database → Connection string → URI
- **Formato:** `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
- **Exemplo:** `postgresql://postgres.xxxxx:senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- **Uso:** Backend (Drizzle ORM para queries diretas ao banco)
- **⚠️ Importante:** Mantenha esta variável **SECRETA**, nunca exponha no frontend

---

## 🔐 Variáveis Opcionais (mas Recomendadas)

### 6. **VITE_APP_TITLE**
- **Descrição:** Título da aplicação exibido no navegador
- **Padrão:** `"App"` (se não configurado)
- **Exemplo:** `"Menu Digital - São Pedro Fusion"`
- **Uso:** Frontend (meta tag title)

### 7. **JWT_SECRET**
- **Descrição:** Chave secreta para assinatura de tokens JWT (se usar autenticação customizada)
- **Padrão:** Vazio (não usado se não configurado)
- **Como gerar:** Use um gerador de strings aleatórias seguras
- **Exemplo:** `sua-chave-secreta-super-segura-aqui`
- **Uso:** Backend (se implementar JWT customizado)

---

## 🗺️ Variáveis para Mapas (Opcional)

Apenas necessárias se você usar o componente `Map.tsx`:

### 8. **VITE_FRONTEND_FORGE_API_KEY**
- **Descrição:** Chave da API do Forge para mapas no frontend
- **Padrão:** Não definido (mapa não funcionará sem isso)
- **Uso:** Frontend (componente Map)

### 9. **VITE_FRONTEND_FORGE_API_URL**
- **Descrição:** URL base da API do Forge
- **Padrão:** `"https://forge.butterfly-effect.dev"` (se não configurado)
- **Uso:** Frontend (componente Map)

### 10. **BUILT_IN_FORGE_API_URL**
- **Descrição:** URL da API do Forge para o backend
- **Padrão:** Vazio (não usado se não configurado)
- **Uso:** Backend (se usar funcionalidades de mapas no servidor)

### 11. **BUILT_IN_FORGE_API_KEY**
- **Descrição:** Chave da API do Forge para o backend
- **Padrão:** Vazio (não usado se não configurado)
- **Uso:** Backend (se usar funcionalidades de mapas no servidor)

---

## 🚫 Variáveis Não Utilizadas (Pode Ignorar)

Estas variáveis estão no código mas **não são necessárias** para o funcionamento atual:

- `VITE_APP_ID` - Não usado

---

## 📝 Como Configurar no Vercel

### Método 1: Via Painel Web (Recomendado)

1. **Acesse o painel do Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login na sua conta

2. **Navegue até seu projeto:**
   - Clique no projeto `menu-digital`

3. **Acesse as configurações:**
   - Clique em **Settings** (Configurações)
   - No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)

4. **Adicione cada variável:**
   - Clique em **Add New** (Adicionar Nova)
   - Digite o **Name** (nome da variável)
   - Digite o **Value** (valor da variável)
   - Selecione os **Environments** (ambientes):
     - ✅ **Production** (produção)
     - ✅ **Preview** (preview/PRs)
     - ✅ **Development** (desenvolvimento local)
   - Clique em **Save** (Salvar)

5. **Repita para todas as variáveis obrigatórias**

6. **Redeploy:**
   - Após adicionar todas as variáveis, vá em **Deployments**
   - Clique nos três pontos (...) do último deploy
   - Selecione **Redeploy**

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Adicionar variáveis (uma por vez)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add DATABASE_URL

# Para cada variável, você será solicitado a:
# 1. Digitar o valor
# 2. Selecionar os ambientes (Production, Preview, Development)
```

---

## ✅ Checklist de Configuração

Use esta lista para garantir que configurou tudo:

- [ ] `VITE_SUPABASE_URL` - URL do Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` - Chave anon do Supabase
- [ ] `SUPABASE_URL` - URL do Supabase (backend)
- [ ] `SUPABASE_ANON_KEY` - Chave anon do Supabase (backend)
- [ ] `DATABASE_URL` - String de conexão do PostgreSQL
- [ ] `VITE_APP_TITLE` - Título da aplicação (opcional)
- [ ] `VITE_FRONTEND_FORGE_API_KEY` - Chave API Forge (se usar mapas)
- [ ] `VITE_FRONTEND_FORGE_API_URL` - URL API Forge (se usar mapas)

---

## 🔍 Como Verificar se Está Funcionando

1. **Após configurar as variáveis e fazer redeploy:**
   - Acesse a URL do seu projeto no Vercel
   - Abra o Console do navegador (F12)
   - Verifique se não há erros relacionados a variáveis de ambiente

2. **Teste de autenticação:**
   - Tente fazer login no painel admin
   - Se funcionar, as variáveis do Supabase estão corretas

3. **Teste de banco de dados:**
   - Acesse o menu público
   - Se os itens do menu aparecerem, a `DATABASE_URL` está correta

---

## ⚠️ Importante

1. **Nunca commite variáveis de ambiente no Git:**
   - O arquivo `.gitignore` já está configurado para ignorar `.env*`
   - Nunca adicione valores reais de variáveis em arquivos commitados

2. **Variáveis `VITE_*` são públicas:**
   - Variáveis que começam com `VITE_` são expostas no código do frontend
   - Não coloque informações sensíveis nelas
   - Use apenas para dados que podem ser públicos

3. **Variáveis sem `VITE_` são privadas:**
   - Variáveis como `DATABASE_URL`, `JWT_SECRET` são apenas do backend
   - Elas não são expostas no frontend

4. **Após adicionar variáveis, sempre faça redeploy:**
   - As variáveis só são aplicadas em novos deploys
   - Variáveis adicionadas não afetam deploys já existentes

---

## 🆘 Problemas Comuns

### "Missing Supabase environment variables"
- **Causa:** `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não configuradas
- **Solução:** Adicione essas variáveis no Vercel e faça redeploy

### "Database connection failed"
- **Causa:** `DATABASE_URL` incorreta ou não configurada
- **Solução:** Verifique a string de conexão no Supabase e adicione no Vercel

### "Build succeeded but app doesn't work"
- **Causa:** Variáveis configuradas mas não aplicadas ao deploy atual
- **Solução:** Faça um novo deploy após adicionar as variáveis

---

## 📚 Recursos Adicionais

- [Documentação do Vercel sobre Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentação do Supabase](https://supabase.com/docs)
- [Como obter credenciais do Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#get-the-api-keys)

