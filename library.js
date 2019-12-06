async function openPage(url, page){
    await page.goto(url);
}

async function openLink(selectorPath, page){
    await page.waitForSelector(selectorPath);
    await page.click(selectorPath);
}

async function clickElement(selectorPath, page){
    await page.waitForSelector(selectorPath);
    await page.click(selectorPath);
}

async function typeText(selectorPath, page, content){
    await page.waitForSelector(selectorPath);
    await page.focus(selectorPath);
    await page.keyboard.type(content);
}

async function scroll(page){
    var interval = intervalDuration;
    var distance = distancePerInterval;
    await page.evaluate(async function(interval) {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;// distance traveled per interval
            var timer = setInterval(function() {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);// interval
        });
    });
}

async function scrapeData(page, listXpath){
    var data;
    var list = [];
    for (let i = 0; i < listXpath.length; i++){
        data = await page.$x(listXpath[i]);
        text = await page.evaluate(path => path.textContent, data[0])
        list.push(text);
    }
    console.log(list);
}

module.exports.openPage = openPage;
module.exports.openLink = openLink;
module.exports.clickElement = clickElement;
module.exports.typeText = typeText;
module.exports.scroll = scroll;
module.exports.scrapeData = scrapeData;
