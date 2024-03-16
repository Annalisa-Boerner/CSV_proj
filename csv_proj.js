const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const results = [];

const directoryName = "/root/csv_proj/data/GLJ/Destinations-of-Silk-2022"
const fileName = "Destinations-of-Silk-2022.csv"
// Path to your Excel file
const filePath = path.join(directoryName, fileName);

console.log("filepath", filePath)

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // Output the data
        // console.log(results);
        const countries = []
        const tradeValues = []

        for (let i = 0; i < results.length; i++) {
            countries.push(results[i]["Country"])
            tradeValues.push(results[i]["Trade Value"])

        }

        console.log('countries, populated:', countries)
        console.log('tradeValues, populated:', tradeValues)
    });

// console.log('results array', results)

