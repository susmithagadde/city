import React, { Component } from 'react';
import { get } from 'lodash';
import style from './contentModal.module.scss';
import Modal from "../Modal/modal";
import ReactSelect from "react-select";

class ContentModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            isHtml: false,
            newNode: false,
            message: '',
            htmlId: '',
            onSuccessId: '',
            onFailureId: '',
            customId: '',
            newNodeId: '',
        }
    }

    componentDidMount() {
        const { currentContent } = this.props;
        console.log('currentContent---', currentContent)
        if(Object.keys(currentContent).length === 0) {
            this.setState({ newNode: true });
        }
        else {
            if (currentContent.html) {
                const htmlObj = currentContent.html;
                this.setState({
                    isHtml: true,
                    htmlId: htmlObj.id,
                    onSuccessId: htmlObj.successId,
                    onFailureId: htmlObj.failureId,
                    customId: htmlObj.customId,
                });
            } else {
                this.setState({isHtml: false, message: currentContent.message});
            }
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
        const { isHtml, message, htmlId, onSuccessId, onFailureId, newNodeId, customId } = this.state;
        const { updateContent, closeModal } = this.props;
        if(isHtml) {
            updateContent(true, { id: htmlId, successId: onSuccessId, failureId: onFailureId, customId }, newNodeId);
        } else {
            updateContent(false, message, newNodeId);
        }
        closeModal();
    }

    render() {
        const { closeModal, active, currentContent, nodes, htmlComponents } = this.props;
        const { isHtml, message, htmlId, onSuccessId, onFailureId, customId, newNode, newNodeId } = this.state;
        return <div>
            {active &&
            <Modal
                closeModal={closeModal}
            >
                <div className={style.contentWrapper}>
                    <div className={style.flex}>
                        <div className={style.title}>Node: {newNode ? 'create' : currentContent.componentId}</div>
                        <div className={style.checkboxContainer}>
                            <input
                                type="checkbox"
                                checked={isHtml}
                                onChange={() => this.setState({ isHtml: !this.state.isHtml })}
                            /> HTML
                        </div>
                    </div>
                    {newNode && <div className={style.flexVerticalAlign}>
                        <div className={style.label}>Node id:</div>
                        <input
                            type="text"
                            value={newNodeId}
                            onChange={
                                (e) =>
                                    this.setState({ newNodeId: e.target.value })
                            }
                        />
                    </div>}
                    {
                        isHtml ?
                            <div>
                                <br />
                                <div className={style.flexVerticalAlign}>
                                    <div className={style.label}>Html id:</div>
                                    <ReactSelect
                                        className={style.selectField}
                                        options={htmlComponents.map(x => ({value: x, label: x}))}
                                        value={htmlId === "" ? null : {value: htmlId, label: htmlId}}
                                        placeholder="Select option"
                                        onChange={(newValue) => {
                                            this.setState(
                                                { htmlId: newValue.value }
                                            )
                                        }}
                                    />
                                </div>
                                <br />
                                <div className={style.flexVerticalAlign}>
                                    <div className={style.label}>Success Node:</div>
                                    <ReactSelect
                                        className={style.selectField}
                                        options={nodes.map(x => ({value: x, label: x}))}
                                        value={onSuccessId === "" ? null : {value: onSuccessId, label: onSuccessId}}
                                        placeholder="Select option"
                                        onChange={(newValue) => {
                                            this.setState(
                                                { onSuccessId: newValue.value }
                                            )
                                        }}
                                    />
                                </div>
                                <br />
                                <div className={style.flexVerticalAlign}>
                                    <div className={style.label}>Failure Node:</div>
                                    <ReactSelect
                                        className={style.selectField}
                                        options={nodes.map(x => ({value: x, label: x}))}
                                        value={onFailureId === "" ? null : {value: onFailureId, label: onFailureId}}
                                        placeholder="Select option"
                                        onChange={(newValue) => {
                                            this.setState(
                                                { onFailureId: newValue.value }
                                            )
                                        }}
                                    />
                                </div>
                                <br />
                                <div className={style.flexVerticalAlign}>
                                    <div className={style.label}>Custom Node:</div>
                                    <ReactSelect
                                        className={style.selectField}
                                        options={nodes.map(x => ({value: x, label: x}))}
                                        value={customId === "" ? null : {value: customId, label: customId}}
                                        placeholder="Select option"
                                        onChange={(newValue) => {
                                            this.setState(
                                                { customId: newValue.value }
                                            )
                                        }}
                                    />
                                </div>
                                <br />
                            </div> :
                            <div>
                                <br />
                                <div className={style.flexVerticalAlign}>
                                    <div className={style.label}>Message:</div>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={this.updateMessage}
                                    />
                                </div>
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