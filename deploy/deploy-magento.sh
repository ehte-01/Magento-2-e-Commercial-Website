#!/bin/bash
# ============================================================
# Magento 2 - Deploy Project to Oracle Cloud
# Run this on the Oracle Cloud instance AFTER setup-server.sh
# Assumes magento2.tar.gz and magento_db_dump.sql are in /tmp/
# ============================================================
set -e

MAGENTO_DIR="/var/www/magento2"
DB_DUMP="/tmp/magento_db_dump.sql"
ARCHIVE="/tmp/magento2.tar.gz"

# Replace YOUR_SERVER_IP with your actual Oracle Cloud public IP
SERVER_IP="${1:-YOUR_SERVER_IP}"

echo "========================================="
echo "  Deploying Magento 2"
echo "========================================="

# --- 1. Extract Magento Files ---
echo "[1/6] Extracting Magento files..."
mkdir -p "$MAGENTO_DIR"
tar xzf "$ARCHIVE" -C "$MAGENTO_DIR" --strip-components=1
echo "Files extracted."

# --- 2. Import Database ---
echo "[2/6] Importing database..."
mysql -u root magento_db < "$DB_DUMP"
echo "Database imported."

# --- 3. Update Magento Base URL ---
echo "[3/6] Updating base URL to http://$SERVER_IP/ ..."
mysql -u root magento_db << URLSQL
UPDATE core_config_data SET value = 'http://$SERVER_IP/' WHERE path = 'web/unsecure/base_url';
UPDATE core_config_data SET value = 'http://$SERVER_IP/' WHERE path = 'web/secure/base_url';
UPDATE core_config_data SET value = '0' WHERE path = 'web/secure/use_in_frontend';
UPDATE core_config_data SET value = '0' WHERE path = 'web/secure/use_in_adminhtml';
URLSQL

# --- 4. Fix env.php (re-enable MySQL networking) ---
echo "[4/6] Updating env.php..."
cd "$MAGENTO_DIR"
# The env.php from WSL2 had 'host' => 'localhost' which is fine

# --- 5. Set Permissions ---
echo "[5/6] Setting file permissions..."
find "$MAGENTO_DIR" -type f -exec chmod 644 {} \;
find "$MAGENTO_DIR" -type d -exec chmod 755 {} \;
chmod -R 775 "$MAGENTO_DIR/var" "$MAGENTO_DIR/generated" "$MAGENTO_DIR/pub/static" "$MAGENTO_DIR/pub/media"
chown -R www-data:www-data "$MAGENTO_DIR"
chmod u+x "$MAGENTO_DIR/bin/magento"

# --- 6. Magento Post-Deploy ---
echo "[6/6] Running Magento post-deploy commands..."
cd "$MAGENTO_DIR"

# Switch to production mode for performance
sudo -u www-data php bin/magento deploy:mode:set production --skip-compilation
sudo -u www-data php bin/magento setup:upgrade
sudo -u www-data php bin/magento setup:di:compile
sudo -u www-data php bin/magento setup:static-content:deploy -f
sudo -u www-data php bin/magento cache:flush
sudo -u www-data php bin/magento indexer:reindex

echo ""
echo "========================================="
echo "  Deployment complete!"
echo ""
echo "  Storefront:  http://$SERVER_IP/"
echo "  Admin Panel: http://$SERVER_IP/adminpanel/"
echo ""
echo "  Admin User:  admin"
echo "  Admin Pass:  Admin@1234"
echo "========================================="
