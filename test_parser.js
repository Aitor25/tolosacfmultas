const fs = require('fs');

const rawCsv = `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,HILEROKOA,,,,,,,,,,,HILEROKOA,,BALOIAK,,,,,,,,,,,
,,,,,,,,,,,,,MULTAK,,,,,,,,,,,,,,,,,,,,,,,,,BALOIAK,,GUZTIRA
,,MULTAK,,,,,,,,,,,,,,ABUZTUA,IRAILA,URRIA,AZAROA,ABENDUA,URTARRILA,OTSAILA,MARTXOA,APIRILA,MAIATZA,,,,IRAILA,URRIA,AZAROA,ABENDUA,URTARRILA,OTSAILA,MARTXOA,APIRILA,MAIATZA,,,
,,Abuztua,Iraila,Urria,Azaroa,Abendua,Urtarrila,Otsaila,Martxoa,Apirila,Maiatza,,BAKOITZAK GUZTIRA,,,,,,,,,,,,,,BAKOITZAK GUZTIRA,,,,,,,,,,,BAKOITZAK GUZTIRA,,
,Aitor Garcia,-,-,5,-,7,-,15,-,45,-,,72,,,10,5,5,5,5,5,5,5,5,-,,50,,2,2,2,4,2,4,2,2,-,20,,142
,Julen Garcia,-,5,-,5,23,30,-,-,46,-,,109,,,5,5,5,5,5,5,5,5,5,-,,45,,-,-,-,-,-,2,2,2,-,6,,160
,Donaciones,544,-,-,2.5,2,-,20,-,-,-,,568.5,,,-,-,-,-,-,-,-,-,-,-,,0,,-,-,-,-,-,-,-,-,-,0,,568.5`;

const Papa = require('./node_modules/papaparse/papaparse.js'); // Assuming papaparse is installed, if not we'll just mock it.
// Wait, I can just split by newline and comma for testing
const rawData = rawCsv.split('\n').map(r => r.split(','));

function normalizeSheetData(rawData) {
  if (rawData.length > 0 && !Array.isArray(rawData[0]) && typeof rawData[0] === 'object') {
    return rawData;
  }
  
  if (rawData.length > 0 && Array.isArray(rawData[0])) {
     const isBasqueSheet = rawData.length > 2 && rawData[1].includes("HILEROKOA");
     
     if (isBasqueSheet) {
        const normalized = [];
        const basqueMonths = ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"];
        const cuotaMonths = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"]; 
        
        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length < 10) continue;
          
          const name = row[1] ? row[1].toString().trim() : "";
          if (!name || name === "HILEROKOA" || name === "MULTAK" || name.includes("Abuztua")) continue;
          
          const obj = { Nombre: name };
          
          basqueMonths.forEach((m, idx) => { obj[`Multa ${m}`] = row[2 + idx] || ""; });
          cuotaMonths.forEach((m, idx) => {
             obj[`Cuota ${m}`] = row[16 + idx] || "";
             obj[`Balon ${m}`] = row[29 + idx] || "";
          });
          
          normalized.push(obj);
        }
        return normalized;
     } else {
        const headers = rawData[0];
        const normalized = [];
        for (let i = 1; i < rawData.length; i++) {
           const obj = {};
           headers.forEach((h, idx) => { obj[h] = rawData[i][idx]; });
           normalized.push(obj);
        }
        return normalized;
     }
  }
  return rawData;
}

const n = normalizeSheetData(rawData);
console.log(JSON.stringify(n, null, 2));
