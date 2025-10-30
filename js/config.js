// Configurações da aplicação

const CONFIG = {
    // Google Sheets
    SHEETS_API_KEY: 'AIzaSyB6QifMHk9_wQHaFUuLwpvE9yUbQNebx8E',
    SHEET_ID: '1v4F95kgBYAvc8JPYDUEheMZ4L6b1LHY_EOTjBa1oBPs',
    SHEET_NAME: 'Produtos', // Nome da aba na planilha
    
    // Google Drive
    DRIVE_FOLDER_ID: '1cZYNBW8tlxub4eoqqEu7eAYYMaXwYTTG',
    
    // WhatsApp
    WHATSAPP_NUMBER: '5511920934212', // Número padrão
    
    // Configurações da aplicação
    CURRENCY_SYMBOL: 'R$',
    DECIMAL_SEPARATOR: ',',
    THOUSANDS_SEPARATOR: '.',
    
    // URLs
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
    DRIVE_API_URL: 'https://www.googleapis.com/drive/v3/files'
};

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para fazer requisições à Google Sheets API
async function fetchSheetData() {
    try {
        const url = `${CONFIG.SHEETS_API_URL}/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}?key=${CONFIG.SHEETS_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values || [];
    } catch (error) {
        console.error('Erro ao buscar dados da planilha:', error);
        return [];
    }
}

// Função para converter dados da planilha em objeto
function parseSheetData(rows) {
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    const products = [];
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Pular linhas vazias
        if (!row || row.length === 0) continue;
        
        const product = {};
        headers.forEach((header, index) => {
            product[header] = row[index] || '';
        });
        
        // Validar produto
        if (product.NomeProduto && product.Categoria) {
            products.push(product);
        }
    }
    
    return products;
}
