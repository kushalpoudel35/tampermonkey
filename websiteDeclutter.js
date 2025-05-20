// ==UserScript==
// @name         Bare OnlineKhabar (Doesn't work)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Strips onlinekhabar.com to bare text and images, removing ads, popups, and styling
// @author       Grok
// @match        *://*.onlinekhabar.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove all stylesheets
    function removeStylesheets() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
        stylesheets.forEach(sheet => sheet.remove());
    }

    // Function to remove unwanted elements (ads, popups, etc.)
    function removeClutter() {
        const selectorsToRemove = [
            'iframe', // Ads and trackers
            'script', // Scripts that may reload ads or popups
            '.ad', '.ads', '.advert', '.banner', '[class*="ad-"]', '[id*="ad-"]', // Ad containers
            '.okam-ad', '.okam-ad-position', '.okam-leaderboard', // OnlineKhabar-specific ad classes
            '.popup', '.modal', '.ok18-single-post-pop', // Popups and modals
            'nav', 'header', 'footer', '.okam-header', '.okam-footer', // Navigation and footer
            '.okam-single-post-sidebar', '.okam-trending-news', // Sidebars and trending sections
            '.okam-newsletter', '[class*="newsletter"]', '[id*="newsletter"]', // Newsletter prompts
            '[class*="cookie"]', '[id*="cookie"]', // Cookie banners
            '.okam-related-posts', '.okam-comment', // Related posts and comments
            'video', 'audio' // Embedded media (optional, remove if you want to keep)
        ];

        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    // Function to extract main article content
    function extractMainContent() {
        // Common selectors for OnlineKhabar article content
        const articleSelectors = [
            '.okam-single-post-content', // Main article content class
            '.post-content', // Common article class
            '.entry-content', // Fallback for WordPress-like structures
            'article', // Standard HTML5 article tag
            '[itemprop="articleBody"]', // Schema.org article content
            '.okam-post-content' // Additional OnlineKhabar-specific class
        ];

        let mainContent = null;
        for (let selector of articleSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }

        // Fallback: If no article is found, use the body
        if (!mainContent) {
            mainContent = document.body;
            console.log('Main content not found, using document.body as fallback');
        }

        // Create a clean container
        const cleanContainer = document.createElement('div');
        cleanContainer.style.margin = '20px';
        cleanContainer.style.fontFamily = 'Arial, sans-serif';
        cleanContainer.style.fontSize = '16px';
        cleanContainer.style.lineHeight = '1.5';
        cleanContainer.style.color = '#000';
        cleanContainer.style.background = '#fff';

        // Copy text and images from main content
        const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'figure', 'figcaption'];
        const elements = mainContent.querySelectorAll('*');
        elements.forEach(el => {
            if (allowedTags.includes(el.tagName.toLowerCase())) {
                cleanContainer.appendChild(el.cloneNode(true));
            }
        });

        // Clear the body and append clean content
        document.body.innerHTML = '';
        document.body.appendChild(cleanContainer);

        // Ensure images are displayed properly
        const images = cleanContainer.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }

    // Run the cleanup
    function cleanPage() {
        removeStylesheets();
        removeClutter();
        extractMainContent();
    }

    // Execute on page load
    window.addEventListener('load', cleanPage);

    // Mutation observer to handle dynamically loaded content (e.g., popups)
    const observer = new MutationObserver(() => {
        removeClutter();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();