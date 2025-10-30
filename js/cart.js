// Módulo de gerenciamento do carrinho de compras

const Cart = {
    // Dados do carrinho
    items: [],
    
    /**
     * Inicializa o carrinho a partir do localStorage
     */
    init() {
        const saved = localStorage.getItem('cardapio_cart');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
                this.items = [];
            }
        }
        this.updateUI();
    },
    
    /**
     * Adiciona um item ao carrinho
     */
    addItem(product, size, quantity) {
        // Criar ID único para o item (produto + tamanho)
        const itemId = `${product.id}-${size.size}`;
        
        // Verificar se o item já existe no carrinho
        const existingItem = this.items.find(item => item.itemId === itemId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                itemId: itemId,
                productId: product.id,
                productName: product.name,
                size: size.size,
                price: size.price,
                quantity: quantity,
                whatsappNumber: product.whatsappNumber
            });
        }
        
        this.save();
        this.updateUI();
    },
    
    /**
     * Remove um item do carrinho
     */
    removeItem(itemId) {
        this.items = this.items.filter(item => item.itemId !== itemId);
        this.save();
        this.updateUI();
    },
    
    /**
     * Atualiza a quantidade de um item
     */
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.itemId === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateUI();
            }
        }
    },
    
    /**
     * Limpa o carrinho
     */
    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    },
    
    /**
     * Retorna todos os itens do carrinho
     */
    getItems() {
        return this.items;
    },
    
    /**
     * Retorna a quantidade total de itens
     */
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    /**
     * Retorna o subtotal do carrinho
     */
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    /**
     * Retorna o total do carrinho (igual ao subtotal neste caso)
     */
    getTotal() {
        return this.getSubtotal();
    },
    
    /**
     * Salva o carrinho no localStorage
     */
    save() {
        localStorage.setItem('cardapio_cart', JSON.stringify(this.items));
    },
    
    /**
     * Atualiza a interface do carrinho
     */
    updateUI() {
        // Atualizar contador do carrinho
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        
        // Atualizar totais
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');
        if (subtotal) subtotal.textContent = formatCurrency(this.getSubtotal());
        if (total) total.textContent = formatCurrency(this.getTotal());
        
        // Atualizar lista de itens no carrinho
        this.renderCartItems();
    },
    
    /**
     * Renderiza os itens do carrinho na sidebar
     */
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
            return;
        }
        
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.itemId}">
                <div class="cart-item-info">
                    <h4>${item.productName}</h4>
                    <p class="cart-item-size">${item.size}</p>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn qty-minus" data-item-id="${item.itemId}">−</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" data-item-id="${item.itemId}">
                        <button class="qty-btn qty-plus" data-item-id="${item.itemId}">+</button>
                    </div>
                    <button class="btn-remove" data-item-id="${item.itemId}">🗑️</button>
                </div>
                <div class="cart-item-subtotal">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
        
        // Adicionar event listeners aos controles do carrinho
        this.attachCartItemListeners();
    },
    
    /**
     * Adiciona event listeners aos controles dos itens do carrinho
     */
    attachCartItemListeners() {
        // Botões de quantidade
        document.querySelectorAll('.cart-item-controls .qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const item = this.items.find(i => i.itemId === itemId);
                if (!item) return;
                
                if (e.target.classList.contains('qty-minus')) {
                    this.updateQuantity(itemId, item.quantity - 1);
                } else {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });
        
        // Inputs de quantidade
        document.querySelectorAll('.cart-item-controls .qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.dataset.itemId;
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(itemId, quantity);
            });
        });
        
        // Botões de remover
        document.querySelectorAll('.cart-item-controls .btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.removeItem(itemId);
            });
        });
    }
};

// Inicializar carrinho quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
