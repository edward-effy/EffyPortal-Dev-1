import React, { useState } from "react";
//import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import { pdfjs } from "pdfjs-dist/webpack";
import "pdfjs-dist/build/pdf.worker.entry";
import "./ModalNCL.css";
import Tesseract from 'tesseract.js';
import { useUsername } from "../useUsername";
import InfoIcon from '@mui/icons-material/Info';
import moment from "moment";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", color: "white", marginTop: "20px", width: "100.5%", zIndex: "2"}}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
//The value of the progress indicator for the determinate and buffer variants. Value between 0 and 100.
  value: PropTypes.number.isRequired,
};

function moneyFormat(value, isNegative = false) {
  value = String(value);
  if (value === "0.00" || value === "0"){
    return ""; 
  }
  // Remove commas for thousands and convert to float
  let number = parseFloat(value.replace(/,/g, ""));
  // Check if the conversion succeeded, if not return an empty string
  if (isNaN(number)) {
    return "";
  }
  // If the value is supposed to be negative, multiply by -1
  if (isNegative) {
    number *= -1;
  }
  // Return the number as a string formatted to two decimal places
  return number.toFixed(2);
}
// Scan Misc.Charges from the pdf, return one if only 1 value, add all if multiple lines
function sumOfMisc(str) {
  // Using two simpler regex patterns for different PDF types
  const miscCharge1 = /Miscellaneous Charges - FCR \(Fidelio\) \(list in Comments below\) \$([\d,]+\.\d{2})/g;
  const miscCharge2 = /Miscellaneous Charges - Cashbook \(FCB\) \(provide signed backup and vouchers\) \$([\d,]+\.\d{2})/g;
  let total = 0;
  // Function to process matches for a given regex
  const processMatches = (regex) => {
    const matches = str.matchAll(regex);
    for (const match of matches) {
      total += parseFloat(match[1].replace(/,/g, ""));
    }
  };
  // Process matches for each pattern 
  processMatches(miscCharge1);
  processMatches(miscCharge2);
  return total === 0 ? "" : total.toFixed(2);
};

function sumOfReq(str) {
  // Using two simpler regex patterns for different PDF types
  const req1 = /Requisitions from Hotel Stores - MXP. *?\$([\d,]+\.\d{2})/g;
  const req2 = /Requisitions - Direct Expense \$([\d,]+\.\d{2})/g;
  let total = 0;
  // Function to process matches for a given regex
  const processMatches = (regex) => {
    const matches = str.matchAll(regex);
    for (const match of matches) {
      total += parseFloat(match[1].replace(/,/g, ""));
    }
  };
  // Process matches for each pattern
  processMatches(req1);
  processMatches(req2);
  return total === 0 ? "" : total.toFixed(2);
};

function sumOfRev(str) {
  const regexPatterns = [
    /GUEST REVENUE[^]*?Fine Jewelry.*?\$([\d,]+\.\d{2})/g,
    /GUEST REVENUE[^]*?Loose Diamonds.*?\$([\d,]+\.\d{2})/g,
    /CREW REVENUE[^]*?Fine Jewelry.*?\$([\d,]+\.\d{2})/g,
    /CREW REVENUE[^]*?Loose Diamonds.*?\$([\d,]+\.\d{2})/g
  ];

  let total = 0;
  regexPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(str)) !== null) {
      // Remove commas and convert to float
      total += parseFloat(match[1].replace(/,/g, ''));
    }
  });
  return total === 0 ? "" : total.toFixed(2);
};

function extractVoyageNum(str) {
  str = String(str);
  const regexPattern = /Voyage #.\s*(\d+)\s+Voyage Start/;
  let voyageNum = "";
  const match = str.match(regexPattern);
  if (match && match[1]) {
    voyageNum = match[1].replace(/\s+/g, '').replace(/^0+/, '');      // Replace spaces and remove leading zeros
  }
  return voyageNum; // Ensure the function returns a value even if no match is found
}

