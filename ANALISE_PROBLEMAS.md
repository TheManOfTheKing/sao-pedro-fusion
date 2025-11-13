# Análise de Problemas - Menu Digital

## Problemas Identificados

### 1. **Configuração do Vercel (CRÍTICO)**

O arquivo `vercel.json` está configurado incorretamente para um projeto full-stack com tRPC:

- **Problema**: A configuração atual tenta fazer build estático do cliente e serverless do servidor separadamente
- **Impacto**: O servidor Node.js não funciona corretamente na Vercel com essa configuração
- **Solução**: Reconfigurar para usar uma abordagem unificada com API routes

### 2. **Variáveis de Ambiente no Build (CRÍTICO)**

As variáveis de ambiente `VITE_*` precisam estar disponíveis durante o build do Vite:

- **Problema**: No deploy da Vercel, as variáveis de ambiente podem não estar disponíveis durante o build
- **Impacto**: O frontend não consegue se conectar ao Supabase
- **Solução**: Criar arquivo `.env.example` e garantir que as variáveis sejam configuradas no painel da Vercel

### 3. **Schema do Banco de Dados**

Precisa verificar se todas as tabelas foram criadas corretamente no Supabase:

- Tabelas necessárias: `user_profiles`, `categories`, `menu_items`, `translations`
- Verificar se os tipos ENUM foram criados
- Verificar se as policies RLS estão ativas

### 4. **Dados de Exemplo**

O banco de dados pode estar vazio:

- **Problema**: Sem categorias e itens de menu, o dashboard e menu público aparecem vazios
- **Solução**: Criar script de seed com dados de exemplo

### 5. **Build Script no package.json**

O script de build atual pode não estar otimizado:

```json
"build": "pnpm install && cd client && pnpm build"
```

- **Problema**: Não compila o servidor TypeScript
- **Solução**: Adicionar build do servidor

### 6. **Estrutura de Deploy na Vercel**

A estrutura atual não é ideal para Vercel:

- **Problema**: Vercel funciona melhor com API routes no padrão `/api/*`
- **Solução**: Ajustar a estrutura para usar o padrão de API routes da Vercel

## Plano de Correção

### Fase 1: Correções Críticas

1. ✅ Reconfigurar `vercel.json` para estrutura correta
2. ✅ Criar arquivo `.env.example` com todas as variáveis necessárias
3. ✅ Ajustar scripts de build no `package.json`
4. ✅ Criar script SQL de seed com dados de exemplo

### Fase 2: Melhorias de Código

1. ✅ Adicionar tratamento de erros mais robusto
2. ✅ Melhorar mensagens de erro para debugging
3. ✅ Adicionar logs de desenvolvimento

### Fase 3: Documentação

1. ✅ Criar README com instruções de deploy
2. ✅ Documentar variáveis de ambiente
3. ✅ Adicionar guia de troubleshooting

## Próximos Passos

1. Implementar todas as correções
2. Testar localmente
3. Preparar para deploy na Vercel
4. Criar documentação de deploy
