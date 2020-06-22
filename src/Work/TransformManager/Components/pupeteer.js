const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ 
		width: 800,
		height: 500,
		deviceScaleFactor: 0.5
	});
	await page.goto("http://localhost:3001/");
	await page.screenshot({ path: "Scale0_5.png" });

	await browser.close();
})();
