#!/bin/bash
# ============================================================
# Magento 2 - Oracle Cloud Free Tier Server Setup Script
# Run this on the Oracle Cloud Ubuntu instance as root
# ============================================================
set -e

echo "========================================="
echo "  Magento 2 Server Setup - Oracle Cloud"
echo "========================================="

# --- 1. System Update ---
echo "[1/8] Updating system packages..."
apt update && apt upgrade -y

# --- 2. Install Apache ---
echo "[2/8] Installing Apache..."
apt install -y apache2
a2enmod rewrite headers expires ssl
systemctl enable apache2

# --- 3. Install PHP 8.3 + Extensions ---
echo "[3/8] Installing PHP 8.3..."
apt install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt update
apt install -y php8.3 php8.3-fpm php8.3-mysql php8.3-xml php8.3-gd php8.3-curl \
    php8.3-intl php8.3-mbstring php8.3-soap php8.3-zip php8.3-bcmath \
    php8.3-xsl php8.3-sockets php8.3-opcache libapache2-mod-php8.3

# Configure PHP for Magento
cat > /etc/php/8.3/fpm/conf.d/99-magento.ini << 'PHPINI'
memory_limit = 756M
max_execution_time = 18000
upload_max_filesize = 64M
post_max_size = 64M
zlib.output_compression = On
realpath_cache_size = 10M
realpath_cache_ttl = 7200
opcache.save_comments = 1
PHPINI

cp /etc/php/8.3/fpm/conf.d/99-magento.ini /etc/php/8.3/cli/conf.d/99-magento.ini
a2enmod proxy_fcgi setenvif
a2enconf php8.3-fpm
systemctl enable php8.3-fpm

# --- 4. Install MySQL 8.0 ---
echo "[4/8] Installing MySQL 8.0..."
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

# Create Magento database and user
mysql -u root << 'MYSQL'
CREATE DATABASE IF NOT EXISTS magento_db;
CREATE USER IF NOT EXISTS 'magento_user'@'localhost' IDENTIFIED BY 'Password123!';
GRANT ALL PRIVILEGES ON magento_db.* TO 'magento_user'@'localhost';
FLUSH PRIVILEGES;
MYSQL

echo "MySQL configured."

# --- 5. Install Elasticsearch 7.17 ---
echo "[5/8] Installing Elasticsearch 7.17..."
apt install -y gnupg
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/7.x/apt stable main" > /etc/apt/sources.list.d/elastic-7.x.list
apt update
apt install -y elasticsearch

# Limit ES memory for free tier
mkdir -p /etc/elasticsearch/jvm.options.d
cat > /etc/elasticsearch/jvm.options.d/heap.options << 'ESHEAP'
-Xms256m
-Xmx256m
ESHEAP

systemctl enable elasticsearch
systemctl start elasticsearch

# --- 6. Install Composer ---
echo "[6/8] Installing Composer..."
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php

# --- 7. Configure Apache Virtual Host ---
echo "[7/8] Configuring Apache virtual host..."
cat > /etc/apache2/sites-available/magento.conf << 'VHOST'
<VirtualHost *:80>
    ServerAdmin admin@example.com
    DocumentRoot /var/www/magento2/pub
    
    <Directory /var/www/magento2/pub>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <Directory /var/www/magento2>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/magento_error.log
    CustomLog ${APACHE_LOG_DIR}/magento_access.log combined
</VirtualHost>
VHOST

a2dissite 000-default.conf
a2ensite magento.conf

# --- 8. Firewall (iptables for Oracle Cloud) ---
echo "[8/8] Configuring iptables firewall..."
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
netfilter-persistent save 2>/dev/null || iptables-save > /etc/iptables/rules.v4

# --- Start Services ---
systemctl restart php8.3-fpm
systemctl restart apache2

echo ""
echo "========================================="
echo "  Server setup complete!"
echo "  Next: Upload Magento files to /var/www/magento2/"
echo "  Then: Import the database dump"
echo "========================================="
