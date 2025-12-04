const fetchPage = require("./services/fetchPage");
const extractResources = require("./services/extractResources");
const computeCarbon = require("./services/computeCarbon");

(async () => {
    try {
        const url = "https://example.com";

        console.log("\n=== Testing fetchPage ===");
        const html = await fetchPage(url);
        console.log("HTML loaded successfully. Length:", html.length);

        console.log("\n=== Testing extractResources ===");
        const analysis = await extractResources(url, html);
        console.log("DOM Count:", analysis.domCount);
        console.log("Requests:", analysis.requests);

        console.log("\n=== Testing computeCarbon ===");
        const carbon = computeCarbon(analysis);
        console.log("Page size:", carbon.pageSizeKB, "KB");
        console.log("Carbon:", carbon.carbonEmission, "g");
        console.log("ECO Score:", carbon.ecoScore);

    } catch (err) {
        console.error("\n❌ ERROR:", err.message);
    }
})();

const normalizeUrl = require("./utils/normalizeUrl");

console.log("\n=== Testing normalizeUrl ===");
console.log(normalizeUrl("Google.com"));
console.log(normalizeUrl("HTTP://EXAMPLE.COM"));
console.log(normalizeUrl("https://test.com//"));


const computePageSize = require("./utils/computePageSize");

console.log("\n=== Testing computePageSize ===");
const mockResources = {
    requests: [
        { size: 1024 },
        { size: 2048 },
        { size: 4096 }
    ]
};

console.log(computePageSize(mockResources));


const formatResponse = require("./utils/formatResponse");

console.log("\n=== Testing formatResponse ===");

const analysisMock = {
    domCount: 120,
    requests: mockResources.requests
};

const carbonMock = {
    carbonEmission: 0.85,
    ecoScore: "B"
};

const sizeInfoMock = computePageSize(mockResources);

console.log(formatResponse(analysisMock, carbonMock, sizeInfoMock));