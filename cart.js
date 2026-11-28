(() => {
  'use strict';

  const CART_STORAGE_KEY = 'genuineProductsCart';
  const BUSINESS_WHATSAPP = '923224268147';
  const DELIVERY_CHARGE_PER_UNIT = 199;
  let cartLoadError = '';
  const cart = loadCart();

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #shoppingCartButton, .cart-trigger {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 6px;
        border: 0;
        cursor: pointer;
      }
      .cart-trigger {
        padding: 9px 13px;
        border-radius: 999px;
        background: #fffdfd;
        color: #a9162d;
        font: 700 13px Arial, sans-serif;
        white-space: nowrap;
      }
      .cart-trigger:hover { background: #fff0f2; }
      .cart-count {
        display: inline-flex;
        min-width: 20px;
        height: 20px;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
        border-radius: 999px;
        background: #b3132b;
        color: #fff;
        font: 700 11px Arial, sans-serif;
      }
      #shoppingCartButton .cart-count {
        position: absolute;
        top: 0;
        right: 0;
      }
      .cart-add-button {
        width: 100%;
        min-height: 38px;
        margin-top: 8px;
        border: 1px solid #b3132b;
        border-radius: 8px;
        background: #b3132b;
        color: #fff;
        font: 700 12px Inter, Arial, sans-serif;
        cursor: pointer;
      }
      .cart-add-button:hover { background: #7d1024; }
      .cart-add-button:focus-visible, .cart-trigger:focus-visible,
      .cart-quantity button:focus-visible, .cart-remove:focus-visible,
      .cart-action-button:focus-visible, .cart-close:focus-visible {
        outline: 3px solid #e8bd54;
        outline-offset: 2px;
      }
      #shoppingCartDialog {
        width: min(760px, calc(100% - 24px));
        max-width: 760px;
        max-height: min(92vh, 900px);
        padding: 0;
        border: 0;
        border-radius: 18px;
        color: #351018;
        background: #fffafb;
        box-shadow: 0 24px 70px rgb(30 10 15 / 30%);
      }
      #shoppingCartDialog::backdrop { background: rgb(25 10 15 / 62%); }
      .shopping-cart-shell { display: flex; max-height: min(92vh, 900px); flex-direction: column; }
      .shopping-cart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 22px;
        border-bottom: 1px solid #efc2c8;
      }
      .shopping-cart-header h2 { margin: 0; color: #8d1429; font: 700 22px "Plus Jakarta Sans", Arial, sans-serif; }
      .cart-close {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 50%;
        background: #fff0f2;
        color: #70404a;
        font-size: 24px;
        cursor: pointer;
      }
      .shopping-cart-content { overflow-y: auto; padding: 18px 22px 22px; }
      .cart-status { min-height: 20px; margin: 0 0 12px; color: #70404a; font: 13px/1.5 Inter, Arial, sans-serif; }
      .cart-status:empty { display: none; }
      .cart-status[data-error="true"] { color: #a9162d; }
      .cart-items { display: grid; gap: 12px; }
      .cart-item {
        display: grid;
        grid-template-columns: 76px minmax(0, 1fr) auto;
        align-items: center;
        gap: 14px;
        padding: 12px;
        border: 1px solid #efc2c8;
        border-radius: 12px;
        background: #fff;
      }
      .cart-item img { width: 76px; height: 76px; border-radius: 9px; background: #fff0f2; object-fit: contain; }
      .cart-item-name { margin: 0 0 4px; color: #351018; font: 700 14px/1.4 Inter, Arial, sans-serif; }
      .cart-item-price, .cart-item-subtotal { margin: 0; color: #70404a; font: 13px/1.5 Inter, Arial, sans-serif; }
      .cart-item-subtotal { margin-top: 3px; color: #8d1429; font-weight: 700; }
      .cart-item-controls { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 8px; }
      .cart-quantity { display: inline-flex; align-items: center; border: 1px solid #efc2c8; border-radius: 8px; overflow: hidden; }
      .cart-quantity button { width: 30px; height: 30px; border: 0; background: #fff0f2; color: #8d1429; font-size: 18px; cursor: pointer; }
      .cart-quantity button:disabled { opacity: .45; cursor: not-allowed; }
      .cart-quantity span { min-width: 30px; text-align: center; font: 700 13px Inter, Arial, sans-serif; }
      .cart-remove { border: 0; background: transparent; color: #a9162d; font: 600 12px Inter, Arial, sans-serif; text-decoration: underline; cursor: pointer; }
      .cart-empty { margin: 18px 0; color: #70404a; text-align: center; font: 15px/1.6 Inter, Arial, sans-serif; }
      .cart-total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 10px;
        padding-top: 14px;
        border-top: 1px solid #efc2c8;
        color: #351018;
        font: 700 18px Inter, Arial, sans-serif;
      }
      .cart-summary { margin: 18px 0; }
      .cart-summary-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
        color: #70404a;
        font: 14px Inter, Arial, sans-serif;
      }
      .cart-item-delivery { margin: 3px 0 0; color: #70404a; font: 12px/1.5 Inter, Arial, sans-serif; }
      .cart-actions { display: grid; gap: 10px; }
      .cart-action-button {
        width: 100%;
        min-height: 46px;
        padding: 10px 16px;
        border: 0;
        border-radius: 9px;
        background: #a9162d;
        color: #fff;
        font: 700 14px Inter, Arial, sans-serif;
        cursor: pointer;
      }
      .cart-action-button:hover { background: #7d1024; }
      .cart-action-secondary { border: 1px solid #efc2c8; background: #fff; color: #70404a; }
      .cart-action-secondary:hover { background: #fff0f2; }
      .cart-checkout-form { display: grid; gap: 13px; }
      .cart-checkout-form h3 { margin: 0; color: #8d1429; font: 700 18px "Plus Jakarta Sans", Arial, sans-serif; }
      .cart-checkout-form p { margin: 0; color: #70404a; font: 13px/1.5 Inter, Arial, sans-serif; }
      .cart-checkout-form label { display: grid; gap: 5px; color: #351018; font: 600 13px Inter, Arial, sans-serif; }
      .cart-checkout-form input, .cart-checkout-form textarea {
        width: 100%;
        min-height: 42px;
        padding: 10px 12px;
        border: 1px solid #dcb4bb;
        border-radius: 8px;
        background: #fff;
        color: #351018;
        font: 14px Inter, Arial, sans-serif;
      }
      .cart-checkout-form textarea { min-height: 86px; resize: vertical; }
      .cart-checkout-form input:focus, .cart-checkout-form textarea:focus { outline: 2px solid #b3132b; outline-offset: 1px; }
      #cartWhatsAppFallback { padding: 16px; border: 1px solid #efc2c8; border-radius: 12px; background: #fff; }
      #cartWhatsAppFallback h3 { margin: 0 0 8px; color: #8d1429; font: 700 18px "Plus Jakarta Sans", Arial, sans-serif; }
      #cartWhatsAppFallback p { margin: 0 0 14px; color: #70404a; font: 13px/1.5 Inter, Arial, sans-serif; }
      #cartWhatsAppFallback a { display: flex; min-height: 46px; align-items: center; justify-content: center; padding: 10px 16px; border-radius: 9px; background: #16883f; color: white; font: 700 14px Inter, Arial, sans-serif; text-align: center; text-decoration: none; }
      #cartWhatsAppFallback a:hover { background: #126b32; }
      @media (max-width: 520px) {
        .shopping-cart-header { padding: 15px 16px; }
        .shopping-cart-header h2 { font-size: 19px; }
        .shopping-cart-content { padding: 14px 14px 18px; }
        .cart-item { grid-template-columns: 60px minmax(0, 1fr); align-items: start; gap: 10px; padding: 10px; }
        .cart-item img { width: 60px; height: 60px; }
        .cart-item-controls { grid-column: 2; justify-content: flex-start; }
        .cart-item-name { font-size: 13px; }
        .cart-item-price, .cart-item-subtotal { font-size: 12px; }
      }
      @media (max-width: 640px) {
        .site-header .header-content { flex-wrap: wrap; }
        .cart-trigger { padding: 8px 10px; font-size: 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(item =>
        item && typeof item.id === 'string' && typeof item.name === 'string' &&
        typeof item.image === 'string' && Number.isFinite(item.price) && item.price >= 0 &&
        Number.isInteger(item.quantity) && item.quantity > 0
      )) {
        throw new Error('Saved cart data is invalid.');
      }
      return parsed;
    } catch (error) {
      console.error('Unable to load the saved cart.', error);
      cartLoadError = 'Saved cart data could not be read. Add a product to create a fresh cart.';
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      cartLoadError = '';
      return true;
    } catch (error) {
      console.error('Unable to save the cart.', error);
      showStatus('Your browser could not save cart changes. Keep this page open while ordering.', true);
      return false;
    }
  }

  function formatPrice(amount) {
    return `Rs. ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 2 }).format(amount)}`;
  }

  function getPrice(text) {
    const match = text.match(/(?:Rs\.?|PKR)\s*([\d,]+(?:\.\d{1,2})?)/i) || text.match(/[\d,]+(?:\.\d{1,2})?/);
    return match ? Number(match[1].replace(/,/g, '')) : NaN;
  }

  function getProductFromCard(card) {
    const title = card.querySelector('a.font-title-md');
    const image = card.querySelector('img');
    const price = card.querySelector('.font-headline-sm');
    if (!title || !image || !price) return null;
    const amount = getPrice(price.textContent);
    if (!Number.isFinite(amount)) return null;
    return {
      id: `catalog-${card.dataset.productId || title.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: title.textContent.trim(),
      image: image.currentSrc || image.src,
      price: amount
    };
  }

  function getProductFromDetailPage() {
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const image = document.getElementById('main-image');
    if (!title || !price || !image) return null;
    const amount = getPrice(price.textContent);
    if (!Number.isFinite(amount)) return null;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product') || window.location.hash.slice(1) || '1';
    return {
      id: `catalog-${productId}`,
      name: title.textContent.trim(),
      image: image.currentSrc || image.src,
      price: amount
    };
  }

  function buildCartUI() {
    const dialog = document.createElement('dialog');
    dialog.id = 'shoppingCartDialog';
    dialog.setAttribute('aria-labelledby', 'shoppingCartHeading');
    dialog.innerHTML = `
      <div class="shopping-cart-shell">
        <header class="shopping-cart-header">
          <h2 id="shoppingCartHeading">Your shopping cart</h2>
          <button class="cart-close" type="button" aria-label="Close cart">&times;</button>
        </header>
        <main class="shopping-cart-content">
          <p class="cart-status" id="cartStatus" aria-live="polite"></p>
          <section id="cartItemsView">
            <div class="cart-items" id="cartItems"></div>
            <div class="cart-summary">
              <div class="cart-summary-line"><span>Product subtotal</span><span id="cartSubtotal"></span></div>
              <div class="cart-summary-line"><span>Standard delivery (Rs. 199 × <span id="cartUnitCount">0</span> units)</span><span id="cartDelivery"></span></div>
              <div class="cart-total"><span>Total</span><span id="cartTotal"></span></div>
            </div>
            <div class="cart-actions">
              <button class="cart-action-button" id="cartCheckoutButton" type="button">Checkout / Place Order</button>
              <button class="cart-action-button cart-action-secondary" id="cartContinueButton" type="button">Continue shopping</button>
            </div>
          </section>
          <section id="cartCheckoutView" hidden>
            <form class="cart-checkout-form" id="cartCheckoutForm">
              <button class="cart-action-button cart-action-secondary" id="cartBackButton" type="button">Back to cart</button>
              <h3>Delivery details</h3>
              <p>Your order will open in WhatsApp so you can review it and send it manually.</p>
              <label>Full Name *
                <input name="fullName" type="text" autocomplete="name" required>
              </label>
              <label>Phone Number *
                <input name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
              </label>
              <label>Complete Delivery Address *
                <textarea name="address" autocomplete="street-address" required></textarea>
              </label>
              <label>Optional Notes
                <textarea name="notes"></textarea>
              </label>
              <button class="cart-action-button" type="submit">Place Order on WhatsApp</button>
            </form>
            <div id="cartWhatsAppFallback" hidden>
              <h3>Your order is ready</h3>
              <p>WhatsApp did not open automatically. Your cart is still saved; use this button to open the prepared order.</p>
              <a id="cartWhatsAppLink" href="#" target="_blank" rel="noopener noreferrer">Open WhatsApp to review and send</a>
            </div>
          </section>
        </main>
      </div>
    `;
    document.body.appendChild(dialog);
    return dialog;
  }

  function ensureCartTrigger() {
    const existing = document.querySelector('header a[data-path="cart"]');
    if (existing) {
      existing.id = 'shoppingCartButton';
      existing.href = '#cart';
      existing.setAttribute('aria-label', 'Open shopping cart');
      existing.setAttribute('aria-haspopup', 'dialog');
      const badge = existing.querySelector('span.absolute');
      if (badge) {
        badge.classList.add('cart-count');
        badge.dataset.cartCount = '';
      } else {
        const count = document.createElement('span');
        count.className = 'cart-count';
        count.dataset.cartCount = '';
        existing.appendChild(count);
      }
      return existing;
    }

    const headerContent = document.querySelector('.site-header .header-content');
    if (!headerContent) return null;
    const button = document.createElement('button');
    button.className = 'cart-trigger';
    button.type = 'button';
    button.dataset.cartOpen = '';
    button.setAttribute('aria-label', 'Open shopping cart');
    button.setAttribute('aria-haspopup', 'dialog');
    button.innerHTML = 'Cart <span class="cart-count" data-cart-count>0</span>';
    headerContent.appendChild(button);
    return button;
  }

  function showStatus(message, isError) {
    const status = document.getElementById('cartStatus');
    if (!status) return;
    status.textContent = message;
    status.dataset.error = String(Boolean(isError));
  }

  function updateCartBadge() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(badge => {
      badge.textContent = String(count);
      badge.setAttribute('aria-label', `${count} items in cart`);
    });
  }

  function renderCart() {
    const items = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('cartSubtotal');
    const deliveryElement = document.getElementById('cartDelivery');
    const unitCountElement = document.getElementById('cartUnitCount');
    const total = document.getElementById('cartTotal');
    const checkout = document.getElementById('cartCheckoutButton');
    if (!items || !subtotalElement || !deliveryElement || !unitCountElement || !total || !checkout) return;
    items.replaceChildren();
    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Your cart is empty. Add a product to get started.';
      items.appendChild(empty);
    } else {
      cart.forEach(item => {
        const row = document.createElement('article');
        row.className = 'cart-item';

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.loading = 'lazy';

        const details = document.createElement('div');
        const name = document.createElement('p');
        name.className = 'cart-item-name';
        name.textContent = item.name;
        const price = document.createElement('p');
        price.className = 'cart-item-price';
        price.textContent = `${formatPrice(item.price)} each`;
        const subtotal = document.createElement('p');
        subtotal.className = 'cart-item-subtotal';
        subtotal.textContent = `Subtotal: ${formatPrice(item.price * item.quantity)}`;
        const delivery = document.createElement('p');
        delivery.className = 'cart-item-delivery';
        delivery.textContent = `Delivery: ${formatPrice(DELIVERY_CHARGE_PER_UNIT)} × ${item.quantity} = ${formatPrice(DELIVERY_CHARGE_PER_UNIT * item.quantity)}`;
        details.append(name, price, subtotal, delivery);

        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        const quantity = document.createElement('div');
        quantity.className = 'cart-quantity';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', `Decrease quantity of ${item.name}`);
        decrease.dataset.cartAction = 'decrease';
        decrease.dataset.cartId = item.id;
        decrease.disabled = item.quantity <= 1;
        const quantityValue = document.createElement('span');
        quantityValue.textContent = String(item.quantity);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', `Increase quantity of ${item.name}`);
        increase.dataset.cartAction = 'increase';
        increase.dataset.cartId = item.id;
        quantity.append(decrease, quantityValue, increase);

        const remove = document.createElement('button');
        remove.className = 'cart-remove';
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.dataset.cartAction = 'remove';
        remove.dataset.cartId = item.id;
        remove.setAttribute('aria-label', `Remove ${item.name} from cart`);
        controls.append(quantity, remove);
        row.append(image, details, controls);
        items.appendChild(row);
      });
    }
    const unitCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const productSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal = unitCount * DELIVERY_CHARGE_PER_UNIT;
    subtotalElement.textContent = formatPrice(productSubtotal);
    deliveryElement.textContent = formatPrice(deliveryTotal);
    unitCountElement.textContent = String(unitCount);
    total.textContent = formatPrice(productSubtotal + deliveryTotal);
    checkout.disabled = cart.length === 0;
    checkout.setAttribute('aria-disabled', String(cart.length === 0));
    updateCartBadge();
    if (cartLoadError) showStatus(cartLoadError, true);
  }

  function addToCart(product) {
    if (!product) {
      showStatus('This product could not be added because its name, image, or price is unavailable.', true);
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    const saved = saveCart();
    renderCart();
    if (saved) showStatus(`${product.name} added to your cart.`, false);
  }

  function setCheckoutView(showCheckout) {
    document.getElementById('cartItemsView').hidden = showCheckout;
    document.getElementById('cartCheckoutView').hidden = !showCheckout;
    document.getElementById('cartCheckoutForm').hidden = false;
    document.getElementById('cartWhatsAppFallback').hidden = true;
    showStatus('', false);
  }

  function createOrderMessage(customer) {
    const lines = [
      'Hello Genuine Products, I would like to place an order.',
      '',
      'Customer Details',
      `Full Name: ${customer.name}`,
      `Phone Number: ${customer.phone}`,
      `Delivery Address: ${customer.address}`,
      '',
      'Ordered Products'
    ];
    cart.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name}`,
        `   Quantity: ${item.quantity}`,
        `   Unit Price: ${formatPrice(item.price)}`,
        `   Product subtotal: ${formatPrice(item.price * item.quantity)}`,
        `   Standard delivery: ${formatPrice(DELIVERY_CHARGE_PER_UNIT)} × ${item.quantity} = ${formatPrice(DELIVERY_CHARGE_PER_UNIT * item.quantity)}`,
        `   Item total: ${formatPrice((item.price + DELIVERY_CHARGE_PER_UNIT) * item.quantity)}`
      );
    });
    const productSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal = cart.reduce((sum, item) => sum + item.quantity * DELIVERY_CHARGE_PER_UNIT, 0);
    lines.push(
      '',
      `Product subtotal: ${formatPrice(productSubtotal)}`,
      `Standard delivery: ${formatPrice(deliveryTotal)} (${DELIVERY_CHARGE_PER_UNIT} × ${cart.reduce((sum, item) => sum + item.quantity, 0)} units)`,
      `Total Amount: ${formatPrice(productSubtotal + deliveryTotal)}`
    );
    if (customer.notes) lines.push('', `Notes: ${customer.notes}`);
    return lines.join('\n');
  }

  function clearCart() {
    const previousItems = cart.slice();
    cart.splice(0, cart.length);
    if (!saveCart()) {
      cart.push(...previousItems);
      renderCart();
      return false;
    }
    renderCart();
    return true;
  }

  addStyles();
  const cartDialog = buildCartUI();
  ensureCartTrigger();

  document.querySelectorAll('.product-item').forEach(card => {
    const actionArea = card.querySelector('.border-t');
    if (!actionArea || actionArea.querySelector('[data-add-to-cart]')) return;
    const button = document.createElement('button');
    button.className = 'cart-add-button';
    button.type = 'button';
    button.dataset.addToCart = '';
    button.textContent = 'Add to Cart';
    actionArea.appendChild(button);
  });

  const detailTitle = document.getElementById('product-title');
  const detailPrice = document.getElementById('product-price');
  if (detailTitle && detailPrice && !document.querySelector('[data-add-to-cart]')) {
    const button = document.createElement('button');
    button.className = 'order cart-add-button';
    button.type = 'button';
    button.dataset.addToCart = '';
    button.textContent = 'Add to Cart';
    detailPrice.insertAdjacentElement('afterend', button);
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('#shoppingCartButton, [data-cart-open]')) {
      event.preventDefault();
      setCheckoutView(false);
      renderCart();
      cartDialog.showModal();
      return;
    }

    const addButton = target.closest('[data-add-to-cart]');
    if (addButton) {
      const card = addButton.closest('.product-item');
      addToCart(card ? getProductFromCard(card) : getProductFromDetailPage());
      const previousText = addButton.textContent;
      addButton.textContent = 'Added to Cart';
      window.setTimeout(() => {
        if (addButton.isConnected) addButton.textContent = previousText;
      }, 1200);
      return;
    }

    const action = target.closest('[data-cart-action]');
    if (action) {
      const itemIndex = cart.findIndex(item => item.id === action.dataset.cartId);
      if (itemIndex < 0) return;
      if (action.dataset.cartAction === 'increase') cart[itemIndex].quantity += 1;
      if (action.dataset.cartAction === 'decrease' && cart[itemIndex].quantity > 1) cart[itemIndex].quantity -= 1;
      if (action.dataset.cartAction === 'remove') cart.splice(itemIndex, 1);
      saveCart();
      renderCart();
      return;
    }

    if (target.closest('.cart-close, #cartContinueButton')) {
      cartDialog.close();
      return;
    }

    if (target.closest('#cartCheckoutButton')) {
      if (cart.length) setCheckoutView(true);
      return;
    }

    if (target.closest('#cartBackButton')) {
      setCheckoutView(false);
      return;
    }

    if (target.closest('#cartWhatsAppLink')) {
      window.setTimeout(() => {
        if (clearCart()) cartDialog.close();
        else {
          setCheckoutView(false);
          showStatus('WhatsApp opened, but the cart could not be cleared. Review or remove its items after confirming your order.', true);
        }
      }, 350);
    }
  });

  const cartCheckoutForm = document.getElementById('cartCheckoutForm');
  cartCheckoutForm.addEventListener('input', event => {
    event.target.setCustomValidity('');
  });
  cartCheckoutForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!cart.length) {
      setCheckoutView(false);
      showStatus('Your cart is empty. Add a product before placing an order.', true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const customer = {
      name: String(formData.get('fullName') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      notes: String(formData.get('notes') || '').trim()
    };
    const requiredFields = [
      [cartCheckoutForm.elements.fullName, customer.name],
      [cartCheckoutForm.elements.phone, customer.phone],
      [cartCheckoutForm.elements.address, customer.address]
    ];
    const emptyField = requiredFields.find(([, value]) => !value);
    if (emptyField) {
      emptyField[0].setCustomValidity('This field is required.');
      emptyField[0].reportValidity();
      return;
    }
    const message = createOrderMessage(customer);
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
    const fallback = document.getElementById('cartWhatsAppFallback');
    const link = document.getElementById('cartWhatsAppLink');
    link.href = whatsappUrl;

    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      if (clearCart()) cartDialog.close();
      else {
        setCheckoutView(false);
        showStatus('WhatsApp opened, but the cart could not be cleared. Review or remove its items after confirming your order.', true);
      }
      return;
    }

    document.getElementById('cartCheckoutForm').hidden = true;
    fallback.hidden = false;
    showStatus('Your order is ready. The cart will remain saved until you open WhatsApp.', false);
  });

  cartDialog.querySelector('.cart-close').addEventListener('click', () => cartDialog.close());
  cartDialog.addEventListener('click', event => {
    if (event.target === cartDialog) cartDialog.close();
  });
  window.addEventListener('storage', event => {
    if (event.key !== CART_STORAGE_KEY) return;
    const latest = loadCart();
    cart.splice(0, cart.length, ...latest);
    renderCart();
  });

  renderCart();
})();
