# Guia de Deploy - Menu Digital

Este guia fornece instruções passo a passo para fazer o deploy do Menu Digital na Vercel.

## 📋 Pré-requisitos

1. **Conta no Supabase** (gratuita)
2. **Conta na Vercel** (gratuita)
3. **Repositório Git** (GitHub, GitLab ou Bitbucket)

## 🗄️ Configuração do Banco de Dados (Supabase)

### Passo 1: Criar o Schema

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **SQL Editor** no menu lateral
4. Abra o arquivo `supabase/schema.sql` deste projeto
5. Copie todo o conteúdo e cole no editor SQL
6. Clique em **Run** para executar o script
7. Verifique se todas as tabelas foram criadas com sucesso

### Passo 2: Popular com Dados de Exemplo (Opcional)

1. No mesmo **SQL Editor**
2. Abra o arquivo `supabase/seed.sql` deste projeto
3. Copie todo o conteúdo e cole no editor SQL
4. Clique em **Run** para executar o script
5. Isso criará categorias e itens de menu de exemplo

### Passo 3: Criar Usuário Administrador

1. Vá em **Authentication** > **Users** no painel do Supabase
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - **Email**: seu email (será o admin)
   - **Password**: senha segura
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **Create user**

### Passo 4: Coletar Credenciais do Supabase

Vá em **Settings** > **API** e anote:

- **Project URL**: `https://xxxxx.supabase.co`
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Vá em **Settings** > **Database** e anote:

- **Connection string** (URI): `postgresql://postgres:...`

## 🚀 Deploy na Vercel

### Passo 1: Preparar o Repositório

1. Faça commit de todas as alterações:
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### Passo 2: Importar Projeto na Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em **Add New** > **Project**
3. Selecione o repositório do projeto
4. Clique em **Import**

### Passo 3: Configurar Variáveis de Ambiente

Na tela de configuração do projeto, vá em **Environment Variables** e adicione:

```
SUPABASE_URL=https://codaniddkekifbbgbmcs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZGFuaWRka2VraWZiYmdibWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDE2MTIsImV4cCI6MjA3ODYxNzYxMn0.vajY9atspx9STj-MFasvSXVCxYnoBE38TuGFM4N4rb8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZGFuaWRka2VraWZiYmdibWNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA0MTYxMiwiZXhwIjoyMDc4NjE3NjEyfQ.UyZwYGqVJRMTWMbu8idYAH4KrCGirTqnUub4DWUSYt4
SUPABASE_DB_URL=postgresql://postgres:6@RbytSXv@db.codaniddkekifbbgbmcs.supabase.co:5432/postgres
ADMIN_EMAIL=delmondesadv@gmail.com
VITE_APP_TITLE=Menu Digital
VITE_SUPABASE_URL=https://codaniddkekifbbgbmcs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZGFuaWRka2VraWZiYmdibWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDE2MTIsImV4cCI6MjA3ODYxNzYxMn0.vajY9atspx9STj-MFasvSXVCxYnoBE38TuGFM4N4rb8
```

**⚠️ IMPORTANTE**: 
- Certifique-se de adicionar TODAS as variáveis
- As variáveis com `VITE_` são necessárias para o frontend
- Selecione **Production**, **Preview** e **Development** para cada variável

### Passo 4: Configurar Build Settings

- **Framework Preset**: `Other`
- **Build Command**: `pnpm build`
- **Output Directory**: `client/dist`
- **Install Command**: `pnpm install`

### Passo 5: Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (pode levar 2-5 minutos)
3. Quando finalizar, clique no link do projeto

## ✅ Verificação Pós-Deploy

### Testar o Menu Público

1. Acesse: `https://seu-projeto.vercel.app/menu/pt`
2. Você deve ver as categorias e itens do menu
3. Teste a navegação entre categorias

### Testar o Login Administrativo

1. Acesse: `https://seu-projeto.vercel.app/`
2. Faça login com o email e senha do usuário criado no Supabase
3. Você deve ser redirecionado para `/admin`
4. Verifique se consegue:
   - Ver todas as categorias
   - Ver todos os itens do menu
   - Alterar disponibilidade de itens (toggle on/off)

## 🔧 Troubleshooting

### Problema: "Database client not initialized"

**Causa**: Variável `SUPABASE_DB_URL` não configurada ou incorreta

**Solução**:
1. Vá em Vercel > Settings > Environment Variables
2. Verifique se `SUPABASE_DB_URL` está configurada
3. Copie a connection string do Supabase (Settings > Database)
4. Faça redeploy: Deployments > ⋯ > Redeploy

### Problema: "Supabase client error" no frontend

**Causa**: Variáveis `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não configuradas

**Solução**:
1. Vá em Vercel > Settings > Environment Variables
2. Adicione as variáveis com prefixo `VITE_`
3. Faça redeploy

### Problema: Menu vazio após login

**Causa**: Banco de dados sem dados

**Solução**:
1. Execute o script `supabase/seed.sql` no SQL Editor do Supabase
2. Recarregue a página do admin

### Problema: "Unauthorized" ao fazer login

**Causa**: Usuário não existe ou senha incorreta

**Solução**:
1. Vá em Supabase > Authentication > Users
2. Verifique se o usuário existe
3. Se necessário, crie um novo usuário
4. Marque "Auto Confirm User" ao criar

### Problema: Build falha na Vercel

**Causa**: Dependências não instaladas corretamente

**Solução**:
1. Verifique os logs de build na Vercel
2. Certifique-se de que `pnpm` está sendo usado
3. Tente fazer redeploy

## 📱 Próximos Passos

Após o deploy bem-sucedido:

1. **Personalize o conteúdo**:
   - Adicione suas próprias categorias
   - Adicione seus itens de menu
   - Faça upload de imagens dos pratos

2. **Configure domínio personalizado**:
   - Vá em Vercel > Settings > Domains
   - Adicione seu domínio
   - Configure DNS conforme instruções

3. **Adicione traduções**:
   - Use o painel admin para adicionar traduções
   - Suporte para: PT, EN, ES, FR, DE, IT

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique os logs na Vercel (Deployments > View Function Logs)
2. Verifique os logs no Supabase (Logs > Postgres Logs)
3. Abra uma issue no repositório do projeto

## 📝 Checklist de Deploy

- [ ] Schema SQL executado no Supabase
- [ ] Seed SQL executado (opcional)
- [ ] Usuário admin criado no Supabase
- [ ] Todas as variáveis de ambiente configuradas na Vercel
- [ ] Build completado com sucesso
- [ ] Menu público acessível
- [ ] Login funcionando
- [ ] Dashboard admin acessível
- [ ] Toggle de disponibilidade funcionando

---

**Última atualização**: 13 de Novembro de 2025
