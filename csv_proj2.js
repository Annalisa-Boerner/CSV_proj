const fs = require("fs").promises; // Import fs with promises
const fs2 = require("fs");
const csv = require("csv-parser");
const path = require("path");

const parentDirectoryPath = `${process.cwd()}/data/GLJ/`;
const countries = [];
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

(async () => {
    await getAllFiles(parentDirectoryPath, true);
    for (const filePath of fileList) {
        try {
            const csvData = await readCsvs(filePath);
            console.log("csvData", csvData);
        } catch (error) {
            console.error("Error reading CSV:", error);
        }
    }
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
