function setGridColItem(gridItemID){
    let grid = document.querySelector(`#${gridItemID}`);

    let rem = parseInt(window.getComputedStyle(document.querySelector('body')).getPropertyValue('font-size'));
    let itemHeight;
    for(let item of grid.children){
        if(item.hasAttribute('rowspan')){
            item.style.gridRowEnd = `span ${parseInt(item.getAttribute('rowspan'))}`;
            continue;
        }
        itemHeight = 0;
        if(item.childElementCount){
            itemHeight = parseInt(item.lastElementChild.offsetHeight) / rem / 2;
            gap = 2;
        }
        item.style.gridRowEnd = `span ${Math.floor(itemHeight + gap)}`;
    }
}

function setColSpan(gridItemID){
    let grid = document.querySelector(`#${gridItemID}`);

    let col= window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').join('').split('px');
    let colCount = 0;
    col.forEach(item =>{
        colCount += parseInt(item) ? 1 : 0;
    });

    let maxStack = [];

    for(let item of grid.children){
        if(!item.hasAttribute('colspan')) continue;

        let col = item.getAttribute('colspan');
        if(col == 'max'){
            maxStack.push(item);
            item.style.gridColumnEnd = ``;
            continue;
        }
        
        col = parseInt(col);

        if( col < colCount){
            item.style.gridColumnEnd = `span ${col}`;
        }else{
            item.style.gridColumnEnd = `span ${colCount}`;
        }
    }

    col = window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').join('').split('px');
    colCount = 0;
    col.forEach(item =>{
        colCount += parseInt(item) ? 1 : 0;
    });
    for(let item of maxStack){
        item.style.gridColumnEnd = `span ${colCount}`;
    }

}