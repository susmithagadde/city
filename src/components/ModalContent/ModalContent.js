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

class ModalContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            Sentiment:['Highly Positive', 'Positive', 'Neutral', 'Negative', 'Extremely Negative'],
            selectedType:'',
        }
    }
    

    render() {
        const {  closeModal,  selectedType, savedData, scheduleList, callStatus, feedbackTypes, responseData,
           selectedSentimentType, handleChangeSentiment, mainStyle, comments, onComment, onsaveFeedback } = this.props;
        // const { Sentiment } = this.state;
        // const types =  Sentiment.map(list => {return {value: list, label: list}});
        return (
            <>
             {(selectedType === 'Appointments' && scheduleList.length > 0 && responseData === '' ) ? 
               <div className="feedback-flex">
               <Select
                    defaultValue={feedbackTypes[1]}
                    className="select-feedback"
                    onChange={handleChangeSentiment}
                    isDisabled={callStatus === 'Completed'}
                    options={feedbackTypes}
                    styles={colourStyles}
                    value={savedData.length !== 0 ? {value: savedData.sentiment, label: savedData.sentiment} : {value: selectedSentimentType, label: selectedSentimentType}}
                />
                 <textarea disabled={callStatus === 'Completed'} value={savedData.length !== 0  ? savedData.comments : comments} placeholder="Comment" rows="4"  cols="45" autoComplete="off" onChange={(e)=>onComment(e)}></textarea>
                 {savedData.length !== 0  ? <button
                 style={{
                   ...mainStyle.button,
                   margin: 0,
                   width: "auto",
                   marginTop: 10,
                   backgroundColor:'#24a557',
                 }}
                 onClick={closeModal}
               >
                 Close
               </button>:<button style={{
                   ...mainStyle.button,
                   margin: 0,
                   width: "auto",
                   marginTop: 10,
                   backgroundColor:'#24a557',
                 }}  onClick={onsaveFeedback}>Save</button>} 
               </div>:  
               <>
               <p>{responseData ? responseData : 'Something Went Wrong..'}</p>

               <button
                 style={{
                   ...mainStyle.button,
                   margin: 0,
                   width: "auto",
                   marginTop: 10,
                   backgroundColor:'#24a557',
                 }}
                 onClick={closeModal}
               >
                 Close
               </button>
               </>
               } 
              </>
        )
    }
}

export default ModalContent;