module.exports = function computeCarbon(pageSizeKB) {
    if (!pageSizeKB || pageSizeKB < 0) pageSizeKB = 0;

    // سيصبح تقريبا: 0.0002g CO2 لكل 1KB
    const carbonEmission = Number((pageSizeKB * 0.0002).toFixed(4));

    return carbonEmission;
};