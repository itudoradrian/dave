function setAuth() {

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const formValues = {}
        const elemArray = Array.from(loginForm.elements);
        elemArray.filter(el => el.type == 'text' || el.type == 'password').map(elem => {
            //console.log(elem.name,elem.value);
            formValues[elem.name] = elem.value;
        });

        await firebase.auth().signInWithEmailAndPassword(formValues.email, formValues.password)
        .then(rasp => {

            console.log(rasp.user);
            localStorage.setItem('logged','true');
            routes.changeRoute('/');
        })
        .catch(err => {
            const errorPanel = document.getElementById('errorLogin');
            errorPanel.innerHTML = err.message;
        });


    });

    registerForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const formValues = {}
        const elemArray = Array.from(registerForm.elements);
        elemArray.filter(el => el.type == 'text' || el.type == 'password').map(elem => {
            //console.log(elem.name,elem.value);
            formValues[elem.name] = elem.value;
        });

        await firebase.auth().createUserWithEmailAndPassword(formValues.email, formValues.password)
        .then(rasp => {

            console.log(rasp.user);
            localStorage.setItem('logged','true');
            routes.changeRoute('/');
        })
        .catch(err => {
            const errorPanel = document.getElementById('errorRegister');
            errorPanel.innerHTML = err.message;
        });


    });

    const logoutButtons = document.getElementsByClassName('logout');
    Array.from(logoutButtons,function(btn)
    {
        btn.addEventListener('click',async function(evn){

            evn.preventDefault();
            evn.stopImmediatePropagation();
            await firebase.auth().signOut().then(function() {
                
                localStorage.setItem('logged','false');
                routes.changeRoute('/landing');
              }, function(error) {
                console.error('Sign Out Error', error);
                localStorage.setItem('logged','false');
                routes.changeRoute('/landing');
              });
        });
    });
}
