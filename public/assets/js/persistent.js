(async ()=>{
    async function fetchPosts() {
        let res = await fetch("/showPosts", {
            method: "POST"
        })
        return res.json();
    }

    function displayPost(post) {
        let postContainer = document.querySelector(".posts");
        let postDiv = document.createElement("div");

        postDiv.classList.add("post", "rounded");
        postDiv.setAttribute("post-id", post['id'])
        
        postDiv.innerHTML = `
        <div class="author-info d-flex">
            <img class="avatarImage" src="${post['avatarImage']}" alt="">
            <h3 class="author">@${post['author']}</h3>
        </div>
        <div class="postContent">${post['post']}</div>
        <div class="comments">
            <h5 class="commentsSep">Comments:</h5>
            <div class="commentSection">
            ${ post['comments']
                .reduce((t, comment) => {
                    t += `
                    <div class="comment rounded">
                        <span class="commentUsername">Anonymous</span>
                        <pre class="commentContent rounded">${comment['comment']}</pre>
                    </div>`
                    return t;
                }, '') }
            </div>
            <div class="addComment rounded d-flex">
                <textarea rows="1" type="text" class="form-control bg-dark commentArea"></textarea>
                <button class="btn btn-secondary sendComment" onclick="processComment(${post['id']})">Send!</button>
            </div>
        </div>`
            
            postContainer.appendChild(postDiv);
    }
    
    (await fetchPosts())
        .forEach(post => {
            displayPost(post);
        })
})()

async function processComment(id) {
    
    let content = document.querySelector(`[post-id="${id}"] > .comments > .addComment > textarea`).value;

    if(/^[\s\n\t]*$/.test(content)) {
        console.error(`You cannot send an empty comment!!`)
    } else {
        let response = await fetch("/addComment", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, content})
        })
        
        response = await response.json()

        if(response['status'] === "success") {
            let comments = document.querySelector(`[post-id="${id}"] > .comments > .commentSection`);

            let commentDiv = document.createElement("div");
            commentDiv.classList.add("comment", "rounded");
            commentDiv.innerHTML = `
                <span class="commentUsername">Anonymous</span>
                <pre class="commentContent rounded">${content}</pre>
            `
            comments.appendChild(commentDiv);

        } else {
            let alertFlash = document.createElement("div");
            alertFlash.classList.add("alert","alert-danger", "alert-dismissible", "fade", "show");

            alertFlash.innerHTML = `
                ${response['message']}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>`
            setTimeout(() => {
                $(alertFlash).alert('close');
            }, 5000);

            document.querySelector(".alertBox").appendChild(alertFlash)
        }
    }
}