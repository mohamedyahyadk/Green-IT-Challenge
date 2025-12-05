/**
 * Carbon calculation based on Green Web Foundation methodology
 * Optimized for contest requirements
 */
const computeCarbon = (resources) => {
  const { totalSize, hasGreenHosting, requestCount } = resources;

  console.log(`🌍 Computing carbon for ${formatBytes(totalSize)} page`);

  // Constants from scientific studies
  const ENERGY_PER_BYTE = 0.0000018; // kWh per MB (1.8 Wh/GB)
  const CARBON_INTENSITY = {
    globalAverage: 0.475, // kg CO₂ per kWh (global grid)
    greenHosting: 0.05, // kg CO₂ per kWh (renewable energy)
    france: 0.058, // kg CO₂ per kWh (France/O2Switch region)
  };

  const CARBON_PER_REQUEST = 0.0001; // Additional carbon per HTTP request

  // Select carbon intensity based on hosting
  const intensity = hasGreenHosting
    ? CARBON_INTENSITY.greenHosting
    : CARBON_INTENSITY.globalAverage;

  // Convert bytes to MB
  const dataMB = totalSize / (1024 * 1024);

  // Energy consumption (kWh)
  const energyDataTransfer = dataMB * ENERGY_PER_BYTE;

  // Add energy for processing (simplified)
  const energyProcessing = requestCount * 0.000001;

  // Total energy
  const totalEnergy = energyDataTransfer + energyProcessing;

  // CO₂ emissions (grams)
  const co2Grams = totalEnergy * intensity * 1000;

  // Add request overhead
  const co2Requests = requestCount * CARBON_PER_REQUEST;
  const co2PerVisit = Math.max(0.001, co2Grams + co2Requests);

  // Monthly impact estimation (if 10,000 visits)
  const monthlyVisits = 10000;
  const monthlyImpact = co2PerVisit * monthlyVisits;

  // Equivalent comparisons (for educational value)
  const equivalents = {
    carMeters: Math.round(co2PerVisit * 150), // grams CO₂ × meters per gram
    smartphoneCharges: (co2PerVisit / 8).toFixed(3), // vs smartphone charge
    treeMinutes: Math.round(co2PerVisit * 21000), // minutes to absorb
  };

  return {
    co2PerVisit,
    co2PerVisitReadable: `${co2PerVisit.toFixed(3)}g`,
    monthlyImpact: monthlyImpact / 1000, // Convert to kg
    monthlyImpactReadable: `${(monthlyImpact / 1000).toFixed(1)}kg CO₂/month`,
    energyConsumption: totalEnergy,
    carbonIntensity: intensity,
    isGreenHosted: hasGreenHosting,
    equivalents,
    // Contest presentation
    calculationBreakdown: {
      dataTransfer: `${(energyDataTransfer * 1000).toFixed(3)}Wh`,
      processing: `${(energyProcessing * 1000).toFixed(3)}Wh`,
      carbonIntensity: `${intensity} kgCO₂/kWh`,
      formula: "CO₂ = Energy (kWh) × Carbon Intensity (kgCO₂/kWh)",
    },
  };
};

// Helper
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

module.exports = computeCarbon;
