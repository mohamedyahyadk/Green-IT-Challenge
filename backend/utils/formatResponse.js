function formatResponse(analysis, carbon, sizeInfo) {
    return {
        domCount: analysis.domCount,
        requestCount: analysis.requests.length,
        pageSizeKB: sizeInfo.kb,
        pageSizeMB: sizeInfo.mb,
        carbonEmission: carbon.carbonEmission,
        ecoScore: carbon.ecoScore,
        timestamp: new Date().toISOString()
    };
}

module.exports = formatResponse;
