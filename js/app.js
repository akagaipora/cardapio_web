// Aplicação principal

const App = {
    currentCategory: 'todos',
    
    /**
     * Inicializa a aplicação
     */
    async init() {
        try {
            // Aguardar carregamento dos produtos
            await this.waitForProducts();
            
            // Renderizar categorias
            this.renderCategories();
            
            // Renderizar produtos
            this.renderProducts();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Ocultar loading
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            document.getElementById('loading').innerHTML = '<p>Erro ao carregar cardápio. Tente recarregar a página.</p>';
        }
    },
    
    /**
     * Aguarda o carregamento dos produtos
     */
    async waitForProducts(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            if (SheetsAPI.products.length > 0) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (SheetsAPI.products.length === 0) {
            throw new Error('Não foi possível carregar os produtos');
        }
    },
    
    /**
     * Renderiza as categorias
     */
    renderCategories() {
        const categoryFilter = document.getElementById('category-filter');
        const categories = SheetsAPI.getCategories();
        
        // Limpar categorias anteriores (manter "Todos")
        const existingButtons = categoryFilter.querySelectorAll('.category-btn:not([data-category="todos"])');
        existingButtons.forEach(btn => btn.remove());
        
        // Adicionar categorias
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category;
            btn.dataset.category = category;
            
            btn.addEventListener('click', () => {
                this.selectCategory(category);
            });
            
            categoryFilter.appendChild(btn);
        });
    },
    
    /**
     * Seleciona uma categoria
     */
    selectCategory(category) {
        this.currentCategory = category;
        
        // Atualizar botões ativos
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Renderizar produtos
        this.renderProducts();
    },
    
    /**
     * Renderiza os produtos
     */
    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        const products = SheetsAPI.getProductsByCategory(this.currentCategory);
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria.</p>';
            return;
        }
        
        productsGrid.innerHTML = products.map(rawProduct => {
            const product = SheetsAPI.formatProduct(rawProduct);
            const minPrice = Math.min(...product.sizes.map(s => s.price));
            
            return `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image || 'https://via.placeholder.com/250x250?text=Imagem+não+disponível'}" 
                             alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/250x250?text=Imagem+não+disponível'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">A partir de ${formatCurrency(minPrice)}</span>
                            <button class="btn btn-primary btn-add" data-product-id="${product.id}">
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Adicionar event listeners aos botões de adicionar
        productsGrid.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const rawProduct = SheetsAPI.getProductById(productId);
                if (rawProduct) {
                    const product = SheetsAPI.formatProduct(rawProduct);
                    Modal.openProductModal(product);
                }
            });
        });
    },
    
    /**
     * Configura os event listeners principais
     */
    setupEventListeners() {
        // Botão de carrinho
        document.getElementById('cart-btn').addEventListener('click', () => {
            this.toggleCartSidebar();
        });
        
        // Fechar sidebar do carrinho
        document.getElementById('cart-close').addEventListener('click', () => {
            this.closeCartSidebar();
        });
        
        // Botão de continuar comprando
        document.getElementById('continue-shopping').addEventListener('click', () => {
            this.closeCartSidebar();
        });
        
        // Botão de checkout
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (Cart.getItems().length === 0) {
                alert('Seu carrinho está vazio');
                return;
            }
            this.closeCartSidebar();
            Modal.openCheckoutModal();
        });
        
        // Fechar sidebar ao clicar fora
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartBtn = document.getElementById('cart-btn');
            
            if (!cartSidebar.classList.contains('hidden') &&
                !cartSidebar.contains(e.target) &&
                !cartBtn.contains(e.target)) {
                this.closeCartSidebar();
            }
        });
    },
    
    /**
     * Alterna a visibilidade da sidebar do carrinho
     */
    toggleCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar.classList.contains('hidden')) {
            this.openCartSidebar();
        } else {
            this.closeCartSidebar();
        }
    },
    
    /**
     * Abre a sidebar do carrinho
     */
    openCartSidebar() {
        document.getElementById('cart-sidebar').classList.remove('hidden');
    },
    
    /**
     * Fecha a sidebar do carrinho
     */
    closeCartSidebar() {
        document.getElementById('cart-sidebar').classList.add('hidden');
    }
};

// Inicializar aplicação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
