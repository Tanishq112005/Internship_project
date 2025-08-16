"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapping = scrapping;
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapping(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // extracting thr url from the body
        const { url } = req.body;
        console.log(`[Node.js] Attempting to scrape URL with Puppeteer: ${url}`);
        let browser;
        const launchOptions = {
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
        try {
            browser = yield puppeteer_1.default.launch(launchOptions);
            const page = yield browser.newPage();
            page.on('console', msg => {
                console.log(`[Browser Console] ${msg.text()}`);
            });
            yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            // going to the url 
            yield page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            const pageTitle = yield page.title();
            console.log(`[Node.js] Page loaded with title: "${pageTitle}"`);
            // extracting the data 
            const extractedData = yield page.evaluate(() => {
                const get_content = (selector, attribute) => {
                    const element = document.querySelector(selector);
                    if (!element)
                        return null;
                    return attribute ? element.getAttribute(attribute) : element.innerText;
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
                yield page.screenshot({ path: 'error_screenshot.png' });
            }
            req.body = {
                url: url,
                brandName: ((_a = extractedData.brandName) === null || _a === void 0 ? void 0 : _a.trim()) || 'N/A',
                description: (_b = extractedData.description) === null || _b === void 0 ? void 0 : _b.trim()
            };
            console.log("[Node.js] Puppeteer scraping successful.");
            next();
        }
        catch (err) {
            console.error(`[Node.js] Puppeteer scraping failed for ${url}:`, err);
            res.status(500).json({ error: 'Failed to scrape the URL.', details: err.message });
        }
        finally {
            if (browser) {
                yield browser.close();
            }
        }
    });
}
