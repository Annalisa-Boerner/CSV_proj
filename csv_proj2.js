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

(async () => {
    await getAllFiles(parentDirectoryPath, true);
    const csvDataList = [];

    for (const filePath of fileList) {
        try {
            const csvData = await readCsvs(filePath);
            // console.log("csvData", csvData);
            csvDataList.push({ data: csvData, filePath: filePath });

            csvData.forEach((datum) => {
                countries.add({ Name: datum.Country, TradeValues: {} });
            });
        } catch (error) {
            console.error("Error reading CSV:", error);
        }
    }

    for (const csvData of csvDataList) {
        for (const country of countries) {
            //Get country csv data
            // console.log("csvData", csvData);
            const countryCsvData = csvData.data.filter((datum) => {
                return (datum.Country = country.Name);
            });
            const finalFileName = path.basename(csvData.filePath);
            if (countryCsvData) {
                country.TradeValues[finalFileName] =
                    countryCsvData[0]["Trade Value"];
            } else {
                country.TradeValues[finalFileName] = null;
            }
        }
    }
    console.log("countires line 66", countries);
})();

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
