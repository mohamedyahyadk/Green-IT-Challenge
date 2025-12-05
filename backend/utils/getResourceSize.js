const axios = require("axios");

module.exports = async function getResourceSize(url) {
    if (!url) return 0;

    try {
        // محاولة الحصول على الحجم دون تحميل الملف
        const head = await axios.head(url);
        const size = head.headers["content-length"];
        return parseInt(size) || 0;
    } catch {
        try {
            // تحميل الملف عندما لا يعرض content-length
            const res = await axios.get(url, { responseType: "arraybuffer" });
            return res.data.length;
        } catch {
            return 0;
        }
    }
};