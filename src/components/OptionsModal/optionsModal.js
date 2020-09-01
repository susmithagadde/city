import React, { Component } from 'react';
import ReactSelect from 'react-select';
import Modal from '../Modal/modal';
import style from './optionsModal.module.scss';
import {get} from "lodash";

class OptionsModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            newOption: false,
            isHtml: false,
            text: '',
            nextNode: '',
        }
    }

    componentDidMount() {
        const { currentOption } = this.props;
        if(Object.keys(currentOption).length > 0){
            if(currentOption.optionHtml) {
                this.setState({ isHtml: true});
            } else {
                this.setState({ text: currentOption.text, nextNode: currentOption.id});
            }
        }
        else {
            this.setState({ newOption: true });
        }
    }

    updateText = (e) => {
        this.setState({ text: e.target.value});
    }

    updateOptionContent = () => {
        const { isHtml, text, nextNode, htmlId, newOption } = this.state;
        const { updateOption, closeModal } = this.props;
        if(isHtml) {
            updateOption(true, newOption, htmlId, nextNode);
        } else {
            updateOption(false, newOption, text, nextNode);
        }
        closeModal();
    }

    render() {
        const { closeModal, active, currentContent, nodes } = this.props;
        const { isHtml, newOption, text, nextNode } = this.state;
        return <div>
            {active &&
            <Modal
                closeModal={closeModal}
            >
                <div className={style.contentWrapper}>
                    <div className={style.flex}>
                        <div className={style.title}>Node: {currentContent.componentId}, {newOption ? 'Add option' : 'Edit option'}</div>
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
                                Option text: &nbsp;&nbsp;
                                <input
                                    type="text"
                                    value={text}
                                    onChange={this.updateText}
                                />
                            </div>
                    }
                    <br />
                    <div className={style.flexVerticalAlign}>
                        Next node: &nbsp;&nbsp;
                        <ReactSelect
                            className={style.selectField}
                            options={nodes.map(x => ({value: x, label: x}))}
                            value={nextNode === "" ? null : {value: nextNode, label: nextNode}}
                            placeholder="Select option"
                            onChange={(newValue) => {
                                this.setState(
                                    { nextNode: newValue.value }
                                )
                            }}
                        />
                    </div>
                    <br />
                    <button className={style.button} onClick={this.updateOptionContent}>Done</button>
                </div>
            </Modal>}
        </div>
    }
}

export default OptionsModal;