//Hämta viktiga element med deras id och tilldela de till en variabel som passar dem.
let fromList = document.getElementById("form-list");
let nameInput = document.getElementById("nameInput");
let telefonInput = document.getElementById("telefonInput");
let submitBtn = document.getElementById("submitButton");
let deleteAll = document.getElementById("deletebtn");
let formMessages = document.getElementById("form-messages");

// Här lägger en händelselyssnare för knappen med id submittButton, för att skapa kontaktlista när man clicka.
submitBtn.addEventListener("click", function(event){
    event.preventDefault(); /* Denna kod förhindra standardbeteendet för förmuläret */
    let errorMessages = "";  /* En tom sträng för att spara felmeddelanden efter */
    
    errorMessages += inputRequiredMessage (nameInput, "Namn");  /* obligatoriska fält namn, telefon felmeddelanden läggs här */
    errorMessages += inputRequiredMessage (telefonInput, "Telefon");
    
    // Om det inte finns felmeddelande och fälten är korrekt fylld.
    if(errorMessages == ""){
        const audioElement = new Audio('submit_sound.mp3'); /* skapar ljud för skapad kontaktlista */
        formMessages.innerHTML = 
            '<div class="alert alert-success" role="alert">' /* Visa form message i html */
                 + 'Kontaktlistan är skapad!' + 
            '</div>';
            createContact();    /* function som skapar en kontaktlista */
            audioElement.play(); /* spela upp ljud för skapad lista */
            setTimeout(() => {     /* tar bort forMessages efter 2 sekunder */
                formMessages.innerHTML = "";     
        }, 2000);     
    }  else {
        const audioElement = new Audio('error_sound.mp3'); /* Om det finns fel som tomma fält skapa error ljud */
        formMessages.innerHTML = 
        
        '<div class="alert alert-danger" role="alert">'  /* Visa felmeddelande i formMessages. */
            + errorMessages + 
        '</div>';
        audioElement.play(); /* Spela upp error ljud */
        setTimeout(() =>{    /* tar bort forMessages efter 3 sekunder */
            formMessages.innerHTML = '';
        }, 3000); 
    } 
}); /* */

// function som skapar och driva felmeddelande om ett obligatoriskt fälte är tomt.
function inputRequiredMessage(input, fieldName){
    if (input.value.trim() == "") {
        return fieldName + ' är obligatoriskt! <br>';        
    }
    
    return "";
};

// Denna function skapar en kontakt och sedan lägger den i form listan
let contactCounter = 1;
function createContact(){
    let errorMessages = "";  /* Skapa felmeddelande för listor */
    let listMessages = document.getElementById('list-messages') /* Skapade kontakt har egen ställe att visa felmeddelande */

    let createItem = document.createElement('ol'); /* skapar list element för kontaktlistan */
    /* let orderlist = document.createElement('ol'); */
    createItem.className = 'created-item';
    createItem.innerHTML = ` 
        <span class="contact-number">${contactCounter++}.</span>
        Namn: <span> <input type="text" value="${nameInput.value}" disabled></span>
        Telefon: <span><input type="number" value="${telefonInput.value}" disabled></span>
        <button class = "edit-btn">Ändra</button>
        <button class="deleteInput-btn">Radera</button>
    `;
    /* orderlist.appendChild(createItem); */
    fromList.appendChild(createItem); /*  lägger nya listan till form listan  */

    clearInputField(); /* här kallar function som rensa input fälten efter skapandet */

    // hämta knapparna edit och delete och ge de variabel. hanterar nya listan
    let editButton = createItem.querySelector ('.edit-btn'); 
    let deleteInput = createItem.querySelector ('.deleteInput-btn');

    // lägg Edit knappen händelselyssnare för att redigera kontaktlistan
    editButton.addEventListener('click', function(event){
        
        console.log('Edit button clicked')
        editContact(createItem, event); /* kallar editContact function som sköta redigera */
        
    });
    // lägg delete knappen händelselyssnare för att redera en kontaktlistan
    deleteInput.addEventListener('click', function(event){
        deleteContact(createItem, event); /* kallar deleteContact function som sköta rederar en lista */
        listMessages.innerHTML =  /* Visa ett meddelande när en kontakt raderas */
        '<div class="alert alert-danger" role="alert">' + 'En kontaktlist är raderats' + 
    '</div>';

    setTimeout(() => {   /* rensa listMessage meddelande efter 3 sekunder */
        listMessages.innerHTML = "";
        
    }, 3000);
    
    });
      
};
   
// Denna function rensar båda input fältet efter en kontakt skapas
function clearInputField(){ 
    nameInput.value = "";
    telefonInput.value = "";

};

// Function för att redigera en kontakt
function editContact(createItem, event) {
    event.preventDefault();
    let inputs = createItem.querySelectorAll("input");
    let isValid = true;
    let errorMessages = "";
    let listMessages = document.getElementById('list-messages')
    
    // for loop för att kontrollera om det finns tomma fält i kontaktlistan.
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].disabled && inputs[i].value.trim() === "") {
            isValid = false;
            errorMessages = "Får ej skapa tom kontakt!";  /* Felmeddelande när fältet är tomt */
            break;
        }
    }

    // Om det inte finns fel, och allt är rätt, ger möjlighet att redigera
    if (isValid) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = !inputs[i].disabled;
        }
        let editButton = createItem.querySelector('.edit-btn');
        editButton.textContent = editButton.textContent === 'Ändra' ? 'Spara' : 'Ändra';
        // Om kontakten är redigerad och sparad, visa ett grönt meddlande med ljud och sedan rensa meddalanden efter 2 sekunder.
        if(editButton.textContent == 'Ändra'){
            const audioElement = new Audio('submit_sound.mp3'); /* När ändring genomfort meddelande med ljud */
            listMessages.innerHTML = 
            '<div class="alert alert-success" role="alert">'
                + 'Kontakt är sparad!' + 
            '</div>';
            audioElement.play();
            setTimeout(() => {
                listMessages.innerHTML = '';
            }, 2000);
        }
    } else {       /* Om det finns fel, visa felmeddalnde och rensa meddelandet efter 3 sekunder*/
        const audioElement = new Audio('error_sound.mp3'); 
        listMessages.innerHTML = 
        '<div class="alert alert-danger" role="alert">' + 
            errorMessages + 
        '</div>';
        audioElement.play();
        setTimeout(() => {
            listMessages.innerHTML = '';
        }, 3000);
    }
}

// function som readerar en kontakt i listan
function deleteContact(createItem){
    createItem.remove();

};

// Skapar varningsljud för att uppmärksamma att detta action innebär att radera allt.
let audioWarning = new Audio('call-to-attention.mp3');

// Lägger addEventlistener för redera Alla kontaktlistan.
deleteAll.addEventListener("click", function(){
    
    let createdItems = document.querySelectorAll('.created-item'); /* hämtar alla skapade kontakter */
    
    // loopar igenom varje skapade kontakt och varnar med ljud, alert meddeland samt ger att avbryta delete action.   
    for (let item of createdItems) {
        audioWarning.play();
        let confirmation = confirm('Är du säker på att du vill radera alla listor?\nOm ja, tryck OK annars Cancel.');
        
        if(confirmation == true){          
            item.remove();
           
            formMessages.innerHTML = 
            '<div class="alert alert-danger" role="alert">' 
                + 'Alla kontaktlistor är raderade!' + 
            '</div>';
            setTimeout(() => { /* rensa formMessages efter 3 sekunder */
                formMessages.innerHTML = "";
                
            }, 3000);
        } else{  /* Om man ångrar avbryta loopen */

                break;
            
            } 
    }; 

});



