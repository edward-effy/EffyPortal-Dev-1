import React, { Fragment } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import IconButton from "@mui/material/IconButton";
import AddModal from "./AddModal.jsx";
import EditModal from "./EditModal.jsx";
import Modal from "@mui/material/Modal";
import MUIDataTable from "mui-datatables";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from 'moment-timezone';

import "./Table.css";
class Table extends React.Component {
  constructor(props) {
    super(props);

    this.open = false;
    this.state = {
      open: false,
      modalType: "addModal",
      edit: false,
    };
    this.array = [];
    this.currentData = [];
    this.editing = false;
  }

  loadContentFromServer() {
    // Back-end server
    const url = "http://localhost:3000/ccl_get";

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ results: json });
      });  }

  componentDidMount() {
    this.loadContentFromServer();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.loadContentFromServer();
  };

  // Render the data in array format
  render() {
    const { open, modalType, currentData } = this.state;
    //const array = this.array;
    var data = [];
    //var editing = false;

    if (!!this.state.results) {
      this.array = this.state.results.map((res) => [
        res.ship_name,
        res.voyage_num,
        res.date,
        res.effy_share,
        res.status_paid,
        res.editor,
        res.rev_ss,
        res.rev_cc,
        res.eu_vat,
        res.carnival_share,
        res.office_supp,
        res.discounts,
        res.exec_folio,
        res.ss_fee,
        res.cc_fee,
        res.meal_charge,
        res.parole_fee,
        res.cash_adv,
        res.cash_paid,
        res.dt_entry,
        "",
      ]);
    }
    
    if (!!this.state.array) {
      data = this.state.array;
    } else {
      data = this.array;
    }

    // Calling RESTful endpoint from the backend
    // Submit button from addModal
    const handleAddModal = (data) => {
      data.id = data.length + 1;
      const addUser = [
        data.ship_name,
        data.voyage_num,
        data.date,
        data.effy_share,
        data.status_paid,
        data.editor,
        data.rev_ss,
        data.rev_cc,
        data.eu_vat,
        data.carnival_share,
        data.office_supp,
        data.discounts,
        data.exec_folio,
        data.ss_fee,
        data.cc_fee,
        data.meal_charge,
        data.parole_fee,
        data.cash_adv,
        data.cash_paid,
        "",
      ];
      this.setState({ array: data.concat([addUser]) });
      this.handleClose();
    };

    // addButton was called in addModal.jsx
    const addButton = () => {
      this.setState({ edit: false });
      this.handleOpen();
      this.setState({
        modalType: "addModal",
        currentData: {},
        open: true,
      });
    };

    // Delete Data
    const handleDeleteRow = (rowData) => {
      // Ensure you have the correct index for the voyage_num
      const delVoyageNum = rowData; // This assumes delVoyageNum is at index 1

      if (!delVoyageNum) {
        alert("Voyage number not found.");
        return;
      }

      const url = `http://localhost:3000/ccl_del/${delVoyageNum}`;
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          this.loadContentFromServer();
          alert("Data deleted successfully");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(`Error: ${error.message}`);
        });
    };

    // Update Table data
    const updateRow = (voyage_num, updateData) => {
      this.setState({ edit: false });
      const editUser = [
        updateData.ship_name,
        updateData.voyage_num,
        updateData.date,
        updateData.effy_share,
        updateData.status_paid,
        updateData.editor,
        updateData.rev_ss,
        updateData.rev_cc,
        updateData.eu_vat,
        updateData.carnival_share,
        updateData.office_supp,
        updateData.discounts,
        updateData.exec_folio,
        updateData.ss_fee,
        updateData.cc_fee,
        updateData.meal_charge,
        updateData.parole_fee,
        updateData.cash_adv,
        updateData.cash_paid,
        "",
      ];
      this.setState({
        array: data.map((data) => (data[0] === voyage_num ? editUser : data)),
      });
      this.handleClose();
    };

    // Edit button
    const editButton = (rowData) => {
      this.setState(
        {
          edit: true,
          modalType: "editModal",
          currentData: {
            ship_name: rowData[0],
            voyage_num: rowData[1],
            date: rowData[2],
            effy_share: rowData[3],
            status_paid: rowData[4],
            editor: rowData[5],
            rev_ss: rowData[6],
            rev_cc: rowData[7],
            eu_vat: rowData[8],
            carnival_share: rowData[9],
            office_supp: rowData[10],
            discounts: rowData[11],
            exec_folio: rowData[12],
            ss_fee: rowData[13],
            cc_fee: rowData[14],
            meal_charge: rowData[15],
            parole_fee: rowData[16],
            cash_adv: rowData[17],
            cash_paid: rowData[18],
            action: "",
          },
          open: true,
        },
        () => {
          this.handleOpen();
        }
      );
    };

    const formatValue = (value) => {
      if (value !== null && value !== undefined) {
        // Assuming value is a number or can be converted into one.
        const formattedValue = Number(value).toLocaleString();
        return formattedValue;
      } else {
        return ""; // or some placeholder like 'N/A' if the value is not available
      }
    };    
   // Table Column names
    const columns = [
      {
        name: "Ship Name",
        options: {
          filter: true,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap", paddingLeft: "20px"},
          }),
        },
      },
      {
        name: "Voyage#",
        options: {
          filter: false,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap" },
          }),
        },
      },
      {
        name: "Date",
        options: {
          filter: false,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap", paddingLeft: "5px"},
          }),
          // Dates in DB were stored as YYYY-MM-DD, for UX and readability use function to render MM/DD/YYYY
          customBodyRender: (value, tableMeta, updateValue) => {
            if (!value) return "N/A"; // Handle invalid or undefined date values
            return moment(value).format("MM/DD/YYYY");
          },
        },
      },
      {
        name: "Effy Share",
        options: {
          filter: false,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap", paddingLeft: "20px"},
          }),
          // Adding commas
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Status",
        options: {
          filter: true,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap" },
          }),
          // Coloured status tag
          customBodyRender: (value, tableMeta, updateValue) => {
            let style;
            switch (value) {
              case "Paid":
                style = { color: "green", border: "1px solid green", borderRadius: "15px", padding: "3px 10px"};
                break;
              case "Pending":
                style = { color: "orange", border: "1px solid orange", borderRadius: "15px", padding: "3px 10px"};
                break;
              case "Unpaid":
                style = { color: "red", border: "1px solid red", borderRadius: "15px", padding: "3px 10px"};
                break;
              default:
                style = { border: "1px solid blue", borderRadius: "15px", padding: "3px 10px" };
            }
            return <span style={style}>{value}</span>;
          },
        },
      },
      {
        name: "Editor",
        options: {
          filter: true,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap", paddingLeft: "15px"},}),
        },
      },
      {
        name: "Revenue Sail & Sign",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({
            style: { textAlign: "center", whiteSpace: "nowrap" },
          }),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Revenue Direct CC",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({
            style: { textAlign: "center", whiteSpace: "nowrap" },
          }),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "EU VAT",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({ style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Carnival Share",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({ style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Office Supplies",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({
            style: { textAlign: "center", whiteSpace: "nowrap" },
          }),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Discounts",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({ style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Exec. Folio",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Sail & Sign Processing Fee",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "CC Processing Fee",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Meal Charge",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Parole Fee",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" },}),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Cash Advance",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({ style: { textAlign: "center", whiteSpace: "nowrap" }, }),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Cash Onboard",
        options: {
          filter: false,
          display: false,
          setCellProps: () => ({style: { textAlign: "center", whiteSpace: "nowrap" }, }),
          // Adding commas for display
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "Last Edit",
        options: {
          filter: false,
          setCellProps: () => ({ style: { textAlign: "left", whiteSpace: "nowrap", paddingLeft: "5px" },}),
          customBodyRender: (value, tableMeta, updateValue) => {
            if (!value) return "N/A"; // Handle invalid or undefined date values
            const formattedDate = moment.utc(value).format('YYYY-MM-DD HH:mm:ss');
            return formattedDate;
          },
        },
      },
      {
        name: "Action",
        options: {
          textAlign: "right",
          setCellProps: () => ({ style: { textAlign: "center", whiteSpace: "nowrap" },}),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <p className="edit_delete_btn">
                <IconButton
                  value={value}
                  onClick={() => { editButton(tableMeta.rowData); }}
                  onChange={(e) => { updateValue(e.target.value); }}
                  className="editBtn"
                >
                  <EditNoteIcon style={{ color: "#6495ED", paddingLeft: "0px" }}/>
                </IconButton>
                <IconButton
                  onClick={() => {handleDeleteRow(tableMeta.rowData[1]); }}
                  className="deleteBtn"
                >
                  <DeleteForeverIcon style={{ color: "red", paddingLeft: "0px" }}/>
                </IconButton>
              </p>
            );
          },
        },
      },
    ];

    // Table options
    const options = {
      searchPlaceholder: "Type Anything to Search",
      sort: true,
      filter: true,
      textAlign: "center",
      filterType: "multiselect",
      responsive: "simple",
      rowsPerPage: 50,
      rowsPerPageOptions: [5, 50, 100, 500],
      print: "disabled",
      fixedSelectColumn: true,
      tableBodyHeight: "100%",
      tableBodyMaxHeight: "74vh",
      downloadOptions: {
        filename: "CCL-Voyages.csv",
        separator: ",",
      },
      sortOrder:{
        name: 'Last Edit',
        direction: 'desc'
      },
    };

    return (
      <div className="tableCCL">
        <div className="btnDiv">
          <button
            className="addBtn_ccl"
            onClick={() => {
              addButton();
            }}
          >
            Add
          </button>
          <button
            className="refreshBtn_ccl"
            onClick={() => {
              this.loadContentFromServer();
            }}
          >
            Refresh
          </button>
        </div>
        <MUIDataTable
          className="CCLDataTable"
          title={
            <div className="pageHeader">
              <p className="carnivalTxt">CARNIVAL DATA</p>
            </div>
          }
          data={data}
          columns={columns}
          options={options}
        />
        <Modal open={open} onClose={this.handleClose}>
          <div className="modal">
            {modalType === "editModal" ? (
              <Fragment>
                <div className="modalBackground">
                  <div className="outer">
                    <div className="inner">
                      <label className="closeLabel" onClick={this.handleClose}>Back</label>
                    </div>
                  </div>
                  <h3 className="modalHeaderTxt">Edit Carnival Data</h3>
                  <EditModal
                    currentData={currentData}
                    updateRow={updateRow}
                    closeModal={this.handleClose}
                  />
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="modalBackground">
                  <div className="outer">
                    <div className="inner">
                      <label className="closeLabel" onClick={this.handleClose}>Back</label>
                    </div>
                  </div>
                  <h3 className="modalHeaderTxt">Carnival Data Entry</h3>
                  <AddModal
                    addModal={handleAddModal}
                    closeModal={() => this.setState({ open: false })}
                  />
                </div>
              </Fragment>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default Table;