// ==UserScript==
// @name         Remove Promoted Posts & Suggestions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide promoted posts and suggested content on Twitter and Facebook
// @author       Kushal Poudel
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Facebook: Remove "Suggested for you" and ads
    const removeFacebookAds = () => {
        const posts = document.querySelectorAll('[role="article"]');
        posts.forEach((post) => {
            if (post.innerText.includes('Suggested for you') || post.innerText.includes('Sponsored')) {
                post.style.display = 'none';
            }
        });
    };

    // Run the script periodically
    const observer = new MutationObserver(() => {
        removeTwitterAds();
        removeFacebookAds();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
