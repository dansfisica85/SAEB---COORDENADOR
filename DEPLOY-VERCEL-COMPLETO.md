# 🚀 GUIA DE DEPLOY NO VERCEL - PASSO A PASSO

## ⚠️ ATENÇÃO: OS DOCUMENTOS NÃO SERÃO HOSPEDADOS

Os documentos SAEB (2.4 GB) **NÃO podem** ser hospedados no Vercel por limitações de tamanho.

**Soluções:**
1. **Usar apenas busca local** (sistema funciona no seu computador)
2. **Hospedar documentos em Azure Blob Storage** (requer conta Azure)
3. **Usar GitHub Releases para documentos** (até 2 GB por arquivo)

---

## 📋 OPÇÃO 1: Deploy Básico (Sem Sistema de Busca)

### Passo 1: Preparar o projeto

```powershell
# Comentar a funcionalidade de busca em documentos
# Editar app/api/search/route.ts para retornar mensagem
```

### Passo 2: Commit e Push

```powershell
git add .
git commit -m "Prepara para deploy no Vercel"
git push origin main
```

### Passo 3: Deploy no Vercel

1. Acesse: https://vercel.com/new
2. Importe o repositório: `dansfisica85/SAEB---COORDENADOR`
3. Configure o Framework: **Next.js** (automático)
4. Clique em **"Deploy"**

### Passo 4: Configurar Variáveis de Ambiente

1. Vá em **Settings > Environment Variables**
2. Adicione estas 3 variáveis:

```
NEXT_PUBLIC_GEMINI_API_KEY = AIzaSyAuiI2TFZH0mC23RqV_CeyP85dNLUfizyo
AUTH_USERNAME = COORDENADOR
AUTH_PASSWORD = SAEB2025FGV
```

3. Marque: **Production, Preview, Development**
4. Clique em **Save**

### Passo 5: Redeploy

1. Vá em **Deployments**
2. Clique nos 3 pontos do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o build finalizar

---

## 📋 OPÇÃO 2: Deploy Completo com Azure Blob Storage

### Requisitos:
- Conta Microsoft Azure (gratuita)
- Azure Storage Account

### Passo 1: Criar Storage no Azure

```powershell
# No Azure Portal:
# 1. Create Resource > Storage Account
# 2. Criar container "saeb-documents"
# 3. Configurar acesso público ou SAS token
```

### Passo 2: Upload dos Documentos

```powershell
# Instalar Azure CLI
winget install Microsoft.AzureCLI

# Login
az login

# Upload dos documentos
az storage blob upload-batch `
  --account-name seustorageaccount `
  --destination saeb-documents `
  --source "data/documents/"
```

### Passo 3: Modificar o código

Editar `app/api/search/route.ts` para buscar documentos no Azure:

```typescript
// Adicionar Azure Storage SDK
import { BlobServiceClient } from '@azure/storage-blob';

// Buscar documentos do Azure em vez de arquivo local
```

### Passo 4: Adicionar variáveis de ambiente no Vercel

```
AZURE_STORAGE_CONNECTION_STRING = sua_connection_string
AZURE_STORAGE_CONTAINER = saeb-documents
```

---

## 📋 OPÇÃO 3: Deploy Simples (Recomendado para Teste)

### Desabilitar busca em documentos temporariamente

1. **Editar** `app/api/search/route.ts`:

```typescript
export async function POST(request: Request) {
  return NextResponse.json({
    results: [],
    aiResponse: "⚠️ Sistema em modo demonstração. A busca em documentos está temporariamente desabilitada. Entre em contato com o administrador para acesso aos documentos completos."
  });
}
```

2. **Commit e Deploy**:

```powershell
git add app/api/search/route.ts
git commit -m "Modo demonstração - busca desabilitada"
git push origin main
```

3. **Deploy automático** no Vercel

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

Após o deploy, teste:

1. ✅ **Login funciona** (COORDENADOR / SAEB2025FGV)
2. ✅ **Interface carrega** corretamente
3. ✅ **Logout funciona**
4. ⚠️ **Busca mostra mensagem** (modo demo)

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### "Build failed: Module not found"
```powershell
# Verificar package.json
npm install
npm run build
```

### "Environment variables not working"
- Verificar se adicionou as 3 variáveis
- Verificar se marcou todos os ambientes
- Fazer redeploy após adicionar variáveis

### "Login não funciona"
- Verificar AUTH_USERNAME e AUTH_PASSWORD no Vercel
- Verificar se fez redeploy após adicionar variáveis

---

## 📊 CUSTOS

**Vercel Free Tier:**
- ✅ Hospedagem grátis
- ✅ HTTPS automático
- ✅ 100 GB de bandwidth/mês
- ✅ Deploy automático do Git

**Azure Blob Storage (se usar):**
- ~R$ 0,50/mês para 2.4 GB
- Custo adicional por requisições

---

## 🎯 RECOMENDAÇÃO FINAL

Para **uso imediato**:
1. Use o sistema **localmente** (npm run dev)
2. Todos os 352 páginas/slides funcionam
3. Busca com IA totalmente operacional
4. Sem custos adicionais

Para **deploy em produção**:
1. Configure Azure Blob Storage
2. Modifique código para buscar no Azure
3. Deploy no Vercel
4. Configure variáveis de ambiente

---

## 📞 PRÓXIMOS PASSOS

Qual opção prefere?

1. **Manter local** (funciona 100% agora)
2. **Deploy demo** (sem busca)
3. **Deploy completo** (com Azure)

Posso ajudar a implementar qualquer uma dessas opções!

---

**Arquivo criado em:** 06/10/2025  
**Sua chave API está em:** VERCEL-ENV-VARS.txt (não versionar!)
