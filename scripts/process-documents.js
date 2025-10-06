const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

// Diretórios
const DOCS_DIR = path.join(process.cwd(), 'data', 'documents');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'processed');

// Criar diretórios se não existirem
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Processar PDF com OCR
async function processPDF(filePath) {
  console.log(`Processando PDF: ${filePath}`);
  
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  
  const filename = path.basename(filePath);
  const pages = [];
  
  // Extrair texto de cada página
  const textPages = pdfData.text.split('\f'); // Form feed separa páginas
  
  for (let i = 0; i < pdfData.numpages; i++) {
    let pageText = textPages[i] || '';
    let hasImage = false;
    
    // Nota: OCR de imagens em PDFs requer conversão adicional
    // Por enquanto, apenas extraímos o texto disponível
    if (pageText.trim().length < 20) {
      console.log(`  Página ${i + 1} tem pouco texto (possível imagem)`);
      hasImage = true;
    }
    
    pages.push({
      pageNumber: i + 1,
      text: pageText.trim(),
      hasImage
    });
  }
  
  return {
    filename,
    type: 'pdf',
    pages
  };
}

// Processar PPTX (PowerPoint)
async function processPPTX(filePath) {
  console.log(`Processando PPTX: ${filePath}`);
  
  const AdmZip = require('adm-zip');
  const { parseStringPromise } = require('xml2js');
  
  const filename = path.basename(filePath);
  const pages = [];
  
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    
    // Encontrar todos os slides
    const slideEntries = zipEntries.filter(entry => 
      entry.entryName.match(/ppt\/slides\/slide\d+\.xml/)
    );
    
    slideEntries.sort((a, b) => {
      const numA = parseInt(a.entryName.match(/\d+/)[0]);
      const numB = parseInt(b.entryName.match(/\d+/)[0]);
      return numA - numB;
    });
    
    for (let i = 0; i < slideEntries.length; i++) {
      const entry = slideEntries[i];
      const xmlContent = zip.readAsText(entry);
      const result = await parseStringPromise(xmlContent);
      
      // Extrair texto de todos os elementos do slide
      let slideText = '';
      const extractText = (obj) => {
        if (typeof obj === 'string') {
          slideText += obj + ' ';
        } else if (Array.isArray(obj)) {
          obj.forEach(extractText);
        } else if (typeof obj === 'object' && obj !== null) {
          Object.values(obj).forEach(extractText);
        }
      };
      
      extractText(result);
      
      pages.push({
        pageNumber: i + 1,
        text: slideText.trim(),
        hasImage: false
      });
    }
  } catch (error) {
    console.error(`Erro ao processar PPTX: ${error}`);
  }
  
  return {
    filename,
    type: 'pptx',
    pages
  };
}

// Processar todos os documentos
async function processAllDocuments() {
  console.log('Iniciando processamento de documentos...\n');
  console.log('⚠️  IMPORTANTE: Processando APENAS os PDFs SCAN0000 e SCAN0001\n');
  
  const documents = [];
  
  // Lista de arquivos para processar - APENAS OS 2 PDFs SCAN
  const files = [
    'SCAN0000.PDF',
    'SCAN0001.PDF'
  ];
  
  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${file}`);
      continue;
    }
    
    try {
      let doc;
      
      if (file.toLowerCase().endsWith('.pdf')) {
        doc = await processPDF(filePath);
      } else if (file.toLowerCase().endsWith('.pptx')) {
        doc = await processPPTX(filePath);
      } else {
        console.log(`⚠️  Tipo de arquivo não suportado: ${file}`);
        continue;
      }
      
      documents.push(doc);
      console.log(`✓ ${file} processado com sucesso (${doc.pages.length} páginas)\n`);
    } catch (error) {
      console.error(`✗ Erro ao processar ${file}:`, error, '\n');
    }
  }
  
  // Salvar documentos processados
  const outputPath = path.join(OUTPUT_DIR, 'documents.json');
  fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
  
  console.log(`\n✓ Processamento concluído!`);
  console.log(`  Total de documentos: ${documents.length}`);
  console.log(`  Arquivo salvo em: ${outputPath}`);
  
  // Limpar diretório temporário
  const tempDir = path.join(OUTPUT_DIR, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  processAllDocuments().catch(console.error);
}

module.exports = { processAllDocuments, processPDF, processPPTX };
