import React, { useState } from "react";
//import { pdfjs } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import "./ModalNCL.css";
import Tesseract from 'tesseract.js';
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
          console.log(pageText); // Check the text of each page
          extractedText += pageText + " ";
          console.log(extractedText) // Debug
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

// Scan Misc.Charges from the pdf, return one if only 1 value, add all if multiple lines
function sumOfMisc(str) {
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

const AddModal = ({ closeModal }) => {
  const editor = useUsername();
  
  const [ rows, setRows ] = useState({
    ship_name: '', voyage_num: '', start_date: '', end_date: '', revenue: '', plcc: '', dpa: '', plcc_dpa: '', reg_commission: '', vip_commission: '', effy_rev: '', editor: editor, vip_sales: '', food: '', beverages: '', 
    discounts: '', cc_fee: '', cash_adv: '', supplies: '', misc_charges: '', vat: '', medical_charges: '', printing: '', prize_voucher: '', status_paid: '', promo_food: '', requisition: ''
  });
  
  function convertDate(day, monthAbbrev, year) {
    // Array of month abbreviations for easy lookup; index + 1 gives the month number
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNumber = months.indexOf(monthAbbrev) + 1;
    const month = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    const fullYear = `20${year}`;
    return `${fullYear}-${month}-${day}`;
  }

  const handleFileChange = async (event) => {
    const file =  event.target.files[0];
    if (!file) return;

    if (file.type.includes("image" || "pdf")) {
      // If the file is an image or pdf, use Tesseract.js for OCR
      Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m),
      }).then(({ data: { text } }) => {
        // Process the text data as needed
        console.log(text);
      }).catch(error => {
        console.error('OCR error:', error);
      });
    } else if (file.type === "application/pdf") {
      // If the file is a PDF, use pdf.js as before
      try {
        const extractedData = await extractTextFromPdf(file);
        //console.log(extractedData);       // Debug
        function extractValue(regexPattern) {
          const match = extractedData.match(regexPattern);
          return match ? match[1] : '';
        }
  
        // Retrieve the last word from the first line as ShipName
        const ship_name = extractValue(/Ship Name: Norwegian (\w+)/);
        // Retrieve the last string from the second line as VoyageNum
        const voyage_num = extractValue(/Voyage #\. ([\d\s]+) Voyage Start/);
        // Retrieve the date from voyage_num
        const startDateMatch = extractValue(/Voyage Start: (\d{2})-(\w{3})-(\d{2})/);
        let start_date = "";
        if (startDateMatch) {
          start_date = convertDate(startDateMatch[1], startDateMatch[2], startDateMatch[3]);
        }
        // Assume convertDate is a function that converts DD-MMM-YY to MM-DD-YYYY format.
        const endDateMatch = extractValue(/Voyage End: (\d{2})-(\w{3})-(\d{2})/);
        let end_date = "";
        if (endDateMatch) {
          end_date = convertDate(endDateMatch[1], endDateMatch[2], endDateMatch[3]);
        }
        // Initialize the variables to store the data using regular expression
          const FineJewelry_GuestRev = extractValue();
          const FineJewelry_CrewRev = extractValue();
        const revenue = moneyFormat(FineJewelry_GuestRev + FineJewelry_CrewRev);
        // VIP Sales
        const vip_sales = moneyFormat(extractValue(/VIP Sales \$([\d,]+\.?\d*)/));
        // PLCC 
        const plcc = moneyFormat(extractValue(/Total Amount charged to PLCC System Account \$([\d,]+\.?\d*)/));
        // DPA
        const dpa = moneyFormat(extractValue(/Total Amount charged to DPA System Account \$([\d,]+\.?\d*)/));
        // PLCC + DPA
        const plcc_dpa = moneyFormat((plcc + dpa)); // Neg value but already converted in previous plcc and dpa 
        const vat = moneyFormat(extractValue());
        const reg_commission = moneyFormat((revenue * (0.36)), true); // 36%
        const vip_commission = moneyFormat((vip_sales * (0.2)), true); // 20%
        
        const food = moneyFormat(extractValue(/Crew Meals \$(\d+)/), true);
        const beverages = moneyFormat(extractValue(/Champagne Charges - FCR \(Fidelio\) \$(\d+\.\d{2})/), true);
        const cc_fee = moneyFormat(extractValue(/Credit Card Fees \$([\d,]+\.\d{2})/), true);
        const supplies = moneyFormat(extractValue(), true);
        const misc_charges = moneyFormat(sumOfMisc(extractedData), true);
        const cash_adv = moneyFormat(extractValue(/Cash Advances & Expenses Paid in Cash \*\*Max \$\d+\/crulse \$(\d+\.\d{2})/), true);
        const medical_charges = moneyFormat(extractValue(/Medical Charges - FCR \(Fidelio\) \$(\d+\.\d{2})/), true);
        const printing = moneyFormat(extractValue(/Printing Charges - Cashbook \(FCB\) \$(\d+\.\d{2})/), true);
        const prize_voucher = moneyFormat(extractValue(/Wheel of Fortune Jewelry Prize Voucher \(Due TO\) \(enter as positive, subtracted from Total - backup from WOF\) \$(\d+\.\d{2})/), true);
        const requisition = moneyFormat(extractValue());
        const promo_food = moneyFormat(extractValue());
        const discounts = extractValue(/Revenue Share Occupan Discount - Due to Effy \$([\d,]+\.\d{2})/);
        
        const effy_rev = revenue - ( food + beverages + cc_fee + misc_charges + cash_adv + medical_charges + printing + prize_voucher + requisition + promo_food + discounts);

        // Add more conditions here as necessary for other fields.
        setRows({...rows, ship_name, voyage_num, start_date, end_date, revenue, plcc, dpa, plcc_dpa, reg_commission, vip_commission, effy_rev, editor, vip_sales, food, beverages, 
                          discounts, cc_fee, cash_adv, supplies, misc_charges, vat, medical_charges, printing, prize_voucher, requisition, promo_food})
      }catch (error){
        console.error('Error parsing the PDF: ', error);
      }
    } else {
      alert("Unsupported file type.");
    }
  };

  const handleSubmit_Add = (event) => {
    const url = `http://localhost:3000/ncl_post`
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
      <div className="panel">
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
            <input className="inputTxt" type="text" placeholder=" " name="start_date" label="Start Date" onChange={(e) => setRows({ ...rows, start_date: e.target.value })} value={rows.start_date}/>
            <label className="floating-label">Start Date</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="end_date" label="End Date" onChange={(e) => setRows({ ...rows, end_date: e.target.value })} value={rows.end_date}/>
            <label className="floating-label">End Date</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="revenue" label="Revenue" onChange={(e) => setRows({ ...rows, revenue: e.target.value })} value={rows.revenue}/>
            <label className="floating-label">Revenue</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vip_sales" label="VIP Sales" onChange={(e) => setRows({ ...rows, vip_sales: e.target.value })} value={rows.vip_sales || null}/>
            <label className="floating-label">VIP Sales</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="plcc_dpa" label="PLCC & DPA" onChange={(e) => setRows({ ...rows, plcc_dpa: e.target.value })} readOnly value={rows.plcc_dpa || null}/>
            <label className="floating-label">PLCC & DPA</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="plcc" label="PLCC" onChange={(e) => setRows({ ...rows, plcc: e.target.value })} value={rows.plcc || null}/>
            <label className="floating-label">PLCC</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="dpa" label="DPA" onChange={(e) => setRows({ ...rows, dpa: e.target.value })} value={rows.dpa || null}/>
            <label className="floating-label">DPA</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vat" label="VAT" onChange={(e) => setRows({ ...rows, vat: e.target.value })} value={rows.vat || null}/>
            <label className="floating-label">VAT</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="reg_commission" label="Cruise Commission" onChange={(e) => setRows({ ...rows, reg_commission: e.target.value })} readOnly value={rows.reg_commission || null}/>
            <label className="floating-label">Cruise Commission</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vip_commission" label="VIP Commission" onChange={(e) => setRows({ ...rows, vip_commission: e.target.value })} readOnly value={rows.vip_commission || null}/>
            <label className="floating-label">VIP Commission</label>
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
            <input className="inputTxt" type="text" placeholder=" " name="food" label="Food" onChange={(e) => setRows({ ...rows, food: e.target.value })} value={rows.food || null}/>
            <label className="floating-label">Food</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="beverages" label="Beverages" onChange={(e) => setRows({ ...rows, beverages: e.target.value })} value={rows.beverages || null}/>
            <label className="floating-label">Beverages</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cc_fee" label="CC Fee" onChange={(e) => setRows({ ...rows, cc_fee: e.target.value })} value={rows.cc_fee || null}/>
            <label className="floating-label">CC Fee</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="supplies" label="Supplies" onChange={(e) => setRows({ ...rows, supplies: e.target.value })} value={rows.supplies || null}/>
            <label className="floating-label">Supplies</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="misc_charges" label="Misc. Charges" onChange={(e) => setRows({ ...rows, misc_charges: e.target.value })} value={rows.misc_charges || null}/>
            <label className="floating-label">Misc. Charges</label>
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
            <input className="inputTxt" type="text" placeholder=" " name="medical_charges" label="Medical Charges" onChange={(e) => setRows({ ...rows, medical_charges: e.target.value })} value={rows.medical_charges || null}/>
            <label className="floating-label">Medical Charges</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="printing" label="Printing" onChange={(e) => setRows({ ...rows, printing: e.target.value })} value={rows.printing || null}/>
            <label className="floating-label">Printing</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="prize_voucher" label="Prize Voucher" onChange={(e) => setRows({ ...rows, prize_voucher: e.target.value })} value={rows.prize_voucher || null}/>
            <label className="floating-label">Prize Voucher</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="effy_rev" label="Effy Revenue" onChange={(e) => setRows({ ...rows, effy_rev: e.target.value })} value={rows.effy_rev || null}/>
            <label className="floating-label">Effy Revenue</label>
          </div>
          <div className="txtInputGrp">
            <select className="inputSelect" onChange={(e) => setRows({ ...rows, status_paid: e.target.value })} value={rows.status_paid}>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            <label className="floating-label">Status</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="editor" label="Editor" value={rows.editor} readOnly/>
            <label className="floating-label">Editor</label>
          </div>
        </form>
        <div className="btns" onDrop={handleDrop} onDragOver={handleDragOver} >
          <input className="fileUpload" type="file" onChange={handleFileChange} accept=".pdf"/>
          <button className="submitBtn" onClick={handleSubmit_Add}>Submit</button>
        </div>
      </div>
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
                          parole_fee, vat, cash_paid, office_supp})
    // ... other code ...
  };

  // ... other code ...
}

*/