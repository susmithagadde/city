import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom';
import Select from 'react-select';
import ReactTable from 'react-table-6';
import { Editor } from "@tinymce/tinymce-react";
import moment from 'moment';
import Tabs from "./Tabs";
import Modal from "./Modal";
import Panel from "./Panel";
import ModalContent from "./ModalContent/ModalContent";
import Email from "./Email/Email";
import Blog from "./Blog/Blog";
import PanelContent from "./PanelContent/PanelContent";
import PostData from "../data/post.js";
import { footerHtml, buttonHtml, getHtmlElement, blogFooter } from "../utils/footer";
import { modalStyle, mainStyle, colourStyles } from "../utils/style";
import Appointments from "./Appointments/Appointments";
import BotBuilder from "./BotBuilder/botBuilder";
import 'react-table-6/react-table.css'
import './City.css';
import BotBuilderLeftPane from "./BotBuilder/botBuilderLeftPane";

var counter = 0;

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
            typeList: ['email', 'blog', 'Appointments', 'Bot builder'],
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
            scheduleList:[],
            selectedSentimentType:'Positive',
            Sentiment:['Highly Positive', 'Positive', 'Neutral', 'Negative', 'Extremely Negative'],
            attendedId:0,
            comments:'',
            callStatus:'',
            savedData:[],
            imageHtml: '',
            titleAdded: false,
            EditorSet:'',
            startDate: new Date(),
            endDate: new Date(),
            formatStartDate:moment().subtract(7,'days').format("DD/MM/YYYY"),
            formatEndDate:moment().add(7,'days').format('DD/MM/YYYY'),
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
        let re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        switch (type) {
            case "title":
                this.setState({
                    blogTitle: e.target.value,
                    titleAdded: true,
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
                const isValidURL = re.test(e.target.value);
                this.setState({
                    blogImgUrl: e.target.value,
                    imageURlErrored: !isValidURL,
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
        //selectedRadioOption === "Yes" ? "url": "image",
        const totalData = {
            title: blogTitle.split(" ").join("-"),
            updated_on: format,
            sub_title: blogSubTitle,
            author: blogAuthor,
            content:htmlString,
            image_type: "url",
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
        // https://api.lotusdew.in/
        fetch('https://api.lotusdew.in/blogs/blog/insert', requestOptions)
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
                if(selectedType === 'email'){ //console.log("email", e.level.content);
                  this.setState({
                    emailText:  e.target.getContent(),
                    testHtml: getHtmlElement(e.target.getContent(), footerHtml),
                    footerRender:getHtmlElement(e.target.getContent(), footerHtml),
                    EditorSet:e.target,
                  });
                }
                else{ 
                  this.setState({
                    emailText:  e.target.getContent(),
                    footerRender: e.target.getContent(),
                    EditorSet:e.target,
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
        const { responseData, selectedType } = this.state;
        this.setState({
            isModalOpen: false,
            responseData:'',
            savedData:'',
        });
        if(selectedType === 'Appointments') {
            responseData !== ''  &&  this.props.history.push("/");
        }
        else{
            this.props.history.push("/");
        }
    }

    openModal = () => {
        this.setState({
            isModalOpen: true
        });
    }

    handleChangeTypes = selectedOption => {
        const { formatStartDate } = this.state;
        if(selectedOption.value === 'email'){
            this.setState({footerRender: footerHtml})
        }
        else if(selectedOption.value === 'Appointments') {
            const startDate = new Date();
            const endDate = moment(startDate, "YYYY-MM-DD").add(7, 'days');
            this.onSubmitDate(formatStartDate, endDate);
        }
        else{
            this.setState({footerRender: blogFooter})
        }
        this.setState({selectedType: selectedOption.value});
    }

    onUpload = e => {
        //  var url = URL.createObjectURL(e.target.files[0]);
        const { blogTitle } = this.state;
        // if(blogTitle !== ''){
        const title =  blogTitle.split(" ").join("-");
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        var sFileName = file.name;
        var sFileExtension = sFileName.split(".")[1].toUpperCase();
        var iFileSize = file.size/1024/1024;
        if (( sFileExtension === "PNG" || sFileExtension === "JPEG" ||  sFileExtension === "JPG"  ) && iFileSize < 3 ) {
            reader.onload = function(upload) {
                const totalData = {
                    title: title,
                    image: upload.target.result,
                }
                const jsonFormat =  JSON.stringify(totalData);
                self.getImageUrl('blog-img', jsonFormat);

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
        //   }
        //   else{
        //     this.setState({titleAdded: false})
        //  }
    }

    getImageUrl = (type, jsonFormat) => {
        this.setState({ loading: true });
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
              body: jsonFormat  
          }
          fetch('https://m73hh8wqb2.execute-api.ap-south-1.amazonaws.com/upload_blog', requestOptions)
          .then(res => res.json())
          .then(response => {
          if(type === 'content'){
            const images = `<img src=${response.url} alt="img" width="500px" height="300px" />`;
            this.setState({ 
              responseData: response.url,
              imageHtml: images,
              emailText: this.state.EditorSet !== '' ? this.state.EditorSet.setContent(images + this.state.emailText) : images + this.state.emailText,
              footerRender: images + this.state.footerRender + blogFooter,
              imageError: false, 
              loading:false, 
              error:false
            })
          }
          else{
              this.setState({
                image: response.url,
                imageError: false,
                loading:false, 
                error:false
            });
          }
          }).catch(error => {
            this.setState({loading:false, error:true, responseData: error.message})
        });
    }

    onUploadMultiImages = e => {
        //  var url = URL.createObjectURL(e.target.files[0]);
        const { blogTitle } = this.state;
        // if(blogTitle !== ''){
        const title =  blogTitle.split(" ").join("-");
        this.setState({titleAdded: true});
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        var sFileName = file.name;
        var sFileExtension = sFileName.split(".")[1].toUpperCase();
        var iFileSize = file.size/1024/1024;
        if (( sFileExtension === "PNG" || sFileExtension === "JPEG" ||  sFileExtension === "JPG"  )) {
            reader.onload = function(upload) {
                counter = counter + 1;
                const totalData = {
                    image: upload.target.result,
                }
                const jsonFormat =  JSON.stringify(totalData);
                self.getImageUrl('content', jsonFormat);
            };
        }
        else{
            reader.onload = function(upload) {
                self.setState({
                    image: '',
                    imageError: true,
                    imageHtml:'',
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
        if (!imageURlErrored && blogImgUrl !== '') {
            this.setState({
                imageURlErrored: true,
                blogImgUrl: '',
            });
        }
        else if(imageURlErrored){
            this.setState({
                imageURlErrored: true,
            });
        }
    }

    onSubmitDate = (startDate, EndDate) => {
        const totalData = {
            fromDate: moment(startDate).format("YYYY-MM-DD"),
            toDate: moment(EndDate).format("YYYY-MM-DD"),
        }
        const jsonFormat =  JSON.stringify(totalData);
        this.setState({ loading: true });

        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
            body: jsonFormat
        }

        fetch('https://api.lotusdew.in/api/schedule-list', requestOptions)
            .then(res => res.json())
            .then(response => {
                this.setState({ scheduleList: response.data, loading:false, error:false})
            }).catch(error => {
            this.setState({loading:false, error:true, scheduleList: ''})
        });

    }

    onsaveFeedback = () => {
        const { attendedId, comments, selectedSentimentType, callStatus } = this.state;

        const totalData = {
            call_status: "Completed",
            comments: comments,
            sentiment: selectedSentimentType,
            id:attendedId.toString()
        }

        const jsonFormat =  JSON.stringify(totalData);
        this.setState({ loading: true, responseData:'' });

        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
            body: jsonFormat
        }

        fetch('https://api.lotusdew.in/api/schedule-update', requestOptions)
            .then(res => res.json())
            .then(response => {
                this.setState({ responseData: response.message, loading:false, error:false})
            }).catch(error => {
            this.setState({loading:false, error:true, responseData: error.message})
        });
    }

    onAttend = (row) => {
        if(row.original.call_status === 'Completed'){
            const totalData = {
                id:row.original.id.toString()
            }

            const jsonFormat =  JSON.stringify(totalData);
            this.setState({ loading: true, responseData:'' });

            let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'},
                body: jsonFormat
            }

            fetch('https://api.lotusdew.in/api/schedule-get', requestOptions)
                .then(res => res.json())
                .then(response => {
                    this.setState({ savedData: response.data, loading:false, error:false})
                }).catch(error => {
                this.setState({loading:false, error:true, savedData: error.message})
            });
        }
        this.openModal();
        this.setState({attendedId: row.original.id, callStatus: row.original.call_status})
    }

    handleChangeSentiment = selectedOption => {
        this.setState({selectedSentimentType: selectedOption.value});
    }


    onComment = e => {
        this.setState({comments: e.target.value});
    }

    handleAppointmentChange = (date) => {
        this.setState({
            formatStartDate: moment(date).format("DD/MM/YYYY"),
            startDate: date,
            formatEndDate: moment(date).format("DD/MM/YYYY"),
            endDate: date,     
        });
      };
      handleEndDate = date => {
        this.setState({
            formatEndDate: moment(date).format("DD/MM/YYYY"),
            endDate: date,    
        });
      }

    render() {
        const { selectedOption, selectedRadioOption, imageURlErrored, footerRender, rawHtml, image, selectedType, typeList, emailText, toggleList, cityData, matchData, loading,
            responseData, subject, titleAdded,  fromName, fromEmail, selectedSentimentType, subscriptionStatus, selectedCategoryOption, category, scheduleList, Sentiment,
            selectedSubcription, subsEnabled, savedData, comments, imageError, blogTitle, blogSubTitle, blogAuthor, blogImgUrl, 
            startDate, endDate, formatEndDate, formatStartDate, callStatus, attendedId, } = this.state;
        const types =  typeList.map(list => {return {value: list, label: list}});
        const feedbackTypes =  Sentiment.map(list => {return {value: list, label: list}});
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
        const categoryList = category.map((data) => { return {value: data, label: data}});
        const SubscriptionList = subscriptionStatus.map(data => {return {value:data, label:data}});
        const htmlString = toggleList ? rawHtml: emailText;
        const blogCondition =  !blogTitle || !blogSubTitle|| !blogAuthor|| (!image && !blogImgUrl) || !htmlString;
        const condition =  matchData.length === 0 || !fromName|| !subject|| (subsEnabled && selectedSubcription.length === 0) || selectedCategoryOption.length === 0 || !fromEmail || (!rawHtml && !emailText);
        const columns = [
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Phone',
                accessor: 'phone',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: (row) => (<span>{moment(row.value).format("DD MMM, YYYY")}</span> ),
            },
            {
                Header: 'Slot',
                accessor: 'slot',
            },
            {
                Header: 'Created At',
                accessor: 'created_at',
                Cell: (row) => (<span>{moment(row.value).format("DD MMM, YYYY")}</span> ),
            },
            {
                Header: 'Call Status',
                accessor: 'call_status',
                Cell: (row) => ( <div className='callStatus-container'>
                    {/* {row.value} */}
                    {row.value  !== 'Completed'
                        ?
                        <button className="attended-btn"><i class="fa fa-calendar" aria-hidden="true" aria-hidden="true" onClick={() =>this.onAttend(row)}>&nbsp;Attended</i></button>
                        :
                        <button className="attended-btn"><i class="fa fa-calendar-check-o" aria-hidden="true" onClick={() =>this.onAttend(row)}>&nbsp;Completed</i></button>
                    }</div> ),

            },
        ];
        return(
            <section className="mail-body">
                <Modal
                    isModalOpen={this.state.isModalOpen}
                    closeModal={this.closeModal}
                    style={modalStyle}
                >
                    <ModalContent
                        selectedType={selectedType}
                        scheduleList={scheduleList}
                        responseData={responseData}
                        feedbackTypes={feedbackTypes}
                        handleChangeSentiment={this.handleChangeSentiment}
                        callStatus={callStatus}
                        savedData={savedData}
                        selectedSentimentType={selectedSentimentType}
                        comments={comments}
                        onComment={(e)=>this.onComment(e)}
                        mainStyle={mainStyle}
                        closeModal={this.closeModal}
                        onsaveFeedback={this.onsaveFeedback}
                    />
                    {/* {(selectedType === 'Appointments' && scheduleList.length > 0 && responseData === '' ) ?
               <div className="feedback-flex">
               <Select
                    defaultValue={feedbackTypes[1]}
                    className="select-feedback"
                    onChange={this.handleChangeSentiment}
                    isDisabled={callStatus === 'Completed'}
                    options={feedbackTypes}
                    styles={colourStyles}
                    value={savedData.length !== 0 ? {value: savedData.sentiment, label: savedData.sentiment} : {value: selectedSentimentType, label: selectedSentimentType}}
                />
                 <textarea disabled={callStatus === 'Completed'} value={savedData.length !== 0  ? savedData.comments : comments} placeholder="Comment" rows="4"  cols="45" autoComplete="off" onChange={(e)=>this.onComment(e)}></textarea>
                 {savedData.length !== 0  ? <button
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
               </button>:<button style={{
                   ...mainStyle.button,
                   margin: 0,
                   width: "auto",
                   marginTop: 10,
                   backgroundColor:'#24a557',
                 }}  onClick={this.onsaveFeedback}>Save</button>}
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
                 onClick={this.closeModal}
               >
                 Close
               </button>
               </>
               }  */}
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
                        {selectedType === 'email' &&
                        <Email
                            selectedOption={selectedOption}
                            handleChange={this.handleChange}
                            cityData={cityData}
                            colourStyles={colourStyles}
                            selectedCategoryOption={selectedCategoryOption}
                            handleCategoryChange={this.handleCategoryChange}
                            categoryList={categoryList}
                            selectedSubcription={selectedSubcription}
                            subsEnabled={subsEnabled}
                            handleSubscriptionChange={this.handleSubscriptionChange}
                            SubscriptionList={SubscriptionList}
                            handleTextChange={this.handleTextChange}
                            onSave={this.onSave}
                            condition={condition}
                            fromEmail={fromEmail}
                            fromName={fromName}
                        />}
                        {selectedType === 'blog' &&
                        <Blog
                            handleBlogTextChange={this.handleBlogTextChange}
                            selectedRadioOption={selectedRadioOption}
                            titleAdded={titleAdded}
                            radioChange={this.radioChange}
                            onUpload={this.onUpload}
                            onUploadMultiImages={this.onUploadMultiImages}
                            blogImgUrl={blogImgUrl}
                            onError={this.onError}
                            onSaveBlog={this.onSaveBlog}
                            imageURlErrored={imageURlErrored}
                            imageError={imageError}
                            blogCondition={blogCondition}
                        />}
                        { selectedType === 'Appointments' &&  
                        <Appointments 
                            handleChange={this.handleAppointmentChange} 
                            handleEndDate={this.handleEndDate} 
                            onSubmitDate={this.onSubmitDate}
                            startDate= {startDate}
                            endDate= {endDate}
                            formatStartDate= {formatStartDate}
                            formatEndDate= {formatEndDate}
                        />}
                        { selectedType === 'Bot builder' &&  <BotBuilderLeftPane />}

                    </section>
                    <section className="main-editor">
                        {selectedType === 'Appointments' &&
                        <div>
                            {scheduleList.length > 0 ?
                                <div className="table-container">
                                    <ReactTable
                                        data={scheduleList}
                                        columns={columns}
                                        // noDataText="No Data Available"
                                        // filterable
                                        // getTrProps={this.onRowClick}
                                        defaultPageSize={5}
                                        className="-striped -highlight"/>
                                </div>
                                :
                                <div className="not-found">No Appointments were Scheduled</div>}
                        </div>
                        }
                        {selectedType === 'Bot builder' &&
                            <BotBuilder />
                        }
                        {(selectedType === 'email' || selectedType === 'blog') &&
                        <Tabs selected={0}>
                            <Panel title={EditorName}>
                                <PanelContent
                                    toggleList={toggleList}
                                    selectedType={selectedType}
                                    onToggle={this.onToggle}
                                    onChangeRawHtMl={this.onChangeRawHtMl}
                                    emailText={emailText}
                                    onChange={this.onChange}
                                    buttonHtml={buttonHtml}
                                    rawHtml={rawHtml}
                                />
                            </Panel>
                            <Panel title="Preview"> <iframe title="preview" srcDoc={footerRender}></iframe></Panel>
                        </Tabs>}

                    </section>
                </section>
            </section>

        )
    }
}

export default withRouter(City);