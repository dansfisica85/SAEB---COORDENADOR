# 📁 Pasta de Documentos

## ⚠️ IMPORTANTE

Esta pasta deve conter os **documentos originais** para processamento pelo sistema SAEB 2025.

---

## 📋 Instruções

### 1. Adicione seus documentos aqui

Coloque os arquivos PowerPoint (.pptx) e PDF (.pdf) nesta pasta:

```
data/documents/
├── SAEB2025_Apresentação_2_Ano_VF.pptx
├── SAEB2025_Apresentação_Aplicadores_5_9_3_VF.pptx
├── SCAN0000.PDF
└── SCAN0001.PDF
```

### 2. Execute o processamento

Após adicionar os documentos, execute:

```powershell
npm run process-docs
```

Isso irá extrair o texto dos documentos e salvar em `data/processed/documents.json`.

---

## 🔒 Por que os documentos não estão no Git?

- **Tamanho**: Os documentos são muito grandes (2.4 GB) para o GitHub
- **Privacidade**: Documentos podem conter informações sensíveis
- **Flexibilidade**: Cada usuário pode usar seus próprios documentos

---

## 📝 Formatos Suportados

- ✅ **PowerPoint** (.pptx) - Apresentações
- ✅ **PDF** (.pdf) - Documentos escaneados
- ✅ **OCR** - Reconhecimento de texto em imagens (automático)

---

## ❓ Problemas Comuns

### "Arquivo não encontrado"
- Verifique se os arquivos estão nesta pasta
- Verifique os nomes dos arquivos

### "Pouco texto extraído"
- Normal para PDFs escaneados (imagens)
- O sistema usará OCR automaticamente

### "Erro ao processar"
- Verifique se os arquivos não estão corrompidos
- Tente abrir os arquivos no PowerPoint/Adobe Reader

---

## 📞 Suporte

Para mais informações, consulte:
- [README.md](../../README.md) - Documentação completa
- [COMECE-AQUI.md](../../COMECE-AQUI.md) - Guia de instalação

---

**SAEB 2025 - Sistema de Pesquisa**  
**Secretaria da Educação do Estado de São Paulo**
