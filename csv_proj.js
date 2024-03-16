const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const results = [];

const directoryName = "/root/csv_proj/data/GLJ/Destinations-of-Silk-2022"
const fileName = "Destinations-of-Silk-2022.csv"
// Path to Excel file
const filePath = path.join(directoryName, fileName);

console.log("filepath", filePath)

//Global countries variable to be populated as we loop through
const countries = []

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // Output the data
        // console.log(results);
        const tradeValues = []

        for (let i = 0; i < results.length; i++) {
            let country = countries.filter((c) => {
                return c["name"] = results[i]["Country"]
            })
            if (country) {
                country = country[0]
            } else {
                let country = {
                    "name": results[i]["Country"],
                    "products": []
                }
                countries.push(country)
            }

            countries.push(results[i]["Country"])

            tradeValues.push(results[i]["Trade Value"])

        }
        //TODO review how to .map() this function instead as well


        console.log('countries, populated:', countries)
        console.log('tradeValues, populated:', tradeValues)
    });


//CSV target for write at the end
const newFilePath = "/root/csv_proj/data/aggregatedFigures1.csv"




