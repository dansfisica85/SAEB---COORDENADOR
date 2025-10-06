# ⚡ Deploy Rápido no Vercel

## 🔑 Variáveis de Ambiente Obrigatórias

Configure estas 3 variáveis no Vercel Dashboard:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Sua chave API do Gemini | Production, Preview, Development |
| `AUTH_USERNAME` | `COORDENADOR` | Production, Preview, Development |
| `AUTH_PASSWORD` | `SAEB2025FGV` | Production, Preview, Development |

## 📋 Passo a Passo

### 1. Importe o Repositório

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dansfisica85/SAEB---COORDENADOR)

### 2. Configure as Variáveis

Em **Settings → Environment Variables**, adicione as 3 variáveis acima.

### 3. Redeploy

Após adicionar as variáveis, vá em **Deployments** e clique em **Redeploy**.

## ⚠️ Limitação Importante

**Os documentos SAEB (2.4 GB) não estão incluídos no deploy.**

O sistema funcionará, mas a busca em documentos estará limitada. Para solução completa, consulte [DEPLOY-VERCEL-COMPLETO.md](DEPLOY-VERCEL-COMPLETO.md).

## ✅ O que funciona no Vercel

- ✅ Login e autenticação
- ✅ Interface completa
- ✅ Integração com IA (Gemini)
- ⚠️ Busca em documentos (requer configuração adicional)

## 🔧 Troubleshooting

**Build falhou?**
- Verifique se todas as 3 variáveis foram adicionadas
- Certifique-se que marcou todos os ambientes
- Faça redeploy após adicionar variáveis

**Login não funciona?**
- Verifique AUTH_USERNAME e AUTH_PASSWORD
- Faça redeploy para aplicar as mudanças

## 📚 Documentação Completa

Para deploy completo com sistema de busca funcional, veja:
- [DEPLOY-VERCEL-COMPLETO.md](DEPLOY-VERCEL-COMPLETO.md)
- [README.md](README.md)

---

**Framework:** Next.js 14  
**Node Version:** 18+  
**Build Command:** `npm run build`  
**Output Directory:** `.next`
