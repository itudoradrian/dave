# DAVE (Data Vaults on Web)

## Abstract
Prin această aplicație ne propunem să oferim o soluție eficientă prin care un utilizator să poată transmite și stoca în mod securizat datele pe care le colectează din formularele de pe site-ul său. Utilizatorul își va putea crea un cont pe platforma noastră, de unde va avea acces la o listă cu toate datele și statisticile asociate formularelor înregistrate de acesta în sistem. De asemenea, el va putea înregistra formulare noi precum și analiza diverse statistici generate în mod automat pe baza datelor fiecărui forumular în parte. Toate aceste date vor fii stocate  în manieră criptate într-un cloud și vor putea fii vizualizate doar de către titularul contului.

## Tehnologii utilizate
* __HTML/CSS__
* __JavaScript__
  *  *Web Cryptography API* 
  *  *AJAX (Asynchronous JavaScript and XML)*
* __Firebase API__
  
## Arhitectura
* *SPA (Single Page Application)*

*Motivul alegerii*: acest tip de arhitectură oferă utilizatorului o experiență mai fluidă și mai plăcută, cu mai puțini timpi de așteptare. În ceea ce privește partea de programare propriu zisă, accentul este pus pe în primul rând pe înțelegerea în detaliu a cerințelor și specificațiilor aplicației înainte de a porni partea de codare propriu zisă. Acest aspect este important deoarece ne ajută să avem la final un cod lizibil, modularizat și ușor de întreținut pe termen lung.

Specific acestui tip de arhitectură este faptul că ne oferă posibilitatea de a redesena Interfața cu Utilizatorul fără a fi nevoiți să cerem de fiecare dată serverului codul HTML. 

În ceea ce privește implementarea, vom utiliza AJAX pentru a putea încărca datele fără a fi nevoie să dăm refresh de fiecare dată când apare un set nou. Practic, în ceea ce privește codul HTML/CSS, acesta va fi încărcat o singură data în sesiune, mai apoi fiind transferate doar datele și aplicate pe ele transformările cu D3.js direct în browser și nu pe server. 
Alegând SPA, sunt mai puține date transmise pe rețea ceea ce înseamnă că viteza de utilizare este mai mare și nu încărcăm nici rețeaua în mod inutil.


 Cum funcționează SPA?
Separăm datele de modalitatea de prezentare a acestora: 
   * model layer: se va ocupa de date
   * view layer: se va ocupa de partea de afișare, citind din modele
  

  
## Criptarea
Fiecare utilizator înregistrat va primi o pereche de chei RSA: o cheie publică și un privată. 
```javascript
//Generate keys
await crypto.subtle.generateKey({
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" }
    },
    true, 
    ["encrypt", "decrypt"]).then(function (key) {
        private_key_object = key.privateKey;
        public_key_object = key.publicKey;
            }).catch(function (e) {
    console.log(e.message);
    });
``` 

Acesta va adăuga o secvență de cod JS (ce-i va fi generată în momentul în care înregistrează formularul pe platformă în pagina în care se află acesta.

În momentul în care cineva care completează formularul apasă Submit, vom folosi Web Cryptography API pentru a genera o cheie AES pe care o vom utiliza în criptarea datelor introduse.  Mai apoi, utilizând cheia publică pe care o are contul, vom cripta cheia AES. 

```javascript
 await window.crypto.subtle.importKey(
                "jwk",
                aesKey,
                {   
                    name: "AES-CTR",
                },
                true, 
                ["encrypt", "decrypt"]
            )
                .then(function (key) {
                
                    cryptoKeyAES = key;
                    console.log('AES IMPORT SUCCES');
                })
                .catch(function (err) {
                    console.log(err);
                });

```
Avem în vedere și necesitatea utilizării unui vector de inițializare care să fie utilizat la criptarea prin AES.

Datele criptate și cheia cu care le-am criptat (AES este o cheie simetrică) le vom trimite pentru a fi stocate pe Cloud, utilizând Firebase API.

## Decriptarea

În momentul în care un utilizator este logat pe contul său de DAVE, acesta se folosește în mod implicit de cheia sa privată în toate interacțiunile pe care le are cu platforma. 

```javascript
//Import private key
await window.crypto.subtle.importKey(
    "jwk",
    privateKey,
    {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" }
    },
    true,
    ["decrypt"]
    ).then(function (private) {
    privateCryptoKey = private;
    console.log('RSA IMPORT SUCCES');
    }).catch(function (err) {
                console.log(err);
});
```

Asta înseamnă că, în momentul în care solicită să vizualizeze datele asociate unui formular înregistrat, în fundal are loc întai decriptarea cheii AES cu cheia privată RSA, după care aceasta este utilizată pentru decriptarea propriu zisă a datelor. Acest proces ne asigură că persoana care vizualizează aceste date este legitimă.

```javascript
await window.crypto.subtle.importKey(
    "jwk", 
    aesKey,
    {   
    name: "AES-CTR",
    },
    true, 
    ["encrypt", "decrypt"] 
    ).then(function (key) {
    //returns the symmetric key
    aesCriptoKey = key;
    console.log("IMPORTED AES KEY");
    }).catch(function (err) {
    console.error(err);
});
```
 ## Scenarii de utilizare
 [Acest video](https://www.youtube.com/watch?v=A-IXGxNRRJQ&feature=youtu.be) explică pas cu pas modul de utilizare al aplicației:

