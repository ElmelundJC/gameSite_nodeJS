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
        'type'          : 'spinAndBack', // type af animation (spintToStop, SpinOngoing, spinAndBack, custom)
        'duration'      : 8,            //
        'spins'         : 3,
        'easing'        : 'Power2.easeInOut',
        'direction'     : 'clockwise',
        'repeat'        : -1,
        'yoyo'          : true,
    },
});

// ################################### HJULET #########################################################

window.onload = theWheel.startAnimation();