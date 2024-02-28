import React, { useState } from "react";
//import { pdfjs } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import "./Modal.css";
import { useUsername } from "../useUsername";

// Const function to extract text from the uploaded pdf file
const extractTextFromPdf = async (file) => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await getDocument(typedArray).promise;
        let extractedText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          //console.log(pageText); // Check the text of each page
          extractedText += pageText + " ";
          //console.log(extractedText) // Debug
        }
        resolve(extractedText);
      } catch (error) {
        reject(alert(error));
      }
    };

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

// Scan Exec.Folio from the pdf, return one if only 1 value, add all if multiple lines
function sumOfExecFolio(str) {
  // Using two simpler regex patterns for different PDF types
  const regexPattern1 = /LESS EXECUTIVE FOLIO CHARGES[^()]*\(([\d,.]+)\)/g;
  const regexPattern2 = /LESS EXECUTIVEFOLIO CHARGES.*?\$.*?\$.*?\$(\d{1,3}(?:,\d{3})*\.\d{2})/g;

  let total = 0;

  // Function to process matches for a given regex
  const processMatches = (regex) => {
    let match;
    while ((match = regex.exec(str)) !== null) {
      total += parseFloat(match[1].replace(/,/g, ""));
    }
  };

  // Process matches for each pattern
  processMatches(regexPattern1);
  processMatches(regexPattern2);

  return total === 0 ? "" : total.toFixed(2);
}

// Date trimming (Accept 2 type of voyage numbers and convert to date)
function trimDate(inputStr) {
  if (inputStr.length === 13) {
    // Assuming the format is two letters followed by YYYYMMDD and three additional characters
    // Extract the year, month, and day using substring
    let year = inputStr.substring(2, 6);
    let month = inputStr.substring(6, 8);
    let day = inputStr.substring(8, 10);

    // Format and return the date
    return year + "/" + month + "/" + day;
  } else if (inputStr.length === 10) {
    // Assuming the format is two letters followed by MMDD20YY
    // Extract the year, month, and day using substring
    let month = inputStr.substring(4, 6);
    let day = inputStr.substring(6, 8);
    let year = "20" + inputStr.substring(8, 10);

    // Format and return the date
    return year + "/" + month + "/" + day;
  } else {
    return "Invalid input length";
  }
}

function moneyFormat(value, isNegative = false) {
  if (value === "0.00" || value === "0"){
    return ""; 
  }
  if (value && !isNaN(parseFloat(value.replace(/,/g, "")))) {
    // Remove commas for thousands and convert to float
    let number = parseFloat(value.replace(/,/g, ""));
    // If the value is supposed to be negative, multiply by -1
    if (isNegative) {
      number *= -1;
    }
    // Return the number as a string formatted to two decimal places
    return number.toFixed(2);
  } else {
    return null;
  }
}

const shipNameMap = {
  BR:	"BREEZE",
  CB:	"CELEBRATION",
  CQ:	"CONQUEST",
  DR:	"DREAM",
  EC:	"ECSTASY",
  EL:	"ELATION",
  FD:	"FREEDOM",
  GL:	"GLORY",
  HZ:	"HORIZON",
  JB:	"JUBILEE",
  LE:	"LEGEND",
  LI:	"LIBERTY",
  LM:	"LUMINOSA",
  MC:	"MAGIC",
  MD:	"MARDI GRAS",
  MI:	"MIRACLE",
  PO:	"PANORAMA",
  PA:	"PARADISE",
  PR:	"PRIDE",
  RD:	"RADIANCE",
  SE:	"SENSATION",
  SP:	"SPIRIT",
  SL:	"SPLENDOR",
  SN:	"SUNRISE",
  SH:	"SUNSHINE",
  VA:	"VALOR",
  VX:	"VENEZIA",
  VS:	"VISTA",
};

// Function to extract the ship name based on the voyage number
function getShipNameFromVoyageNum(voyageNum) {
  const abbreviation = voyageNum.substring(0, 2); 
  return shipNameMap[abbreviation] || "";
}

