function computePageSize(resources) {
    let totalBytes = 0;

    for (const item of resources.requests) {
        if (item.size) {
            totalBytes += item.size;
        }
    }

    const kb = totalBytes / 1024;
    const mb = kb / 1024;

    return {
        bytes: totalBytes,
        kb: Math.round(kb * 100) / 100,
        mb: Math.round(mb * 100) / 100
    };
}

module.exports = computePageSize;
