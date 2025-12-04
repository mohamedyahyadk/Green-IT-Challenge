const { JSDOM } = require("jsdom");

module.exports = async function extractResources(url, html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // حساب عدد عناصر DOM
    const domCount = document.querySelectorAll("*").length;

    // استخراج الموارد
    const resources = [
        ...document.querySelectorAll("img"),
        ...document.querySelectorAll("script"),
        ...document.querySelectorAll("link[rel='stylesheet']")
    ];

    const resourceList = resources.map(res => ({
        tag: res.tagName.toLowerCase(),
        src: res.src || res.href || null
    }));

    return {
        url,
        domCount,
        requests: resourceList.length,
        resources: resourceList
    };
};
