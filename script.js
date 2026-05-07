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
      });
    });

    tela.addEventListener("click", () => {
      tela.style.display = "none";
      imgGrande.src = "";
    });

    fechar.addEventListener("click", (event) => {
      event.stopPropagation();
      tela.style.display = "none";
      imgGrande.src = "";
    });
  }
});
const botoesCurtir = document.querySelectorAll(".like-btn");

botoesCurtir.forEach((botao, index) => {

  const contador = botao.nextElementSibling;

  const chave = "foto-curtida-" + index;

  const chaveContador = "foto-contador-" + index;

  let curtido = localStorage.getItem(chave);

  let total = localStorage.getItem(chaveContador) || 0;

  contador.textContent = total + " curtidas";

  if (curtido === "sim") {

    botao.textContent = "❤️ Curtido";

    botao.classList.add("curtido");

  }

  botao.addEventListener("click", () => {

    let numero = Number(localStorage.getItem(chaveContador)) || 0;

    if (localStorage.getItem(chave) === "sim") {

      numero--;

      localStorage.setItem(chave, "nao");

      botao.textContent = "🤍 Curtir";

      botao.classList.remove("curtido");

    } else {

      numero++;

      localStorage.setItem(chave, "sim");

      botao.textContent = "❤️ Curtido";

      botao.classList.add("curtido");

    }

    localStorage.setItem(chaveContador, numero);

    contador.textContent = numero + " curtidas";

  });

});