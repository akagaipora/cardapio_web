// Módulo de gerenciamento de modais

const Modal = {
    currentProduct: null,
    selectedSize: null,
    selectedQuantity: 1,
    
    /**
     * Abre o modal de produto
     */
    openProductModal(product) {
        this.currentProduct = product;
        this.selectedSize = null;
        this.selectedQuantity = 1;
        
        // Preencher informações do produto
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        
        // Definir imagem
        const img = document.getElementById('modal-product-image');
        img.src = product.image || 'https://via.placeholder.com/300x300?text=Imagem+não+disponível';
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/300x300?text=Imagem+não+disponível';
        };
        
        // Renderizar opções de tamanho
        this.renderSizeOptions(product.sizes);
        
        // Resetar quantidade
        document.getElementById('qty-input').value = 1;
        
        // Mostrar modal
        document.getElementById('product-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },
    
    /**
     * Fecha o modal de produto
     */
    closeProductModal() {
        document.getElementById('product-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.currentProduct = null;
        this.selectedSize = null;
    },
    
    /**
     * Renderiza as opções de tamanho
     */
    renderSizeOptions(sizes) {
        const sizeOptionsContainer = document.getElementById('size-options');
        sizeOptionsContainer.innerHTML = sizes.map((size, index) => `
            <button type="button" class="size-option" data-size-index="${index}" data-price="${size.price}">
                <span class="size-name">${size.size}</span>
                <span class="size-price">${formatCurrency(size.price)}</span>
            </button>
        `).join('');
        
        // Selecionar primeira opção por padrão
        if (sizes.length > 0) {
            this.selectSize(0, sizes[0]);
        }
        
        // Adicionar event listeners
        sizeOptionsContainer.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.dataset.sizeIndex);
                this.selectSize(index, sizes[index]);
            });
        });
    },
    
    /**
     * Seleciona um tamanho
     */
    selectSize(index, size) {
        // Remover seleção anterior
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Selecionar novo tamanho
        document.querySelector(`[data-size-index="${index}"]`).classList.add('selected');
        this.selectedSize = size;
        
        // Atualizar preço
        document.getElementById('modal-price').textContent = formatCurrency(size.price);
    },
    
    /**
     * Adiciona o produto ao carrinho
     */
    addToCart() {
        if (!this.currentProduct || !this.selectedSize) {
            alert('Por favor, selecione um tamanho');
            return;
        }
        
        const quantity = parseInt(document.getElementById('qty-input').value) || 1;
        Cart.addItem(this.currentProduct, this.selectedSize, quantity);
        
        // Mostrar feedback
        this.showAddedToCartFeedback();
        
        // Fechar modal
        this.closeProductModal();
    },
    
    /**
     * Mostra feedback de item adicionado ao carrinho
     */
    showAddedToCartFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-toast';
        feedback.textContent = '✓ Adicionado ao carrinho!';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    },
    
    /**
     * Abre o modal de checkout
     */
    openCheckoutModal() {
        // Renderizar itens do checkout
        this.renderCheckoutItems();
        
        // Atualizar total
        document.getElementById('checkout-total').textContent = formatCurrency(Cart.getTotal());
        
        // Mostrar modal
        document.getElementById('checkout-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Fechar sidebar do carrinho
        document.getElementById('cart-sidebar').classList.add('hidden');
    },
    
    /**
     * Fecha o modal de checkout
     */
    closeCheckoutModal() {
        document.getElementById('checkout-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    },
    
    /**
     * Renderiza os itens no checkout
     */
    renderCheckoutItems() {
        const checkoutItemsContainer = document.getElementById('checkout-items');
        const items = Cart.getItems();
        
        checkoutItemsContainer.innerHTML = items.map(item => `
            <div class="checkout-item">
                <div class="item-details">
                    <strong>${item.productName}</strong>
                    <span class="item-size">${item.size}</span>
                </div>
                <div class="item-quantity">
                    Qtd: ${item.quantity}
                </div>
                <div class="item-price">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
    },
    
    /**
     * Gera a mensagem para WhatsApp
     */
    generateWhatsAppMessage() {
        const name = document.getElementById('customer-name').value.trim();
        const phone = document.getElementById('customer-phone').value.trim();
        const address = document.getElementById('customer-address').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
        
        if (!name) {
            alert('Por favor, insira seu nome');
            return null;
        }
        
        if (!payment) {
            alert('Por favor, selecione uma forma de pagamento');
            return null;
        }
        
        const items = Cart.getItems();
        const total = Cart.getTotal();
        
        // Construir mensagem
        let message = `*PEDIDO DO CARDÁPIO DIGITAL*\n\n`;
        message += `*Cliente:* ${name}\n`;
        
        if (phone) {
            message += `*Telefone:* ${phone}\n`;
        }
        
        if (address) {
            message += `*Endereço:* ${address}\n`;
        }
        
        message += `*Forma de Pagamento:* ${payment}\n`;
        message += `\n*ITENS DO PEDIDO:*\n`;
        message += `${'─'.repeat(40)}\n`;
        
        items.forEach(item => {
            message += `\n${item.productName}\n`;
            message += `Tamanho: ${item.size} | Preço: ${formatCurrency(item.price)}\n`;
            message += `Quantidade: ${item.quantity} | Subtotal: ${formatCurrency(item.price * item.quantity)}\n`;
        });
        
        message += `\n${'─'.repeat(40)}\n`;
        message += `\n*TOTAL: ${formatCurrency(total)}*\n`;
        
        return message;
    },
    
    /**
     * Envia o pedido via WhatsApp
     */
    sendWhatsAppOrder() {
        const message = this.generateWhatsAppMessage();
        if (!message) return;
        
        // Obter número de WhatsApp (usar o do primeiro item ou o padrão)
        const items = Cart.getItems();
        const whatsappNumber = items.length > 0 ? items[0].whatsappNumber : CONFIG.WHATSAPP_NUMBER;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Criar URL do WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Limpar carrinho
        Cart.clear();
        
        // Fechar modal
        this.closeCheckoutModal();
        
        // Mostrar mensagem de sucesso
        this.showOrderSentFeedback();
    },
    
    /**
     * Mostra feedback de pedido enviado
     */
    showOrderSentFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-toast success';
        feedback.textContent = '✓ Pedido enviado! Você será redirecionado para o WhatsApp.';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
};

// Inicializar event listeners dos modais quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Modal de produto
    document.getElementById('modal-close').addEventListener('click', () => Modal.closeProductModal());
    document.getElementById('modal-cancel').addEventListener('click', () => Modal.closeProductModal());
    document.getElementById('modal-add').addEventListener('click', () => Modal.addToCart());
    
    // Controles de quantidade no modal
    document.getElementById('qty-minus').addEventListener('click', () => {
        const input = document.getElementById('qty-input');
        input.value = Math.max(1, parseInt(input.value) - 1);
    });
    
    document.getElementById('qty-plus').addEventListener('click', () => {
        const input = document.getElementById('qty-input');
        input.value = parseInt(input.value) + 1;
    });
    
    // Modal de checkout
    document.getElementById('checkout-close').addEventListener('click', () => Modal.closeCheckoutModal());
    document.getElementById('checkout-back').addEventListener('click', () => Modal.closeCheckoutModal());
    
    // Formulário de checkout
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        Modal.sendWhatsAppOrder();
    });
    
    // Fechar modais ao clicar fora
    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target.id === 'product-modal') {
            Modal.closeProductModal();
        }
    });
    
    document.getElementById('checkout-modal').addEventListener('click', (e) => {
        if (e.target.id === 'checkout-modal') {
            Modal.closeCheckoutModal();
        }
    });
});
