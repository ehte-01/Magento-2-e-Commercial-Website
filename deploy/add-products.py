#!/usr/bin/env python3
"""Add sample products to Magento via REST API"""
import requests
import json
import base64
import sys
import time

BASE = "http://127.0.0.1:8080/rest/V1"

# Get admin token
r = requests.post(f"{BASE}/integration/admin/token", json={
    "username": "admin",
    "password": "Admin@1234"
})
TOKEN = r.json()
print(f"Token acquired: {TOKEN[:20]}...")

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

products = [
    {
        "sku": "thrift-w-linen-blazer",
        "name": "Oversized Linen Blazer",
        "price": 4299,
        "category_id": "23",
        "desc": "Crafted from premium European linen, this relaxed-fit blazer is perfect for layering over a simple tee or as a statement piece.",
        "img": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80",
        "weight": 0.8
    },
    {
        "sku": "thrift-w-silk-maxi",
        "name": "Silk Wrap Maxi Dress",
        "price": 5999,
        "category_id": "20",
        "desc": "Flowing silk maxi dress with a flattering wrap silhouette. Features a V-neckline and adjustable tie waist.",
        "img": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80",
        "weight": 0.5
    },
    {
        "sku": "thrift-w-cotton-tee",
        "name": "Organic Cotton Relaxed Tee",
        "price": 1499,
        "category_id": "25",
        "desc": "Ultra-soft 100% organic cotton t-shirt with a relaxed, slightly cropped fit. A wardrobe essential.",
        "img": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=80",
        "weight": 0.3
    },
    {
        "sku": "thrift-m-oxford-shirt",
        "name": "Classic Oxford Shirt",
        "price": 2799,
        "category_id": "11",
        "desc": "Timeless button-down Oxford in premium brushed cotton. Tailored fit with a modern collar.",
        "img": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop&q=80",
        "weight": 0.4
    },
    {
        "sku": "thrift-m-wool-coat",
        "name": "Merino Wool Overcoat",
        "price": 8999,
        "category_id": "14",
        "desc": "Luxurious merino wool overcoat with a clean silhouette. Features notch lapels and two-button closure.",
        "img": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=80",
        "weight": 1.2
    },
    {
        "sku": "thrift-m-chinos",
        "name": "Slim Fit Stretch Chinos",
        "price": 2299,
        "category_id": "11",
        "desc": "Modern slim-fit chinos crafted from stretch cotton twill. Comfortable and sharp enough for the office.",
        "img": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop&q=80",
        "weight": 0.5
    },
    {
        "sku": "thrift-a-leather-tote",
        "name": "Handcrafted Leather Tote",
        "price": 3499,
        "category_id": "4",
        "desc": "Full-grain leather tote with hand-stitched details. Spacious interior with zip pocket.",
        "img": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop&q=80",
        "weight": 0.7
    },
    {
        "sku": "thrift-a-watch",
        "name": "Minimalist Analog Watch",
        "price": 4999,
        "category_id": "3",
        "desc": "Clean-dial analog watch with Japanese quartz movement. Genuine leather strap, sapphire crystal.",
        "img": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop&q=80",
        "weight": 0.2
    },
    {
        "sku": "thrift-a-cashmere-scarf",
        "name": "Pure Cashmere Scarf",
        "price": 2999,
        "category_id": "3",
        "desc": "Luxuriously soft 100% cashmere scarf in a versatile neutral tone. Lightweight yet warm.",
        "img": "https://images.unsplash.com/photo-1601379329542-31c59347e2b0?w=600&h=800&fit=crop&q=80",
        "weight": 0.2
    },
    {
        "sku": "thrift-w-cardigan",
        "name": "Chunky Knit Cardigan",
        "price": 3799,
        "category_id": "20",
        "desc": "Cozy oversized cardigan in a chunky cable knit. Features large buttons and deep patch pockets.",
        "img": "https://images.unsplash.com/photo-1434389677669-e08b4cda3a38?w=600&h=800&fit=crop&q=80",
        "weight": 0.6
    },
    {
        "sku": "thrift-m-denim-jacket",
        "name": "Vintage Wash Denim Jacket",
        "price": 3299,
        "category_id": "14",
        "desc": "Classic denim jacket with a modern vintage wash. Copper button details, relaxed trucker fit.",
        "img": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop&q=80",
        "weight": 0.9
    },
    {
        "sku": "thrift-a-sneakers",
        "name": "Premium Canvas Sneakers",
        "price": 2499,
        "category_id": "3",
        "desc": "Minimalist canvas sneakers with vulcanized rubber sole. Clean design that pairs with everything.",
        "img": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop&q=80",
        "weight": 0.8
    },
]

for p in products:
    # Download image and base64 encode
    img_data = None
    try:
        img_resp = requests.get(p["img"], timeout=15)
        if img_resp.status_code == 200:
            img_data = base64.b64encode(img_resp.content).decode()
            print(f"  Image downloaded for {p['name']} ({len(img_resp.content)} bytes)")
    except Exception as e:
        print(f"  Image download failed for {p['name']}: {e}")

    payload = {
        "product": {
            "sku": p["sku"],
            "name": p["name"],
            "price": p["price"],
            "status": 1,
            "visibility": 4,
            "type_id": "simple",
            "weight": p["weight"],
            "attribute_set_id": 4,
            "extension_attributes": {
                "category_links": [{"category_id": p["category_id"], "position": 0}],
                "stock_item": {"qty": 100, "is_in_stock": True}
            },
            "custom_attributes": [
                {"attribute_code": "description", "value": f"<p>{p['desc']}</p>"},
                {"attribute_code": "short_description", "value": p["desc"]},
                {"attribute_code": "url_key", "value": p["sku"]},
                {"attribute_code": "tax_class_id", "value": "2"}
            ]
        }
    }

    if img_data:
        payload["product"]["media_gallery_entries"] = [{
            "media_type": "image",
            "label": p["name"],
            "position": 1,
            "disabled": False,
            "types": ["image", "small_image", "thumbnail", "swatch_image"],
            "content": {
                "base64_encoded_data": img_data,
                "type": "image/jpeg",
                "name": f"{p['sku']}.jpg"
            }
        }]

    r = requests.post(f"{BASE}/products", headers=HEADERS, json=payload)
    if r.status_code == 200:
        print(f"  OK: {p['name']} (SKU: {r.json().get('sku', '?')})")
    else:
        print(f"  FAIL: {p['name']} -> {r.status_code}: {r.text[:200]}")
    
    time.sleep(0.5)

# Reindex
print("\nReindexing...")
import subprocess
subprocess.run(["php", "/var/www/magento2/bin/magento", "indexer:reindex"], capture_output=True)
subprocess.run(["php", "/var/www/magento2/bin/magento", "cache:flush"], capture_output=True)
print("Done! All products added and indexes refreshed.")
