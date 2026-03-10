(function() {
    /* ── Title ── */
    function updateTitle() {
        var t = document.title;
        if (t && t.indexOf('Magento Admin') !== -1) {
            document.title = t.replace('Magento Admin', 'Thrift Admin');
        } else if (t && t.indexOf('Magento') !== -1) {
            document.title = t.replace('Magento', 'Thrift');
        }
    }

    /* ── Favicon ── */
    function updateFavicon() {
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%239333ea'/><text x='16' y='23' font-family='Georgia,serif' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>T</text></svg>";
        var link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,' + svg;
    }

    /* ── Sidebar T Logo (injected DOM element) ── */
    function injectSidebarLogo() {
        if (document.getElementById('thrift-sidebar-logo')) return;
        var nav = document.querySelector('.admin__menu');
        if (!nav) return;

        var logo = document.createElement('div');
        logo.id = 'thrift-sidebar-logo';
        logo.innerHTML = '<span class="thrift-t-icon">T</span><span class="thrift-t-label">Thrift</span>';
        nav.insertBefore(logo, nav.firstChild);
    }

    /* ── Footer Branding ── */
    function updateFooter() {
        if (document.getElementById('thrift-footer-done')) return;

        /* Replace copyright text */
        var copyright = document.querySelector('.page-footer .copyright');
        if (copyright) {
            copyright.innerHTML = '<span class="thrift-footer-brand"><span class="thrift-footer-t">T</span> Thrift</span> &copy; ' + new Date().getFullYear() + ' All rights reserved.';
        }

        /* Replace legal system links (privacy policy, report bug, version) */
        var legalSys = document.querySelector('.footer-legal-system');
        if (legalSys) {
            legalSys.innerHTML = '<span style="opacity:.5">Thrift Commerce Platform v1.0</span>';
        }

        /* Mark done so we don't re-run */
        if (copyright || legalSys) {
            var marker = document.createElement('span');
            marker.id = 'thrift-footer-done';
            marker.style.display = 'none';
            document.body.appendChild(marker);
        }
    }

    /* ── Marketplace Page Override ── */
    function fixMarketplacePage() {
        if (window.location.href.indexOf('marketplace/index') === -1) return;
        if (document.getElementById('thrift-marketplace-done')) return;

        var content = document.querySelector('.page-content') || document.querySelector('#container .entry-edit');
        if (!content) return;

        /* Find the marketplace iframe or content wrapper */
        var marketplace = content.querySelector('.marketplace-content, iframe, .magento-marketplace, .admin__page-section');
        var target = marketplace || content;

        target.innerHTML = '<div id="thrift-marketplace">' +
            '<div class="thrift-mp-header">' +
                '<div class="thrift-mp-t-badge">T</div>' +
                '<div><h2>Thrift Store Hub</h2><p>Everything you need to manage your store</p></div>' +
            '</div>' +
            '<div class="thrift-mp-grid">' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#128722;</div>' +
                    '<h3>Product Management</h3>' +
                    '<p>Add, edit, and manage your product catalog with ease. Set prices, organize categories, and control inventory.</p>' +
                '</div>' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#128230;</div>' +
                    '<h3>Order Processing</h3>' +
                    '<p>Track orders from placement to delivery. Manage invoices, shipments, and refunds efficiently.</p>' +
                '</div>' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#128100;</div>' +
                    '<h3>Customer Insights</h3>' +
                    '<p>View customer profiles, order history, and shopping behavior to boost engagement.</p>' +
                '</div>' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#127912;</div>' +
                    '<h3>Storefront Design</h3>' +
                    '<p>Customize your React-powered Thrift storefront. Manage themes, layouts, and branding.</p>' +
                '</div>' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#128200;</div>' +
                    '<h3>Sales Reports</h3>' +
                    '<p>Analyze revenue, bestsellers, and trends with built-in analytics and reporting tools.</p>' +
                '</div>' +
                '<div class="thrift-mp-card">' +
                    '<div class="thrift-mp-card-icon">&#9881;</div>' +
                    '<h3>Store Configuration</h3>' +
                    '<p>Configure payment gateways, shipping methods, tax rules, and general store settings.</p>' +
                '</div>' +
            '</div>' +
        '</div>';

        var marker = document.createElement('span');
        marker.id = 'thrift-marketplace-done';
        marker.style.display = 'none';
        document.body.appendChild(marker);
    }

    /* ── Init ── */
    function initAll() {
        updateTitle();
        updateFavicon();
        injectSidebarLogo();
        updateFooter();
        fixMarketplacePage();
    }

    initAll();

    var observer = new MutationObserver(function() { updateTitle(); });
    var titleEl = document.querySelector('title');
    if (titleEl) {
        observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener('DOMContentLoaded', function() { initAll(); });
    /* Re-check periodically for dynamically loaded content */
    setInterval(function() {
        updateTitle();
        injectSidebarLogo();
        updateFooter();
        fixMarketplacePage();
    }, 1500);
})();
