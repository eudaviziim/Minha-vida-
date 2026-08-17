document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     MODAL DAS FOTOS
     ========================================================= */

  const imagens = document.querySelectorAll(".galeria img");
  const telaCheia = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");

  let modalAberto = false;

  if (imagens.length > 0 && telaCheia && imgGrande && fechar) {

    imagens.forEach(function (img) {

      img.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        imgGrande.src = img.currentSrc || img.src;
        imgGrande.alt = img.alt || "Imagem ampliada";

        telaCheia.classList.add("ativo");

        document.body.classList.add("no-scroll");

        modalAberto = true;
      });

    });


    function fecharModal() {

      telaCheia.classList.remove("ativo");

      document.body.classList.remove("no-scroll");

      modalAberto = false;

      setTimeout(function () {
        imgGrande.removeAttribute("src");
      }, 250);
    }


    /* =====================================================
       SOMENTE O X FECHA A FOTO
       ===================================================== */

    fechar.addEventListener("click", function (e) {

      e.preventDefault();
      e.stopPropagation();

      fecharModal();

    });


    /* ESC NO COMPUTADOR */

    document.addEventListener("keydown", function (e) {

      if (e.key === "Escape" && modalAberto) {
        fecharModal();
      }

    });

  }


  /* =========================================================
     BOTÃO VOLTAR AO TOPO
     ========================================================= */

  const btnTopo = document.getElementById("btnTopo");

  if (btnTopo) {

    function verificarTopo() {

      if (window.scrollY > 350) {
        btnTopo.style.display = "flex";
      } else {
        btnTopo.style.display = "none";
      }

    }

    window.addEventListener(
      "scroll",
      verificarTopo,
      { passive: true }
    );

    verificarTopo();


    btnTopo.addEventListener("click", function () {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  /* =========================================================
     TRANSIÇÃO ENTRE PÁGINAS
     ========================================================= */

  const links = document.querySelectorAll(
    'a[href$=".html"]'
  );

  links.forEach(function (link) {

    link.addEventListener("click", function (e) {

      const destino = link.getAttribute("href");

      if (
        !destino ||
        destino.startsWith("#") ||
        link.target === "_blank"
      ) {
        return;
      }

      e.preventDefault();

      document.body.classList.add("saindo");

      setTimeout(function () {

        window.location.href = destino;

      }, 220);

    });

  });


  /* =========================================================
     FUNDO ANIMADO
     
     SOMENTE CANVAS 2D
     
     NÃO USA THREE.JS
     NÃO USA TOUCH
     NÃO USA MOUSE
     NÃO USA SCROLL
     ========================================================= */

  const canvas = document.getElementById("bg-3d");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d", {
    alpha: true
  });

  if (!ctx) {
    return;
  }


  let largura = window.innerWidth;
  let altura = window.innerHeight;

  let particulas = [];

  let dpr = Math.min(
    window.devicePixelRatio || 1,
    1.5
  );

  let ultimoFrame = 0;

  let animacaoAtiva = true;


  /* =========================================================
     CONFIGURAR CANVAS
     ========================================================= */

  function configurarCanvas() {

    largura = window.innerWidth;
    altura = window.innerHeight;

    dpr = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    canvas.width = Math.floor(
      largura * dpr
    );

    canvas.height = Math.floor(
      altura * dpr
    );

    canvas.style.width =
      largura + "px";

    canvas.style.height =
      altura + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

  }


  /* =========================================================
     CRIAR PARTÍCULAS
     ========================================================= */

  function criarParticulas() {

    particulas = [];

    const celular = largura <= 700;

    const quantidade =
      celular ? 45 : 80;

    for (let i = 0; i < quantidade; i++) {

      particulas.push({

        x:
          Math.random() * largura,

        y:
          Math.random() * altura,

        tamanho:
          Math.random() * 1.5 + 0.5,

        velocidade:
          Math.random() * 0.20 + 0.05,

        brilho:
          Math.random() * 0.45 + 0.25,

        fase:
          Math.random() *
          Math.PI *
          2

      });

    }

  }


  /* =========================================================
     INICIALIZAR
     ========================================================= */

  configurarCanvas();

  criarParticulas();


  /* =========================================================
     RESIZE
     
     SOMENTE REDIMENSIONAMENTO.
     
     NÃO DETECTA MOVIMENTO DO DEDO.
     ========================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    function () {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function () {

        configurarCanvas();
        criarParticulas();

      }, 150);

    },
    { passive: true }
  );


  /* =========================================================
     ECONOMIZAR BATERIA QUANDO A PÁGINA NÃO ESTÁ VISÍVEL
     ========================================================= */

  document.addEventListener(
    "visibilitychange",
    function () {

      animacaoAtiva =
        !document.hidden;

    }
  );


  /* =========================================================
     ANIMAÇÃO
     ========================================================= */

  function animar(tempo) {

    requestAnimationFrame(animar);


    if (!animacaoAtiva) {
      return;
    }


    /* aproximadamente 60 FPS */

    if (
      tempo - ultimoFrame < 16
    ) {
      return;
    }

    ultimoFrame = tempo;


    /*
      Quando uma foto estiver aberta,
      o fundo fica congelado.
    */

    if (modalAberto) {
      return;
    }


    ctx.clearRect(
      0,
      0,
      largura,
      altura
    );


    const agora =
      tempo * 0.001;


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    for (
      let i = 0;
      i < particulas.length;
      i++
    ) {

      const p = particulas[i];


      p.y -= p.velocidade;


      if (p.y < -10) {

        p.y = altura + 10;

        p.x =
          Math.random() * largura;

      }


      const pulsar =
        0.5 +
        Math.sin(
          agora * 1.4 +
          p.fase
        ) * 0.5;


      const opacidade =
        p.brilho *
        (
          0.55 +
          pulsar * 0.45
        );


      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.tamanho,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(0,217,255," +
        opacidade +
        ")";

      ctx.fill();

    }


    /* =====================================================
       LINHAS ENTRE PARTÍCULAS
       
       SOMENTE COMPUTADOR
       PARA O CELULAR FICAR LEVE
       ===================================================== */

    if (largura > 700) {

      for (
        let i = 0;
        i < particulas.length;
        i++
      ) {

        for (
          let j = i + 1;
          j < particulas.length;
          j++
        ) {

          const a = particulas[i];
          const b = particulas[j];

          const dx =
            a.x - b.x;

          const dy =
            a.y - b.y;

          const distancia =
            Math.sqrt(
              dx * dx +
              dy * dy
            );


          if (distancia < 105) {

            const opacidade =
              (
                1 -
                distancia / 105
              ) * 0.10;


            ctx.beginPath();

            ctx.moveTo(
              a.x,
              a.y
            );

            ctx.lineTo(
              b.x,
              b.y
            );

            ctx.strokeStyle =
              "rgba(0,217,255," +
              opacidade +
              ")";

            ctx.lineWidth = 0.5;

            ctx.stroke();

          }

        }

      }

    }

  }


  /* =========================================================
     COMEÇAR ANIMAÇÃO
     ========================================================= */

  requestAnimationFrame(animar);

});