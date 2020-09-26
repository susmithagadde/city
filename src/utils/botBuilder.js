import { remove } from 'lodash';
const defaultNode = 'welcomeMsg';

export const reorderNodes = (data) => {
    let orderedList = [];
    let options = [];
    let dataKeys = Object.keys(data);
    const firstNodeObj = data[defaultNode];
    let currentOptions = firstNodeObj.options.map(x => x.id);
    let leftOverList = [];
    options = [...[], ...currentOptions];
    let visited = [defaultNode];
    orderedList.push(firstNodeObj);
    remove(dataKeys,(x) => x === defaultNode);
    while (options.length > 0) {
        const firstOption = options[0];
        if(visited.indexOf(firstOption) === -1) {
            visited.push(firstOption);
            remove(dataKeys,(x) => x === firstOption);
            let newNode = data[firstOption] || {};
            orderedList.push(newNode);
            const currentHtmlNodes = [];
            if (newNode.html) {
                if(newNode.html.successId) {
                    currentHtmlNodes.push(newNode.html.successId);
                    remove(dataKeys,(x) => x === newNode.html.successId);
                }
                if(newNode.html.failureId) {
                    currentHtmlNodes.push(newNode.html.failureId);
                    remove(dataKeys,(x) => x === newNode.html.failureId);
                }
                if(newNode.html.customId) {
                    currentHtmlNodes.push(newNode.html.customId);
                    remove(dataKeys,(x) => x === newNode.html.customId);
                }
            }
            currentOptions = (newNode.options || []).map(z => z.optionHtml ? z.optionHtml.nextId : z.id);
            options = [...options, ...currentHtmlNodes, ...currentOptions];
        }
        options.shift();
    }
    dataKeys.forEach(x => {
        const obj = data[x];
        leftOverList.push(obj);
    })
    return [...orderedList, ...leftOverList];
}

export const createJson = (chatJson, chatData) => {
    let newData = {};
    chatData.forEach((x, idx) => {
        const key = x.componentId;
        newData[key] = {...x};
    })
    return newData;
}