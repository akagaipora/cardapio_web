// Módulo para integração com Google Sheets API

const SheetsAPI = {
    // Cache de produtos
    products: [],
    categories: new Set(),
    
    /**
     * Inicializa a API e carrega os dados da planilha
     */
    async init() {
        try {
            const rows = await fetchSheetData();
            this.products = parseSheetData(rows);
            this.extractCategories();
            return this.products;
        } catch (error) {
            console.error('Erro ao inicializar SheetsAPI:', error);
            return [];
        }
    },
    
    /**
     * Extrai as categorias únicas dos produtos
     */
    extractCategories() {
        this.categories.clear();
        this.products.forEach(product => {
            if (product.Categoria) {
                this.categories.add(product.Categoria.trim());
            }
        });
    },
    
    /**
     * Retorna todas as categorias
     */
    getCategories() {
        return Array.from(this.categories).sort();
    },
    
    /**
     * Retorna todos os produtos
     */
    getAllProducts() {
        return this.products;
    },
    
    /**
     * Retorna produtos filtrados por categoria
     */
    getProductsByCategory(category) {
        if (category === 'todos') {
            return this.products;
        }
        return this.products.filter(p => p.Categoria && p.Categoria.trim() === category);
    },
    
    /**
     * Retorna um produto pelo ID
     */
    getProductById(id) {
        return this.products.find(p => p.ID === id);
    },
    
    /**
     * Formata um produto para exibição
     */
    formatProduct(product) {
        return {
            id: product.ID,
            name: product.NomeProduto,
            description: product.Descrição,
            category: product.Categoria,
            sizes: this.extractSizes(product),
            image: product.LinkFoto,
            whatsappNumber: product.NumeroWhatsApp || CONFIG.WHATSAPP_NUMBER
        };
    },
    
    /**
     * Extrai os tamanhos e preços de um produto
     */
    extractSizes(product) {
        const sizes = [];
        
        // Tamanho P
        if (product.Tamanho_P && product.Preço_P) {
            sizes.push({
                size: product.Tamanho_P.trim(),
                price: parseFloat(product.Preço_P.toString().replace(',', '.'))
            });
        }
        
        // Tamanho M
        if (product.Tamanho_M && product.Preço_M) {
            sizes.push({
                size: product.Tamanho_M.trim(),
                price: parseFloat(product.Preço_M.toString().replace(',', '.'))
            });
        }
        
        // Tamanho G
        if (product.Tamanho_G && product.Preço_G) {
            sizes.push({
                size: product.Tamanho_G.trim(),
                price: parseFloat(product.Preço_G.toString().replace(',', '.'))
            });
        }
        
        return sizes;
    }
};

// Inicializar a API quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    const products = await SheetsAPI.init();
    console.log('Produtos carregados:', products.length);
});
