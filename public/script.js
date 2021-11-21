function setGridItem(gridItemID){
    let grid = document.querySelector(`#${gridItemID}`);

    let rem = parseInt(window.getComputedStyle(document.querySelector('body')).getPropertyValue('font-size'));
    let itemHeight;
    for(let item of grid.children){
        itemHeight = 0;
        if(item.childElementCount){
            itemHeight = parseInt(item.lastElementChild.offsetHeight) / rem / 2;
            gap = 2;
        }
        item.style.gridRowEnd = `span ${Math.round(itemHeight + gap)}`;
    }
}

window.addEventListener('load', ()=>{
    setGridItem('main-grid')
});
window.addEventListener('resize', () =>{
    setGridItem('main-grid')
});

