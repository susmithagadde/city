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
            if(visited.indexOf(options[0]) === -1) {
                visited.push(options[0]);
                let newNode = data[options[0]];
                orderedList.push(newNode);
                currentOptions = (newNode.options || []).map(z => z.optionHtml ? z.optionHtml.nextId : z.id);
                options = [...options, ...currentOptions];
            }
            options.shift();
    }
    return orderedList;
}