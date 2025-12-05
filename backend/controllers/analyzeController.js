const normalizeUrl = require("../utils/normalizeUrl");
const fetchPage = require("../services/fetchPage");
const extractResources = require("../services/extractResources");
const computeCarbon = require("../services/computeCarbon");
const computePageSize = require("../utils/computePageSize");
const formatResponse = require("../utils/formatResponse");

exports.analyzePage = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // 1) Normalize URL
        const cleanUrl = normalizeUrl(url);

        // 2) Fetch HTML
        const html = await fetchPage(cleanUrl);

        // 3) Extract resources
        const analysis = await extractResources(cleanUrl, html);

        // 4) Compute page size
        const sizeInfo = computePageSize(analysis);

        // 5) Compute carbon footprint
        const carbon = computeCarbon(analysis);

        // 6) Format final response
        const result = formatResponse(analysis, carbon, sizeInfo);

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to analyze page" });
    }
};