const axios = require("axios");

module.exports = async function fetchPage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            },
            timeout: 15000, // 15 ثانية
            maxRedirects: 5,
            decompress: true // ⚡ مهم للصفحات المشفرة
        });

        if (!response.data) {
            throw new Error("La page ne contient aucun contenu HTML.");
        }

        return response.data;

    } catch (err) {
        throw new Error("Erreur lors du chargement de la page : " + err.message);
    }
};