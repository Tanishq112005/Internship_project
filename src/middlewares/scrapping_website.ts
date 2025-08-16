import puppeteer from 'puppeteer';

export async function scrapping(req: any, res: any, next: any) {
    // extracting thr url from the body
    const { url } = req.body;
    console.log(`[Node.js] Attempting to scrape URL with Puppeteer: ${url}`);
    let browser;
    const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
         
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      };
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }
      
    try {
        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        page.on('console', msg => {
            console.log(`[Browser Console] ${msg.text()}`);
        });

       
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // going to the url 
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        const pageTitle = await page.title();
        console.log(`[Node.js] Page loaded with title: "${pageTitle}"`);

         // extracting the data 
        const extractedData = await page.evaluate(() => {
   
            const get_content = (selector: string, attribute?: string): string | null => {
                const element = document.querySelector(selector);
                if (!element) return null;
                return attribute ? element.getAttribute(attribute) : (element as HTMLElement).innerText;
            };

            let brandName = get_content('meta[property="og:site_name"]', 'content');
            
 
            if (!brandName) {
                brandName = get_content('img[alt*="logo" i]', 'alt') || get_content('img[src*="logo" i]', 'alt');
            }

            if (!brandName) {
                brandName = get_content('meta[name="application-name"]', 'content');
            }

            if (!brandName) {
                const title = get_content('title');
                if (title) {
          
                    brandName = title.split('|')[0].split('-')[0].split('—')[0].trim();
                }
            }
            

            let description = get_content('meta[name="description"]', 'content') ||
                              get_content('meta[property="og:description"]', 'content');

            if (!description) {
                description = get_content('p'); 
            }


            console.log('Brand Name found in browser:', brandName);
            console.log('Description found in browser:', description);

            return { brandName, description };
        });
       

        console.log('[Node.js] Data received from browser:', extractedData);

        if (!extractedData.brandName && !extractedData.description) {
            console.error("[Node.js] ERROR: Selectors failed to find content even after page load.");
            await page.screenshot({ path: 'error_screenshot.png' });
        }

        req.body = {
            url: url,
            brandName: extractedData.brandName?.trim() || 'N/A', 
            description: extractedData.description?.trim()
        };

        console.log("[Node.js] Puppeteer scraping successful.");
        next();

    } catch (err: any) {
        console.error(`[Node.js] Puppeteer scraping failed for ${url}:`, err);
       
      
        res.status(500).json({ error: 'Failed to scrape the URL.', details: err.message });

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}