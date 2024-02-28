import React, { useState, useEffect } from "react";
import "./ModalNCL.css";
import { useUsername } from "../useUsername";

const EditModal = (props) => {
  const editor = useUsername();
  const [row, setRow] = useState({
    voyage_num: "",
    ship_name: "",
    start_date: "",
    end_date: "",
    revenue: "",
    vip_sales: "",
    plcc: "",
    dpa: "",
    plcc_dpa: "",
    vat: "",
    reg_commission: "",
    vip_commission: "",
    discounts: "",
    food: "",
    beverages: "",
    cc_fee: "",
    supplies: "",
    misc_charges: "",
    cash_adv: "",
    medical_charges: "",
    printing: "",
    prize_voucher: "",
    effy_rev: "",
    status_paid: "",
    editor: "",
  });

  // HandleSummit function
  const handleSubmit_Edit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/ncl_put/${props.currentData.voyage_num}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    })
      .then((response) => response.json())
      .then((data) => {
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
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
    const day = (date.getDate() + 1).toString().padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  useEffect(() => {
    if (props.currentData) {
      const formatStart_Date = formatDate(props.currentData.start_date);
      const formatEnd_Date = formatDate(props.currentData.end_date);
      setRow({
        ...props.currentData,
        start_date: formatStart_Date,
        end_date: formatEnd_Date,
        editor: editor,
      });
    }
  }, [props.currentData, editor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRow((prevRow) => ({
      ...prevRow,
      [name]: name === "editor" ? editor : value,
    }));
  };

  return (
    <>
      <form   
        className="inputForm" onSubmit={(e) => { e.preventDefault(); props.updateRow(row.voyage_num, row);}}>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" paceholder=" " name="voyage_num" label="Voyage #" onChange={handleInputChange} value={row.voyage_num}/>
          <label className="floating-label">Voyage #</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="ship_name" label="Ship Name" onChange={handleInputChange} value={row.ship_name}/>
          <label className="floating-label">Ship Name</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="start_date" label="Start Date(yyyy/mm/dd)" onChange={handleInputChange} value={row.start_date}/>
          <label className="floating-label">Start Date(yyyy/mm/dd)</label>
        </div>
        <div className="txtInputGrp">
          <input className="inputTxt" type="text" placeholder=" " name="end_date" label="End Date(yyyy/mm/dd)" onChange={handleInputChange} value={row.end_date}/>
          <label className="floating-label">End Date(yyyy/mm/dd)</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="revenue" label="Revenue" onChange={handleInputChange} value={row.revenue}/>
          <label className="floating-label">Revenue</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="vip_sales" label="VIP Sales" onChange={handleInputChange} value={row.vip_sales}/>
          <label className="floating-label">VIP Sales</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="plcc_dpa" label="PLCC & DPA" onChange={handleInputChange} value={row.plcc_dpa}/>
          <label className="floating-label">PLCC & DPA</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="plcc" label="PLCC" onChange={handleInputChange} value={row.plcc} />
          <label className="floating-label">PLCC</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="dpa" label="DPA" onChange={handleInputChange} value={row.dpa}/>
          <label className="floating-label">DPA</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="vat" label="VAT" onChange={handleInputChange} value={row.vat}/>
          <label className="floating-label">VAT</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="reg_commission" label="Cruise Commission" onChange={handleInputChange} value={row.reg_commission}/>
          <label className="floating-label">Cruise Commission</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="vip_commission" label="VIP Commission" onChange={handleInputChange} value={row.vip_commission}/>
          <label className="floating-label">VIP Commission</label>
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
          <input className="inputTxt" type="text" placeholder=" " name="food" label="Food" onChange={handleInputChange} value={row.food} />
          <label className="floating-label">Food</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="beverages" label="Beverages" onChange={handleInputChange} value={row.beverages}/>
          <label className="floating-label">Beverages</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="cc_fee" label="CC Fee" onChange={handleInputChange} value={row.cc_fee}/>
          <label className="floating-label">CC Fee</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="supplies" label="Supplies" onChange={handleInputChange} value={row.supplies}/>
          <label className="floating-label">Supplies</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="misc_charges" label="Misc. Charges" onChange={handleInputChange} value={row.misc_charges}/>
          <label className="floating-label">Misc. Charges</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input
            className="inputTxt" type="text" placeholder=" " name="cash_adv" label="Cash Advance" onChange={handleInputChange} value={row.cash_adv}/>
          <label className="floating-label">Cash Advance</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="medical_charges" label="Medical Charges" onChange={handleInputChange} value={row.medical_charges}/>
          <label className="floating-label">Medical Charges</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="printing" label="Printing" onChange={handleInputChange} value={row.printing} />
          <label className="floating-label">Printing</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="prize_voucher" label="Prize Voucher" onChange={handleInputChange} value={row.prize_voucher}/>
          <label className="floating-label">Prize Voucher</label>
        </div>
        <div className="txtInputGrp input-group">
          <span className="inputGrp">
            <div className="dollarSign">$</div>
          </span>
          <input className="inputTxt" type="text" placeholder=" " name="effy_rev" label="Effy Revenue" onChange={handleInputChange} value={row.effy_rev}/>
          <label className="floating-label">Effy Revenue</label>
        </div>
        <div className="txtInputGrp">
          <select className="inputSelect" onChange={handleInputChange} value={row.status_paid}>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <label className="floating-label">Status</label>
        </div>
        <div className="txtInputGrp">
          <input
            className="inputTxt" type="text" placeholder=" " name="editor" label="Editor" value={row.editor} readOnly/>
          <label className="floating-label">Editor</label>
        </div>
      </form>
      <button className="submitBtn" onClick={handleSubmit_Edit}>
        Submit
      </button>
    </>
  );
};

export default EditModal;
