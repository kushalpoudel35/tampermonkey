// ==UserScript==
// @name         Facebook Suggested & Sponsored Post Blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides suggested and sponsored posts on Facebook's home feed.
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements matching the given selector
    function hideElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Hide suggested posts
    hideElements('div[data-testid="story"] [data-testid="suggested_post"]');

    // Hide sponsored posts
    hideElements('div[data-testid="story"] [data-testid="ad_unit"]');

    // Observe changes to the DOM and re-apply the hiding logic
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                hideElements('div[data-testid="story"] [data-testid="suggested_post"]');
                hideElements('div[data-testid="story"] [data-testid="ad_unit"]');
            }
        });
    });

    // Observe the main content area for changes
    const targetNode = document.querySelector('div[role="feed"]');
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();