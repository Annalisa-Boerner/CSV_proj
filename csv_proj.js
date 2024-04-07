//file system package
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const results = [];

//cwd is current working directory
const parentDirectoryPath = `${process.cwd()}/data/GLJ/`;

const directoryName = `${process.cwd()}/data/GLJ/Destinations-of-Silk-2022`;
const fileName = "Destinations-of-Silk-2022.csv";

// Path to Excel file
const filePath = path.join(directoryName, fileName);

// console.log("filepath", filePath);

//Global countries variable to be populated as we loop through
const countries = [];
const fileList = [];

//loop through all of the directories
const getAllFiles = (parentDirectoryPath, checkForDirectory) => {
    fs.readdir(parentDirectoryPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(parentDirectoryPath, file.name);
            if (file.isDirectory() && checkForDirectory) {
                // console.log("Folder:", filePath);
                const csvFile = getAllFiles(filePath, false);
                //locate the csv file in the folder
            } else if (!checkForDirectory) {
                if (filePath.endsWith(".csv")) {
                    // console.log("File name:", filePath);
                    fileList.push(filePath);
                    // console.log("fileList line 38", fileList);
                }
            }
        });
    });
    return fileList;
};
getAllFiles(parentDirectoryPath, true);
console.log("fileList", fileList);

const readCsvFile = (filePath) => {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            // console.log(results);
            //Countries: [ {country: Kenya}, {country: USA} ]
        });
};
readCsvFile(filePath);
//CSV target for write at the end
const newFilePath = "/root/csv_proj/data/aggregatedFigures1.csv";
