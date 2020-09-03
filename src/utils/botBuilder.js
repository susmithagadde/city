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
            let newNode = data[firstOption];
            orderedList.push(newNode);
            currentOptions = (newNode.options || []).map(z => z.optionHtml ? z.optionHtml.nextId : z.id);
            options = [...options, ...currentOptions];
        }
        options.shift();
    }
    return orderedList;
}