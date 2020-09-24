(() => {
    /* HTML tags will be blocked on the server-side so sanitization is not needed here! */
    if(!!window.location.search) {
        document.querySelector("#url-params").innerHTML = decodeURIComponent(window.location.href.split("?")[1]);
    } else {
        document.querySelector("#url-params").innerHTML = "Create a URL query parameter above, for example: ?hello=world"
    }
    
    /* Split all parameters and add the to their own table */

    let params = !!window.location.search ? window.location.search.substr(1)
        .split("&")
        .map(param => {
            return param.split("=");
        }) : null;

    if(params) {
        params.forEach( v => {
            let table = document.querySelector(".url-table > tbody")
            
            let row = document.createElement("tr")
            table.appendChild(row);

            [document.createElement("td"), document.createElement("td")]
                .map((cell, i) => {
                    cell.innerHTML = v[i] || "";
                    row.appendChild(cell);
                })
        })
    }
    
})()