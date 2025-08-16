import puppeteer from 'puppeteer';

export async function scrapping(req: any, res: any, next: any) {
    const { url } = req.body;
    console.log(`[Node.js] Attempting to scrape URL with Puppeteer: ${url}`);
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        page.on('console', msg => {
            // This is great for debugging! Keep it.
            console.log(`[Browser Console] ${msg.text()}`);
        });

        // A more common user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        const pageTitle = await page.title();
        console.log(`[Node.js] Page loaded with title: "${pageTitle}"`);

        // ======================= REVISED page.evaluate BLOCK =======================
        const extractedData = await page.evaluate(() => {
            // Function to safely get text or attribute content
            const get_content = (selector: string, attribute?: string): string | null => {
                const element = document.querySelector(selector);
                if (!element) return null;
                return attribute ? element.getAttribute(attribute) : (element as HTMLElement).innerText;
            };

            // --- Robust Brand Name Extraction ---
            // 1. Try OpenGraph site_name (Ideal)
            let brandName = get_content('meta[property="og:site_name"]', 'content');
            
            // 2. Try the logo's alt text (Very common)
            if (!brandName) {
                brandName = get_content('img[alt*="logo" i]', 'alt') || get_content('img[src*="logo" i]', 'alt');
            }

            // 3. Try the application-name meta tag
            if (!brandName) {
                brandName = get_content('meta[name="application-name"]', 'content');
            }
            
            // 4. Use the page title as a fallback, but clean it up
            if (!brandName) {
                const title = get_content('title');
                if (title) {
                    // Remove common separators and extra text
                    brandName = title.split('|')[0].split('-')[0].split('—')[0].trim();
                }
            }
            
            // --- Description Extraction (Your logic was already good) ---
            let description = get_content('meta[name="description"]', 'content') ||
                              get_content('meta[property="og:description"]', 'content');

            if (!description) {
                description = get_content('p'); // Fallback to the first paragraph
            }

            // These logs are very helpful for seeing which selector worked.
            console.log('Brand Name found in browser:', brandName);
            console.log('Description found in browser:', description);

            return { brandName, description };
        });
        // =======================================================================

        console.log('[Node.js] Data received from browser:', extractedData);

        if (!extractedData.brandName && !extractedData.description) {
            console.error("[Node.js] ERROR: Selectors failed to find content even after page load.");
            await page.screenshot({ path: 'error_screenshot.png' });
        }

        req.body = {
            url: url,
            // Use optional chaining and trim, with a final fallback
            brandName: extractedData.brandName?.trim() || 'N/A', 
            description: extractedData.description?.trim()
        };

        console.log("[Node.js] Puppeteer scraping successful.");
        next();

    } catch (err: any) {
        console.error(`[Node.js] Puppeteer scraping failed for ${url}:`, err);
       
        // Properly handle the error, don't just hang the request
        res.status(500).json({ error: 'Failed to scrape the URL.', details: err.message });

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}