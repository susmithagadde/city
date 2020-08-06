import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom';
import Select from 'react-select';
// import ReactTable from 'react-table-6';
import { Editor } from "@tinymce/tinymce-react";
import Tabs from "./Tabs";
import Modal from "./Modal";
import Panel from "./Panel";
import PostData from "../data/post.js"; 
import { footerHtml, buttonHtml, getHtmlElement } from "../utils/footer";
// import 'react-table-6/react-table.css'
import './City.css';

// overwrite style
const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

const mainStyle = {
	app: {
		margin: "120px 0"
	},
	button: {
		backgroundColor: "#408cec",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
	}
};

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


class City extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedOption: [],
            cityData: [],
            matchData: [],
            savedList:[],
            emailText: '',
            responseData: '', 
            category:['delivered', 'new', 'bounced', 'open', 'deferred', 'click', 'blocked', 'invalid', 'unsubscribe'], 
            subject:'',
            fromName:'Abhishek Banerjee',
            fromEmail:'investor.relations@lotusdew.in',
            buttonDescription:'',
            selectedCategoryOption:[],
            loading: false,
            error:false,
            subscriptionStatus: ['REQUESTED_ACCESS', 'UNSUBSCRIBED', 'RESUBSCRIBE_REQUESTED', 'SUBSCRIBED', 'GRACE_PERIOD'],
            selectedSubcription:[],
            subsEnabled: false,
            testHtml:footerHtml,
            selectedTab:1,
            toggleList: false,
            rawHtml:'',
            isModalOpen: false,
			      isInnerModalOpen: false,
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
            let subsEnabled;

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
            const subsEnable = total && total.filter(data => data.label === 'smallcase-target');
            subsEnabled = subsEnable.length > 0 ? true : false;
            this.setState({matchData: concatArray, selectedOption: total, subsEnabled: subsEnabled});
        }
        else {
            this.setState({matchData: [], selectedOption: [], selectedSubcription:[], subsEnabled: false});
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

      handleSubscriptionChange = selectedSubcription => {
        if (selectedSubcription !== null){
          const total = [...selectedSubcription];
          this.setState({ selectedSubcription: total });
        }
        else {
            this.setState({ selectedSubcription: []});
        }
      }

      handleTextChange = (e, type) => {

        switch (type) {
            case "subject": 
              this.setState({
                subject: e.target.value
              });
              break;
            case "from-name": 
              this.setState({
                fromName: e.target.value
              });
              break;
            case "from-email": 
              this.setState({
                fromEmail: e.target.value
              });
              break;
            default: 
              console.log("unknown category");
              break;
          };
          
      }


      onSave = () => {
          const {  selectedOption, fromName, subject, toggleList, rawHtml, testHtml,
            selectedCategoryOption, selectedSubcription, fromEmail } = this.state;
        
         let finalMatch =  selectedOption.map(data => {
              return data.label;
          })

          const categoryMatch = selectedCategoryOption.map(data => {
            return data.label;
        })
        const SubsMatch = selectedSubcription ? selectedSubcription.map(data => data.label): [];
        const htmlString = toggleList ? rawHtml: testHtml;

        const totalData = {
            subject: subject,
            subscription_status: SubsMatch,
            sender_name: fromName,
            sender_email: fromEmail,
            category: categoryMatch,
            cities: finalMatch,
            html_string:htmlString,
        }
        
        this.setState({ loading: true });
      
            let requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(totalData)   
          }
           
           fetch('https://api.traderight.co/sendBulkEmails', requestOptions)
           .then(res => res.json())
           .then(response => {
               this.setState({ responseData: response.message, loading:false, error:false})
               this.openModal();
           }).catch(error => {
            this.setState({loading:false, error:true, responseData: error.message})
            this.openModal();
          });

      }
      componentWillUnmount() {
        clearInterval(this.timeout);
      }

      onChange = (e, type) => {
        
        switch (type) {
            case "main-editor": 
              this.setState({
                emailText:  e.target.getContent(),
                testHtml: getHtmlElement(e.level.content, footerHtml),
              });
              break;
            // case "custom-text": 
            //   this.setState({
            //     customText: e.target.getContent()
            //   });
            //   break;
            default: 
              console.log("unknown category");
              break;
          };
        
      }

      onConfirm =() => {
        this.props.history.push("/");
      }

      onToggle = () => {
       const { toggleList } = this.state;
         this.setState({ toggleList: !toggleList });
      }

      onChangeRawHtMl = e => {
        this.setState({rawHtml: e.target.value});
      }

      closeModal = () => {
        this.setState({
          isModalOpen: false
        });
        this.props.history.push("/");
      }
    
      openModal = () => {
        this.setState({
          isModalOpen: true
        });
      }


    render() {
        const { selectedOption, rawHtml, emailText, toggleList, cityData, matchData, loading, 
          responseData, subject, fromName, fromEmail,testHtml, subscriptionStatus, selectedCategoryOption, category, 
          selectedSubcription, subsEnabled } = this.state; 
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
        //  const columns = [{  
        //    Header: 'City',  
        //    accessor: 'city'  
        //    },{  
        //    Header: 'Count',  
        //    accessor: 'count',
        //    Footer: <span>{sum}</span> 
        //    }]
           const categoryList = category.map((data) => { 
              return {value: data, label: data}
          });
          const SubscriptionList = subscriptionStatus.map(data => {
            return {value:data, label:data}
          });
         const condition =  matchData.length === 0 || !fromName|| !subject|| (subsEnabled && selectedSubcription.length === 0) || selectedCategoryOption.length === 0 || !fromEmail || (!rawHtml && !emailText);
         return(
            <section className="mail-body">
              <Modal
                isModalOpen={this.state.isModalOpen}
                closeModal={this.closeModal}
                style={modalStyle}
              >
                <p>{responseData ? responseData : 'Testing..'}</p>

                <button
                  style={{
                    ...mainStyle.button,
                    margin: 0,
                    width: "auto",
                    marginTop: 10,
                    backgroundColor:'#24a557',
                  }}
                  onClick={this.closeModal}
                >
                  Close
                </button>
              </Modal>
              { loading && <div>
                <div className="appOverlay" />
                <div className="loader" />
              </div>}
              {/* {responseData !== '' && <div>
                <div className="appOverlay" />
                <div class="success">Mail Sent</div>
                <button className="confirm sent" onClick={() => this.onConfirm()}>Ok</button>
              </div>}
              {error && <div>
                <div className="appOverlay" />
                <div class="error-msg">Mail Not Sent</div>
                <button className="confirm err" onClick={() => this.onConfirm()}>Ok</button>
              </div>} */}
                <section className="mail-container">
                <section className="select-dropdown">
                <Select
                    value={selectedOption}
                    placeholder={<div>Select City</div>}
                    isMulti
                    className="select-city"
                    onChange={this.handleChange}
                    options={cityData}
                    styles={colourStyles}
                />
                <Select
                    value={selectedCategoryOption}
                    placeholder={<div>Select Category</div>}
                    isMulti
                    className="select-category"
                    onChange={this.handleCategoryChange}
                    options={categoryList}
                    styles={colourStyles}
                />
                {subsEnabled && <Select
                    value={selectedSubcription}
                    placeholder={<div>Select Subscription Status</div>}
                    isMulti
                    className="select-subscription"
                    onChange={this.handleSubscriptionChange}
                    options={SubscriptionList}
                    styles={colourStyles}
                />}
                <input type="text" id="subject" name="subject"  placeholder="Subject" onChange={(e) => this.handleTextChange(e,'subject')}/>
                <input type="text" id="from-email" name="from-email" value={fromEmail} placeholder="From (email)" onChange={(e) => this.handleTextChange(e,'from-email')}/>
                <input type="text" id="from-name" name="from-name" value={fromName} placeholder="From (name)" onChange={(e) => this.handleTextChange(e,'from-name')}/>   
                <button className="btn save" disabled={condition} onClick={this.onSave}>Send</button> 
                </section>  
                <section className="main-editor">
                <Tabs selected={0}>
                  <Panel title="Email Content">
                  <div className="d-flex">
                    <p className="status">{toggleList ? "Raw HTML" : "Email Editor"}</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={toggleList}
                        className="toggle-list"
                        onChange={this.onToggle}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {toggleList ? 
                   <textarea value={rawHtml} onChange={(e)=>this.onChangeRawHtMl(e)}placeholder="Raw HTML" rows="20" name="comment[text]" id="comment_text" cols="40" autoComplete="off"  aria-autocomplete="list" aria-haspopup="true"></textarea>
                  :
                  <Editor
                  initialValue={emailText ?  emailText  : "<p style='color:grey'>Email Editor</p>"}
                   init={{
                     height: 600,
                     statusbar: false,
                     plugins: [
                      'link image code', 'textcolor',
                     ],
                     toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | currentdate | forecolor backcolor | Info ',
                     content_css: 'www.tiny.cloud/css/codepen.min.css',
                     setup: function(editor) { 
                              function insertBtn() {
                                var html = buttonHtml;
                                editor.insertContent(html);
                              }

                              function insertTag() {
                                var html = '';
                                editor.insertContent(html);
                              }
                        
                              editor.ui.registry.addButton('currentdate', {
                                text: "Insert Button",
                                tooltip: "Insert Button",
                                onAction: () => insertBtn()
                              });
                               editor.ui.registry.addButton('Info', {
                                   icon:'help',
                                   tooltip: "tags 1.Name {{name}} 2.unsubscribe link: {{unsubscribe}} 3. Firm Name: {{member_name}}",
                                   onAction: () => insertTag()
                               });
                            }
                   }}
                  //  init={{
                  //      height: 400,
                  //      plugins: ['link image code', 'textcolor'],
                  //      menubar: false,
                  //      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | currentdate | forecolor backcolor',
                  //      color_map: [
                  //        "000000", "Black",
                  //        "808080", "Gray",
                  //        "FFFFFF", "White",
                  //        "FF0000", "Red",
                  //        "FFFF00", "Yellow",
                  //        "008000", "Green",
                  //        "0000FF", "Blue"
                  //      ],
                  //      content_css: 'www.tiny.cloud/css/codepen.min.css',
                  //      setup: function(editor) {
    
                  //         // function toTimeHtml(date) {
                  //         //   return '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
                  //         // }
                        
                  //        function insertDate() {
                  //          var html = '<button>New Button</button>';
                  //          editor.insertContent(html);
                  //        }
                    
                  //        editor.addButton('currentdate', {
                  //           icon: 'insertdatetime',
                  //          text: "Insert Button",
                  //          tooltip: "Insert Current Date",
                  //          onclick: insertDate
                  //        });
                  //      }
                  //  }}
                  onChange={(e) => this.onChange(e, 'main-editor')}
                  
                  />
                  }
                  
                  </Panel>
                  <Panel title="Preview"> <iframe title="preview" srcDoc={testHtml}></iframe></Panel>
                </Tabs> 
                  
                </section>
                {/* <section className="table-section">
               {matchData.length > 0 && <ReactTable  
                  data={matchData}  
                  columns={columns}  
                  defaultPageSize = {matchData.length}
                  pageSize ={matchData.length > 10 ? 10 : 10}
                  pageSizeOptions = {[10, 20, 30]}
                    
              /> } 

                </section> */}
                {/* {responseData !== '' && responseData} */}
            </section>
            </section>
            
        )
    }
}

export default withRouter(City);