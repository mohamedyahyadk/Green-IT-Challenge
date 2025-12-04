module.exports = function computeCarbon(data) {
    const { resources } = data;

    // تقدير حجم الصفحة
    const pageSizeKB = resources.length * 50; // 50KB لكل مورد

    // حساب CO2
    const carbonEmission = (pageSizeKB / 1024) * 0.8;

    // حساب التقييم ECO-Score
    let ecoScore = "C";
    if (pageSizeKB < 500) ecoScore = "A";
    else if (pageSizeKB < 1000) ecoScore = "B";
    else if (pageSizeKB < 2000) ecoScore = "C";
    else ecoScore = "D";

    return {
        pageSizeKB,
        carbonEmission: parseFloat(carbonEmission.toFixed(3)),
        ecoScore
    };
};
