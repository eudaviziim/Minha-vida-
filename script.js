document.addEventListener("DOMContentLoaded", () => {
  const imagens = document.querySelectorAll(".galeria img");
  const tela = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");

  if (imagens.length > 0 && tela && imgGrande && fechar) {
    imagens.forEach((img) => {
      img.addEventListener("click", () => {
  tela.style.display = "flex";
  imgGrande.src = img.src;

  document.body.classList.add("no-scroll");
});
    });

    tela.addEventListener("click", () => {
  tela.style.display = "none";
  imgGrande.src = "";

  document.body.classList.remove("no-scroll");
});

    fechar.addEventListener("click", (event) => {
  event.stopPropagation();
  tela.style.display = "none";
  imgGrande.src = "";

  document.body.classList.remove("no-scroll");
});
  }
});