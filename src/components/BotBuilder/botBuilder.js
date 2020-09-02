import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import axios from 'axios';
import { MdEdit, MdClose, MdAddCircleOutline } from 'react-icons/md';
import style from './botBuilder.module.scss';
import ContentModal from "../ContentModal/contentModal";
import OptionsModal from "../OptionsModal/optionsModal";

const defaultInitialSchema = {
    user: "bot",
    message: "Hi there! How can I help?",
    options: [],
    componentId: "welcomeMsg"
};

class BotBuilder extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatJson: {},
            nodes: [],
            htmlComponents: [],
            chatData: [defaultInitialSchema],
            contentEditorActive: false,
            optionsEditorActive: false,
            currentContent: {},
            currentOption: {},
            viewType: 'table',
            highlightedNode: '',
        }
    }

    componentDidMount() {
        this.getDbSchema();
    }

    getDbSchema = () => {
        axios.get('https://chat-crm.lotusdew.in/chatbot/get')
            .then((res) => {
                const response = res.data;
                console.log('response.data==', response.data)
                this.setState({ chatJson: response.data, htmlComponents: response.htmlComponents, nodes: response.nodes, chatData: Object.values(response.data) });
            })
            .catch((error) => {
                console.log('error---', error)
            });
    }

    showContentEditor = (contentData) => {
        this.setState({ contentEditorActive: true, currentContent: contentData });
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

    updateContent = (isHtml, data, newNodeId=false) => {
        const { chatData, currentContent, nodes } = this.state;
        const currentComponentId = currentContent.componentId;
        let clonedChatData = [...chatData];
        let newData = {};
        if(newNodeId) {
            newData = isHtml ? {...defaultInitialSchema, html: data, componentId: newNodeId} : {...defaultInitialSchema, message: data, componentId: newNodeId};
            this.setState({ nodes: [...nodes, newNodeId]});
            clonedChatData.push(newData);
        } else {
            newData = isHtml ? {...currentContent, html: data } : {...currentContent, message: data};
            if(!isHtml) {
                delete newData.html;
            }
            const idx = chatData.findIndex(x => x.componentId === currentComponentId);
            clonedChatData.splice(idx, 1, newData);
        }

        this.setState({ chatData: clonedChatData});
    }

    updateOption = (isHtml, newOption, data, nextNode) => {
        const { chatData, currentContent, currentOption, chatJson } = this.state;
        let currentOptionList = currentContent.options || [];
        const currentComponentId = currentContent.componentId;
        let clonedChatData = [...chatData];
        if(newOption) {
            let optionObj = {
                text: data, id: nextNode, optionId: `option-${nextNode}`
            }
            if(isHtml) {
                optionObj = {
                    text: '', id: data, optionId: `option-${nextNode}`, optionHtml: { id: data, nextId: nextNode }
                }
            }
            currentOptionList.push(optionObj);
        } else {
            const currentOptionId = currentOption.optionId;
            let optionObj = {
                text: data, id: nextNode, optionId: currentOptionId,
            }
            if(isHtml) {
                optionObj = {
                    text: '', id: data, optionId: currentOptionId, optionHtml: { id: data, nextId: nextNode }
                }
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

    highlightNode = (nodeId) => {
        this.setState({ highlightedNode: nodeId })
    }

    render() {
        const { chatData, contentEditorActive, optionsEditorActive, currentContent,
            currentOption, viewType, nodes, htmlComponents, highlightedNode } = this.state;
        return <div className={style.botBuilderWrapper}>
            {contentEditorActive && <ContentModal
                active={contentEditorActive}
                closeModal={this.hideContentEditor}
                updateContent={this.updateContent}
                currentContent={currentContent}
                nodes={nodes}
                htmlComponents={htmlComponents}
            />}
            {optionsEditorActive && <OptionsModal
                active={optionsEditorActive}
                closeModal={this.hideOptionsEditor}
                updateOption={this.updateOption}
                currentContent={currentContent}
                currentOption={currentOption}
                nodes={nodes}
                htmlComponents={htmlComponents}
            />}
            <div className={style.flex}>
            </div>
            <div className={`${style.flexHorizontalAlign} ${style.tabPosition}`}>

                <div className={style.newNodeBtn}>
                    <button onClick={() => this.showContentEditor({}) }>New node</button> &nbsp;
                    <button onClick={() => this.setState({ chatData: [defaultInitialSchema] })}>New schema</button> &nbsp;
                    <button onClick={this.getDbSchema}>DB schema</button>
                </div>
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
            {viewType === "table" && <table className={style.table}>
                <tr>
                    <th>node-id</th>
                    <th>content</th>
                    <th>options</th>
                </tr>
                {chatData.map(dataRow =>
                    <tr className={`${highlightedNode === dataRow.componentId ? style.highlightRow : ''}`}>
                        <td>{dataRow.componentId}</td>
                        <td>
                            {dataRow.html && <div className={style.tag}>HTML</div>}
                            <div className={style.flexVerticalAlign}>
                                <div>{dataRow.html ? dataRow.html.id : dataRow.message}</div>
                                <div
                                    className={`${style.iconContainer} ${style.flexAllAlign}`}
                                    onClick={() => this.showContentEditor(dataRow)}
                                >
                                    <MdEdit className={style.icon}/>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className={style.optionsWrapper}>
                            {(dataRow.options || []).map( option =>
                                <div className={style.optionContainer}>
                                    {option.optionHtml && <div className={style.tag}>HTML</div>}
                                    <div className={style.flexVerticalAlign}>
                                        <div
                                            className={style.optionText}
                                            onClick={() => this.highlightNode(option.optionHtml ? option.optionHtml.nextId : option.id)}
                                        >
                                            {option.optionHtml ? option.optionHtml.id : option.text}
                                        </div>
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
                            </div>
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