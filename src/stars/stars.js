var stars;
fetch("./stars.json")
  .then((res) => res.json())
  .then((data) => {
    stars = data.stars;
    console.log(stars);
    addStars();
});

function addStars() {

    var space = document.getElementById("space");

    for (let index = 0; index < 25; index++) {
        let posX = Math.random() * space.clientWidth; // Get the width of the "space" div
        let posY = Math.random() * space.clientHeight; // Get the height of the "space" div

        while(posX < 544 && posX > 160 && posY < 464 && posY > 80)
        {
            posX = Math.random() * space.clientWidth; // Get the width of the "space" div
            posY = Math.random() * space.clientHeight; // Get the height of the "space" div
        }

        let scale = Math.round(Math.random() * 8); // Get the width of the "space" div

        var star = document.createElement("img");
        star.src = "./star.png"
        star.classList.add("star");
        star.classList.add("h-" + scale);
        star.classList.add("w-" + scale);
        star.style.left = posX + "px";
        star.style.top = posY + "px";
        star.addEventListener("click", () => {
            showStar(stars[index]);
        });
        
        space.appendChild(star);
    }

    var moon = document.getElementById('moon');
    moon.addEventListener("click", () => {
        showStar("{}");
    });

}

function showStar(data) {
    var star = document.getElementById("starId");
    star.innerHTML = "<img class='w-20 h-20 m-auto' src='./moon.png' alt=''>";
    star.innerHTML += "<h2>" + data.name + "</h2>";
    star.innerHTML += "<a href=" + data.url + ">About me!</a>";
    star.style.display = "inline";
}