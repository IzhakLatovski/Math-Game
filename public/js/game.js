let score = 0;
let randomNumber1;
let randomNumber2;

game();

function game() {
  $("#score").text(score);
  $("#score-save").val(score);

  randomNumber1 = Math.floor(Math.random()*10);
  randomNumber2 = Math.floor(Math.random()*10);

  $("#number1").text(randomNumber1);
  $("#number2").text(randomNumber2);
}



function getAnswer() {
    var answer = $("#answer").val();
    if(parseInt(answer) === randomNumber1*randomNumber2) {
      score++;
    } else {
        $("#answer").addClass("wrong").delay(1000).queue(function(next){
          $(this).removeClass("wrong");
          next();
        });
    }

    $("#answer").val("");
    game();
}
