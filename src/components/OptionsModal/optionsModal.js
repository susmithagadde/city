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
            htmlId: '',
            nextNode: '',
        }
    }

    componentDidMount() {
        const { currentOption } = this.props;
        if(Object.keys(currentOption).length > 0){
            if(currentOption.optionHtml) {
                const htmlObj = currentOption.optionHtml;
                this.setState({ isHtml: true, htmlId: htmlObj.id, nextNode: htmlObj.nextId });
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
        const { closeModal, active, currentContent, nodes, htmlComponents } = this.props;
        const { isHtml, newOption, text, nextNode, htmlId } = this.state;
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
                                checked={isHtml}
                                onChange={() => this.setState({ isHtml: !this.state.isHtml })}
                            /> HTML
                        </div>
                    </div>
                    {
                        isHtml ?
                            <div>
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
                            </div> :
                            <div className={style.flexVerticalAlign}>
                                <div className={style.label}>Option text:</div>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={this.updateText}
                                />
                            </div>
                    }
                    <br />
                    <div className={style.flexVerticalAlign}>
                        <div className={style.label}>Next node:</div>
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