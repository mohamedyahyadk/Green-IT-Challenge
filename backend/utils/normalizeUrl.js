module.exports = function normalizeUrl(url) {
    if (!url) return "";

    url = url.trim();

    // لو يبدأ بـ www ولا يحتوي http
    if (url.startsWith("www.") && !url.startsWith("http")) {
        return "https://" + url;
    }

    // لو لا يحتوي http ولا https
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }

    return url;
};