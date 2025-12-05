const normalizeUrl = require("../utils/normalizeUrl");
const fetchPage = require("../services/fetchPage");
const extractResources = require("../services/extractResources");
const computePageSize = require("../utils/computePageSize");
const computeCarbon = require("../services/computeCarbon");

exports.analyzePage = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // 1) Normalize
        const cleanUrl = normalizeUrl(url);

        // 2) Fetch HTML
        const html = await fetchPage(cleanUrl);

        // 3) Extract DOM + resources
        const analysis = await extractResources(cleanUrl, html);

        // 4) Compute total page size
        const sizeInfo = await computePageSize(analysis);

        // 5) Compute carbon footprint (only carbon)
        const carbon = computeCarbon(sizeInfo.totalKB);

        // 6) Score
        const ecoScore =
            sizeInfo.totalKB < 500 ? "A" :
            sizeInfo.totalKB < 1500 ? "B" :
            sizeInfo.totalKB < 3000 ? "C" : "D";

        res.json({
            url: cleanUrl,
            domCount: analysis.domCount,
            requestCount: analysis.requests,
            pageSizeKB: sizeInfo.totalKB,
            carbonEmission: carbon,
            ecoScore,
            resources: analysis.resources
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to analyze page" });
    }
};