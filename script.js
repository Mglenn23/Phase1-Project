document.addEventListener("DOMContentLoaded", () => {
  const log = console.log;

  //Function scroll event
  window.addEventListener("scroll", reveal);

  function reveal() {
    let reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
      let windowHeight = window.innerHeight;
      let revealTop = reveals[i].getBoundingClientRect().top;
      let revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  //   Get element from index.html
  let getRandomPic = document.querySelector("#deckOpponent");
  let myCardPic = document.querySelector("#myCardPicture");
  let containerWinScore = document.getElementById("streakScoreContainer");
  let updateWinScore = document.getElementById("streakScore");
  let levelH3 = document.getElementById("levelH3");

  //   Level difficulity game by how many card to choose
  let easy = 2;
  let medium = 3;
  let hard = 6;

  //   Empty array for keep data temporary
  let highestLevel = [];
  let streak = [];
  let totalStreak = [];
  let winRate = [];
  let correctWrong = [];

  //   Function get data from API and process
  function getRandomCard() {
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch("https://db.ygoprodeck.com/api/v7/randomcard.php", configuration)
      .then((resp) => {
        return resp.json();
      })
      .then(function (obj) {
        let imgs = obj.card_images[0].image_url;
        addOpponentCard(imgs);
      });
  }

  //   Health Bar
  let healthPlayer = [100];
  let health = document.getElementById("health");
  health.style.width = `${healthPlayer[0]}%`;
  health.textContent = `${healthPlayer[0]} hp`;

  //   Function process the data and display card to index.html
  function addOpponentCard(image) {
    let deckOpponent = document.querySelector("#deckOpponent");
    let divCol = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardText = document.createElement("div");
    let divCardInner = document.createElement("div");
    let divCardPicFront = document.createElement("div");
    let divCardPicBack = document.createElement("div");
    let divButton = document.createElement("div");
    let divCardButton = document.createElement("div");
    let img = document.createElement("img");
    let imgBack = document.createElement("img");
    let button = document.createElement("button");

    divCol.className = "colDeck";
    divCard.className = "card text-center shadow-sm";
    img.style = "width: 100%;padding:25px";
    img.setAttribute("src", `${image}`);
    img.setAttribute("class", `frontIMG`);

    divCardPicFront.appendChild(img);
    divCardPicFront.className = "front";

    imgBack.style = "width: 100%;padding:25px";
    imgBack.setAttribute("src", "./img/download.jpg");

    divCardPicBack.appendChild(imgBack);
    divCardPicBack.className = "";

    divCardInner.className = "classInner";
    divCardInner.style = "background: black;";

    divCardInner.appendChild(divCardPicFront);
    divCardInner.appendChild(divCardPicBack);

    divCardText.className = "card-body";
    divCardText.style = "background:black";

    divCardButton.className = "d-flex justify-content-evenly";
    divButton.className = "btn-group";
    button.className = "btn btn-sm btn-outline-danger";
    button.setAttribute("type", "button");
    button.setAttribute("id", `sweetalert`);
    button.setAttribute("value", `${image}`);

    button.textContent = "Pick";
    button.style = "width:100%";

    divCardButton.appendChild(button);

    divCardText.appendChild(divCardButton);

    divCard.appendChild(divCardInner);
    divCard.appendChild(divCardText);
    divCol.appendChild(divCard);

    deckOpponent.appendChild(divCol);

    // Button Click Event
    button.addEventListener("click", validate);

    // Validation Our Card With Cards Selection
    function validate() {
      let attackOpponent = button.value;
      let colFlipImg = document.querySelectorAll(".colDeck");
      let allButtonHide = document.querySelectorAll("button");
      for (let i = 0; i < colFlipImg.length; i++) {
        colFlipImg[i].className = "colDeck flip";
      }
      for (let i = 0; i < allButtonHide.length; i++) {
        allButtonHide[i].setAttribute("hidden", "");
      }
      let myCardURL = document.querySelector("#myCardPicture").src;
      setTimeout(function () {
        // Alert & Keep Data In Array and Reload The Card
        if (attackOpponent === myCardURL) {
          setTimeout(function () {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Correct!",
              showConfirmButton: false,
              timer: 1000,
            });

            let plusHealth = healthPlayer[0] + 15;
            healthPlayer.shift();
            healthPlayer.push(plusHealth);

            correctWrong.push("correct");
            winRate.push(1);
            streak.push(1);

            deckOpponent.innerHTML = "";
            myCardPic.src = "";

            loadCard();
          }, 1000);
        } else {
          setTimeout(function () {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Wrong!",
              showConfirmButton: false,
              timer: 1000,
            });
            // grab and put to new array the win streak to history
            totalStreak.push(streak.length);

            // delete the win streak if we choose the wrong card
            streak.length = 0;

            let decreaseHealth = healthPlayer[0] - 25;
            correctWrong.push("wrong");
            healthPlayer.shift();
            healthPlayer.push(decreaseHealth);

            deckOpponent.innerHTML = "";
            myCardPic.src = "";

            loadCard();
          }, 1000);
        }
        // End Alert & Keep Data In Array and Reload The Card
      }, 2000);
    }
    // End Validation Our Card With Cards Selection
  }

  function loadCard() {
    // Count Correct,Wrong,highest win streak and level For Status Player
    let recordLevel = Math.max(...highestLevel);
    let highestWinStreak = Math.max(...totalStreak);
    const countsCorrectWrong = {};
    correctWrong.forEach(function (e) {
      countsCorrectWrong[e] = (countsCorrectWrong[e] || 0) + 1;
    });
    let totalWrong;
    let totalCorrect;
    totalCorrect = countsCorrectWrong["correct"];
    totalWrong = countsCorrectWrong["wrong"];
    // End Count Correct,Wrong,highest win streak and level For Status Player

    // Validation Max,Min Health and Lose Game
    if (healthPlayer[0] > 100) {
      healthPlayer.shift();
      healthPlayer.push(100);
    } else if (healthPlayer[0] <= 0) {
      healthPlayer.shift();
      healthPlayer.push(100);
      highestLevel.length = 0;
      totalStreak.length = 0;
      winRate.length = 0;
      correctWrong.length = 0;

      Swal.fire(
        {
          icon: "warning",
          title: "You Lose",
          text: "Try again!",
        },
        function () {
          window.location.reload();
        }
      );
    }
    // End Validation Max,Min Health and Lose Game

    // Validation show Win Streak
    if (streak.length >= 1) {
      containerWinScore.removeAttribute("hidden");
      updateWinScore.textContent = `${streak.length}`;
    } else if (streak.length === 0) {
      containerWinScore.setAttribute("hidden", "");
    }
    // End Validation show Win Streak

    // Validation Health HP
    if (healthPlayer[0] <= 25) {
      health.className = "progress-bar bg-danger";
    } else if (healthPlayer[0] <= 50) {
      health.className = "progress-bar bg-warning";
    } else if (healthPlayer[0] > 50) {
      health.className = "progress-bar bg-success";
    }
    health.style.width = `${healthPlayer[0]}%`;
    health.textContent = `${healthPlayer[0]} hp`;
    // End Validation Health HP

    // Validation Levels Game
    if (winRate.length < 5) {
      highestLevel.push(easy);
      level(easy);
      levelH3.textContent = `Easy Level (${5 - winRate.length} Wins For Next Level)`;
    } else if (winRate.length >= 5 && winRate.length < 10) {
      highestLevel.push(medium);
      level(medium);
      levelH3.textContent = `Medium Level (${10 - winRate.length}Wins For Next Level)`;
    } else if (winRate.length >= 10 && winRate.length < 15) {
      highestLevel.push(hard);
      level(hard);
      levelH3.textContent = `Hard Level (${15 - winRate.length}Wins For Champhion)`;
    } else if (winRate.length >= 15) {
      healthPlayer.shift();
      healthPlayer.push(100);
      highestLevel.length = 0;
      totalStreak.length = 0;
      winRate.length = 0;
      correctWrong.length = 0;

      Swal.fire(
        {
          title: "Congratulation!",
          text: "Your Champion!",
          imageUrl: "https://media4.giphy.com/media/5USTijryafZEQ/giphy.gif",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Your Champion!",
        },
        function () {
          window.location.reload();
        }
      );
    }
    // End Validation Levels Game

    // Create the chart (Highcharts)
    Highcharts.chart("container", {
      chart: {
        type: "column",
      },
      credits: {
        enabled: false,
      },
      title: {
        align: "center",
        text: "Player Game Status",
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Total game status",
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y}",
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>',
      },

      series: [
        {
          name: "Status",
          colorByPoint: true,
          data: [
            {
              name: "Correct",
              y: totalCorrect,
            },
            {
              name: "Wrong",
              y: totalWrong,
            },
            {
              name: "Highest Win Streak",
              y: highestWinStreak,
            },
            {
              name: "Highest Level",
              y: recordLevel,
            },
          ],
        },
      ],
    });
    // End Create the chart (Highcharts)
  }

  // Function Load Random Cards And Our Card
  function level(lvl) {
    for (let i = 0; i < lvl; i++) {
      getRandomCard();
    }
    // Function Load Our Card
    function myCard() {
      let exe = false;
      setTimeout(function () {
        let getIMG = getRandomPic.getElementsByClassName("frontIMG");
        function getRandomInt(max) {
          return Math.floor(Math.random() * max);
        }
        let levelGame = getRandomInt(lvl);
        // log Cheat To Guess Card
        // log("level" + lvl);
        // log(levelGame);

        let image = getIMG[levelGame];

        // Validation & loop until get Img source
        /*
        (BUGS FIXED)
        because our card grab the img card from #deckOpponent class, 
        sometimes it take more times to load the cards. If we don't use this
        validation it will give an error and our card not loaded.
        */
        setTimeout(function () {
          if (image == undefined) {
            if (exe == false) {
              exe = true;
              myCard();
            } else {
              exe = false;
            }
          } else {
            myCardPic.src = `${image.src}`;
          }
        }, 500);

        // End Validation & loop until get Img source
      }, 1000);
    }
    // End Function Load Our Card
    myCard();
  }
  // End Function Load Random Cards And Our Card

  loadCard();
});
