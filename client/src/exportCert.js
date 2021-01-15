import React, { Component } from 'react';
import './PendingRequest/PendingRequest.css';
import ExportButton from './Buttons/ExportButton';

class ExportCert extends Component {  

    render(){

    return(
        <div className="row row-content">
                    <div className="col-12">
                        <h2>Export certificate</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ABCDE345679</td>
                                        <td><ExportButton/></td>
                                    </tr>
                                    <tr>
                                        <td>EF89CDE5679</td>
                                        <td><ExportButton/></td>
                                    </tr>
                                    <tr>
                                        <td>ABCDE345679</td>
                                        <td><ExportButton/></td>
                                    </tr>
                                    <tr>
                                        <td>DE1947CF508</td>
                                        <td><ExportButton/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>             
    )
    }
}

export default ExportCert;