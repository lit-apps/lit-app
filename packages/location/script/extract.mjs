import fs from 'fs';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JSON file
const rawData = fs.readFileSync(path.resolve(__dirname, './tmp.json'));
const countriesData = JSON.parse(rawData);

// Extract countries and store them into an array
const countries = Object.values(countriesData).map(country => {
  return {
    name: country.label,
    code: country.ID_2
  };
});


// store the extracted data into a new JSON file
fs.writeFileSync(path.resolve(__dirname, './country.json'), JSON.stringify(countries, null, 2));

// Extract countries and store them into an array
const alpha3 = Object.values(countriesData)
.sort((a, b) => a.label.localeCompare(b.label))
.map(country => {
  return country.ID_2
});

console.log(alpha3);

// store the extracted data into a new JSON file
fs.writeFileSync(path.resolve(__dirname, './alpha3.json'), JSON.stringify(alpha3, null, 2));

// Extract countries and store them into an array
const countryContinent = Object.values(countriesData)
.sort((a, b) => a.label.localeCompare(b.label))
.map(country => {
  return [country.ID_2, country.ID_1,]
});

console.log(countryContinent);

// store the extracted data into a new JSON file
fs.writeFileSync(path.resolve(__dirname, './countryContinent.json'), JSON.stringify(countryContinent, null, 2));


// Extract countries and store them into an array
const en = Object.fromEntries(Object.values(countriesData)
  .sort((a, b) => a.label.localeCompare(b.label))
  .map(country => {
    return [country.ID_2, country.label]
  }));


console.log(en);

// store the extracted data into a new JSON file
fs.writeFileSync(path.resolve(__dirname, './en.json'), JSON.stringify(en, null, 2));