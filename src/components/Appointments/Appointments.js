import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';
import ReactTable from 'react-table-6';
import '../City.css';
import "./Appointments.css";
import "react-datepicker/dist/react-datepicker.css";
import 'react-table-6/react-table.css';




class Appointments extends Component {
    constructor(props){
        super(props);
        this.state = {
           
        }
    }



    render() {
        // const { startDate, endDate, formatStartDate, formatEndDate  } = this.state;
        const { onSubmitDate, handleChange, handleEndDate, startDate, endDate, formatStartDate, formatEndDate } = this.props;
        const ExampleCustomInput = ({ value, onClick }) => (
            <label className='textFieldOutlined'>
            <input
                className='textField'
                type="text"
                value={formatStartDate}
                onClick={onClick}
                // disabled={disableField}
                //onChange={(e:) => this.updatePanOcrField(e.target.value, 'dob')}
            />
            <span>Start Date</span>
            </label>
          );
          const ExampleEndDateInput = ({ value, onClick }) => (
            <label className='textFieldOutlined'>
            <input
                className='textField'
                type="text"
                value={formatEndDate}
                onClick={onClick}
                // disabled={disableField}
                //onChange={(e:) => this.updatePanOcrField(e.target.value, 'dob')}
            />
            <span>End Date</span>
            </label>
          );
          const diableFields = !formatEndDate || !formatStartDate;
          var d = new Date();
        return (
            <div>
                <DatePicker
                    selected={startDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date)  => handleChange(date)}
                    placeholderText="Select start Date" 
                    selectsStart
                    startDate={startDate}
                    customInput={<ExampleCustomInput />}
                    endDate={endDate}
                    minDate={d.setDate(d.getDate() - 7)}
                    showDisabledMonthNavigation
                />
                <DatePicker
                    selected={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select End Date" 
                    onChange={(date)  => handleEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    customInput={<ExampleEndDateInput />}
                    endDate={endDate}
                    minDate={startDate}
                />
                 <button className="btn save" disabled={diableFields} onClick={() =>onSubmitDate(startDate, endDate)}>Submit</button>
            </div>
        )
    }
}

export default Appointments;