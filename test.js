const HCCrawler = require('headless-chrome-crawler');
const CSVExporter = require('headless-chrome-crawler/exporter/csv');
const JSONLineExporter = require('headless-chrome-crawler/exporter/json-line');
const FILE = 'link_jobs.json';

const url =["https://guangzhou.craigslist.org/d/books-magazines/search/bka?lang=en&cc=us", "https://guangzhou.craigslist.org/d/sporting-goods/search/sga?lang=en&cc=us"];
const regex = new RegExp(".*book.*");
let maxDepthCrawler = 1;
const exporter = new JSONLineExporter({
	file: FILE,
	fields: ['result'],
});

(async () => {
  	const crawler = await HCCrawler.launch({
		headless: false,
		exporter,
		customCrawl: async function(page, crawl){
			const result = await crawl();
			if (await page.url().match(regex)){//code cho template 1
				await page.waitFor('.result-meta');
				var suggest = await page.$$eval(".result-row", function(news){
			
					return news.map(function(oneNew) {
						var properties = {};
						var title = oneNew.querySelector('.result-price').textContent;
						properties.title = title;
						return properties;
					});
					
				//return news;
				});
				result.result = suggest;
				return result;
			}
			
			else{//code cho template 2
				await page.waitFor('.result-row');
				var suggest = await page.$$eval(".result-row", function(news){
			
					return news.map(function(oneNew) {
						var properties = {};
						var title = oneNew.querySelector('.result-title').textContent;
						properties.title = title;
						return properties;
					});
					
				//return news;
				});
				result.result = suggest;
				return result;
			}
			
		},
		//evaluatePage: () => ({
		//  title: $('title').text(),
		//}),
		maxConcurrency: 1,
		onSuccess: (result => {
			console.log(result.result);
    	}),
	});


	for (let i = 0; i < url.length; i++){
		await crawler.queue({
			url: url[i],
			//maxDepth: maxDepthCrawler,
			//depthPriority: true,
			//allowedDomains: ["guangzhou.craigslist.org"],
		});
	}
	//console.log(regex);
	await crawler.onIdle(); 
	await crawler.close();
})();


