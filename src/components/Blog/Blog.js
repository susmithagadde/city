import React, { Component } from 'react';
import '../City.css';
// import Modal from "../Modal";


class Blog extends Component {
    constructor(props){
        super(props);
        this.state = {
           
        }
    }
    

    render() {
        const {  handleBlogTextChange,  selectedRadioOption, radioChange, onUpload, blogImgUrl, onError, onSaveBlog,
            imageURlErrored, imageError, blogCondition, onUploadMultiImages, titleAdded } = this.props;
        return (
            <>
             <input type="text" id="title" name="title"  placeholder="Title" onChange={(e) => handleBlogTextChange(e,'title')}/>
             <input type="text" id="sub_title" name="sub_title"  placeholder="Sub Title" onChange={(e) => handleBlogTextChange(e,'sub_title')}/>
             <input type="text" id="author" name="author"  placeholder="Author" onChange={(e) => handleBlogTextChange(e,'author')}/>
                <div className="flex-radio">
                  <div>
                  <input type="radio" value="Yes" name="radio" id="radio1" className="radio" checked={selectedRadioOption === "Yes"} onChange={radioChange}/>
                  <label className="radio-option" htmlFor="radio1">Blog Image url</label>
                  </div>
                  <div>
                  <input type="radio" value="No" name="radio" id="radio2" className="radio" checked={selectedRadioOption === "No"} onChange={radioChange}/>
                  <label className="radio-option" htmlFor="radio2">Upload Blog Image</label>
                  </div>
                </div>
             {selectedRadioOption === "Yes" && <input type="text" id="url" name="url" value={blogImgUrl} placeholder="Image URL" onChange={(e) => handleBlogTextChange(e,'url')}/>}
             {selectedRadioOption === "No" && <input type="file" id="upload" onChange= {(e) => onUpload(e)} />}
             {/* <input type="file" id="upload" onChange= {(e) => onUploadMultiImages(e)} /> */}
             <form  id="img-upload-form" method="post" encType="multipart/form-data">
                <p>
                    <label htmlFor="upload_imgs" className="button hollow">Upload Images +</label>
                    <input className="show-for-sr"  onChange= {(e) => onUploadMultiImages(e)} type="file" id="upload_imgs" name="upload_imgs[]" multiple/>
                </p>
            </form>
             {selectedRadioOption === "Yes" && 
             <img src={blogImgUrl} onError={onError} width="50px" height="50px" style={{display:'none'}} alt="img"/>}
                {((imageURlErrored && selectedRadioOption === "Yes")) && <div className="file-msg">Please add Valid Image URL</div>}
                {(imageError && selectedRadioOption === 'No') && <div className="file-msg">Please make sure your file is in png, jpeg or jpg format and less than 3 MB</div>}
             <button className="btn save" disabled={blogCondition} onClick={onSaveBlog}>Generate</button>
            </>
        )
    }
}

export default Blog;