class AjaxHandler{

    constructor(){

        this.xhr = new XMLHttpRequest();
    }
    getResource(resource){
        
        this.xhr.open('GET',resource,true);
        this.xhr.onload = function(){
            // this.responseText; for data extraction
            if(this.status == 200){
                console.log('Succes');
                /*
                    Supouse we get JSON file
                    var user = JSON.parse(this.responseText);
                    we have an user object now
                */
            }else if(this.status == 404){
                console.log('Not found');
            }
        };
        this.xhr.onerror = function(){

            console.log('Request Error...');
        }
        this.xhr.send();
    }
}