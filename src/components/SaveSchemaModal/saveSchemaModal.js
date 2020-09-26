import React, { Component } from 'react';
import style from './saveSchemaModal.module.scss';
import Modal from "../Modal/modal";

class SaveSchemaModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            createdBy: '',
            jsonName: '',
        }
    }

    updateCreatedBy = (e) => {
        this.setState({ createdBy: e.target.value});
    }

    updateJsonName = (e) => {
        this.setState({ jsonName: e.target.value});
    }

    saveJson = () => {
        const { updateJson } = this.props;
        const { createdBy, jsonName } = this.state;
        updateJson(createdBy, jsonName);
    }

    render() {
        const { closeModal, active } = this.props;
        const { jsonName, createdBy } = this.state;
        return <div>
            {active &&
            <Modal
                closeModal={closeModal}
            >
                <div className={style.contentWrapper}>
                    <div>
                        <br />
                        <div className={style.flexVerticalAlign}>
                            <div className={style.label}>Created By:</div>
                            <input
                                type="text"
                                value={createdBy}
                                onChange={this.updateCreatedBy}
                            />
                        </div>
                        <br />
                        <div className={style.flexVerticalAlign}>
                            <div className={style.label}>Json name:</div>
                            <input
                                type="text"
                                value={jsonName}
                                onChange={this.updateJsonName}
                            />
                        </div>
                    </div>
                    <br />
                    <button className={style.button} onClick={this.saveJson}>Save</button>
                </div>
            </Modal>}
        </div>
    }
}

export default SaveSchemaModal;