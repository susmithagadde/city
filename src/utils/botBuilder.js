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
                if(newNode.html.otherId1) {
                    currentHtmlNodes.push(newNode.html.otherId1)
                }
                if(newNode.html.otherId2) {
                    currentHtmlNodes.push(newNode.html.otherId2)
                }
            }
            currentOptions = (newNode.options || []).map(z => z.optionHtml ? z.optionHtml.nextId : z.id);
            options = [...options, ...currentHtmlNodes, ...currentOptions];
        }
        options.shift();
    }
    return orderedList;
}