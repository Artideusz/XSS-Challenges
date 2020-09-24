(()=>{
    async function animateText() {

        let textDiv = document.querySelector("#animated");

        let words = ["HACK", "CONQUER", "MASTER", "LEARN", "XSS"]

        // A simple promise-based delay to make things simple
        function delay(time) {
            return new Promise((res) => {
                setTimeout(res, time);
            })
        }

        // Responsible for blinking
        async function blink(div, times, time) {
            for(let i = 0; i < times; i++) {
                if(/.*\_$/.test(div.textContent)) {
                    div.textContent = div.textContent.slice(0,-1);
                } else {
                    div.textContent = div.textContent + "_";
                }
                await delay(time)
            }
        }

        //Removes and changes the tex to a different one
        async function removeAndReplace(div, newName, time) {
            let len = div.textContent.length;
            for(let i = len; i > 0; i--) {
                div.textContent = div.textContent.slice(0,-1);
                await delay(time);
            }
            for(let i = 0; i < newName.length; i++) {
                div.textContent = div.textContent + newName[i];
                await delay(time)
            }
        }

        let pos = 0; // Current position of shown word.

        while(true) {
            await blink(textDiv, 5, 500);
            
            if(pos >= words.length) {
                pos = 0;
            }

            await removeAndReplace(textDiv, words[pos++], 100)
        }
    }
    animateText()
})()