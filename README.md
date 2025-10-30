# cardapio_web
# 🍽️ Cardápio Digital - Site Estático

Um site estático moderno e responsivo para cardápio interativo com integração automática ao Google Sheets e pedidos via WhatsApp.

## 📋 Características

- ✅ **Carregamento Automático de Dados** - Produtos carregados diretamente da Google Sheets API
- ✅ **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Carrinho de Compras** - Com persistência em localStorage
- ✅ **Seleção de Variações** - Tamanhos e preços dinâmicos
- ✅ **Integração WhatsApp** - Pedidos enviados automaticamente com resumo formatado
- ✅ **Sem Dependências Externas** - Apenas HTML, CSS e JavaScript vanilla
- ✅ **Rápido e Leve** - Carregamento instantâneo

## 🚀 Como Usar

### 1. Hospedagem

O site é completamente estático e pode ser hospedado em qualquer serviço gratuito:

- **GitHub Pages** (Recomendado)
- **Netlify**
- **Vercel**
- **Firebase Hosting**
- Seu próprio servidor web

### 2. Configuração da Google Sheets

O site carrega os dados automaticamente da sua planilha do Google Sheets. A estrutura esperada é:

| ID | NomeProduto | Descrição | Categoria | Tamanho_P | Preço_P | Tamanho_M | Preço_M | Tamanho_G | Preço_G | LinkFoto | NumeroWhatsApp |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Mini esfiha carne | Descrição... | Mini esfiha | Pequena | 5.00 | Média | 8.00 | Grande | 12.00 | URL_IMAGEM | 5511920934212 |

**Importante:** A planilha deve ser compartilhada como **"Qualquer pessoa com o link pode visualizar"**.

### 3. Configuração das Credenciais

Abra o arquivo `js/config.js` e atualize as seguintes informações:

```javascript
const CONFIG = {
    SHEETS_API_KEY: 'SUA_API_KEY_AQUI',
    SHEET_ID: 'SEU_SHEET_ID_AQUI',
    SHEET_NAME: 'Produtos', // Nome da aba
    DRIVE_FOLDER_ID: 'SEU_FOLDER_ID_AQUI',
    WHATSAPP_NUMBER: '5511920934212' // Seu número padrão
};
```

#### Como obter as credenciais:

**Google Sheets API Key:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google Sheets API**
4. Crie uma chave de API (API Key)

**Sheet ID:**
- Abra sua planilha no Google Sheets
- O ID está na URL: `https://docs.google.com/spreadsheets/d/**SEU_SHEET_ID**/edit`

**Drive Folder ID:**
- Abra a pasta no Google Drive
- O ID está na URL: `https://drive.google.com/drive/folders/**SEU_FOLDER_ID**`

### 4. Estrutura de Pastas

```
cardapio-web/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos da aplicação
├── js/
│   ├── config.js       # Configurações (EDITAR AQUI)
│   ├── sheets-api.js   # Integração com Google Sheets
│   ├── cart.js         # Gerenciamento do carrinho
│   ├── modal.js        # Controle de modais
│   └── app.js          # Aplicação principal
└── README.md           # Este arquivo
```

## 📱 Funcionalidades

### Visualização de Cardápio
- Grid responsivo de produtos
- Filtro por categorias
- Imagens dos produtos carregadas do Google Drive
- Descrição e preço mínimo exibidos

### Seleção de Produto
- Modal com imagem em alta qualidade
- Seleção de tamanho (P, M, G)
- Controle de quantidade
- Preço atualizado dinamicamente

### Carrinho de Compras
- Sidebar deslizável
- Adicionar/remover itens
- Atualizar quantidade
- Cálculo automático de totais
- Persistência com localStorage (não perde ao recarregar)

### Checkout
- Formulário com campos:
  - **Nome** (obrigatório)
  - **Telefone** (opcional)
  - **Endereço** (opcional)
  - **Forma de Pagamento** (obrigatório): Cartão, Pix, Dinheiro
- Resumo do pedido com todos os itens
- Envio automático via WhatsApp

### Mensagem WhatsApp
A mensagem gerada contém:
```
*PEDIDO DO CARDÁPIO DIGITAL*

*Cliente:* João Silva
*Telefone:* (11) 99999-9999
*Endereço:* Rua X, número Y, bairro Z
*Forma de Pagamento:* Pix

*ITENS DO PEDIDO:*
────────────────────────────────────────

Mini esfiha carne
Tamanho: Pequena | Preço: R$ 5,00
Quantidade: 1 | Subtotal: R$ 5,00

────────────────────────────────────────

*TOTAL: R$ 5,00*
```

## 🎨 Personalização

### Cores
Edite o arquivo `css/styles.css` e altere as variáveis CSS:

```css
:root {
    --primary-color: #FF6B35;        /* Cor principal (laranja) */
    --secondary-color: #004E89;      /* Cor secundária (azul) */
    --accent-color: #F7B801;         /* Cor de destaque (amarelo) */
    --success-color: #06A77D;        /* Cor de sucesso (verde) */
    /* ... outras cores ... */
}
```

### Logo e Título
Edite o arquivo `index.html`, procure pela seção `<header>` e altere:

```html
<div class="logo">
    <h1>🍽️ Seu Restaurante</h1>
    <p>Pedidos via WhatsApp</p>
</div>
```

## 🔧 Desenvolvimento Local

Para testar localmente, execute um servidor web simples:

**Python 3:**
```bash
cd cardapio-web
python3 -m http.server 8000
```

**Node.js:**
```bash
cd cardapio-web
npx http-server
```

Acesse: `http://localhost:8000`

## 📊 Atualizar Cardápio

1. Abra sua planilha no Google Sheets
2. Adicione, edite ou remova produtos
3. **O site atualizará automaticamente** quando a página for recarregada

Não é necessário fazer deploy novamente!

## 🐛 Solução de Problemas

### Produtos não aparecem
- Verifique se a API Key está correta em `js/config.js`
- Confirme se o Sheet ID está correto
- Verifique se a planilha está compartilhada como "Qualquer pessoa com o link"
- Abra o console do navegador (F12) para ver mensagens de erro

### Imagens não carregam
- Verifique se os links das imagens estão corretos na coluna `LinkFoto`
- Confirme se as imagens estão acessíveis (não requerem autenticação)
- Verifique se o folder ID do Google Drive está correto

### WhatsApp não abre
- Verifique se o número está no formato correto: `55` + DDD + número
- Teste em um navegador que suporta links `wa.me`
- Verifique se o WhatsApp está instalado no dispositivo

## 📄 Licença

Este projeto é fornecido como está para uso pessoal e comercial.

## 💬 Suporte

Para dúvidas ou problemas, revise a documentação acima ou entre em contato.

---

**Desenvolvido com ❤️ para seu negócio**
