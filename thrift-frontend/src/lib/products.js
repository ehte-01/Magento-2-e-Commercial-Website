// Product catalog for Thrift store
// High-quality images from Unsplash (free to use)

export const categories = [
  { slug: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop' },
  { slug: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop' },
  { slug: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop' },
  { slug: 'footwear', name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop' },
]

export const products = [
  {
    id: 1,
    name: 'Oversized Linen Blazer',
    category: 'women',
    price: 4299,
    originalPrice: 6999,
    currency: '₹',
    description: 'Crafted from premium European linen, this relaxed-fit blazer features a single-button closure and patch pockets. Perfect for layering over a simple tee or wearing as a statement piece.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Dusty Rose', 'Sage'],
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: 'Ribbed Cotton Tank Top',
    category: 'women',
    price: 1299,
    originalPrice: 1999,
    currency: '₹',
    description: 'A wardrobe essential. This ribbed tank is made from 100% organic cotton with a flattering slim fit. Pairs beautifully with high-waisted trousers or denim.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Black', 'Terracotta'],
    badge: null,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Wide Leg Palazzo Pants',
    category: 'women',
    price: 2999,
    originalPrice: 4499,
    currency: '₹',
    description: 'Flowing wide-leg silhouette in a breathable crepe fabric. Elastic waistband for an effortless fit. From brunch to boardrooms, these pants do it all.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&h=1000&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Ivory', 'Navy'],
    badge: 'New',
    rating: 4.7,
    reviews: 56,
  },
  {
    id: 4,
    name: 'Relaxed Fit Oxford Shirt',
    category: 'men',
    price: 2499,
    originalPrice: 3999,
    currency: '₹',
    description: 'The perfect everyday shirt. Made from washed cotton oxford cloth with a relaxed fit through the body. Button-down collar, chest pocket, curved hem.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Pale Pink'],
    badge: null,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    name: 'Heavyweight Crew Sweatshirt',
    category: 'men',
    price: 3499,
    originalPrice: 4999,
    currency: '₹',
    description: 'A 420 GSM French terry sweatshirt with a brushed interior. Garment-dyed for a perfectly worn-in look from day one. Ribbed cuffs and hem.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Washed Black', 'Heather Grey', 'Forest'],
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 167,
  },
  {
    id: 6,
    name: 'Slim Chino Trousers',
    category: 'men',
    price: 2799,
    originalPrice: 3999,
    currency: '₹',
    description: 'Tailored slim-fit chinos in a stretchy cotton-elastane blend. Perfect crease, tapered leg, and belt loops. Smart enough for the office.',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Tan', 'Navy', 'Olive'],
    badge: null,
    rating: 4.5,
    reviews: 78,
  },
  {
    id: 7,
    name: 'Leather Minimal Watch',
    category: 'accessories',
    price: 5999,
    originalPrice: 8999,
    currency: '₹',
    description: 'Japanese quartz movement, sapphire-coated crystal, and a genuine Italian leather strap. 38mm case in brushed steel.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=1000&fit=crop',
    ],
    sizes: ['One Size'],
    colors: ['Brown/Silver', 'Black/Gold'],
    badge: 'Limited',
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 8,
    name: 'Canvas Tote Bag',
    category: 'accessories',
    price: 1799,
    originalPrice: 2499,
    currency: '₹',
    description: 'Heavy-duty 16oz canvas tote with reinforced handles and an internal zip pocket. Spacious enough for your laptop, lunch, and everything in between.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop',
    ],
    sizes: ['One Size'],
    colors: ['Natural', 'Olive', 'Rust'],
    badge: null,
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 9,
    name: 'Retro Runner Sneakers',
    category: 'footwear',
    price: 4499,
    originalPrice: 6499,
    currency: '₹',
    description: 'Vintage-inspired running silhouette with modern comfort. Suede and nylon upper, EVA midsole, and a rubber outsole. Unisex sizing.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1000&fit=crop',
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Red/White', 'Navy/Gum', 'All Black'],
    badge: 'New',
    rating: 4.6,
    reviews: 93,
  },
  {
    id: 10,
    name: 'Chelsea Leather Boots',
    category: 'footwear',
    price: 6999,
    originalPrice: 9499,
    currency: '₹',
    description: 'Classic Chelsea boots in full-grain leather with elastic side panels. Goodyear-welted sole for durability. They only get better with age.',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=1000&fit=crop',
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Tan', 'Black'],
    badge: null,
    rating: 4.8,
    reviews: 208,
  },
  {
    id: 11,
    name: 'Floral Wrap Dress',
    category: 'women',
    price: 3599,
    originalPrice: 5499,
    currency: '₹',
    description: 'A feminine wrap dress in a hand-drawn floral print. V-neckline, adjustable tie waist, and a midi-length hem. Made from soft viscose.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue Floral', 'Rose Floral'],
    badge: null,
    rating: 4.7,
    reviews: 67,
  },
  {
    id: 12,
    name: 'Denim Trucker Jacket',
    category: 'men',
    price: 4999,
    originalPrice: 7499,
    currency: '₹',
    description: 'Japanese selvedge denim in a classic trucker cut. Raw indigo that will develop unique fading patterns over time. Two chest pockets, brass buttons.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&h=1000&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Raw Indigo', 'Washed Blue'],
    badge: 'Popular',
    rating: 4.9,
    reviews: 189,
  },
]

export function getProduct(id) {
  return products.find(p => p.id === Number(id))
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return products
  return products.filter(p => p.category === categoryId)
}

export function getFeaturedProducts() {
  return products.filter(p => p.badge === 'Bestseller' || p.badge === 'New')
}

export function formatPrice(amount, currency = '₹') {
  return `${currency}${amount.toLocaleString('en-IN')}`
}
