async function loadMarkdown() {
    try {
        // Get the current page from the URL hash
        let pageName = window.location.hash.slice(1) || 'welcome';
        
        console.log('Loading markdown for page:', pageName);
        
        // Update page title
        document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('_', ' ')} - Prof. Flávio L. Cardoso-Ribeiro`;
        
        const response = await fetch(`markdown/${pageName}.md`);
        if (!response.ok) {
            throw new Error(`Failed to load markdown: ${response.statusText}`);
        }
        
        const markdown = await response.text();
        const converter = new showdown.Converter({ tables: true, literalMidWordUnderscores: true });        const html = converter.makeHtml(markdown);
        document.getElementById("content").innerHTML = html;

        // Typeset math if MathJax is available
        if (typeof MathJax !== 'undefined') {
            console.log('MathJax found, starting typeset');
            try {
                await MathJax.typesetPromise([document.getElementById("content")]);
                console.log('MathJax typesetting completed');
            } catch (err) {
                console.error('MathJax typesetting failed:', err);
            }
        } else {
            console.warn('MathJax not found');
        }
    } catch (error) {
        console.error('Error loading markdown:', error);
        document.getElementById("content").innerHTML = `
            <p>Error loading content. Please try again later.</p>
            <p>Details: ${error.message}</p>
        `;
    }
}

// Load content when hash changes
window.addEventListener('hashchange', loadMarkdown);

// Initial load
document.addEventListener('DOMContentLoaded', loadMarkdown);
