import React, { Component } from 'react';
import { get } from 'lodash';
import Select from "react-select";
import style from './contentModal.module.scss';
import Modal from "../Modal/modal";

class ContentModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            isHtml: false,
            message: '',
            htmlId: '',
            onSuccessId: '',
            onFailureId: '',
        }
    }

    componentDidMount() {
        const { currentContent } = this.props;
        if(currentContent.html) {
            this.setState({ isHtml: true});
        } else {
            this.setState({ message: currentContent.message});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(nextProps.currentContent) !== JSON.stringify(this.props.currentContent)) {
            const currentContent = nextProps.currentContent;
            if(currentContent.html) {
                this.setState({ isHtml: true});
            } else {
                this.setState({ message: currentContent.message});
            }
        }
    }

    updateMessage = (e) => {
        this.setState({ message: e.target.value});
    }

    updateContent = () => {
        const { isHtml, message, htmlId, onSuccessId, onFailureId } = this.state;
        const { updateContent, closeModal } = this.props;
        if(isHtml) {
            updateContent(true, { htmlId, onSuccessId, onFailureId });
        } else {
            updateContent(false, message);
        }
        closeModal();
    }

    render() {
        const { closeModal, active, currentContent } = this.props;
        const { isHtml, message } = this.state;
        return <div>
            {active &&
            <Modal
                closeModal={closeModal}
            >
                <div className={style.contentWrapper}>
                    <div className={style.flex}>
                        <div className={style.title}>Node: {currentContent.componentId}</div>
                        <div className={style.checkboxContainer}>
                            <input
                                type="checkbox"
                                defaultChecked={isHtml}
                                onChange={() => this.setState({ isHtml: !this.state.isHtml })}
                            /> HTML
                        </div>
                    </div>
                    {
                        isHtml ?
                            <div>
                                <div>html id: {get(currentContent, 'html.id', '')}</div>
                                <div>onSuccessNode: {get(currentContent, 'html.successId', '')}</div>
                                <div>onFailureNode: {get(currentContent, 'html.failureId', '')}</div>
                            </div> :
                            <div className={style.flexVerticalAlign}>
                                Message: &nbsp;&nbsp;
                                <input
                                    type="text"
                                    value={message}
                                    onChange={this.updateMessage}
                                />
                            </div>
                    }
                    <br />
                    <button className={style.button} onClick={this.updateContent}>Done</button>
                </div>
            </Modal>}
        </div>
    }
}

export default ContentModal;