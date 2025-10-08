# 🔧 Solução para Erros no Vercel

## ❌ Problemas Corrigidos

### 1. Erro 404 - favicon.ico
**Causa**: Navegador procurando favicon padrão  
**Solução**: Adicionado favicon inline (emoji 📚) nos arquivos HTML

### 2. Erro 401 - api/auth/login
**Causa**: Vercel tentando acessar rotas do Next.js antigo  
**Solução**: Sistema novo usa **localStorage** - sem API

## ✅ O que foi feito

1. ✅ Adicionado `vercel.json` na pasta `web/`
2. ✅ Favicon inline nos HTML
3. ✅ Corrigido `data-section` no JavaScript
4. ✅ Commit e push para GitHub

## 🚀 Próximos Passos no Vercel

### IMPORTANTE: Redeploy no Vercel

1. **Acesse seu projeto no Vercel**
2. Vá em **"Deployments"**
3. Clique em **"Redeploy"** no último deployment
4. OU faça um novo deployment automático (já foi feito push)

### Verificar Configuração

Se ainda não funcionar:

1. **Verifique Root Directory**:
   - Vá em Settings > General
   - Root Directory DEVE ser: `web`
   - Salve e faça redeploy

2. **Framework Preset**:
   - Deve estar: `Other`
   - NÃO pode estar: `Next.js`

3. **Build Command**:
   - Deve estar: VAZIO
   - NÃO colocar nenhum comando

## 🔍 Como Testar

Após o redeploy:

1. Abra a URL do Vercel
2. Aperte **F12** (Console do navegador)
3. Aperte **Ctrl+Shift+R** (recarregar forçado)
4. Verifique se há erros no Console

### ✅ Deve funcionar:
- Página de login carrega
- Consegue fazer login com `COORDENADOR` / `SAEB2025FGV`
- Redireciona para página de chat
- Chat carrega corretamente

### ❌ Se ainda houver erros:
- Tire screenshot do Console (F12)
- Verifique a aba "Network" no DevTools
- Veja quais arquivos estão dando 404

## 📝 Estrutura Correta

```
seu-projeto.vercel.app/
├── index.html       ← Página inicial (login)
├── chat.html        ← Página de chat
├── styles.css       ← Estilos
├── auth.js          ← Autenticação
├── chat.js          ← Chat
├── config.js        ← Configuração API
├── documents.js     ← Documentos
└── vercel.json      ← Configuração Vercel
```

## 🆘 Ainda não funciona?

Compartilhe:
1. URL do site no Vercel
2. Screenshot do Console (F12)
3. Screenshot da configuração Root Directory no Vercel

---

**Status**: ✅ Correções enviadas para GitHub  
**Ação necessária**: Redeploy no Vercel
