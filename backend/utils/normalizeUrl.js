function normalizeUrl(url) {
    url = url.trim();

    // إذا يبدأ بـ http:// أو https:// لا نضيف شيء
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url.toLowerCase().replace(/\/+$/, "");
    }

    // إذا لا يبدأ ببروتوكول، نضيف https://
    return "https://" + url.toLowerCase().replace(/\/+$/, "");
}

module.exports = normalizeUrl;