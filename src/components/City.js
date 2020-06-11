import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import Select from 'react-select';
import ReactTable from 'react-table-6';
import { Editor } from "@tinymce/tinymce-react";
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
            category:['delivered', 'new', 'bounced', 'open', 'deferred', 'click', 'blocked', 'invalid', 'unsubscribe'], 
            subject:'',
            buttonText:'',
            buttonLink:'',
            buttonDescription:'',
            selectedCategoryOption:[],
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

      handleCategoryChange = selectedCategoryOption => {
         if (selectedCategoryOption !== null){
             const total = [...selectedCategoryOption];
             this.setState({ selectedCategoryOption: total });
         }
         else {
             this.setState({ selectedCategoryOption: []});
         }

      };

      handleTextChange = (e, type) => {

        switch (type) {
            case "subject": 
              this.setState({
                subject: e.target.value
              });
              break;
            case "btn-text": 
              this.setState({
                buttonText: e.target.value
              });
              break;
            case "btn-link": 
              this.setState({
                buttonLink: e.target.value
              });
              break;
            default: 
              console.log("unknown category");
              break;
          };
          
      }


      onSave = () => {
          const { customText, selectedOption, buttonDescription, buttonText, subject, selectedCategoryOption, buttonLink } = this.state;
        
         let finalMatch =  selectedOption.map(data => {
              return data.label;
          })

          const categoryMatch = selectedCategoryOption.map(data => {
            return data.label;
        })

        const totalData = {
            subject: subject,
            custom_text: customText,
            button_desc: buttonDescription,
            button_text: buttonText,
            button_link: buttonLink,
            category: categoryMatch,
            cities: finalMatch,
        }
        

           let requestOptions = {
               method: 'POST',
               headers: {'Content-Type': 'application/json' },
               body: JSON.stringify(totalData)   
         }
           
           fetch('https://api.traderight.co/sendBulkEmails', requestOptions)
           .then(res => res.json())
           .then(response => {
               this.setState({ responseData: response.message})
           })

      }

      onChange = (e, type) => {
        switch (type) {
            case "btn-desc": 
              this.setState({
                buttonDescription: e.target.getContent()
              });
              break;
            case "custom-text": 
              this.setState({
                customText: e.target.getContent()
              });
              break;
            default: 
              console.log("unknown category");
              break;
          };
        
      }


    render() {
        const { selectedOption, cityData, matchData, customText, responseData, subject, buttonText, buttonLink, buttonDescription, selectedCategoryOption, category } = this.state; 
        if(this.props.location.authSuccess === false || this.props.location.authSuccess === undefined ) {
          return <Redirect to='/'  />
         }
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

           const categoryList = category.map((data) => { 
              return {value: data, label: data}
          });

          const condition = !customText || matchData.length === 0 || !buttonDescription || !buttonText|| !subject|| !selectedCategoryOption.length === 0 || !buttonLink;
        return(
            <section className="mail-body">
                <section className="mail-container">
                <section className="select-dropdown">
                <Select
                    value={selectedOption}
                    placeholder={<div>Select City</div>}
                    isMulti
                    className="select-city"
                    onChange={this.handleChange}
                    options={cityData}
                />
                <Select
                    value={selectedCategoryOption}
                    placeholder={<div>Select Category</div>}
                    isMulti
                    className="select-category"
                    onChange={this.handleCategoryChange}
                    options={categoryList}
                />
                <input type="text" id="subject" name="subject" placeholder="Subject" onChange={(e) => this.handleTextChange(e,'subject')}/>
               
                
                <input type="text" id="button-text" name="button-text" placeholder="Button Text" onChange={(e) => this.handleTextChange(e,'btn-text')}/>
                <Editor
                initialValue="<p style='color:grey'>Button Description</p>"
                init={{
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                }}
                onChange={(e) => this.onChange(e, 'btn-desc')}
                />
                <input type="text" id="button-link" name="button_link" placeholder="Button Link" onChange={(e) => this.handleTextChange(e,'btn-link')}/>
                <Editor
                initialValue="<p style='color:grey'>Custom Text</p>"
                init={{
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                }}
                onChange={(e) => this.onChange(e, 'custom-text')}
                />
                <button className="btn save" disabled={condition} onClick={this.onSave}>Send</button> 
                </section>  
                <section className="table-section">
               {matchData.length > 0 && <ReactTable  
                  data={matchData}  
                  columns={columns}  
                  defaultPageSize = {matchData.length}
                  pageSize ={matchData.length > 10 ? 10 : 10}
                  pageSizeOptions = {[10, 20, 30]}
                    
              /> } 

                </section>
                {responseData !== '' && responseData}
            </section>
            </section>
            
        )
    }
}

export default City;