document.addEventListener('DOMContentLoaded', () => {
    //----------------------------------------------------------------

    //creeare cronometru
    const timp = document.querySelector("#timp");
    let t=0;
    var min, sec;
    function time_convert(num)
    { 
        min = Math.floor(num / 60);  
        sec = num % 60;
        if(sec<10) {
            if(min<10) {
                return "0"+ min + " : 0" + sec;
            } else {
                return min + " : 0" + sec;
            }
        } else if(min<10) {
            return "0"+ min + " : " + sec;
        } else {
            return min + " : " + sec;
        }
    }

    function timer() {
        t++;
        timp.textContent = time_convert(t);
    }

    const startButton = document.querySelector('#start');

    let timer1;

    startButton.onclick = function start() {
        document.querySelector("#popUp").style.display = "none";
        document.querySelector("#sideSection").style.display = "flex";
        timer1 = setInterval(timer, 1000);
    }

    const restartButton = document.querySelector("#restart");

    restartButton.onclick = function restart() {
        location.reload();
    }

    const homeButton = document.querySelector('#home');

    //----------------------------------------------------------------

    //Matrice cu cele 6x2=12 carti de joc fiecare de tip struct
    const cardArray = [
        {
            name: 'fries',
            img: 'images/fries.png'
        },
        {
            name: 'donut',
            img: 'images/donut.png'
        },
        {
            name: 'hotdog',
            img: 'images/hotdog.png'
        },
        {
            name: 'icecream',
            img: 'images/icecream.png'
        },
        {
            name: 'pizza',
            img: 'images/pizza.png'
        },
        {
            name: 'shaorma',
            img: 'images/shaorma.png'
        },
        {
            name: 'fries',
            img: 'images/fries.png'
        },
        {
            name: 'donut',
            img: 'images/donut.png'
        },
        {
            name: 'hotdog',
            img: 'images/hotdog.png'
        },
        {
            name: 'icecream',
            img: 'images/icecream.png'
        },
        {
            name: 'pizza',
            img: 'images/pizza.png'
        },
        {
            name: 'shaorma',
            img: 'images/shaorma.png'
        }
    ];

    //amestecarea cartilor din vectorul de mai sus
    cardArray.sort(() => 0.5 - Math.random());

    //salvarea in constanta 'grid' a div-ului cu clasa '.grid'
    const grid = document.querySelector('.grid');
    //declararea unui constante pentru scor, adica numarul de încercări
    const resultDisplay = document.querySelector('#result');
    let score = 0;
    //crearea a 2 vectori: primul - gol in care vom pune cartile ce se vor intoarce; al 2-lea - gol in care punem id-urile acestor carti
    let cardsChosen = [];
    let cardsChosenId =[];
    //declararea unui vector fara elemente in care vom pastra mai tarziu cartile ce au fost gasite
    let cardsWon = [];

    //crearea tablei
    function createBoard() {
        //generarea cartilor
        for(let i=0; i<cardArray.length; i++)
        {
            //generarea unui element img
            const card = document.createElement('img');
            //atribuirea imaginii unei carti intoarse
            card.setAttribute('src','images/blank.png');
            //atribuirea id-ului corespunzator
            card.setAttribute('data-id', i);
            //la 'click' este apelata functia 'flipcard' pentru intoarcerea cartii de joc
            card.addEventListener('click', flipCard);
            //adaugarea cartii in interiorul 'div'-ului cu clasa '.grid'
            grid.appendChild(card);
            //atribuirea unei clase "playcard" in care sunt proprietatie de stil + atribuirea clasei in care este stocata animatia
            card.setAttribute('class', "playcard playcard_anim");
        }
    }

    //verificarea potrivirii celor doua carti intoarse
    function checkForMatch() {
        //declararea unei variabile "cards" si initializarea ei cu toate imaginile din pagina
        const cards = document.querySelectorAll('img');
        //declararea a doua constante si initializarea lor cu id-urile celor doua carti intoarse ce trebuie comparate
        const optionOneId = cardsChosenId[0];
        const optionTwoId = cardsChosenId[1];
        //verificarea proipriu-zisa a potrivirii celor doua carti intoarse
        if(optionOneId == optionTwoId) 
        {
            //daca se apasa de 2 ori pe aceeasi carte, aceasta e intoarce si jucatorul primeste o alerta
            cards[optionOneId].setAttribute('src', 'images/blank.png');
            cards[optionTwoId].setAttribute('src', 'images/blank.png');
            alert('Ai apăsat pe aceeași carte!');
            //adaugarea animatiei
            cards[optionOneId].classList.add("playcard_anim");
        }
        else if(cardsChosen[0] === cardsChosen[1])
        {
            //daca se potrivesc, atunci elementele 'img' aferente devin doua imagini albe pentru a crea efectul ca cele doua carti au fost ridicate de pe tabla
            cards[optionOneId].setAttribute('src','images/white.png');
            cards[optionTwoId].setAttribute('src','images/white.png');
            //de asemenea, cele doua carti intoarse nu vor mai putea fi apasate
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            //adaugarea cartilor in vectorul "cardsWon"
            cardsWon.push(cardsChosen);
            //cresterea nr. de incercari/ a scorului
            score++;
        }
        else
        {
            //daca cele doua carti nu se potrivesc, se doreste intoarcerea lor cu fata in jos la loc
            cards[optionOneId].setAttribute('src','images/blank.png');
            cards[optionTwoId].setAttribute('src','images/blank.png');
            //se adauga animatia
            cards[optionOneId].classList.add("playcard_anim");
            cards[optionTwoId].classList.add("playcard_anim");
            //cresterea nr. de incercari/ a scorului
            score++;
        }
        //indiferent daca cele doua carti s-au potrivit sau nu, vom goli cei doi vectori:
        cardsChosen = [];
        cardsChosenId = [];
        //modificarea scorului
        resultDisplay.textContent = score;
        //verificare daca mai exista carti de intors
        if(cardsWon.length === cardArray.length/2)
        {
            //oprirea cronometrului
            clearInterval(timer1);

            //------------------------------------------------------
            let mesaj = "Felicitări! Ai finalizat jocul din " + score;
            if(score<20) {
                mesaj += " încercări, în timpul de ";
            } else {
                mesaj += " de încercări, în timpul de ";
            }
            if(min > 20) {
                mesaj = mesaj + min + " de minute și ";
            } else if(mesaj > 0) {
                mesaj = mesaj + min + " minute și ";
            }
            if(sec > 20) {
                mesaj = mesaj + sec + " de secunde.";
            } else if(sec > 0) {
                mesaj = mesaj + sec + " secunde.";
            }

            document.querySelector("#sideSection").style.display = "none";
            document.querySelector("#popUp").style.display = "flex";
            document.querySelector("#finalMessage").textContent = mesaj;
            
            restartButton.classList.remove('hidden');
            homeButton.classList.remove('hidden');
            startButton.classList.add("hidden");
        }
    }

    //intoarcerea cartilor de joc
    function flipCard() {
        //stocarea intr-o variabila a id-ului cartii ce se vrea intoarsa
        let cardId =  this.getAttribute('data-id');
        //adaugarea in vector a numelui cartii apasate, respectiv a id-ului
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);
        //modificarea imaginii cardului cu cea de pe verso pentru a simula intoarcerea lui
        this.setAttribute('src', cardArray[cardId].img);
        //eliminarea animatiei
        this.classList.remove("playcard_anim");
        //daca avem 2 carti in vector, atunci le vom compara
        if(cardsChosen.length === 2) {
            //setarea unui timp de intarziere pentru ca jucatorul sa apuce sa-si vada cartile
            //apelam functia checkForMatch dupa o intarziere de 1s (1000ms)
            setTimeout(checkForMatch, 500);
        }
    }
    
    //apelul functiiei pentru crearea tablei
    createBoard();
})//[...]