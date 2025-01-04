// ==UserScript==
// @name         Open Image in New Tab Button (Google Search)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a "View" button to images on Google Search to open them in a new tab.
// @author       Kushal Poudel
// @match        *://*.google.com/search?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a "View" button element
    const button = document.createElement('button');
    button.textContent = "View";
    button.style.position = 'absolute';
    button.style.top = '5px';
    button.style.left = '5px';
    button.style.padding = '5px 10px';
    button.style.background = 'rgba(0, 0, 0, 0.5)';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.zIndex = 9999;

    // Function to create and add the button to an image
    function addButtonToImage(image) {
        const buttonClone = button.cloneNode(true);
        buttonClone.addEventListener('click', () => {
            window.open(image.src, '_blank');
        });
        image.parentNode.appendChild(buttonClone);

        // Remove the button when the image is clicked
        image.addEventListener('click', () => {
            buttonClone.remove();
        });
    }

    // Observe changes to the DOM to detect new images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IMG') {
                        addButtonToImage(node);
                    }
                });
            }
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Add buttons to existing images on the page
    document.querySelectorAll('img').forEach(addButtonToImage);

})();