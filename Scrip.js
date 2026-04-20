alert("JS carregou");

document.addEventListener("DOMContentLoaded", () => {
  const imagens = document.querySelectorAll(".galeria img");
  const tela = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");

  imagens.forEach((img) => {
    img.addEventListener("click", () => {
      imgGrande.src = img.src;
      tela.style.display = "flex";
    });
  });

  tela.addEventListener("click", () => {
    tela.style.display = "none";
    imgGrande.src = "";
  });
});