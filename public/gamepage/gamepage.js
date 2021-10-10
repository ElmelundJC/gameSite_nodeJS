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

function winAnimation() {

   // getIndicatedSegment() er funktionen der returnere pointeren til det segment vi definerede som vindervinklen på hjulet.
   let winningSegment = theWheel.getIndicatedSegment();
   console.log(winningSegment);
   
    // 'Tag' det vindende segment
    let winningSegmentNumber = theWheel.getIndicatedSegmentNumber();

    console.log(winningSegmentNumber);

    




    // let tbodyRef = document.getElementById('table_body');

    // let tRowChild = tbodyRef.children;
    
    
    // for (let i = 0; i < tRowChild.length; i++) {
    //     if(tRowChild[i].children[1].innerHTML === ""){ 
    //         if(3 === winningSegmentNumber){
    //             tRowChild[i].children[1].innerText = `NITTE`
    //         } else if (7 === winningSegmentNumber){
    //             tRowChild[i].children[1].innerText = `NITTE`
    //         } else {
    //             tRowChild[i].children[1].innerText = `${winningSegmentNumber}`
    //         }
    //     }; 
    // };

    // Da animationen allerede har fundet sted er det nødvendigt at tillægge nye spins til hjulet.
    theWheel.animation.spins += 6;
    theWheel.animation.duration = 8;

    theWheel.draw();  

};
