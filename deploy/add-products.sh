#!/bin/bash
# Add sample products to Magento via REST API
TOKEN="$1"
BASE="http://127.0.0.1:8080/rest/V1"

# Helper: create a simple product
add_product() {
  local sku="$1" name="$2" price="$3" cat_id="$4" desc="$5" img_url="$6" weight="$7"
  
  # Download image
  local img_file="/tmp/${sku}.jpg"
  curl -sL "$img_url" -o "$img_file" 2>/dev/null
  local img_base64=$(base64 -w0 "$img_file")
  
  local payload=$(cat <<JSONEOF
{
  "product": {
    "sku": "${sku}",
    "name": "${name}",
    "price": ${price},
    "status": 1,
    "visibility": 4,
    "type_id": "simple",
    "weight": ${weight},
    "attribute_set_id": 4,
    "extension_attributes": {
      "category_links": [{"category_id": "${cat_id}", "position": 0}],
      "stock_item": {"qty": 100, "is_in_stock": true}
    },
    "custom_attributes": [
      {"attribute_code": "description", "value": "${desc}"},
      {"attribute_code": "short_description", "value": "${desc}"},
      {"attribute_code": "url_key", "value": "${sku}"},
      {"attribute_code": "tax_class_id", "value": "2"}
    ],
    "media_gallery_entries": [
      {
        "media_type": "image",
        "label": "${name}",
        "position": 1,
        "disabled": false,
        "types": ["image", "small_image", "thumbnail"],
        "content": {
          "base64_encoded_data": "${img_base64}",
          "type": "image/jpeg",
          "name": "${sku}.jpg"
        }
      }
    ]
  }
}
JSONEOF
)

  local response=$(curl -s -X POST "${BASE}/products" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")
  
  echo "Product: ${name} -> $(echo $response | python3 -c "import sys,json; d=json.load(sys.stdin); print('OK - SKU:', d.get('sku','FAILED'))" 2>/dev/null || echo "ERROR: $response")"
}

echo "=== Adding Products to Magento ==="
echo ""

# Women's products (category 20 = Women, 21 = Tops, 23 = Jackets, 25 = Tees, 26 = Bras & Tanks)
add_product "thrift-w-linen-blazer" \
  "Oversized Linen Blazer" 4299 23 \
  "Crafted from premium European linen, this relaxed-fit blazer is perfect for layering over a simple tee or as a statement piece." \
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80" \
  0.8

add_product "thrift-w-silk-maxi" \
  "Silk Wrap Maxi Dress" 5999 20 \
  "Flowing silk maxi dress with a flattering wrap silhouette. Features a V-neckline and adjustable tie waist." \
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80" \
  0.5

add_product "thrift-w-cotton-tee" \
  "Organic Cotton Relaxed Tee" 1499 25 \
  "Ultra-soft 100% organic cotton t-shirt with a relaxed, slightly cropped fit. A wardrobe essential in every color." \
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=80" \
  0.3

# Men's products (category 11 = Men, 14 = Jackets, 16 = Tees)
add_product "thrift-m-oxford-shirt" \
  "Classic Oxford Shirt" 2799 11 \
  "Timeless button-down Oxford in premium brushed cotton. Tailored fit with a modern collar for everyday refinement." \
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop&q=80" \
  0.4

add_product "thrift-m-wool-coat" \
  "Merino Wool Overcoat" 8999 14 \
  "Luxurious merino wool overcoat with a clean silhouette. Features notch lapels and a two-button closure." \
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=80" \
  1.2

add_product "thrift-m-chinos" \
  "Slim Fit Stretch Chinos" 2299 11 \
  "Modern slim-fit chinos crafted from stretch cotton twill. Comfortable enough for all day, sharp enough for the office." \
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop&q=80" \
  0.5

# Gear / Accessories (category 3 = Gear, 4 = Bags)
add_product "thrift-a-leather-tote" \
  "Handcrafted Leather Tote" 3499 4 \
  "Full-grain leather tote with hand-stitched details. Spacious interior with an inside zip pocket for daily essentials." \
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop&q=80" \
  0.7

add_product "thrift-a-minimalist-watch" \
  "Minimalist Analog Watch" 4999 3 \
  "Clean-dial analog watch with a Japanese quartz movement. Genuine leather strap and sapphire crystal glass." \
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop&q=80" \
  0.2

add_product "thrift-a-cashmere-scarf" \
  "Pure Cashmere Scarf" 2999 3 \
  "Luxuriously soft 100% cashmere scarf in a versatile neutral tone. Lightweight yet warm—perfect for transitional weather." \
  "https://images.unsplash.com/photo-1601379329542-31c59347e2b0?w=600&h=800&fit=crop&q=80" \
  0.2

# More items
add_product "thrift-w-knit-cardigan" \
  "Chunky Knit Cardigan" 3799 20 \
  "Cozy oversized cardigan in a chunky cable knit. Features large buttons and deep patch pockets." \
  "https://images.unsplash.com/photo-1434389677669-e08b4cda3a38?w=600&h=800&fit=crop&q=80" \
  0.6

add_product "thrift-m-denim-jacket" \
  "Vintage Wash Denim Jacket" 3299 14 \
  "Classic denim jacket with a modern vintage wash. Features copper button details and a relaxed trucker fit." \
  "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop&q=80" \
  0.9

add_product "thrift-a-canvas-sneakers" \
  "Premium Canvas Sneakers" 2499 3 \
  "Minimalist canvas sneakers with a vulcanized rubber sole. Clean design that pairs with everything in your wardrobe." \
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop&q=80" \
  0.8

echo ""
echo "=== Done! ==="
