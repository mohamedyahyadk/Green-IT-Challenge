const axios = require("axios");
const { JSDOM } = require("jsdom");

exports.analyzePage = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    try {
        // important: some websites block axios without a browser User-Agent
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
            },
            timeout: 15000
        });

        const html = response.data;

        // Parse DOM using jsdom
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const domCount = document.getElementsByTagName("*").length;

        // Detect HTTP requests
        const images = [...document.querySelectorAll("img")].length;
        const scripts = [...document.querySelectorAll("script")].length;
        const links = [...document.querySelectorAll("link")].length;
        const requestCount = images + scripts + links;

        // Compute size
        const pageSizeKB = Buffer.byteLength(html, "utf-8") / 1024;

        // Carbon footprint estimation
        const carbonEmission = (pageSizeKB * 0.0005).toFixed(2);

        // Score
        let ecoScore = "C";
        if (carbonEmission < 0.5) ecoScore = "A";
        else if (carbonEmission < 1.0) ecoScore = "B";

        res.json({
            domCount,
            requestCount,
            pageSizeKB: pageSizeKB.toFixed(0),
            carbonEmission,
            ecoScore
        });
    } catch (error) {
        return res.status(500).json({
            error: "Impossible d'analyser la page",
            details: error.message
        });
    }
};
