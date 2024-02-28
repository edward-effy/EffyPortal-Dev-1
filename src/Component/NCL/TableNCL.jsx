import React, { Fragment } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import IconButton from "@mui/material/IconButton";
import AddModal from "./AddModalNCL.jsx";
import EditModal from "./EditModalNCL.jsx";
import Modal from "@mui/material/Modal";
import MUIDataTable from "mui-datatables";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./TableNCL.css";

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
    const url = "http://localhost:3000/ncl_get";

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ results: json });
      });
  }

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
        res.voyage_num, 
        res.ship_name, 
        res.start_date, 
        res.end_date, 
        res.revenue, 
        res.vip_sales, 
        res.plcc, 
        res.dpa,
        res.plcc_dpa, 
        res.vat, 
        res.reg_commission, 
        res.vip_commission, 
        res.discounts, 
        res.food, 
        res.beverages, 
        res.cc_fee, 
        res.supplies, 
        res.misc_charges, 
        res.cash_adv, 
        res.medical_charges, 
        res.printing, 
        res.prize_voucher, 
        res.effy_rev, 
        res.status_paid, 
        res.editor,
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
        data.voyage_num, 
        data.ship_name, 
        data.start_date, 
        data.end_date, 
        data.revenue, 
        data.vip_sales, 
        data.plcc, 
        data.dpa,
        data.plcc_dpa, 
        data.vat, 
        data.reg_commission, 
        data.vip_commission, 
        data.discounts, 
        data.food, 
        data.beverages, 
        data.cc_fee, 
        data.supplies, 
        data.misc_charges, 
        data.cash_adv, 
        data.medical_charges, 
        data.printing, 
        data.prize_voucher, 
        data.effy_rev,
        data.status_paid, 
        data.editor,
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

      const url = `http://localhost:3000/ncl_del/${delVoyageNum}`;
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
        updateData.voyage_num, 
        updateData.ship_name, 
        updateData.start_date, 
        updateData.end_date, 
        updateData.revenue, 
        updateData.vip_sales, 
        updateData.plcc, 
        updateData.dpa,
        updateData.plcc_dpa, 
        updateData.vat, 
        updateData.reg_commission, 
        updateData.vip_commission, 
        updateData.discounts, 
        updateData.food, 
        updateData.beverages, 
        updateData.cc_fee, 
        updateData.supplies, 
        updateData.misc_charges, 
        updateData.cash_adv, 
        updateData.medical_charges, 
        updateData.printing, 
        updateData.prize_voucher, 
        updateData.effy_rev,
        updateData.status_paid, 
        updateData.editor,
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
          modalType: "editModalNCL",
          currentData: {
            voyage_num: rowData[0], 
            ship_name: rowData[1], 
            start_date: rowData[2], 
            end_date: rowData[3], 
            revenue: rowData[4], 
            vip_sales: rowData[5], 
            plcc: rowData[6], 
            dpa: rowData[7],
            plcc_dpa: rowData[8], 
            vat: rowData[9], 
            reg_commission: rowData[10], 
            vip_commission: rowData[11], 
            discounts: rowData[12], 
            food: rowData[13], 
            beverages: rowData[14], 
            cc_fee: rowData[15], 
            supplies: rowData[16], 
            misc_charges: rowData[17], 
            cash_adv: rowData[18], 
            medical_charges: rowData[19], 
            printing: rowData[20], 
            prize_voucher: rowData[21], 
            effy_rev: rowData[22],
            status_paid: rowData[23], 
            editor: rowData[24],
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
      if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return ""; // or some placeholder like 'N/A' if the value is not available
      } else {
        // Assuming value is a number or can be converted into one.
        const formattedValue = Number(value).toLocaleString();
        return formattedValue;
      }
    };

    const columnStyle = (value) => (
      <div style={{
        border: '1px solid rgba(255, 255, 255, .25)',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.164)',
        boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)', // for Safari browsers
        padding: '10px',
        boxSizing: 'border-box',
      }}>
        {value}
      </div>
    );

    // Table Column names
    const columns = [
      {
        name: "Voyage#",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { textAlign: "left", whiteSpace: "nowrap" },
          }),
          style: columnStyle(),
        },
      },
      {
        name: "Ship Name",
        options: {
          filter: true,
          setCellProps: () => ({
            style: {
              textAlign: "left",
              whiteSpace: "nowrap",
              paddingLeft: "20px",
            },
          }),
        },
      },
      {
        name: "Start Date",
        options: {
          filter: false,
          setCellProps: () => ({
            style: {
              textAlign: "left",
              whiteSpace: "nowrap",
              paddingLeft: "5px",
            },
          }),
          // Dates in DB were stored as YYYY-MM-DD, for UX and readability use function to render MM/DD/YYYY
          customBodyRender: (value, tableMeta, updateValue) => {
            if (!value) return ""; // Handle invalid or undefined date values

            const date = new Date(value);
            let month = "" + (date.getMonth() + 1), // Months are zero indexed
              day = "" + (date.getDate() + 1), // Days are zero indexed
              year = date.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            return [month, day, year].join("/"); // Adjusted to MM/DD/YYYY format
          },
        },
      },
      {
        name: "End Date",
        options: {
          filter: false,
          setCellProps: () => ({
            style: {
              textAlign: "left",
              whiteSpace: "nowrap",
              paddingLeft: "5px",
            },
          }),
          // Dates in DB were stored as YYYY-MM-DD, for UX and readability use function to render MM/DD/YYYY
          customBodyRender: (value, tableMeta, updateValue) => {
            if (!value) return ""; // Handle invalid or undefined date values

            const date = new Date(value);
            let month = "" + (date.getMonth() + 1), // Months are zero indexed
              day = "" + (date.getDate() + 1), // Days are zero indexed
              year = date.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            return [month, day, year].join("/"); // Adjusted to MM/DD/YYYY format
          },
        },
      },
      {
        name: "Revenue",
        options: {
          filter: false,
          setCellProps: () => ({
            style: {
              textAlign: "left",
              whiteSpace: "nowrap",
              paddingLeft: "20px",
            },
          }),
          // Adding commas
          customBodyRender: (value, tableMeta, updateValue) => {
            return formatValue(value);
          },
        },
      },
      {
        name: "VIP Sales",
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
        name: "PLCC",
        options: {
          filter: false,
          display: true,
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
        name: "DPA",
        options: {
          filter: false,
          display: true,
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
        name: "PLCC & DPA",
        options: {
          filter: false,
          display: true,
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
        name: "VAT",
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
        name: "Reg. Commission",
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
        name: "VIP Commission",
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
        name: "Food",
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
        name: "Beverages",
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
        name: "CC Fee",
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
        name: "Supplies",
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
        name: "Misc. Charges",
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
        name: "Cash Advance",
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
        name: "Medical Charges",
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
        name: "Printing",
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
        name: "Prize Voucher",
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
        name: "Effy Revenue",
        options: {
          filter: false,
          display: true,
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
                style = {
                  color: "green",
                  border: "1px solid green",
                  borderRadius: "15px",
                  padding: "3px 10px",
                };
                break;
              case "Pending":
                style = {
                  color: "orange",
                  border: "1px solid orange",
                  borderRadius: "15px",
                  padding: "3px 10px",
                };
                break;
              case "Unpaid":
                style = {
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "15px",
                  padding: "3px 10px",
                };
                break;
              default:
                style = {
                  border: "1px solid transparent",
                  borderRadius: "15px",
                  padding: "3px 10px",
                };
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
            style: {
              textAlign: "left",
              whiteSpace: "nowrap",
              paddingLeft: "15px",
            },
          }),
        },
      },
      {
        name: "Action",
        options: {
          textAlign: "right",
          setCellProps: () => ({
            style: { textAlign: "center", whiteSpace: "nowrap" },
          }),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <p className="edit_delete_btn">
                <IconButton
                  value={value}
                  onClick={() => {
                    editButton(tableMeta.rowData);
                  }}
                  onChange={(e) => {
                    updateValue(e.target.value);
                  }}
                  className="editBtn"
                >
                  <EditNoteIcon
                    style={{ color: "#6495ED", paddingLeft: "0px" }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteRow(tableMeta.rowData[0]);
                  }}
                  className="deleteBtn"
                >
                  <DeleteForeverIcon
                    style={{ color: "red", paddingLeft: "0px" }}
                  />
                </IconButton>
              </p>
            );
          },
        },
      },
    ];

    // Table options
    const options = {
      //expandableRows: true,
      //serverSide: true,
      searchPlaceholder: "Type Anything to Search",
      //sort: true,
      //filter: true,
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
        filename: "NCL-Voyages.csv",
        separator: ",",
      },
      // sortOrder:{
      //   name: 'Start Date',
      //   direction: 'desc'
      // },
    };

    return (
      <div className="tableNCL">
        <div className="btnDiv">
          <button
            className="addBtn_ncl"
            onClick={() => {
              addButton();
            }}
          >
            Add
          </button>
          <button
            className="refreshBtn_ncl"
            onClick={() => {
              this.loadContentFromServer();
            }}
          >
            Refresh
          </button>
        </div>
        <MUIDataTable className='MUIDataTableNCL'
          title={
            <div className="pageHeaderNCL">
              <div className="nclTxt">NCL DATA</div>
            </div>
          }
          data={data}
          columns={columns}
          options={options}
          rowHeight={40}
        />
        <Modal open={open} onClose={this.handleClose}>
          <div className="modal">
            {modalType === "editModalNCL" ? (
              <Fragment>
                <div className="modalBackgroundNCL">
                  <div className="outerNCL">
                    <div className="innerNCL">
                      <label className="closeLabelNCL" onClick={this.handleClose}>Back</label>
                    </div>
                  </div>
                  <h3 className="modalHeaderTxt">Edit NCL Data</h3>
                  <EditModal
                    currentData={currentData}
                    updateRow={updateRow}
                    closeModal={this.handleClose}
                  />
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="modalBackgroundNCL">
                  <div className="outerNCL">
                    <div className="innerNCL">
                      <label className="closeLabelNCL" onClick={this.handleClose}>Back</label>
                    </div>
                  </div>
                  <h3 className="modalHeaderTxt">NCL Data Entry</h3>
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


/*
import React from "react";
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const ExpandableRowTable = (props) => {
  var data = [];
  var open = false;
  var editing = false;
  var currentUser = [];

  const handleOpen = () => {
    this.setState({ open: true });
  };

  const handleClose = () => {
    this.setState({ open: false });
  };

  open = this.state.open;
  editing = this.state.edit;
  currentUser = this.state.arrayEdit;

  if (!!this.state.results) {
    this.array = this.state.results.map((result) => [
      result.id,
      result.name,
      result.username,
      result.email,
      ""
    ]);
  }

  if (!!this.state.array) {
    data = this.state.array;
  } else {
    data = this.array;
  }

  // CRUD operations
  const addUser = (user) => {
    user.id = data.length + 1;
    const addUser = [user.id, user.name, user.username, user.email, ""];
    this.setState({ array: data.concat([addUser]) });
    handleClose();
  };

  const addButton = () => {
    this.setState({ edit: false });
    handleOpen();
  };

  const updateUser = (id, updatedUser) => {
    this.setState({ edit: false });
    const editUser = [
      updatedUser.id,
      updatedUser.name,
      updatedUser.username,
      updatedUser.email,
      ""
    ];
    this.setState({
      array: data.map((user) => (user[0] === id ? editUser : user))
    });
    handleClose();
  };

  const editButton = (user) => {
    this.setState({ edit: true });
    this.setState({
      arrayEdit: {
        id: user[0],
        name: user[1],
        username: user[2],
        email: user[3],
        acao: ""
      }
    });
    handleOpen();
  };

  const columns = [
    {
      name: "Ship Name"
    },
    {
      name: "Voyage #"
    },
    {
      name: "Date"
    },
    {
      name: "Effy Shares"
    },
    {
      name: "Status"
    },
    {
      name: "Editor"
    },
    {
      name: "Action",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              onClick={() => {
                editButton(tableMeta.rowData);
              }}
              className="button muted-button"
            >
              Edit
            </button>
          );
        }
      }
    }
  ];

  const dataMain = [
    ["Gabby George", "GG984201382", "Minneapolis", 30, 100000],
    ["Brian Anatoli", "BA92304393", "Dallas", 55, 200000],
    ["Jaden Collins", "JC89340238", "Santa Ana", 27, 500000],
    ["Franky Rees", "FR842830405", "St. Petersburg", 22, 50000],
    ["CONQUEST", "CQ20211220004", "12/27/22", 28, 75000],
    ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000],
    ["BREEZE", "BR20210821005", "10/16/21", 71, 210000],
    ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000],
    ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000],
    ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000],
    ["CELEBRATION", "CB20221227007", "12/27/22", 52, 420000],
    ["Kris Humphrey", "Legal Counsel", "Laredo", 30, 150000],
    ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000],
    ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000],
    ["Justice Mann", "Business Consultant", "Chicago", 24, 133000],
    ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000],
    ["Jesse Welch", "Legal Counsel", "Seattle", 28, 200000],
    ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000],
    ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000],
    ["Danny Leon", "Computer Scientist", "Newark", 60, 220000],
    ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000],
    ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000],
    ["Danni Hudson", "Legal Counsel", "Tampa", 37, 90000],
    ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000],
    ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000],
    ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000],
    ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000],
    ["BREEZE", "BR20211011005", "8/7/21", 44, 80000],
    ["Gabby Strickland", "Business Consultant", "Scottsdale", 26, 45000],
    ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000]
  ];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [createData(34543, 159, 6.0, 24, 4.0)];

  const options = {
    print: false,
    downloadOptions: { filename: "CarnivalData", separator: "," },
    filter: true,
    onFilterChange: (changedColumn, filterList) => {
      console.log(changedColumn, filterList);
    },

    selectableRows: "multiple",
    searchPlaceholder: "Search by Main Row Data",
    filterType: "multiselect",
    responsive: "standard",
    rowsPerPage: 10,
    expandableRows: true,
    pagination: true,
    fixedHeader: true,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
      return (
        <React.Fragment>
          <tr>
            <td colSpan={8}>
              <TableContainer component={Paper}>
                <Table style={{ minWidth: "650" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Revenue S&S</TableCell>
                      <TableCell align="left">Revenue CC</TableCell>
                      <TableCell align="left">Exec. Folio</TableCell>
                      <TableCell align="left">Parole Fee</TableCell>
                      <TableCell align="left">EU Revenue</TableCell>
                      <TableCell align="left">Carnival Share</TableCell>
                      <TableCell align="left">Office Supplies</TableCell>
                      <TableCell align="left">Cash Paid</TableCell>
                      <TableCell align="left">Discount</TableCell>
                      <TableCell align="left">S&S Fee</TableCell>
                      <TableCell align="left">CC Fee</TableCell>
                      <TableCell align="left">Cash Advance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.calories}</TableCell>
                        <TableCell align="left">{row.fat}</TableCell>
                        <TableCell align="left">{row.carbs}</TableCell>
                        <TableCell align="left">{row.protein}</TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.calories}</TableCell>
                        <TableCell align="left">{row.fat}</TableCell>
                        <TableCell align="left">{row.carbs}</TableCell>
                        <TableCell align="left">{row.protein}</TableCell>
                        <TableCell align="left">{row.fat}</TableCell>
                        <TableCell align="left">{row.calories}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </td>
          </tr>
        </React.Fragment>
      );
    }
  };

  return <MUIDataTable data={dataMain} columns={columns} options={options} />;
};

export default ExpandableRowTable;

*/