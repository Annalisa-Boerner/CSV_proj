    // Output the data
 const countryFunction = () => {   
    
    console.log("results before the loop", results);
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
//each country needs 

    console.log('countries, populated:', countries)
    console.log('tradeValues, populated:', tradeValues)
}