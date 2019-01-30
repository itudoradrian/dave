
function setLogin(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const formValues = {}
        const elemArray = Array.from(loginForm.elements);
        elemArray.filter(el => el.type == 'text' || el.type == 'password').map(elem => {
            //console.log(elem.name,elem.value);
            formValues[elem.name] = elem.value;
        });

        await auth.signInWithEmailAndPassword(formValues.email, formValues.password)
            .then(rasp => {

                console.log(rasp.user);
                localStorage.setItem('logged', 'true');
                routes.changeRoute('/');
            })
            .catch(err => {
                const errorPanel = document.getElementById('errorLogin');
                errorPanel.innerHTML = err.message;
            });


    });
}
function setRegister(registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const formValues = {}
        const elemArray = Array.from(registerForm.elements);
        elemArray.filter(el => el.type == 'text' || el.type == 'password').map(elem => {
            //console.log(elem.name,elem.value);
            formValues[elem.name] = elem.value;
        });

        await auth.createUserWithEmailAndPassword(formValues.email, formValues.password)
            .then( async rasp => {

                console.log(rasp.user);
                await db.collection('users').doc(`${rasp.user.uid}`).set({
                    
                    rsaKey: 'gilberto',
                }).then(function(e) {
                    console.log('Doc registered');
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
                localStorage.setItem('logged', 'true');
                routes.changeRoute('/');


            })
            .catch(err => {
                const errorPanel = document.getElementById('errorRegister');
                errorPanel.innerHTML = err.message;
            });


    });
}
function setLogout(logoutButtons) {
    Array.from(logoutButtons, function (btn) {
        btn.addEventListener('click', async function (evn) {

            evn.preventDefault();
            evn.stopImmediatePropagation();
            await auth.signOut().then(function () {

                console.log('Signout');
                const ulElem = document.getElementById('formList').innerHTML = '';
                localStorage.setItem('logged', 'false');
                routes.changeRoute('/landing');
            }, function (error) {
                console.error('Sign Out Error', error);
                localStorage.setItem('logged', 'false');
                routes.changeRoute('/landing');
            });
        });
    });
}
function setUserData(userData) {
    user = userData;
}
async function getFormData() {
    await db.collection(`users/${user.uid}/registerForm`).get().then(snap => {

        formNames = snap.docs.map(doc => {

            return doc.data().name;
        });
    });

}
async function getViews() {
    db.collection(`users/${user.uid}/formData`).get().then(snp => {


        formNames = snp.docs.map(doc => {

            console.log(doc.data());
            formsData.push({'name':doc.data().nume,'enJSON':doc.data().enJSON,'aesKey':doc.data().aesKey})
        });
    });
}
function setAuth() {

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButtons = document.getElementsByClassName('logout');
    setLogin(loginForm);
    setRegister(registerForm);
    setLogout(logoutButtons);
    auth.onAuthStateChanged(async userData => {
        if (userData) {
            setUserData(userData);
            await getFormData();
            await getViews();
            setForms();
            setFormViews();
        }
        else {
            console.log('USER OUT');
        }
    });
}

