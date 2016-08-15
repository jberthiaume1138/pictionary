var pictionary = function() {
    var socket = io();

    var canvas, context;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    var drawing;

    canvas.on('mousedown', function(event) {
        drawing = true;
    });

    canvas.on('mouseup', function(event) {
        drawing = false;
    });

    canvas.on('mousemove', function(event) {
        if(drawing === true) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
            draw(position);

            socket.emit('draw', position);
        }
    });

    var $guessBox = $('#guessBox');

    var onKeyDown = function(event) {
        if (event.keyCode == 13) { // Enter ... er this is NOT enter
        //     return;
        // }

            var guess = $guessBox.val();
            socket.emit('guess', guess);
            console.log($guessBox.val());
            $guessBox.val('');
        }
    };

    $guessBox.on('keydown', onKeyDown);

    var $guesses = $('#guessDisplay');
    var updateGuesses = function(guess) {
        $guesses.css("display","block");
        $guesses.append('<p>' + guess + '</p>');
    };

    socket.on('draw', draw);
    socket.on('guess made', updateGuesses);
};



$(document).ready(function() {
    pictionary();
});
