(()=>{
    let cardImages = [...document.querySelectorAll(".item-image")]

    cardImages.forEach(card => {
        card.src = `https://picsum.photos/seed/${Math.floor(Math.random()*100+1)}/100`
    })

    function randomColor() {
        return `rgb(${Math.random()*100},${Math.random()*100},${Math.random()*100})`
    }

    interact('.item')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '.fullscreen',
                endOnly: true
            })
        ],
        listeners: {
            move: dragMoveListener
        }
    })

    // Code snatched and modified from the interact.js docs!

    function dragMoveListener (event) {
        let target = event.target
        // keep the dragged position in the data-x/data-y attributes
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)'

        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }
    let sVal = window.location.search.substr(3)

    let cards = [...document.querySelectorAll(".item")]

    if(sVal) {
        cards.forEach(card => card.textContent.includes(sVal) && card.classList.remove("inactive") )
    } else {
        cards.forEach(card => card.classList.remove("inactive") )
    }

    cards.forEach(card => {
        card.style.backgroundColor = randomColor();
    })



})()