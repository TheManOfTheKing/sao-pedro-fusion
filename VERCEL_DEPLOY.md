# Configuração de Deploy no Vercel

## Problema Resolvido

O erro `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` ocorria porque o Vercel estava tentando usar pnpm@9.x, mas o projeto usa pnpm@10.4.1.

## Solução Implementada

1. **vercel.json atualizado** com comandos que usam corepack para garantir a versão correta do pnpm
2. **.npmrc criado** para configurações do npm/pnpm
3. **package.json** já contém `packageManager` especificando pnpm@10.4.1

## Configurações no Vercel Dashboard (Opcional)

Se ainda houver problemas, configure no Vercel Dashboard:

1. Acesse **Settings** → **General**
2. Em **Build & Development Settings**:
   - **Install Command**: `corepack enable && corepack prepare pnpm@10.4.1 --activate && pnpm install`
   - **Build Command**: `corepack enable && corepack prepare pnpm@10.4.1 --activate && pnpm build`
   - **Output Directory**: `client/dist`

## Variáveis de Ambiente Necessárias

Certifique-se de configurar no Vercel Dashboard (Settings → Environment Variables):

### Backend
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `ADMIN_EMAIL`
- `GOOGLE_TRANSLATE_API_KEY` (opcional)

### Frontend
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_TITLE`

## Comandos de Build

O projeto usa:
- **Root**: `pnpm build` (instala dependências e build do client)
- **Client**: `cd client && pnpm build` (build do frontend)

## Notas

- O Vercel detecta automaticamente o `packageManager` no `package.json`
- O corepack garante que a versão correta do pnpm seja usada
- Se o erro persistir, tente fazer commit e push novamente para forçar um novo build

