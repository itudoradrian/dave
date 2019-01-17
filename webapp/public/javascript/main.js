const content = document.querySelector('.content');
fetch('views/index.html').then(function(response){

    if(response.status !== 200){
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
    }
    return response.text();
}).then(function(html){

    const parser = new DOMParser();
    const doc = parser.parseFromString(html,"text/html");
    const indexContent = doc.querySelector('.wrapper');
    content.appendChild(indexContent);
})