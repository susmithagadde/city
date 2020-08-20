import React, { Component } from 'react';
import Select from 'react-select';
import '../City.css';
// import Modal from "../Modal";

const colourStyles = {
    container: (base, state) => ({
        ...base,
      }),
      valueContainer: (base, state) => ({
        ...base,
      }),
      multiValue:(base, state) => ({
        ...base,
        backgroundColor: "#f4f7f8"
      }),
      indicatorSeparator: (base, state) => ({
        ...base,
        backgroundColor: "#fff"
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: "#000"
      }),
      // option: (base, state) => ({
      //   ...base,
      //   color: "#f4f7f8 !important",
      //   backgroundColor: '#e8eeef !imporatnt'
      // }),
    menu: styles => ({ ...styles, backgroundColor: '#e8eeef' }),
    control: styles => ({ ...styles, backgroundColor: '#e8eeef' }),
     option: styles => ({ ...styles, color: '#f4f7f8 !imporatnt' }),
  };

class Email extends Component {
    constructor(props){
        super(props);
        this.state = {
           
        }
    }
    

    render() {
        const {  selectedOption,  handleChange, cityData, colourStyles, selectedCategoryOption, handleCategoryChange, categoryList,
            selectedSubcription, subsEnabled, handleSubscriptionChange, SubscriptionList, handleTextChange, onSave,
            condition, fromEmail, fromName, } = this.props;
        return (
            <>
                <Select
                  value={selectedOption}
                  placeholder={<div>Select City</div>}
                  isMulti
                  className="select-city"
                  onChange={handleChange}
                  options={cityData}
                  styles={colourStyles}
              />
              <Select
                  value={selectedCategoryOption}
                  placeholder={<div>Select Category</div>}
                  isMulti
                  className="select-category"
                  onChange={handleCategoryChange}
                  options={categoryList}
                  styles={colourStyles}
              />
              <Select
                  value={selectedSubcription}
                  placeholder={<div>Select Subscription Status</div>}
                  isMulti
                  isDisabled={!subsEnabled}
                  className="select-subscription"
                  onChange={handleSubscriptionChange}
                  options={SubscriptionList}
                  styles={colourStyles}
              />
            <input type="text" id="subject" name="subject"  placeholder="Subject" onChange={(e) => handleTextChange(e,'subject')}/>
            <input type="text" id="from-email" name="from-email" value={fromEmail} placeholder="From (email)" onChange={(e) => handleTextChange(e,'from-email')}/>
            <input type="text" id="from-name" name="from-name" value={fromName} placeholder="From (name)" onChange={(e) => handleTextChange(e,'from-name')}/>   
            <button className="btn save" disabled={condition} onClick={onSave}>Send</button>
            </>
        )
    }
}

export default Email;