
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

                let private_key_object = null;
                let public_key_object = null;

                //Generate keys
                await crypto.subtle.generateKey({
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: { name: "SHA-256" }
                }, true, ["encrypt", "decrypt"]).then(function (key) {
                    private_key_object = key.privateKey;
                    public_key_object = key.publicKey;
                }).catch(function (e) {
                    console.log(e.message);
                });
                console.log(private_key_object);
                console.log(public_key_object);
                //Export keys
                let exported_private_key = null;
                let exported_public_key = null;

                await window.crypto.subtle.exportKey(
                    "jwk", 
                    private_key_object
                )
                .then(function(private){
                    
                    console.log(JSON.stringify(private));
                    exported_private_key = JSON.stringify(private)
                })
                .catch(function(err){
                    console.log(err);
                });

                await window.crypto.subtle.exportKey(
                    "jwk", 
                    public_key_object 
                )
                .then(function(public){
                    
                    console.log(JSON.stringify(public));
                    exported_public_key = JSON.stringify(public)
                })
                .catch(function(err){
                    console.log(err);
                });

                await db.collection('users').doc(`${rasp.user.uid}`).set({
                    publicKey: exported_public_key,
                    privateKey: exported_private_key,
                }).then(function(e) {
                    console.log('User configured');
                })
                .catch(function(error) {
                    console.log("Error writing document: ", error);
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
    const regForm = document.getElementById('formRegister');
    regForm.addEventListener('submit', async (e) => {

        e.preventDefault();
        let aesKey = null;
        let dtoAes = null;
        let rsaPublicKey = null;
        let nameOfForm = regForm['numeForm'].value;
        await window.crypto.subtle.generateKey(
            {
                name: "AES-CTR",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
            .then(function (key) {
                //returns a key object
                aesKey = key;

            })
            .catch(function (err) {
                console.error(err);
            });

        await window.crypto.subtle.exportKey(
            "jwk", //can be "jwk" or "raw"
            aesKey //extractable must be true
        )
            .then(function (keydata) {
                //returns the exported key data
                console.log(keydata);
                dtoAes = JSON.stringify(keydata);
            })
            .catch(function (err) {
                console.log(err);
            });

        await db.collection('users').doc(`${user.uid}`).get().then(doc => {

            rsaPublicKey = doc.data().publicKey;
        });
        await db.collection('users').doc(`${user.uid}`).collection('registerForm').add({

            name: nameOfForm,

        }).then(function () {
            formNames.push(nameOfForm);
            regForm.reset();
            setForms();
            console.log('Doc registered');
        })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });

        let generatedCode = generateCode(user.uid,rsaPublicKey, dtoAes, nameOfForm);
        document.getElementById('displayCode').insertAdjacentHTML('beforebegin',generatedCode);

    });
}

