const axios = require("axios");

module.exports = async function computePageSize(analysis) {
    let totalKB = 0;

    const baseUrl = analysis.url;
    const resources = analysis.resources || [];

    const requests = resources.map(async (res) => {
        if (!res.src) return 0;

        let fullUrl;

        try {
            // تحويل الرابط النسبي إلى رابط كامل
            fullUrl = new URL(res.src, baseUrl).href;
        } catch {
            return 0;
        }

        try {
            const response = await axios.get(fullUrl, {
                responseType: "arraybuffer"
            });

            const size = Buffer.byteLength(response.data) / 1024; // KB
            return size;

        } catch (err) {
            return 0;
        }
    });

    const sizes = await Promise.all(requests);

    sizes.forEach(size => totalKB += size);

    return {
        totalKB: Number(totalKB.toFixed(2))
    };
};