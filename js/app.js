/**
 * CEMILAN CIAMIS — Main App Logic
 * Handles common UI: navbar scroll, cart drawer, toasts, scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCartDrawer();
  initScrollReveal();
  updateCartBadge();

  // Listen for cart updates
  window.addEventListener('cart-updated', () => {
    updateCartBadge();
    renderCartDrawer();
  });
});

/* ============================================
   Navbar
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar-nav');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ============================================
   Cart Drawer
   ============================================ */
function initCartDrawer() {
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartClose = document.querySelector('.cart-drawer__close');

  if (!cartDrawer) return;

  function openCart() {
    cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Expose globally
  window.openCart = openCart;
  window.closeCart = closeCart;
}

function renderCartDrawer() {
  const cartBody = document.querySelector('.cart-drawer__body');
  const cartFooter = document.querySelector('.cart-drawer__footer');
  if (!cartBody) return;

  const groups = Cart.getGroupedBySeller();
  const sellerIds = Object.keys(groups);

  if (sellerIds.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Keranjang Kosong</h3>
        <p>Belum ada produk di keranjang Anda</p>
      </div>
    `;
    if (cartFooter) cartFooter.innerHTML = '';
    return;
  }

  let html = '';
  let grandTotal = 0;

  sellerIds.forEach(sellerId => {
    const group = groups[sellerId];
    grandTotal += group.subtotal;

    html += `
      <div class="cart-group">
        <div class="cart-group__header">
          <span>👩‍🍳</span>
          <span class="cart-group__seller">${group.seller.shopName}</span>
        </div>
    `;

    group.items.forEach(item => {
      const finalPrice = getDiscountedPrice(item.price, item.discount);
      html += `
        <div class="cart-item">
          <div class="cart-item__image">${item.emoji}</div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__variant">${item.variationName}</div>
            <div class="cart-item__bottom">
              <div class="cart-item__price">${formatRupiah(finalPrice * item.quantity)}</div>
              <div class="qty-selector">
                <button onclick="updateCartQty('${item.productId}','${item.variationName}',${item.quantity - 1})">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button onclick="updateCartQty('${item.productId}','${item.variationName}',${item.quantity + 1})">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item__remove" onclick="removeCartItem('${item.productId}','${item.variationName}')" title="Hapus">✕</button>
        </div>
      `;
    });

    html += `
        <div class="cart-group__subtotal">
          <span>Subtotal</span>
          <span class="price">${formatRupiah(group.subtotal)}</span>
        </div>
        <button class="btn btn-whatsapp btn-block btn-sm" onclick="WhatsApp.sendOrder('${sellerId}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.556-1.472A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.35-1.554l-.374-.224-2.706.874.893-2.637-.249-.391A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Kirim Pesanan via WhatsApp
        </button>
      </div>
    `;
  });

  cartBody.innerHTML = html;

  if (cartFooter) {
    cartFooter.innerHTML = `
      <div class="flex-between mb-4">
        <span class="font-heading font-bold">Total Keseluruhan</span>
        <span class="price" style="font-size:var(--text-xl)">${formatRupiah(grandTotal)}</span>
      </div>
      <button class="btn btn-ghost btn-block btn-sm" onclick="Cart.clear()">🗑️ Kosongkan Keranjang</button>
    `;
  }
}

function updateCartQty(productId, variationName, newQty) {
  Cart.updateQuantity(productId, variationName, newQty);
}

function removeCartItem(productId, variationName) {
  Cart.removeItem(productId, variationName);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = Cart.getTotalCount();
  badges.forEach(badge => {
    badge.textContent = count > 0 ? count : '';
  });
}

/* ============================================
   Toast Notifications
   ============================================ */
function showToast(message, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '📢'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================
   Add to Cart (from product cards)
   ============================================ */
function addToCartFromCard(productId) {
  const product = getProductById(productId);
  if (!product) return;

  // Add first variation by default
  const variation = product.variations[0];
  Cart.addItem(product, variation, 1);
  if (typeof AdPixel !== 'undefined') {
    AdPixel.track('AddToCart', {
      content_name: product.name,
      value: variation.price,
      currency: 'IDR'
    });
  }
  showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* Helper to sanitize HTML strings against XSS */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================
   Render Product Cards
   ============================================ */
function renderProductCard(product) {
  const seller = getSellerById(product.sellerId);
  const hasDiscount = product.discount > 0;
  const finalPrice = getDiscountedPrice(product.basePrice, product.discount);

  let badges = '';
  if (hasDiscount) badges += `<span class="badge badge-promo">-${product.discount}%</span>`;
  if (product.isNew) badges += `<span class="badge badge-new">Baru</span>`;
  if (product.isFeatured && !hasDiscount && !product.isNew) badges += `<span class="badge badge-featured">⭐ Unggulan</span>`;

  let priceHtml = '';
  if (hasDiscount) {
    priceHtml = `
      <span class="price">${formatRupiah(finalPrice)}</span>
      <span class="price-original">${formatRupiah(product.basePrice)}</span>
    `;
  } else {
    priceHtml = `<span class="price">${formatRupiah(product.basePrice)}</span>`;
  }

  return `
    <div class="product-card">
      <a href="detail-produk.html?id=${encodeURIComponent(product.id)}" class="product-card__image">
        <div class="product-card__image-placeholder">${escapeHTML(product.emoji || '📦')}</div>
        ${badges ? `<div class="product-card__badges">${badges}</div>` : ''}
      </a>
      <div class="product-card__body">
        <a href="penjual.html?id=${encodeURIComponent(seller.id)}" class="product-card__seller">${escapeHTML(seller.shopName)}</a>
        <h3 class="product-card__name">
          <a href="detail-produk.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a>
        </h3>
        <div class="product-card__price">${priceHtml}</div>
        <div class="product-card__actions">
          <button class="btn btn-primary btn-sm" onclick="addToCartFromCard('${escapeHTML(product.id)}')">
            🛒 Keranjang
          </button>
          <a href="detail-produk.html?id=${encodeURIComponent(product.id)}" class="btn btn-secondary btn-sm">Detail</a>
        </div>
      </div>
    </div>
  `;
}

function renderSellerCard(seller) {
  return `
    <div class="seller-card">
      <div class="seller-card__avatar">${escapeHTML(seller.avatar || '👩‍🍳')}</div>
      <h3 class="seller-card__name">${escapeHTML(seller.name)}</h3>
      <p class="seller-card__shop">${escapeHTML(seller.shopName)}</p>
      <p class="seller-card__bio">${escapeHTML(seller.bio)}</p>
      <div class="seller-card__meta">
        <div class="seller-card__meta-item">
          <span class="meta-value">${seller.productCount}</span>
          <span class="meta-label">Produk</span>
        </div>
        <div class="seller-card__meta-item">
          <span class="meta-value">${escapeHTML(seller.village.split(',')[0])}</span>
          <span class="meta-label">Lokasi</span>
        </div>
      </div>
      <a href="penjual.html?id=${encodeURIComponent(seller.id)}" class="btn btn-secondary btn-block btn-sm">Lihat Profil</a>
    </div>
  `;
}
