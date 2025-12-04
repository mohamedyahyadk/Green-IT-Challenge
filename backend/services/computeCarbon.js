const axios = require("axios");

module.exports = async function fetchPage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "GreenIT Analyzer Bot"
            }
        });

        return response.data; 
    } catch (err) {
        throw new Error("Erreur lors du chargement de la page: " + err.message);
    }
};
