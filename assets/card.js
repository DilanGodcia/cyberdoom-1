
 document.querySelectorAll(".game-card").forEach(card => {
    const height = card.clientHeight;
    const width = card.clientWidth;

    card.addEventListener("mousemove", (evt) => {
        const { layerX, layerY } = evt;

        const yRotation = ((layerX - width / 2) / width) * 20;
        const xRotation = -((layerY - height / 2) / height) * 20;

        card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

    card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
});
    