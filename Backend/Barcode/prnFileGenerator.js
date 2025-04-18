// // Node.js - prnFileGenerator.js
// const fs = require('fs');
// const path = require('path');

// function generatePRN(barcodeValue = "SK000001") {
//     const zpl = `
// ^XA
// ^FO50,50^A0N,50,50^FDBarcode:^FS
// ^FO50,120^BY2
// ^BCN,100,Y,N,N
// ^FD${barcodeValue}^FS
// ^FO50,240^A0N,30,30^FD${barcodeValue}^FS
// ^XZ
// `;

//     const outputPath = path.join(__dirname, `${barcodeValue}.prn`);
//     fs.writeFileSync(outputPath, zpl, 'utf8');
//     console.log(`✅ PRN file generated: ${outputPath}`);
// }

// generatePRN("SK000123"); // You can change this value dynamically


const fs = require('fs');
const path = require('path');

function generatePRN({ barcode = "SG0000001", model = "ABC-14A", date = "12.04" }) {
    const content = `
SIZE 42.5 mm, 20 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON
CLS
BARCODE 305,103,"39",70,0,180,1,3,"${barcode}"
CODEPAGE 1252
TEXT 262,25,"1",180,1,1,"${barcode}"
TEXT 305,139,"ROMAN.TTF",180,1,12,"${model}"
TEXT 95,139 ,"ROMAN.TTF",180,1,12,"${date}"
PRINT 1,1
`;

    const filePath = path.join(__dirname, `${barcode}.prn`);
    fs.writeFileSync(filePath, content.trim(), 'utf8');
    console.log(`✅ Label .prn file generated at: ${filePath}`);
}

// Example usage
generatePRN({
    barcode: "SG0000150",
    model: "XYZ-22B",
    date: "17.04"
});