const AddModal = (props) => {
  const editor = useUsername();
  const [ rows, setRows ] = useState({
    voyage_num: '', ship_name: '', start_date: '', end_date: '', revenue: '', plcc: '', dpa: '', plcc_dpa: '', reg_commission: '', vip_commission: '', effy_rev: '', editor: editor, vip_sales: '', food: '', beverages: '', 
    discounts: '', cc_fee: '', cash_adv: '', supplies: '', misc_charges: '', vat: '', medical_charges: '', printing: '', prize_voucher: '', status_paid: 'Unpaid', promo_food: '', requisition: ''
  });
  const [progress, setProgress] = React.useState(0);
  const [formKey, setFormKey] = useState(0)
  const initFormState = {voyage_num: '', ship_name: '', start_date: '', end_date: '', revenue: '', plcc: '', dpa: '', plcc_dpa: '', reg_commission: '', vip_commission: '', effy_rev: '', editor: editor, vip_sales: '', food: '', beverages: '', 
  discounts: '', cc_fee: '', cash_adv: '', supplies: '', misc_charges: '', vat: '', medical_charges: '', printing: '', prize_voucher: '', status_paid: 'Unpaid', promo_food: '', requisition: ''
  };

  const resetFrom = () => {
    setRows(initFormState);
    setFormKey(prevKey => prevKey + 1);
  }

  function convertDate(ocrText, dateType) {
    // Define regex patterns to extract the specific date from the ocrText
    const datePattern = dateType === 'start'
      ? /Voyage Start: (\d{2})-(\w{3})-(\d{2})/
      : /Voyage End: (\d{2})-(\w{3})-(\d{2})/;
    // Extract the date from ocrText
    const dateMatch = ocrText.match(datePattern);
    // If a match is found, format and return the date, otherwise return 'Invalid date'
    if (dateMatch && dateMatch.length >= 4) {
      // Extract the day, month abbreviation, and year from the match
      const day = dateMatch[1];
      const monthAbbrev = dateMatch[2];
      const year = dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3];
      // Construct the date string and format it using moment
      const dateString = `${day}-${monthAbbrev}-${year}`;
      return moment(dateString, 'DD-MMM-YY').format('YYYY-MM-DD');
    } else {
      return 'Invalid date';
    }
  }

  // Pdf drag&drop
  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Check if the file type is PDF, JPG, or JPEG
      if (file.type === 'application/pdf' || file.type === 'application/jpeg' || file.type === 'application/jpg') {
        await handleFileChange({ target: { files: [file] } });
      } else {
        console.error('Unsupported file type. Please upload a PDF, JPG, or JPEG file.');
      }
    }
  };

  // Pdf Drag
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow for drop
  };

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      reader.readAsDataURL(file);
    });
  };
  
  const convertPdfToImages = async (pdfFile) => {
    const images = [];
    const data = await readFileData(pdfFile);
    const pdf = await pdfjs.getDocument(data).promise;
    const canvas = document.createElement("canvas");
  
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 2 }); // Consider adjusting scale as needed
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas.toDataURL()); // Use push instead of append
    }
  
    return images;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (file.type.includes("image")) {
      // If the file is an image, use Tesseract.js for OCR
      processImageFile(file);
    } else if (file.type === "application/pdf") {
      //If the file is a PDF, convert to images and then use Tesseract.js for OCR
      convertPdfToImages(file).then(images => {
        images.forEach(image => {
          processImageFile(image);
        });
      });
    } else {
      alert("Unsupported file type.");
    }
  };

  const processImageFile = (imageFile) => {
    setProgress(10);
    setProgress(30);
    Tesseract.recognize(imageFile, 'eng', {
      logger: m => console.log(m),
    }).then(({ data: { text: ocrText } }) => {
      console.log(ocrText);
      try {
        function extractValue(regexPattern) {
          if (typeof ocrText !== 'string') {
            console.error('ocrText is not a string:', ocrText);
            return '';
          }
          const match = ocrText.match(regexPattern);
          // Return with removed spaceses 
          return match ? match[1] : '';
        }
        // Retrieve the last word from the first line as ShipName
        const ship_name = extractValue(/Norwegian (\w+)/);
        // Retrieve the last string from the second line as VoyageNum
        const voyage_num = extractVoyageNum(ocrText);
        // Retrieve the date
        const start_date = convertDate(ocrText, 'start');
        const end_date = convertDate(ocrText, 'end');
        // Initialize the variables to store the data using regular expression
        const revenue = moneyFormat(sumOfRev(ocrText));
        // Net Share Amount
        //const netShare = extractValue(/Revenue.*?\$(\d{1,3}(?:,\d{3})*\.\d{2})\s+Total/) || extractValue(/\$(\d{1,3}(?:,\d{3})*\.\d{2})\s+Total Amount/);
        // VIP Sales
        const vip_sales = moneyFormat(extractValue(/VIP Sales \$[\d,]+\.\d{2}\s+\$[\d,]*\.\d{2}\s+\$(\d{1,3}(?:,\d{3})*\.\d{2})/));
        // PLCC 
        const plcc = 0 || moneyFormat(extractValue(/Total Amount charged to PLCC System Account \$([\d,]+\.\d{2})/));
        // DPA
        const dpa = 0 || moneyFormat(extractValue(/Total Amount charged to DPA System Account \$([\d,]+\.\d{2})/));
        // PLCC + DPA
        const plcc_dpa = plcc + dpa; // Neg value but already converted in previous plcc and dpa 
        const vat = moneyFormat(extractValue(/Total Tax \$([\d,]+\.\d{2})/));
        const reg_commission = moneyFormat((revenue * 0.36), true); // 36% of Regular Sales
        const vip_commission = moneyFormat((vip_sales * 0.2), true); // 20% of VIP Sales
        const food = moneyFormat(extractValue(/Crew Meals \$([\d,]+\.\d{2})/), true);
        const beverages = moneyFormat(extractValue(/Champagne Charges - FCR \(Fidelio\) \$([\d,]+\.\d{2})/), true);
        const cc_fee = moneyFormat(extractValue(/Credit Card Fees \$([\d,]+\.\d{2})/), true);
        const supplies = moneyFormat(extractValue(), true);
        setProgress(50);
        const misc_charges = moneyFormat(sumOfMisc(ocrText), true);
        const cash_adv = moneyFormat(extractValue(/Cash Advances & Expenses Paid in Cash \*\*Max \$\d+\/crulse \$([\d,]+\.\d{2})/), true);
        const medical_charges = moneyFormat(extractValue(/Medical Charges - FCR \(Fidelio\) \$([\d,]+\.\d{2})/), true);
        const printing = moneyFormat(extractValue(/Printing Charges - Cashbook \(FCB\) \$([\d,]+\.\d{2})/), true);
        const prize_voucher = moneyFormat(extractValue(/Wheel of Fortune Jewelry Prize Voucher \(Due TO\) \(enter as positive, subtracted from Total - backup from WOF\) \$([\d,]+\.\d{2})/), true);
        const requisition = moneyFormat(sumOfReq(ocrText), true);
        const promo_food = null;
        const discounts = extractValue(/Discount - Due to Effy \$([\d,]+\.\d{2})/);
        //console.log("Discounts: " + discounts)
        //const effyRev_regex = moneyFormat(extractValue(/Effy: \$([\d,]+\.\d{2})/)) || moneyFormat(extractValue(/Net Due to Effy: ([\d,]+\.\d{2})/));
        //const allExpenses = food + beverages + cc_fee + misc_charges + cash_adv + medical_charges + printing + requisition + promo_food;
        //const effy_rev = netShare - (plcc_dpa + allExpenses) + (discounts + prize_voucher);
        const effy_rev = moneyFormat(extractValue(/Effy: \$([\d,]+\.\d{2})/)) || moneyFormat(extractValue(/Net Due to Effy: ([\d,]+\.\d{2})/));
        setRows({...rows, voyage_num, ship_name, start_date, end_date, revenue, plcc, dpa, plcc_dpa, reg_commission, vip_commission, vip_sales, food, beverages, 
                          discounts, cc_fee, cash_adv, supplies, misc_charges, vat, medical_charges, printing, prize_voucher, effy_rev, editor, requisition, promo_food})
        setProgress(70);
        setProgress(100);
      }catch (error){
        console.error('Error parsing the attached file: ', error);
        setProgress(0);
      }
    }).catch(error => {
      console.error('Tesseract OCR error:', error);
      setProgress(0);
    });
  };
  //console.log("JSON Format:\n" + JSON.stringify(rows, null));
  // Backend Connection
  const handleSubmit_ncl = (event) => {
    fetch(`http://localhost:3000/ncl_post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rows),
    })
    .then(response => response.json())
    .then((data) => {
        alert(data.alert);
        props.closeModal();
        // Reset the form by setting the state back to its initial value   
        //resetFrom();
        setProgress(0); 
      })
    .catch((error, data) => {
      // If the error has a message property, it's a JSON error from the server
      //alert(data.alert); 
      alert(`Error: ${error.message || "Something went wrong"}`);
      resetFrom();
      setProgress(0);
    });
  }

  // Return ReactJS format input text
    return (
      <>
        <form className="inputForm_ncl" key={formKey}>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="voyage_num" label="Voyage #" onChange={(e) => setRows({ ...rows, voyage_num: e.target.value })} value={rows.voyage_num}/>
            <label className="floating-label">Voyage #</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="ship_name" label="Ship Name" onChange={(e) => setRows({ ...rows, ship_name: e.target.value })} value={rows.ship_name}/>
            <label className="floating-label">Ship Name</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="start_date" label="Start Date" onChange={(e) => setRows({ ...rows, start_date: e.target.value })} value={rows.start_date}/>
            <label className="floating-label">Start Date(yyyy/mm/dd)</label>
          </div>
          <div className="txtInputGrp">
            <input className="inputTxt" type="text" placeholder=" " name="end_date" label="End Date" onChange={(e) => setRows({ ...rows, end_date: e.target.value })} value={rows.end_date}/>
            <label className="floating-label">End Date(yyyy/mm/dd)</label>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="revenue" label="Revenue" onChange={(e) => setRows({ ...rows, revenue: e.target.value })} value={rows.revenue}/>
            <label className="floating-label">Revenue</label>
            <i title="Total Net Revenue"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vip_sales" label="VIP Sales" onChange={(e) => setRows({ ...rows, vip_sales: e.target.value })} value={rows.vip_sales || null}/>
            <label className="floating-label">VIP Sales</label>
            <i title="VIP Sales"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="plcc_dpa" label="PLCC & DPA" onChange={(e) => setRows({ ...rows, plcc_dpa: e.target.value })} readOnly value={rows.plcc_dpa || null}/>
            <label className="floating-label">PLCC & DPA</label>
            <i title="PLCC + DPA"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="plcc" label="PLCC" onChange={(e) => setRows({ ...rows, plcc: e.target.value })} value={rows.plcc || null}/>
            <label className="floating-label">PLCC</label>
            <i title="Charge to PLCC System Amount"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="dpa" label="DPA" onChange={(e) => setRows({ ...rows, dpa: e.target.value })} value={rows.dpa || null}/>
            <label className="floating-label">DPA</label>
            <i title="Charge to DPA System Amount"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vat" label="VAT" onChange={(e) => setRows({ ...rows, vat: e.target.value })} value={rows.vat || null}/>
            <label className="floating-label">VAT</label>
            <i title="Total Tax"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="reg_commission" label="Cruise Commission" onChange={(e) => setRows({ ...rows, reg_commission: e.target.value })} readOnly value={rows.revenue * 0.36 || null}/>
            <label className="floating-label">Cruise Commission</label>
            <i title="36% of Regular Sales"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="vip_commission" label="VIP Commission" onChange={(e) => setRows({ ...rows, vip_commission: e.target.value })} readOnly value={rows.vip_sales * 0.2 || null}/>
            <label className="floating-label">VIP Commission</label>
            <i title="20% of VIP Sales"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="discounts" label="Discounts" onChange={(e) => setRows({ ...rows, discounts: e.target.value })} value={rows.discounts || null}/>
            <label className="floating-label">Discounts</label>
            <i title="Discount (+)"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="food" label="Food" onChange={(e) => setRows({ ...rows, food: e.target.value })} value={rows.food || null}/>
            <label className="floating-label">Food</label>
            <i title="Crew Meal"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="beverages" label="Beverages" onChange={(e) => setRows({ ...rows, beverages: e.target.value })} value={rows.beverages || null}/>
            <label className="floating-label">Beverages</label>
            <i title="Champagne Charges"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cc_fee" label="CC Fee" onChange={(e) => setRows({ ...rows, cc_fee: e.target.value })} value={rows.cc_fee || null}/>
            <label className="floating-label">CC Fee</label>
            <i title="Credit Card Fees"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="requisition" label="Requisition" onChange={(e) => setRows({ ...rows, requisition: e.target.value })} value={rows.requisition || null}/>
            <label className="floating-label">Requisition</label>
            <i title="Requisition"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="misc_charges" label="Misc. Charges" onChange={(e) => setRows({ ...rows, misc_charges: e.target.value })} value={rows.misc_charges || null}/>
            <label className="floating-label">Misc. Charges</label>
            <i title="Total Misc. Charges"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="cash_adv" label="Cash Advance" onChange={(e) => setRows({ ...rows, cash_adv: e.target.value })} value={rows.cash_adv || null}/>
            <label className="floating-label">Cash Advance</label>
            <i title="Cash Advance"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="medical_charges" label="Medical Charges" onChange={(e) => setRows({ ...rows, medical_charges: e.target.value })} value={rows.medical_charges || null}/>
            <label className="floating-label">Medical Charges</label>
            <i title="Medical Charges"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="printing" label="Printing" onChange={(e) => setRows({ ...rows, printing: e.target.value })} value={rows.printing || null}/>
            <label className="floating-label">Printing</label>
            <i title="Printing Charges"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="prize_voucher" label="Prize Voucher" onChange={(e) => setRows({ ...rows, prize_voucher: e.target.value })} value={rows.prize_voucher || null}/>
            <label className="floating-label">Prize Voucher</label>
            <i title="Wheel of Fortune"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="promo_food" label="Promo. Food" onChange={(e) => setRows({ ...rows, promo_food: e.target.value })} value={rows.promo_food || null}/>
            <label className="floating-label">Promo. Food</label>
            <i title="Promotional Food Charges"><InfoIcon fontSize="small" color="disabled"/></i>
          </div>
          <div className="txtInputGrp input-group">
            <span className="inputGrp">
              <div className="dollarSign">$</div>
            </span>
            <input className="inputTxt" type="text" placeholder=" " name="effy_rev" label="Effy Revenue" onChange={(e) => setRows({ ...rows, effy_rev: e.target.value })} value={rows.effy_rev || null}/>
            <label className="floating-label">Effy Revenue</label>
            <i title="Effy Share"><InfoIcon fontSize="small" color="disabled"/></i>
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
          <button className="submitBtn" onClick={handleSubmit_ncl}>Submit</button>
        </div>
      <Box sx={{ width: "100%" }}>
        <LinearProgressWithLabel value={progress} />
      </Box>
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