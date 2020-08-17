import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom';
import Select from 'react-select';
// import ReactTable from 'react-table-6';
import { Editor } from "@tinymce/tinymce-react";
import moment from 'moment';
import Tabs from "./Tabs";
import Modal from "./Modal";
import Panel from "./Panel";
import PostData from "../data/post.js"; 
import { footerHtml, buttonHtml, getHtmlElement, blogFooter } from "../utils/footer";
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
            typeList: ['email', 'blog'],
            selectedType:'blog',
            blogTitle:'',
            blogSubTitle:'',
            blogAuthor:'',
            blogImgUrl:'',
            image:'',
            selectedRadioOption:'',
            imageError: false,
            footerRender:blogFooter,
            imageURlErrored: false,
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

      handleBlogTextChange = (e, type) => {
        switch (type) {
            case "title": 
              this.setState({
                blogTitle: e.target.value
              });
              break;
            case "sub_title": 
              this.setState({
                blogSubTitle: e.target.value
              });
              break;
            case "author": 
              this.setState({
                blogAuthor: e.target.value
              });
              break;
            case "url": 
            this.setState({
              blogImgUrl: e.target.value,
              imageURlErrored: false,
            });
            break;
            default: 
              console.log("unknown category");
              break;
          }; 
      }

      onSaveBlog = () => {
        const {  toggleList, rawHtml, footerRender, image,
                blogTitle, blogSubTitle, blogAuthor, blogImgUrl, selectedRadioOption } = this.state;
          const htmlString = toggleList ? rawHtml: footerRender;
          const today = moment();
          const format = moment(today).format("MMM DD, YYYY");
          const url = selectedRadioOption === "Yes" ? blogImgUrl: image;
          const totalData = {
            blog_title: blogTitle,
            blog_updated_on: format,
            blog_sub_title: blogSubTitle,
            blog_author: blogAuthor,
            blog_content:htmlString,
            image_type: selectedRadioOption === "Yes" ? "url": "image",
            url: url,
        }

          const jsonFormat =  JSON.stringify(totalData);
        this.setState({ loading: true });
      
            let requestOptions = {
                method: 'POST',
                 headers: {
                  'Content-Type': 'application/json'},
                body: jsonFormat  
          }
           
            fetch('https://dev-api.lotusdew.in/blogs/blog/insert', requestOptions)
            .then(res => res.json())
            .then(response => {
                this.setState({ responseData: response.message, loading:false, error:false})
                this.openModal();
            }).catch(error => {
             this.setState({loading:false, error:true, responseData: error.message})
             this.openModal();
           });

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

      onChange = (e, type) => {
        const { selectedType } = this.state;
        switch (type) {
            case "main-editor": 
                if(selectedType === 'email'){
                  this.setState({
                    emailText:  e.target.getContent(),
                    testHtml: getHtmlElement(e.level.content, footerHtml),
                    footerRender:getHtmlElement(e.level.content, footerHtml),
                  });
                }
                else{ 
                  this.setState({
                    emailText:  e.target.getContent(),
                    footerRender: e.target.getContent() + blogFooter,
                  });
                }
              
              break;
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

      handleChangeTypes = selectedOption => {
        if(selectedOption.value === 'email'){
              this.setState({footerRender: footerHtml})
        }
        else{
          this.setState({footerRender: blogFooter})
        }
        this.setState({selectedType: selectedOption.value});
      }

       onUpload = e => {
        //  var url = URL.createObjectURL(e.target.files[0]);
         var self = this;
         var reader = new FileReader();
         var file = e.target.files[0];
         var sFileName = file.name;
         var sFileExtension = sFileName.split(".")[1].toUpperCase();
         var iFileSize = file.size/1024/1024;
          if (( sFileExtension === "PNG" || sFileExtension === "JPEG" ||  sFileExtension === "JPG"  ) && iFileSize < 3 ) {
              reader.onload = function(upload) {
                self.setState({
                    image: upload.target.result,
                    imageError: false,
                });
            };
          }
          else{
              reader.onload = function(upload) {
                self.setState({
                    image: '',
                    imageError: true,
                });
            };
          }
         
       reader.readAsDataURL(file);    
       }

      radioChange = (e) => {
        this.setState({
          selectedRadioOption: e.currentTarget.value
        });
      }

      onError = () => {
        const { imageURlErrored, blogImgUrl } = this.state;
        if (!imageURlErrored && blogImgUrl) {
          this.setState({
            imageURlErrored: true,
            blogImgUrl: '',
          });
        }
      }


    render() {
        const { selectedOption, selectedRadioOption, imageURlErrored, footerRender, rawHtml, image, selectedType, typeList, emailText, toggleList, cityData, matchData, loading, 
          responseData, subject, fromName, fromEmail, subscriptionStatus, selectedCategoryOption, category, 
          selectedSubcription, subsEnabled, imageError, blogTitle, blogSubTitle, blogAuthor, blogImgUrl, } = this.state; 
         const types =  typeList.map(list => {
            return {value: list, label: list}
          })
          const EditorName = selectedType === 'email' ? 'Email Content': 'Blog Content';
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
           const categoryList = category.map((data) => { 
              return {value: data, label: data}
          });
          const SubscriptionList = subscriptionStatus.map(data => {
            return {value:data, label:data}
          });
          const htmlString = toggleList ? rawHtml: emailText;
          const blogCondition =  !blogTitle || !blogSubTitle|| !blogAuthor|| (!image && !blogImgUrl) || !htmlString;
         const condition =  matchData.length === 0 || !fromName|| !subject|| (subsEnabled && selectedSubcription.length === 0) || selectedCategoryOption.length === 0 || !fromEmail || (!rawHtml && !emailText);
         return(
            <section className="mail-body">
              <Modal
                isModalOpen={this.state.isModalOpen}
                closeModal={this.closeModal}
                style={modalStyle}
              >
                <p>{responseData ? responseData : 'Something Went Wrong..'}</p>

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
                <section className="mail-container">
                <section className="select-dropdown">
                <Select
                    defaultValue={types[1]}
                    className="select-type"
                    onChange={this.handleChangeTypes}
                    options={types}
                    styles={colourStyles}
                />
                {selectedType === 'email' ? 
                <>
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
              <Select
                  value={selectedSubcription}
                  placeholder={<div>Select Subscription Status</div>}
                  isMulti
                  isDisabled={!subsEnabled}
                  className="select-subscription"
                  onChange={this.handleSubscriptionChange}
                  options={SubscriptionList}
                  styles={colourStyles}
              />
            <input type="text" id="subject" name="subject"  placeholder="Subject" onChange={(e) => this.handleTextChange(e,'subject')}/>
            <input type="text" id="from-email" name="from-email" value={fromEmail} placeholder="From (email)" onChange={(e) => this.handleTextChange(e,'from-email')}/>
            <input type="text" id="from-name" name="from-name" value={fromName} placeholder="From (name)" onChange={(e) => this.handleTextChange(e,'from-name')}/>   
            <button className="btn save" disabled={condition} onClick={this.onSave}>Send</button>
            {/* {image && <img src={image} alt="ds" width="100px" height="100px"/>} */}
            </>:
            <>
             <input type="text" id="title" name="title"  placeholder="Title" onChange={(e) => this.handleBlogTextChange(e,'title')}/>
             <input type="text" id="sub_title" name="sub_title"  placeholder="Sub Title" onChange={(e) => this.handleBlogTextChange(e,'sub_title')}/>
             <input type="text" id="author" name="author"  placeholder="Author" onChange={(e) => this.handleBlogTextChange(e,'author')}/>
                <div className="flex-radio">
                  <div>
                  <input type="radio" value="Yes" name="radio" id="radio1" className="radio" checked={selectedRadioOption === "Yes"} onChange={this.radioChange}/>
                  <label className="radio-option" For="radio1">Add Image url</label>
                  </div>
                  <div>
                  <input type="radio" value="No" name="radio" id="radio2" className="radio" checked={selectedRadioOption === "No"} onChange={this.radioChange}/>
                  <label className="radio-option" For="radio2">Upload Image</label>
                  </div>
                </div>
             {selectedRadioOption === "Yes" && <input type="text" id="url" name="url" value={blogImgUrl} placeholder="Image URL" onChange={(e) => this.handleBlogTextChange(e,'url')}/>}
             {selectedRadioOption === "No" && <input type="file" id="upload" onChange= {(e) => this.onUpload(e)} />}
             {selectedRadioOption === "Yes" && 
             <img src={blogImgUrl} onError={this.onError} width="50px" height="50px" style={{display:'none'}} alt="img"/>}
                {((imageURlErrored && selectedRadioOption === "Yes")) && <div className="file-msg">Please add Valid Image URL</div>}
                {(imageError && selectedRadioOption === 'No') && <div className="file-msg">Please make sure your file is in png, jpeg or jpg format and less than 3 MB</div>}
             <button className="btn save" disabled={blogCondition} onClick={this.onSaveBlog}>Generate</button>
            </>}
                
                </section>  
                <section className="main-editor">
                <Tabs selected={0}>
                  <Panel title={EditorName}>
                  <div className="d-flex">
                    <p className="status">{toggleList ? "Raw HTML" : selectedType === 'email' ? "Email Editor" : "Blog Editor"}</p>
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
                  initialValue={emailText && emailText}
                  
                   init={{
                     height: 600,
                     statusbar: false,
                     plugins: [
                      'link image code', 'textcolor',
                     ],
                     placeholder: "Editor",
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
                  onChange={(e) => this.onChange(e, 'main-editor')}
                  
                  />
                  }
                  
                  </Panel>
                  <Panel title="Preview"> <iframe title="preview" srcDoc={footerRender}></iframe></Panel>
                </Tabs> 
                  
                </section>
            </section>
            </section>
            
        )
    }
}

export default withRouter(City);