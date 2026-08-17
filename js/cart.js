/**
 * CEMILAN CIAMIS — Cart System
 * Keranjang belanja dengan localStorage + grouping per penjual
 */

const Cart = {
  STORAGE_KEY: 'cemilan_ciamis_cart',

  /** Get all cart items */
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  /** Save items to localStorage */
  _save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this._notifyUpdate();
  },

  /** Add item to cart */
  addItem(product, variation, quantity = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex(
      item => item.productId === product.id && item.variationName === variation.name
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        variationName: variation.name,
        price: variation.price,
        quantity,
        emoji: product.emoji || '📦',
        discount: product.discount || 0,
      });
    }

    this._save(items);
    return true;
  },

  /** Remove item from cart */
  removeItem(productId, variationName) {
    let items = this.getItems();
    items = items.filter(
      item => !(item.productId === productId && item.variationName === variationName)
    );
    this._save(items);
  },

  /** Update item quantity */
  updateQuantity(productId, variationName, quantity) {
    const items = this.getItems();
    const item = items.find(
      i => i.productId === productId && i.variationName === variationName
    );
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, variationName);
        return;
      }
      item.quantity = quantity;
      this._save(items);
    }
  },

  /** Clear entire cart */
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._notifyUpdate();
  },

  /** Clear items by seller */
  clearBySeller(sellerId) {
    let items = this.getItems();
    items = items.filter(item => item.sellerId !== sellerId);
    this._save(items);
  },

  /** Get total item count */
  getTotalCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  /** Get total price */
  getTotalPrice() {
    return this.getItems().reduce((sum, item) => {
      const finalPrice = getDiscountedPrice(item.price, item.discount);
      return sum + (finalPrice * item.quantity);
    }, 0);
  },

  /** Group items by seller */
  getGroupedBySeller() {
    const items = this.getItems();
    const groups = {};

    items.forEach(item => {
      if (!groups[item.sellerId]) {
        const seller = getSellerById(item.sellerId);
        groups[item.sellerId] = {
          seller,
          items: [],
          subtotal: 0,
        };
      }
      const finalPrice = getDiscountedPrice(item.price, item.discount);
      groups[item.sellerId].items.push(item);
      groups[item.sellerId].subtotal += finalPrice * item.quantity;
    });

    return groups;
  },

  /** Notify all listeners about cart update */
  _notifyUpdate() {
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: {
        count: this.getTotalCount(),
        total: this.getTotalPrice(),
      }
    }));
  },
};

/**
 * Ad Pixel & Conversion Tracker Helper
 */
const AdPixel = {
  track(eventName, eventData = {}) {
    console.log(`[Ad Pixel Event] ${eventName}:`, eventData);
    try {
      window.dispatchEvent(new CustomEvent('ad-pixel-event', {
        detail: { eventName, eventData, timestamp: new Date().toISOString() }
      }));
    } catch(e) {}
  }
};

/**
 * WhatsApp Message Generator
 */
const WhatsApp = {
  /** Generate order message for a seller group */
  generateMessage(sellerGroup) {
    const { seller, items, subtotal } = sellerGroup;
    let message = `Halo ${seller.name}! 👋\n`;
    message += `Saya ingin memesan dari *${seller.shopName}*:\n\n`;

    items.forEach((item, index) => {
      const finalPrice = getDiscountedPrice(item.price, item.discount);
      const itemTotal = finalPrice * item.quantity;
      message += `${index + 1}. ${item.name}`;
      if (item.variationName) message += ` (${item.variationName})`;
      message += `\n   ${item.quantity}x @${formatRupiah(finalPrice)} = ${formatRupiah(itemTotal)}\n`;
    });

    message += `\n─────────────\n`;
    message += `*Total: ${formatRupiah(subtotal)}*\n\n`;
    message += `Mohon info ongkir dan rekening transfer. Terima kasih! 🙏`;

    // Sisipkan info atribusi UTM jika ada
    if (typeof AdTracker !== 'undefined' && AdTracker.getUTMString) {
      message += AdTracker.getUTMString();
    }

    return message;
  },

  /** Generate direct order message for single product */
  generateDirectMessage(product, variation, quantity, seller) {
    const finalPrice = getDiscountedPrice(variation.price, product.discount);
    const total = finalPrice * quantity;

    let message = `Halo ${seller.name}! 👋\n`;
    message += `Saya ingin memesan dari *${seller.shopName}*:\n\n`;
    message += `📦 *${product.name}*`;
    if (variation.name) message += ` (${variation.name})`;
    message += `\n   ${quantity}x @${formatRupiah(finalPrice)} = ${formatRupiah(total)}\n`;
    message += `\n─────────────\n`;
    message += `*Total: ${formatRupiah(total)}*\n\n`;
    message += `Mohon info ongkir dan rekening transfer. Terima kasih! 🙏`;

    // Sisipkan info atribusi UTM jika ada
    if (typeof AdTracker !== 'undefined' && AdTracker.getUTMString) {
      message += AdTracker.getUTMString();
    }

    return message;
  },

  /** Open WhatsApp with message */
  openChat(phoneNumber, message) {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank');
  },

  /** Send order for a seller group */
  sendOrder(sellerId) {
    const groups = Cart.getGroupedBySeller();
    const group = groups[sellerId];
    if (!group) return;

    // Trigger Ad Pixel Conversion Event
    AdPixel.track('Lead', {
      content_name: group.seller.shopName,
      value: group.subtotal,
      currency: 'IDR',
      num_items: group.items.length
    });

    const message = this.generateMessage(group);
    this.openChat(group.seller.whatsapp, message);
  },

  /** Send direct order */
  sendDirectOrder(product, variation, quantity) {
    const seller = getSellerById(product.sellerId);
    if (!seller) return;

    const finalPrice = getDiscountedPrice(variation.price, product.discount);
    const total = finalPrice * quantity;

    // Trigger Ad Pixel Conversion Event
    AdPixel.track('Lead', {
      content_name: product.name,
      value: total,
      currency: 'IDR',
      num_items: quantity
    });

    const message = this.generateDirectMessage(product, variation, quantity, seller);
    this.openChat(seller.whatsapp, message);
  },
};

