import React, { Component } from 'react';
import './PendingRequest.css';
import AdmitButton from '../Buttons/AdmitButton';
import DenyButton from '../Buttons/DenyButton';

class PendingRequest extends Component {  

    render(){

    return(
        <div className="row row-content">
                    <div className="col-12">
                        <h2>Pending requests</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Date & Time</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vaishali</td>
                                        <td>ABCDE345679</td>
                                        <td>17-12-2020 16:30</td>
                                        <td><AdmitButton/></td>
                                        <td><DenyButton/></td>
                                    </tr>
                                    <tr>
                                        <td>Uma</td>
                                        <td>EF89CDE5679</td>
                                        <td>17-12-2020 16:30</td>
                                        <td><AdmitButton/></td>
                                        <td><DenyButton/></td>
                                    </tr>
                                    <tr>
                                        <td>Sneha</td>
                                        <td>ABCDE345679</td>
                                        <td>17-12-2020 16:30</td>
                                        <td><AdmitButton/></td>
                                        <td><DenyButton/></td>
                                    </tr>
                                    <tr>
                                        <td>John</td>
                                        <td>DE1947CF508</td>
                                        <td>12-06-2020 18:00</td>
                                        <td><AdmitButton/></td>
                                        <td><DenyButton/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>             
    )
    }
}

export default PendingRequest;