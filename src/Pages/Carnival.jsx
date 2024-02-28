
import React from 'react';
import Navbar from '../Component/NavBar';
//import Button from '@mui/material/Button';
import "./Carnival.css";
import Table from "../Component/Carnival/Table.jsx";

function Carnival() {
    return (
        <div className='cclBackground'>
            <Navbar/>
            <Table/>
        </div>
    )
}

export default Carnival;
//
//In this code, we are creating a Carnival component that will display the carnival data.
//
//1. We import the necessary React library and the Navbar component from the '../Component/NavBar' file.
//2. We import the Carnival.css file to style our component.
//3. We import the Table component from the '../Component/Table' file.
//
//Inside the Carnival component, we have the following:
//
//1. We render the Navbar component at the top of the page.
//2. We create a 'pageHeader' div that contains a 'carnivalTxt' div. The 'carnivalTxt' div displays the text "CARNIVAL DATA".
//3. We render the Table component below the 'pageHeader' div.
//
//By exporting the Carnival component as the default export, we can import and use it in other parts of our application..</s>