// ################################### HJULET #########################################################

// Instansiering af et nyt object af wheel hvortil hjulets specifikationer defineres.
let theWheel = new Winwheel({
    'numSegments'       :   8,          // antal segmenter i hjulet
    'lineWidth'         :   2,          // border/grænse tykkelse 
    'textOrientation'   : 'vertical',   // opstilling af teksten i segmenterne
    'textAlignment'     : 'outer',      // texten går udefra og ind mod midten
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
        {'fillStyle'    :   '#fff457', 'text'   : 'GEVINST 1', 'textFontSize' : 30},
        {'fillStyle'    :   '#69fa3d', 'text'   : 'GEVINST 2', 'textFontSize' : 30},
        {'fillStyle'    :   '#6c7e85', 'text'   : 'NITTE',     'textFontSize' : 30},
        {'fillStyle'    :   '#00ffea', 'text'   : 'GEVINST 4', 'textFontSize' : 30},
        {'fillStyle'    :   '#003cff', 'text'   : 'GEVINST 5', 'textFontSize' : 30},
        {'fillStyle'    :   '#c300ff', 'text'   : 'GEVINST 6', 'textFontSize' : 30},
        {'fillStyle'    :   '#6c7e85', 'text'   : 'NITTE',     'textFontSize' : 30},
        {'fillStyle'    :   '#ff5e00', 'text'   : 'GEVINST 8', 'textFontSize' : 30}
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