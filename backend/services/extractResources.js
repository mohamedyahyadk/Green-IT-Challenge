const { JSDOM } = require("jsdom");
const urlModule = require("url");

module.exports = async function extractResources(pageUrl, html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // DOM COUNT
    const domCount = document.querySelectorAll("*").length;

    // عناصر يجب تحليلها
    const resources = [
        ...document.querySelectorAll("img"),
        ...document.querySelectorAll("script[src]"),
        ...document.querySelectorAll("link[rel='stylesheet']")
    ];

    const resourceList = resources.map(res => {
        let src = res.src || res.href || null;

        // 🔥 معالجة الروابط النسبية
        if (src && !src.startsWith("http")) {
            src = urlModule.resolve(pageUrl, src);
        }

        return {
            tag: res.tagName.toLowerCase(),
            src
        };
    });
console.log("ressources found :",resourceList);
    return {
        url: pageUrl,
        domCount,
        requests: resourceList.length,
        resources: resourceList
    };
};