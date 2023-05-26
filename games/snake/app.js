document.addEventListener('DOMContentLoaded', () => {
    // declararea si initializarea constantelor pentru multimea patratelor, scor, butonul de start si mesajul de final
    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('span');
    const startBtn = document.querySelector('.start');
    const messageDisplay = document.querySelector('.message');

    // declararea si initializarea unui constante pentru latime
    const width = 10;
    // declararea si initializarea unei variabile pentru pozitia pe care se afla marul
    let appleIndex = 0;
    // declararea si initializarea unei variabile pentru sarpe
    let currentSnake = [2,1,0]; //2 este CAPUL sarpelui, iar 0 este varful COZII sarpelui

    // declararea si initializarea de variabile:
    // pentru directie, adica pozitia urmatorului div in functie de directie
    let direction = 1;
    // pentru scor
    let score = 0;
    // pentru coeficientul vitezei
    let speed = 0.95;
    //pentru timpul dintre deplasari
    let intervalTime = 0;
    let interval = 0;
    //pentru mesajul de final de joc
    messageDisplay.textContent = "";
    //pentru a verifica daca am pierdut
    let lose = false;

    // acocierea unei functii pentru pornirea/ repornirea jocului
    function startGame() {
        //ascunerea popUp-ului cu mesaj
        messageDisplay.style.display = "none";
        // resetarea tuturor lucrurilor
        //eliminarea clasei specifice sarpelui pentru fiecare div
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        //eliminarea marului
        squares[appleIndex].classList.remove('apple');
        //oprirea miscarii sarpelui
        clearInterval(interval);
        //reinitializarea scorului
        score = 0;

        // directia initiala va fi din dreapta
        direction = 1;
        // afisarea in pagina a scorului
        scoreDisplay.innerText = score;
        // setarea intervalului de timp = 800ms = 0,8s
        intervalTime = 800;
        //creearea sarpelui de lungime 3 cu capul in 2 si coada in 0
        currentSnake = [2,1,0];
        //atribuirea fiecarui div din sarpe a clasei "snake"
        currentSnake.forEach(index => squares[index].classList.add('snake'));
        // pozitionarea aleatorie a marului
        randomApple();
        //apelarea functiei moveOutcomes la fiecare 'intervalTime' milisecunde <=> pornirea deplasarii sarpelui
        interval = setInterval(moveOutcomes, intervalTime);
        //stergerea mesajului de final
        messageDisplay.textContent = "";
        //steagul de pierdere
        lose = false;
    }

    //funcitia ce are a face cu fiecare actiune a sarpelui
    function moveOutcomes() {
        //lovirea de contur a sarpelui sau trecerea capului prin corp
        if (
                (currentSnake[0] + width >= width*width && direction === width) || //daca capul sarpelui iese in afara celor 100 de divuri (in partea de jos) si merge pe directia in jos, adica daca se loveste de conturul de jos
                (currentSnake[0] % width === width-1 && direction === 1) || //daca capul sarpelui este pe ultima coloana de divuri cu directia spre dreapta, adica loveste conturul din dreapta
                (currentSnake[0] % width === 0 && direction === -1) || //daca capul sarpelui este pe prima coloana de div-uri cu directia spre stanga, adcica daca loveste conturul din stanga
                (currentSnake[0] - width < 0 && direction === -width) || //daca capul iese in afara celor 100 de div-uri (in partea de sus) si are directia spre in sus, adica loveste conturul de sus
                squares[currentSnake[0] + direction].classList.contains('snake') //daca urmatorul div din fata capului este sarpe
            ) {
            //rulare sunet la lovirea sarpelui
            let sound = document.getElementById("loseSound");
            sound.play();
            //afisarea mesajului de final
            messageDisplay.style.display = "flex";
            messageDisplay.textContent = "Șarpele s-a lovit!";
            lose = true;
            //crearea imaginii unui sarpe ametit
            const dizzySnake = document.createElement('img');
            dizzySnake.setAttribute('src', 'images/dizzy_snake.png');
            dizzySnake.classList.add("message_image");
            document.querySelector(".message").appendChild(dizzySnake);
            //oprirea miscarii sarpelui
            return clearInterval(interval);
        }

        //deplasarea sarpelui pe directia 'direction'
        //inlaturarea ultimei bucati din sarpe si salvarea acesteia in constanta 'tail', scurtandu-l din spate
        const tail = currentSnake.pop();
        //inlaturarea clasei 'snake' a div-ului din care a fost bucata eliminata
        squares[tail].classList.remove('snake');
        //adaugarea unei bucati inaintea capului sarpelui, prelungindu-l inainte
        currentSnake.unshift(currentSnake[0] + direction);

        //mancarea marului
        if(squares[currentSnake[0]].classList.contains('apple')) { //daca capul sarpelui se afla in acelasi div cu marul
            //inlaturarea clasei specifica marului
            squares[currentSnake[0]].classList.remove('apple');
            //alungirea sarpelui prin adaugarea clasei specifice sarpelui la coada sa
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            //adaugarea unui alt mar in joc
            randomApple();
            //cresterea, respectiv afisarea scorului
            score++;
            scoreDisplay.textContent = score;
            //rulare sunet la mancarea marului
            let sound = document.getElementById("appleSound");
            sound.play();
            //oprirea deplasarii sarpelui
            clearInterval(interval);
            //marirea vitezei sarpelui, adica micsorarea intervalului de timp la care se repeta apelarea functiei 'moveOutcomes'
            intervalTime = intervalTime * speed;
            //repornirea deplasarii sarpelui cu noua viteza
            interval = setInterval(moveOutcomes, intervalTime);
        }

        //adaugarea clasei specifice sarpelui noului cap
        squares[currentSnake[0]].classList.add('snake');
    }

    //generarea unui nou mar
    function randomApple() {
        //memorarea unei pozitii posibile aleatorii in care ar putea marul sa fie
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while(squares[appleIndex].classList.contains('snake')); //daca patratul de ordin appleIndex are sarpe in el, este generat altul, pana cand nu se va afla sarpele in el
        //adaugarea clasei specifice marului div-ului de indicele gasit anterior
        squares[appleIndex].classList.add('apple');
    }

    // asocierea unei functii ce raspunde la tastele-sageti pentru modificarea directiei sarpelui
    function control(e) {
        //verificarea codurilor tastelor si schimbarea directiei
        if(e.keyCode === 39) {
            direction = 1; //la apasarea tastei - sageata dreapta, sarpele va merge catre patratul din dreapta
            //rulare sunet la apasarea tastei
            let sound = document.getElementById("rightSound");
            sound.play();
        } else if(e.keyCode === 38) {
            direction = -width; //la apasarea tastei - sageata sus, sarpele va merge catre patratul de deasupra (cu 10 div-uri inapoi)
            //rulare sunet la apasarea tastei
            let sound = document.getElementById("upSound");
            sound.play();
        } else if(e.keyCode === 37) {
            direction = -1; //la apasarea tastei - stanga, sarpele va merge cu un div la stanga
            //rulare sunet la apasarea tastei
            let sound = document.getElementById("leftSound");
            sound.play();
        } else if(e.keyCode === 40) {
            direction = +width; //la apasarea tastei - jos, sarpele va merge in jos (cu 10 div-uri inainte)
            //rulare sunet la apasarea tastei
            let sound = document.getElementById("downSound");
            sound.play();
        } else if(e.keyCode === 80) {
            if(messageDisplay.style.display == "none") {
                messageDisplay.style.display = "flex";
                messageDisplay.textContent = "Ești în pauză";
                clearInterval(interval);
                //crearea imaginii unui sarpe adormit
                const sleepySnake = document.createElement('img');
                sleepySnake.setAttribute('src', 'images/sleepy_snake.png');
                sleepySnake.classList.add("message_image");
                document.querySelector(".message").appendChild(sleepySnake);
            }
            else if(lose == false) {
                messageDisplay.style.display = "none";
                interval = setInterval(moveOutcomes, intervalTime);
            }
        }
    }

    //adaugarea evenimentului la luarea degetului de pe o tasta
    document.addEventListener('keydown',control);
    //adaugarea evenimentului la click pe butonul de start
    startBtn.addEventListener('click', startGame);
})