import React from 'react';
import Navbar from '../Component/NavBar';
import './NCL.css';
import Table from '../Component/NCL/TableNCL';

function NCL(){

    return (
        <div className='nclBackground'>
            <Navbar/>
            <Table/>
        </div>

    )

}
export default NCL;