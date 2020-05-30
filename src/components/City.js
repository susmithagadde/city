import React, { Component } from 'react';
import Select from 'react-select';
import ReactTable from 'react-table-6' 
import PostData from "../data/post.js"; 
import 'react-table-6/react-table.css'
import './City.css';


class City extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedOption: [],
            cityData: [],
            matchData: [],
            savedList:[],
            customText: '',
            responseData: '',  
        }
    }

    componentDidMount() {
        
        const finalData = PostData.map((data) => {
          let count = Object.values(data)[0];  
            return {value: { city: data.city, count : count }, label: data.city}
        });
        
        this.setState({cityData: finalData});
    }

    handleChange = selectedOption => { 
        if (selectedOption !== null){
            const total = [...selectedOption];
            let results;
            let format;
            var concatArray = [];

            total.map(option => {
                const label = option.label;
               results = PostData.filter(question => (question.city.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").join("")).toLowerCase() === (label.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").join("")).toLowerCase());
               
    
               format = results.map((data) => {  
                let count = Object.values(data)[0];
                return { city: data.city, count : count }
               }); 
               
               concatArray = concatArray.concat(format);
               return results;
            })
            
           
            
            this.setState({matchData: concatArray, selectedOption: total});
        }
        else {
            this.setState({matchData: [], selectedOption: []});
        }
        
          
      };

      handleTextChange = (e) => {
          
          this.setState({customText: e.target.value});
      }


      onSave = () => {
          const { customText, selectedOption } = this.state;
        
         let finalMatch =  selectedOption.map(data => {
              return data.label;
          })

          let requestOptions = {
              method: 'POST',
              headers: { "Access-Control-Allow-Origin": "https://api.traderight.co/sendBulkEmails", 'Content-Type': 'application/json'},
              body: JSON.stringify({ cities: finalMatch, custom_text: customText })   
        }
           
          fetch('https://cors-anywhere.herokuapp.com/https://api.traderight.co/sendBulkEmails', requestOptions)
          .then(res => res.json())
          .then(response => {
              console.log("response", response);
              this.setState({ responseData: response.message})
          })

      }


    render() {
        const { selectedOption, cityData, matchData, customText, responseData } = this.state; 
  
        let sum = 0;
        if(matchData.length > 0) {
            matchData.map(data => {
                let add = Object.values(data)[1];
                sum = sum + add; 
                return sum;
            })
        }
        
         const columns = [{  
           Header: 'City',  
           accessor: 'city'  
           },{  
           Header: 'Count',  
           accessor: 'count',
           Footer: <span>{sum}</span> 
           }]

        return(
            <section>
                {/* <h2>City</h2> */}
                <section className="select-dropdown">
                <Select
                    value={selectedOption}
                    isMulti
                    className="select-city"
                    onChange={this.handleChange}
                    options={cityData}
                />
                <section className="input-group">
                    <div className="row">
                        <div className="col-75">
                        <input type="text" id="custom-text" name="custom" placeholder="Custom Text" onChange={this.handleTextChange}/>
                        </div>
                    </div>
                    <button className="btn save" disabled={!customText || matchData.length === 0} onClick={this.onSave}>Save</button>
                </section>
                
                </section>  
                <section className="table-section">
               {matchData.length > 0 && <ReactTable  
                  data={matchData}  
                  columns={columns}  
                  defaultPageSize = {matchData.length}
                  pageSize ={matchData.length > 10 ? 10 : matchData.length}
                  pageSizeOptions = {[10, 20, 30]}
                    
              /> } 

                </section>
                {responseData !== '' && responseData}
            </section>
        )
    }
}

export default City;