const AddModal = ({ closeModal }) => {
  const editor = useUsername();
  
  const [ rows, setRows ] = useState({
    ship_name: '', voyage_num: '', date: '', effy_share: '', editor: editor, rev_ss: '',
    rev_cc: '', ss_fee: '', cc_fee: '', eu_vat: '', discounts: '', carnival_share: '', exec_folio: '',
    meal_charge: '', office_supp: '', cash_adv: '', cash_paid: '', parole_fee: '', status_paid: "Unpaid", dt_entry: ''
  });
  
  const handleFileChange = async (event) => {
    const file =  event.target.files[0];
    if (!file) return;
    try{
      const extractedData = await extractTextFromPdf(file);
      //console.log(extractedData);       // Debug
      function extractValue(regexPattern) {
        const match = extractedData.match(regexPattern);
        return match ? match[1] : '';
      }
      // Retrieve the last word from the first line as ShipName
      //const ship_name = extractValue(/SHIP: CARNIVAL (\w+)/) || extractValue(/VOYAGE SETTLEMENT - CARNIVAL (\w+)/);
      // Retrieve the last string from the second line as VoyageNum
      const voyage_num = extractValue(/VOYAGE: (\w+)/);
      // Retrieve the ship_name from the first 2 letters of Voyage_num
      const ship_name = getShipNameFromVoyageNum(voyage_num);
      // Retrieve the date from voyage_num
      const date = trimDate(voyage_num);
      // Initialize the variables to store the data using regular expression
      const effy_share = moneyFormat(extractValue(/FROM\) EFFY\s+(\d+,\d+\.\d+)/)) || moneyFormat(extractValue(/Total\s*\$\s*([\d,]+\.\d{2})\s*PAYMENT REQUEST/));
      const rev_ss = moneyFormat(extractValue(/PLUS SAIL AND SIGN REVENUE\s+(\d+,\d+\.\d+)/)) || moneyFormat(extractValue(/REVENUE\s+-\s+SAIL\s+AND\s+SIGN.*?\$\d{1,3}(?:,\d{3})*\.\d{2}\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$(\d{1,3}(?:,\d{3})*\.\d{2})/)) ;
      const rev_cc = moneyFormat(extractValue(/PLUS DIRECT CC REVENUE\s+(\d+,\d+\.\d+)/)) || moneyFormat(extractValue(/REVENUE\s+-\s+DIRECT\s+CC.*?\$\d{1,3}(?:,\d{3})*\.\d{2}\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$(\d{1,3}(?:,\d{3})*\.\d{2})/));
      const carnival_share = moneyFormat(extractValue(/LESS CCL SHARE OF REVENUE\s+\((\d+,\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS CCL SHARE OF REVENUE\s+\$([\d,]+\.\d{2})/), true);
      const exec_folio = moneyFormat(sumOfExecFolio(extractedData), true);
      const ss_fee = moneyFormat(extractValue(/LESS SAIL AND SIGN CC PROCESSING FEE.*?\((\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS SAIL AND SIGN CC PROCESSING FEE - SAIL\s+AND SIGN CC.*?\$(\d{1,3}(?:,\d{3})*\.\d{2})/), true);
      const cc_fee = moneyFormat(extractValue(/LESS DIRECT CREDIT CARD PROCESSING FEE.*?\((\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS CC PROCESSING FEE - DIRECT\s+CC.*?\$(\d{1,3}(?:,\d{3})*\.\d{2})/), true);
      const discounts = moneyFormat(extractValue(/PLUS CCL CREW SALES DISCOUNT.*?\((\d+\.\d+)\)/));
      const meal_charge = moneyFormat(extractValue(/LESS MEAL CHARGE.*?\((\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS MEAL CHARGE\s*\$\d+\.\d+\s*\(Rate\)\s*X\s*\d+\s*\(Qty\)\s*\$(\d+\.\d+)/), true);
      const office_supp = moneyFormat(extractValue(/LESS OFFICE SUPPLIES.*?\((\d+,\d+\.\d+)\)/), true);
      const eu_vat = moneyFormat(extractValue(/LESS EU VAT.*?\((\d+,\d+\.\d+)\)/), true);
      const parole_fee = moneyFormat(extractValue(/LESS PAROLE FEE.*?\((\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS CREW PAROLE CHARGE\s+\d+% of \$\d+\s+\$(\d+\.?\d+)/), true);
      const cash_adv = moneyFormat(extractValue(/LESS CASH VISA.*?\((\d+,\d+\.\d+)\)/), true) || moneyFormat(extractValue(/LESS CASH ADVANCEFOR PAYROLL[^]*?\$\d+\.?\d*\s+\$(\d{1,3}(?:,\d{3})*\.\d{2})/), true);
      const cash_paid = moneyFormat(extractValue(/LESS CASH PAID ON BOARD.*?\((\d+,\d+\.\d+)\)/), true);
      // Add more conditions here as necessary for other fields.
      setRows({...rows, ship_name, voyage_num, date, effy_share, editor, rev_ss, rev_cc, 
                              discounts, carnival_share, exec_folio, ss_fee, cc_fee, meal_charge, cash_adv, 
                              parole_fee, eu_vat, cash_paid, office_supp})
    }catch (error){
      console.error('Error parsing the PDF: ', error);
    }
  };

  const handleSubmit_Add = (event) => {
    const url = `http://localhost:3000/ccl_post`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    })
      .then(response => response.json())
      .then((data) => {
        if (!data.success) {
          alert(data.alert);
        } else {
          closeModal();
          alert("Data updated successfully");
        }
      })
      .catch((error) => {
        // If the error has a message property, it's a JSON error from the server
        alert(`Error: ${error.message || "Something went wrong"}`);
      });
  }

  // Pdf drag&drop
  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      await handleFileChange({ target: { files: [file] } });
    }
  };

  // Pdf Drag
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow for drop
  };

  // Return ReactJS format input text
    return (
      <>
        <form className="inputForm">
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="ship_name" label="Ship Name" onChange={(e) => setRows({ ...rows, ship_name: e.target.value })} value={rows.ship_name}/>
            <label className="floating-label">Ship Name</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="voyage_num" label="Voyage #" onChange={(e) => setRows({ ...rows, voyage_num: e.target.value })} value={rows.voyage_num}/>
            <label className="floating-label">Voyage #</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="date" label="Date (yyyy/mm/dd)" onChange={(e) => setRows({ ...rows, date: e.target.value })} value={rows.date}/>
            <label className="floating-label">Date (yyyy/mm/dd)</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="effy_share" label="Effy Share" onChange={(e) => setRows({ ...rows, effy_share: e.target.value })} value={rows.effy_share}/>
            <label className="floating-label">Effy Share</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="editor" label="Editor" value={rows.editor} readOnly/>
            <label className="floating-label">Editor</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="rev_ss" label="Revenue S&S" onChange={(e) => setRows({ ...rows, rev_ss: e.target.value })} value={rows.rev_ss || null}/>
            <label className="floating-label">Revenue Sail & Sign</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="rev_cc" label="Revenue CC" onChange={(e) => setRows({ ...rows, rev_cc: e.target.value })} value={rows.rev_cc || null}/>
            <label className="floating-label">Revenue Direct CC</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="ss_fee" label="S&S Fee" onChange={(e) => setRows({ ...rows, ss_fee: e.target.value })} value={rows.ss_fee || null}/>
            <label className="floating-label">Sail & Sign Proc. Fee</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cc_fee" label="CC Fee" onChange={(e) => setRows({ ...rows, cc_fee: e.target.value })} value={rows.cc_fee || null}/>
            <label className="floating-label">CC Proc. Fee</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="eu_vat" label="EU VAT" onChange={(e) => setRows({ ...rows, eu_vat: e.target.value })} value={rows.eu_vat || null}/>
            <label className="floating-label">EU VAT</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="discounts" label="Discounts" onChange={(e) => setRows({ ...rows, discounts: e.target.value })} value={rows.discounts || null}/>
            <label className="floating-label">Discounts</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="carnival_share" label="Carnival Share" onChange={(e) => setRows({ ...rows, carnival_share: e.target.value })} value={rows.carnival_share || null}/>
            <label className="floating-label">Carnival Share</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="exec_folio" label="Exec. Folio" onChange={(e) => setRows({ ...rows, exec_folio: e.target.value })} value={rows.exec_folio || null}/>
            <label className="floating-label">Exec. Folio</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="meal_charge" label="Meal Charge" onChange={(e) => setRows({ ...rows, meal_charge: e.target.value })} value={rows.meal_charge || null}/>
            <label className="floating-label">Meal Charge</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="office_supp" label="Office Supplies" onChange={(e) => setRows({ ...rows, office_supp: e.target.value })} value={rows.office_supp || null}/>
            <label className="floating-label">Office Supplies</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cash_paid" label="Cash Paid Onboard" onChange={(e) => setRows({ ...rows, cash_paid: e.target.value })} value={rows.cash_paid || null}/>
            <label className="floating-label">Cash Paid Onboard</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cash_adv" label="Cash Advance" onChange={(e) => setRows({ ...rows, cash_adv: e.target.value })} value={rows.cash_adv || null}/>
            <label className="floating-label">Cash Advance</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="parole_fee" label="Parole Fee" onChange={(e) => setRows({ ...rows, parole_fee: e.target.value })} value={rows.parole_fee || null}/>
            <label className="floating-label">Parole Fee</label>
          </div>
          <div className="txtInputGrp">
            <select className="inputSelect" onChange={(e) => setRows({ ...rows, status_paid: e.target.value })} value={rows.status_paid}>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            <label className="floating-label">Status</label>
          </div>
        </form>
        <div className="btns" onDrop={handleDrop} onDragOver={handleDragOver} >
          <input className="fileUpload" type="file" onChange={handleFileChange} accept=".pdf"/>
          <button className="submitBtn" onClick={handleSubmit_Add}>Submit</button>
        </div>
      </>
    );
}
export default AddModal;


// Future Optimization 
/*
  function extractAndFormatValue(extractedData, patterns, isNegative = false) {
  for (const pattern of patterns) {
    const match = extractedData.match(pattern);
    if (match && match[1]) {
      return moneyFormat(match[1], isNegative);
    }
  }
  return null;
}

const AddModal = ({ closeModal }) => {
  // ... other code ...

  const handleFileChange = async (event) => {
    // ... other code ...

    // Define patterns for each field
    const patterns = {
      effy_share: [/FROM\) EFFY\s+(\d+,\d+\.\d+)/, /Total\s*\$\s*([\d,]+\.\d{2})\s*PAYMENT REQUEST/],
      rev_ss: [/PLUS SAIL AND SIGN REVENUE\s+(\d+,\d+\.\d+)/, /REVENUE\s+-\s+SAIL\s+AND\s+SIGN.*?\$\d{1,3}(?:,\d{3})*\.\d{2}\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$0\.00\s+\$(\d{1,3}(?:,\d{3})*\.\d{2})/],
      // ... other patterns ...
    };

    // Extract and format values
    const effy_share = extractAndFormatValue(extractedData, patterns.effy_share);
    const rev_ss = extractAndFormatValue(extractedData, patterns.rev_ss);
    const rev_cc = extractAndFormatValue(extractedData, patterns.rev_cc);
    const carnival_share = extractAndFormatValue(extractedData, patterns.carnival_share, true);
    const exec_folio = moneyFormat(sumOfExecFolio(extractedData), true);
    const ss_fee = extractAndFormatValue(extractedData, patterns.ss_fee, true);
    // ... other fields ...

    setRows({...rows, ship_name, voyage_num, date, effy_share, editor, rev_ss, rev_cc, 
                          discounts, carnival_share, exec_folio, ss_fee, cc_fee, meal_charge, cash_adv, 
                          parole_fee, eu_vat, cash_paid, office_supp})
    // ... other code ...
  };

  // ... other code ...
}

*/