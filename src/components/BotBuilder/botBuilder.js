import React, { Component } from 'react';
import ReactJson from 'react-json-view'
import { MdEdit, MdClose, MdAddCircleOutline } from 'react-icons/md';
import { chatJson, nodes, htmlComponents } from "../../constants/mock-api";
import style from './botBuilder.module.scss';
import ContentModal from "../ContentModal/contentModal";
import OptionsModal from "../OptionsModal/optionsModal";

class BotBuilder extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatData: [{
                user: "bot",
                message: "Hi there! How can I help?",
                options: [
                    // { text: "I want to open an account", id: "openAccount", optionId: 'option-open-account' },
                    // { text: "Test", id: "emailVerification", optionId: 'option-test' },
                ],
                componentId: "welcomeMsg"
            }],
            contentEditorActive: false,
            optionsEditorActive: false,
            currentContent: {},
            currentOption: {},
            viewType: 'table',
        }
    }

    showContentEditor = (contentData) => {
        this.setState({ contentEditorActive: true, currentContent: contentData});
    }

    hideContentEditor = () => {
        this.setState({ contentEditorActive: false, currentContent: {}});
    }

    showOptionsEditor = (contentData, optionData) => {
        this.setState({ optionsEditorActive: true, currentContent: contentData, currentOption: optionData});
    }

    hideOptionsEditor = () => {
        this.setState({ optionsEditorActive: false, currentOption: {}});
    }

    updateContent = (isHtml, data) => {
        const { chatData, currentContent } = this.state;
        const currentComponentId = currentContent.componentId;
        const newData = {...currentContent, message: data};
        const idx = chatData.findIndex(x => x.componentId === currentComponentId);
        let clonedChatData = [...chatData];
        clonedChatData.splice(idx, 1, newData);
        this.setState({ chatData: clonedChatData});
    }

    updateOption = (isHtml, newOption, data, nextNode) => {
        const { chatData, currentContent, currentOption } = this.state;
        let currentOptionList = currentContent.options || [];
        const currentComponentId = currentContent.componentId;
        let clonedChatData = [...chatData];
        if(newOption) {
            const optionObj = {
                text: data, id: nextNode, optionId: `option-${nextNode}`,
            }
            currentOptionList.push(optionObj);
        } else {
            const currentOptionId = currentOption.optionId;
            const optionObj = {
                text: data, id: nextNode, optionId: currentOptionId,
            }
            const optionIdx = currentOptionList.findIndex(x => x.optionId === currentOptionId);
            currentOptionList.splice(optionIdx, 1, optionObj);
        }
        const newData = {...currentContent, options: currentOptionList};
        const idx = chatData.findIndex(x => x.componentId === currentComponentId);
        clonedChatData.splice(idx, 1, newData);
        const nodeExists = chatData.findIndex(x => x.componentId === nextNode) > -1;
        if(!nodeExists) {
            clonedChatData.push(chatJson[nextNode]);
        }
        this.setState({ chatData: clonedChatData});
    }

    removeOption = (contentData, optionData) => {
        const { chatData } = this.state;
        let clonedChatData = [...chatData];
        let currentOptionList = contentData.options || [];
        const currentComponentId = contentData.componentId;
        const currentOptionId = optionData.optionId;
        const optionIdx = currentOptionList.findIndex(x => x.optionId === currentOptionId);
        currentOptionList.splice(optionIdx, 1);
        const newData = {...contentData, options: currentOptionList};
        const idx = chatData.findIndex(x => x.componentId === currentComponentId);
        clonedChatData.splice(idx, 1, newData);
        this.setState({ chatData: clonedChatData});
    }

    addOption = (contentData) => {
        this.setState({ optionsEditorActive: true, currentContent: contentData});
    }

    render() {
        const { chatData, contentEditorActive, optionsEditorActive, currentContent, currentOption, viewType } = this.state;
        return <div className={style.botBuilderWrapper}>
            {contentEditorActive && <ContentModal
                active={contentEditorActive}
                closeModal={this.hideContentEditor}
                updateContent={this.updateContent}
                currentContent={currentContent}
            />}
            {optionsEditorActive && <OptionsModal
                active={optionsEditorActive}
                closeModal={this.hideOptionsEditor}
                updateOption={this.updateOption}
                currentContent={currentContent}
                currentOption={currentOption}
                nodes={nodes}
            />}
            <div className={`${style.flexHorizontalAlign} ${style.tabPosition}`}>
                <div
                    className={`${style.tab} ${viewType === 'table' ? style.selectedMenu : ''}`}
                    onClick={() => this.setState({ viewType: 'table'})}
                >
                    Table
                </div>
                <div
                    className={`${style.tab} ${viewType === 'json' ? style.selectedMenu : ''}`}
                    onClick={() => this.setState({ viewType: 'json'})}
                >
                    JSON viewer
                </div>
            </div>
            {viewType === "table" && <table>
                <tr>
                    <th>node-id</th>
                    <th>content</th>
                    <th>options</th>
                </tr>
                {chatData.map(dataRow =>
                    <tr>
                        <td>{dataRow.componentId}</td>
                        <td>
                            <div className={style.flexVerticalAlign}>
                                <div>{dataRow.message}</div>
                                <div
                                    className={`${style.iconContainer} ${style.flexAllAlign}`}
                                    onClick={() => this.showContentEditor(dataRow)}
                                >
                                    <MdEdit className={style.icon}/>
                                </div>
                            </div>
                        </td>
                        <td>
                            {dataRow.options.map( option =>
                                <div className={style.optionContainer}>
                                    <div className={style.flexVerticalAlign}>
                                        <div className={style.optionText}>{option.text}</div>
                                        <div className={style.flexEnd}>
                                            <div
                                                className={`${style.optionIconContainer}`}
                                                onClick={() => this.showOptionsEditor(dataRow, option)}
                                            >
                                                <MdEdit className={style.icon}/>
                                            </div>
                                            <div
                                                className={`${style.optionIconContainer}`}
                                                onClick={() => this.removeOption(dataRow, option)}
                                            >
                                                <MdClose className={style.icon}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            }
                            <div
                                className={style.flexHorizontalAlign}
                                onClick={() => this.addOption(dataRow)}
                            >
                                <MdAddCircleOutline className={style.icon}/>
                            </div>
                        </td>
                    </tr>
                )}

            </table>}
            {viewType === "json" &&
            <div className={style.jsonViewer}>
                {/*<pre>{JSON.stringify(chatData, null, 2)}</pre>*/}
                <ReactJson
                    src={chatData}
                    displayDataTypes={false}
                />
            </div>
            }
        </div>
    }
}

export default BotBuilder;