import React, { Component } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import '../City.css';
// import Modal from "../Modal";


class PanelContent extends Component {
    constructor(props){
        super(props);
        this.state = {
           
        }
    }
    

    render() {
        const {  toggleList,  selectedType, onToggle, onChangeRawHtMl, rawHtml, emailText, onChange, buttonHtml } = this.props;
        return (
            <>
             <div className="d-flex">
                    <p className="status">{toggleList ? "Raw HTML" : selectedType === 'email' ? "Email Editor" : "Blog Editor"}</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={toggleList}
                        className="toggle-list"
                        onChange={onToggle}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {toggleList ? 
                   <textarea value={rawHtml} onChange={(e)=>onChangeRawHtMl(e)}placeholder="Raw HTML" rows="20" name="comment[text]" id="comment_text" cols="40" autoComplete="off"  aria-autocomplete="list" aria-haspopup="true"></textarea>
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
                  onChange={(e) => onChange(e, 'main-editor')}
                  
                  />
                  }
            </>
        )
    }
}

export default PanelContent;