import React, { useState, useEffect } from "react";
import "./Modal.css";
import { useUsername } from "../useUsername";

const EditModal = (props) => {
  const editor = useUsername();
  const [row, setRow] = useState({
    ship_name: '',
    voyage_num: '',
    date: '',
    effy_share: '',
    status_paid: '',
    editor: editor,
    rev_ss: '',
    rev_cc: '',
    eu_vat: '',
    carnival_share: '',
    office_supp: '',
    discounts: '',
    exec_folio: '',
    ss_fee: '',
    cc_fee: '',
    meal_charge: '',
    parole_fee: '',
    cash_adv: '',
    cash_paid: ''
  });

  // HandleSummit function
  const handleSubmit_Edit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/ccl_put/${props.currentData.voyage_num}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    })
      .then(response => response.json())
      .then(data => {
        // Close the modal (assuming you have a method or state for this)
        props.closeModal();
        alert("Data updated successfully");
      })
      .catch((error) => {
        // If the error has a message property, it's a JSON error from the server
        alert(`Error: ${error.message || "Something went wrong"}`);
      });
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const day = (date.getDate() + 1).toString().padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  }
  
  useEffect(() => {
    if (props.currentData) {
      const formattedDate = formatDate(props.currentData.date);
      setRow({ ...props.currentData, date: formattedDate, editor: editor });
    }
  }, [props.currentData, editor]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRow(prevRow => ({
      ...prevRow,
      [name]: name === "editor" ? editor: value
    }));
  };
  

  return (
    <>
      <form className="inputForm" onSubmit={(e) => { e.preventDefault(); props.updateRow(row.voyage_num, row);}}>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="ship_name" label="Ship Name" onChange={handleInputChange} value={row.ship_name}/>
          <label className="floating-label">Ship Name</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="voyage_num" label="Voyage #" onChange={handleInputChange} value={row.voyage_num}/>
          <label className="floating-label">Voyage #</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="date" label="Date (yyyy/mm/dd)" onChange={handleInputChange} value={row.date}/>
          <label className="floating-label">Date (yyyy/mm/dd)</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span> 
          <input className="inputTxt" type="text" placeholder=" "  name="effy_share" label="Effy Share" onChange={handleInputChange} value={row.effy_share}/>
          <label className="floating-label">Effy Share</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="editor" label="Editor" value={row.editor}/>
          <label className="floating-label">Editor</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="rev_ss" label="Revenue S&S" onChange={handleInputChange} value={row.rev_ss}/>
          <label className="floating-label">Revenue Sail & Sign</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="rev_cc" label="Revenue CC" onChange={handleInputChange} value={row.rev_cc}/>
          <label className="floating-label">Revenue Direct CC</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="ss_fee" label="S&S Fee" onChange={handleInputChange} value={row.ss_fee}/>
          <label className="floating-label">Sail & Sign Processing Fee</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="cc_fee" label="CC Fee" onChange={handleInputChange} value={row.cc_fee}/>
          <label className="floating-label">CC Processing Fee</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="eu_vat" label="EU VAT" onChange={handleInputChange} value={row.eu_vat}/>
          <label className="floating-label">EU VAT</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="discounts" label="Discounts" onChange={handleInputChange} value={row.discounts}/>
          <label className="floating-label">Discounts</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="carnival_share" label="Carnival Share" onChange={handleInputChange} value={row.carnival_share}/>
          <label className="floating-label">Carnival Share</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="exec_folio" label="Exec. Folio" onChange={handleInputChange} value={row.exec_folio}/>
          <label className="floating-label">Exec. Folio</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="meal_charge" label="Meal Charge" onChange={handleInputChange} value={row.meal_charge}/>
          <label className="floating-label">Meal Charge</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="office_supp" label="Office Supplies" onChange={handleInputChange} value={row.office_supp}/>
          <label className="floating-label">Office Supplies</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="cash_paid" label="Cash Paid Onboard" onChange={handleInputChange} value={row.cash_paid}/>
          <label className="floating-label">Cash Paid Onboard</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" "  name="cash_adv" label="Cash Advance" onChange={handleInputChange} value={row.cash_adv}/>
          <label className="floating-label">Cash Advance</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text"  placeholder=" " name="parole_fee" label="Parole Fee" onChange={handleInputChange} value={row.parole_fee}/>
          <label className="floating-label">Parole Fee</label>
        </div>
        <div className="txtInputGrp">
          <select className="inputSelect" name="status_paid" onChange={handleInputChange} value={row.status_paid}>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <label className="floating-label">Status</label>
        </div>
      </form>
      <button className="submitBtn" onClick={handleSubmit_Edit}>Submit</button>
    </>
  );
};
  
  export default EditModal;
  