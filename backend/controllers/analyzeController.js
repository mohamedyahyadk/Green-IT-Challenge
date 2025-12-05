const axios = require("axios");
const { JSDOM } = require("jsdom");

exports.analyzePage = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    try {
        const response = await axios.get(url);
        const html = response.data;

        const dom = new JSDOM(html);
        const domCount = dom.window.document.getElementsByTagName("*").length;

       
        const pageSizeKB = Buffer.byteLength(html, "utf-8") / 1024;
        const requestCount = (html.match(/<img|<script|<link/g) || []).length;

    
        const carbonEmission = (pageSizeKB * 0.0005).toFixed(2); 

       
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
        res.status(500).json({ error: "Impossible d'analyser la page" });
    }
};
