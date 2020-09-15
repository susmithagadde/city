const defaultNode = 'welcomeMsg';

export const reorderNodes = (data) => {
    let orderedList = [];
    let options = [];
    const firstNodeObj = data[defaultNode];
    let currentOptions = firstNodeObj.options.map(x => x.id);
    options = [...[], ...currentOptions];
    let visited = [defaultNode];
    orderedList.push(firstNodeObj);
    while (options.length > 0) {
        const firstOption = options[0];
        if(visited.indexOf(firstOption) === -1) {
            visited.push(firstOption);
            let newNode = data[firstOption] || {};
            orderedList.push(newNode);
            const currentHtmlNodes = [];
            if (newNode.html) {
                if(newNode.html.successId) {
                    currentHtmlNodes.push(newNode.html.successId)
                }
                if(newNode.html.failureId) {
                    currentHtmlNodes.push(newNode.html.failureId)
                }
                if(newNode.html.customId) {
                    currentHtmlNodes.push(newNode.html.customId)
                }
            }
            currentOptions = (newNode.options || []).map(z => z.optionHtml ? z.optionHtml.nextId : z.id);
            options = [...options, ...currentHtmlNodes, ...currentOptions];
        }
        options.shift();
    }
    return orderedList;
}

export const createJson = (chatJson, chatData) => {
    let newData = {};
    chatData.forEach((x, idx) => {
        const key = x.componentId;
        newData[key] = {...x};
    })
    return newData;
}