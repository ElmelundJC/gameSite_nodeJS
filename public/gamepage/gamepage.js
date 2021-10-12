// ################################### HJULET #########################################################

// Instansiering af et nyt object af wheel hvortil hjulets specifikationer defineres.
let theWheel = new Winwheel({
    'numSegments'       :   8,          // antal segmenter i hjulet
    'lineWidth'         :   2,          // border/grænse tykkelse 
    'textOrientation'   : 'vertical',   // opstilling af teksten i segmenterne
    'textAlignment'     : 'center',      // texten går udefra og ind mod midten
    'textFontFamily'    : 'Poppins',// FONT type
    'innerRadius'       : 40,           // Indre cirkel i hjulet
    'pointerAngle'      : 90,           // Her definere vi den vinkel hvor vores "pointer-arrow" er 
                                        // sat til.dvs. den vindene position på hjulet.
// Man kan opstille en guidelinje der markere den stillede "position/pointerAngle".
//     'pointerGuide'      : 
//     {
//         'display'       : true,
//         'strokeStyle'   : 'red',
//         'lineWidth'     : 3
//     },
    'segments'          :               // farve og tekst
    [
        {'fillStyle'    :   '#fff457', 'text'   : '1', 'textFontSize' : 50},
        {'fillStyle'    :   '#69fa3d', 'text'   : '2', 'textFontSize' : 50},
        {'fillStyle'    :   '#6c7e85', 'text'   : '0', 'textFontSize' : 50},
        {'fillStyle'    :   '#00ffea', 'text'   : '4', 'textFontSize' : 50},
        {'fillStyle'    :   '#003cff', 'text'   : '5', 'textFontSize' : 50},
        {'fillStyle'    :   '#c300ff', 'text'   : '6', 'textFontSize' : 50},
        {'fillStyle'    :   '#ffa500', 'text'   : '7', 'textFontSize' : 50},
        {'fillStyle'    :   '#ff5e00', 'text'   : '8', 'textFontSize' : 50}
    ],
    'animation'         : 
    {
        'type'          : 'spinToStop', // type af animation (spintToStop, SpinOngoing, spinAndBack, custom)
        'duration'      : 8,            //
        'spins'         : 6,
        // Til at gribe det vindende element: 
        'callbackFinished'  : 'winAnimation()',
        'direction'     : 'clockwise',
    },
});

// ################################### HJULET #########################################################

let tableName = document.querySelector('.table-name');
let tableScore = document.querySelector('.table-score');

let highestScore;


async function getScoreboard() {
    // let tableName = document.querySelector('.table-name');
    // let tableScore = document.querySelector('.table-score');
    
    await fetch('/api/users/getMe', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then( response => {
        return response.json();
    })
    .then( data => {
        console.log(data.data.user.name);
        console.log(data.data.user.currentScore);
        
        tableName.innerHTML = data.data.user.name;
        tableScore.innerHTML = data.data.user.currentScore;

        highestScore = data.data.user.maxScore;
        console.log('Highest Score: ', highestScore);
    })
    .catch((error) => {
        console.log('Error: ', error);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    getScoreboard();
});

async function winAnimation() {

//    getIndicatedSegment() er funktionen der returnere pointeren til det segment vi definerede som vindervinklen på hjulet.
//    let winningSegment = theWheel.getIndicatedSegment();
//    console.log(winningSegment);
   
    // 'Tag' det vindende segment
    let winningSegmentNumber = theWheel.getIndicatedSegmentNumber();

    let oldNumber = tableScore.innerText;
    console.log(oldNumber);

    if (winningSegmentNumber === 3) {
        tableScore.innerText = 0;
    } else {
        tableScore.innerText = parseInt(oldNumber) + winningSegmentNumber;
    }

    let numberToDatabase = tableScore.innerText;
    
    if ( numberToDatabase > highestScore ) {
        highestScore = numberToDatabase;
    }


    const data = {currentScore: numberToDatabase, maxScore: highestScore};

    await fetch('/api/users/updateMe', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then( response => response.json())
    .then( response => {
        return response

    })
    .catch((error) => {
        console.log('Error: ', error);
    });

    // Da animationen allerede har fundet sted er det nødvendigt at tillægge nye spins til hjulet.
    theWheel.animation.spins += 6;
    theWheel.animation.duration = 8;

    theWheel.draw();  
};