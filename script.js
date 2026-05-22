let header = document.querySelector('header')

header.addEventListener("click", (event) => {
    header.classList.toggle("is-hidden")
});

let games = document.querySelectorAll("gameContainer")

for (let card of games) {
    card.addEventListener("click", () => {
        const game = card.querySelector(".cardTitle")
        const text2name = trim(game.value.toLowerCase().replace(/\s+/g, ''))
        window.location.href = `./games/${text2name}/index.html`;
})
}