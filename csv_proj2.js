const fs = require("fs").promises; // Import fs with promises
const fs2 = require("fs");
const csv = require("csv-parser");
const path = require("path");

const parentDirectoryPath = `${process.cwd()}/data/GLJ/`;
const fileList = [];

const getAllFiles = async (parentDirectoryPath, checkForDirectory) => {
    try {
        const files = await fs.readdir(parentDirectoryPath, {
            withFileTypes: true,
        });

        for (const file of files) {
            const filePath = path.join(parentDirectoryPath, file.name);
            if (file.isDirectory() && checkForDirectory) {
                await getAllFiles(filePath, false);
            } else if (!checkForDirectory) {
                if (filePath.endsWith(".csv")) {
                    fileList.push(filePath);
                }
            }
        }
        //        console.log("fileList inside function", fileList);
        return fileList;
    } catch (err) {
        console.error("Error reading directory:", err);
    }
};

//adds to a list but eliminates duplicates
const countries = new Set();

//function to read files and return the data in a useable format
const readCsvs = (filePath) => {
    return new Promise((resolve, reject) => {
        let currentResults = [];
        fs2.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => currentResults.push(data))
            .on("end", () => {
                resolve(currentResults);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};

(async () => {
    await getAllFiles(parentDirectoryPath, true);
    const csvContentsAndFilenames = [];

    //loop through csv files; for each, append the names of the countires within to the countries list (set prevents duplicates)
    for (const filePath of fileList) {
        try {
            //storing csv data for later
            const csvFileData = await readCsvs(filePath);

            // console.log("csvData", csvData);
            csvContentsAndFilenames.push({
                data: csvFileData,
                filePath: filePath,
            });

            //extract the country column from the csv file
            csvFileData.forEach((entry) => {
                countries.add({ Name: entry.Country, TradeValues: {} });
            });
        } catch (error) {
            console.error("Error reading CSV:", error);
        }
    }
    // console.log("csvDataList:", csvDataList[0]);

    //loop through each file with its data
    for (const csvFileDataPlusName of csvContentsAndFilenames) {
        //inside a file, loop through the countries to build the trade values object based on the instance of the country happening in the file; make sure each country inherits each file name so the keys are the same for every country
        //record null if it doesn't exist so that each country has an entry in each file (good for Excel columns)
        for (const country of countries) {
            //Get individual country's row in the csv data: for  Kenya, loop through and find the row in this file that includes Kenya; set it to either trade values or null and return

            const countryCsvData = csvFileDataPlusName.data.filter((entry) => {
                return entry.Country == country.Name;
            });
            const finalFileName = path.basename(csvFileDataPlusName.filePath);
            if (countryCsvData.length > 0) {
                country.TradeValues[finalFileName] =
                    countryCsvData[0]["Trade Value"];
            } else {
                country.TradeValues[finalFileName] = null;
            }
        }
    }
    // console.log("countries line 96", countries);
    const countryArray = [...countries];
    const jsonCountries = JSON.stringify(countryArray, null, 2);
    // console.log("jsonCountries line 98", jsonCountries);
    writeDataToFile(jsonCountries, "countries.json");

    convertJsonToCsv(countryArray);
})();

//Write to json file
const writeDataToFile = (jsonCountries, fileName) => {
    // console.log("jsonCountries", jsonCountries);
    fs2.writeFile(fileName, jsonCountries, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("file successfully created");
        }
    });
};

const convertJsonToCsv = (jsonArray) => {
    const rows = [];

    //pull off the keys from the json file to create the header row
    const fileNameHeaders = Object.keys(jsonArray[0]["TradeValues"]);
    const headers = ["Name"];
    conciseFileNameHeaders = fileNameHeaders.map((name) => {
        return name.replace("Destinations-of-", "").replace("-2022.csv", "");
    });
    console.log("concise", conciseFileNameHeaders);
    let finalHeaders = headers.concat(conciseFileNameHeaders);

    rows.push(finalHeaders.join(","));
    //loop through json array; build each row for each country
    for (const country of jsonArray) {
        let countryRow = [];

        countryRow.push(country.Name);
        for (const fileNameHeader of fileNameHeaders) {
            let countryTradeValue = country["TradeValues"][fileNameHeader];
            countryRow.push(countryTradeValue);
        }
        rows.push(countryRow.join(","));
    }
    let countryCsv = rows.join("\n");
    // console.log("countryCsv", countryCsv);
    writeDataToFile(countryCsv, "countries.csv");
};
