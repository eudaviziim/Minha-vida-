document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     LAZY LOADING DAS FOTOS
     ========================================================= */

  const imagensLazy = document.querySelectorAll(".galeria img[data-src]");

  const imagemVazia =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

  imagensLazy.forEach(function (img) {
    img.src = imagemVazia;
    img.decoding = "async";
    img.loading = "lazy";
  });

  if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver(
      function (entradas, observer) {

        entradas.forEach(function (entrada) {

          if (!entrada.isIntersecting) return;

          const img = entrada.target;
          const endereco = img.dataset.src;

          if (!endereco) return;

          img.src = endereco;
          img.removeAttribute("data-src");

          observer.unobserve(img);

        });

      },
      {
        rootMargin: "500px 0px",
        threshold: 0.01
      }
    );

    imagensLazy.forEach(function (img) {
      observador.observe(img);
    });

  } else {

    imagensLazy.forEach(function (img) {

      img.src = img.dataset.src;
      img.removeAttribute("data-src");

    });

  }


  /* =========================================================
     MODAL DAS FOTOS + CARREGAMENTO
     ========================================================= */

  const galeria =
    document.querySelector(".galeria");

  const telaCheia =
    document.getElementById("telaCheia");

  const imgGrande =
    document.getElementById("imgGrande");

  const fechar =
    document.getElementById("fechar");

  const loadingFoto =
    document.getElementById("loadingFoto");

  let modalAberto = false;


  if (
    galeria &&
    telaCheia &&
    imgGrande &&
    fechar
  ) {

    galeria.addEventListener("click", function (e) {

      const img =
        e.target.closest("img");

      if (!img) return;

      e.preventDefault();
      e.stopPropagation();

      const endereco =
        img.dataset.src || img.src;


      telaCheia.classList.add("ativo");

      document.body.classList.add("no-scroll");

      modalAberto = true;


      if (loadingFoto) {
        loadingFoto.classList.add("ativo");
      }


      imgGrande.classList.remove(
        "foto-pronta"
      );

      imgGrande.removeAttribute("src");


      const imagemGrande =
        new Image();


      imagemGrande.onload =
        function () {

          if (!modalAberto) return;

          imgGrande.src =
            endereco;

          imgGrande.alt =
            img.alt ||
            "Imagem ampliada";

          imgGrande.classList.add(
            "foto-pronta"
          );


          if (loadingFoto) {
            loadingFoto.classList.remove(
              "ativo"
            );
          }

        };


      imagemGrande.onerror =
        function () {

          if (loadingFoto) {
            loadingFoto.classList.remove(
              "ativo"
            );
          }

        };


      imagemGrande.src =
        endereco;

    });


    function fecharModal() {

      telaCheia.classList.remove(
        "ativo"
      );

      document.body.classList.remove(
        "no-scroll"
      );

      modalAberto = false;


      if (loadingFoto) {
        loadingFoto.classList.remove(
          "ativo"
        );
      }


      imgGrande.classList.remove(
        "foto-pronta"
      );


      setTimeout(function () {

        imgGrande.removeAttribute(
          "src"
        );

      }, 250);

    }


    fechar.addEventListener(
      "click",
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        fecharModal();

      }
    );


    document.addEventListener(
      "keydown",
      function (e) {

        if (
          e.key === "Escape" &&
          modalAberto
        ) {
          fecharModal();
        }

      }
    );

  }


  /* =========================================================
     BOTÃO VOLTAR AO TOPO
     ========================================================= */

  const btnTopo =
    document.getElementById("btnTopo");

  if (btnTopo) {

    function verificarTopo() {

      if (window.scrollY > 350) {

        btnTopo.style.display =
          "flex";

      } else {

        btnTopo.style.display =
          "none";

      }

    }


    window.addEventListener(
      "scroll",
      verificarTopo,
      { passive: true }
    );


    verificarTopo();


    btnTopo.addEventListener(
      "click",
      function () {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* =========================================================
     TRANSIÇÃO ENTRE PÁGINAS
     ========================================================= */

  const links =
    document.querySelectorAll(
      'a[href$=".html"]'
    );


  links.forEach(function (link) {

    link.addEventListener(
      "click",
      function (e) {

        const destino =
          link.getAttribute("href");


        if (
          !destino ||
          destino.startsWith("#") ||
          link.target === "_blank"
        ) {
          return;
        }


        e.preventDefault();


        document.body.classList.add(
          "saindo"
        );


        setTimeout(
          function () {

            window.location.href =
              destino;

          },
          220
        );

      }
    );

  });


  /* =========================================================
     FUNDO ANIMADO
     ========================================================= */

  const canvas =
    document.getElementById("bg-3d");

  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext(
      "2d",
      {
        alpha: true
      }
    );


  if (!ctx) {
    return;
  }


  let largura =
    window.innerWidth;

  let altura =
    window.innerHeight;


  let particulas = [];


  let dpr =
    Math.min(
      window.devicePixelRatio || 1,
      1.5
    );


  let ultimoFrame = 0;

  let animacaoAtiva = true;


  /* =========================================================
     CONFIGURAR CANVAS
     ========================================================= */

  function configurarCanvas() {

    largura =
      window.innerWidth;

    altura =
      window.innerHeight;


    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        1.5
      );


    canvas.width =
      Math.floor(
        largura * dpr
      );


    canvas.height =
      Math.floor(
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


    const celular =
      largura <= 700;


    const quantidade =
      celular ? 45 : 80;


    for (
      let i = 0;
      i < quantidade;
      i++
    ) {

      particulas.push({

        x:
          Math.random() *
          largura,

        y:
          Math.random() *
          altura,

        tamanho:
          Math.random() *
          1.5 +
          0.5,

        velocidade:
          Math.random() *
          0.20 +
          0.05,

        brilho:
          Math.random() *
          0.45 +
          0.25,

        fase:
          Math.random() *
          Math.PI *
          2

      });

    }

  }


  configurarCanvas();

  criarParticulas();


  /* =========================================================
     RESIZE
     ========================================================= */

  let resizeTimer;


  window.addEventListener(
    "resize",
    function () {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          function () {

            configurarCanvas();
            criarParticulas();

          },
          150
        );

    },
    {
      passive: true
    }
  );


  /* =========================================================
     ECONOMIZAR BATERIA
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

    requestAnimationFrame(
      animar
    );


    if (!animacaoAtiva) {
      return;
    }


    if (
      tempo -
      ultimoFrame <
      16
    ) {
      return;
    }


    ultimoFrame =
      tempo;


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


    for (
      let i = 0;
      i < particulas.length;
      i++
    ) {

      const p =
        particulas[i];


      p.y -=
        p.velocidade;


      if (p.y < -10) {

        p.y =
          altura + 10;

        p.x =
          Math.random() *
          largura;

      }


      const pulsar =
        0.5 +
        Math.sin(
          agora * 1.4 +
          p.fase
        ) *
        0.5;


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

          const a =
            particulas[i];

          const b =
            particulas[j];


          const dx =
            a.x - b.x;

          const dy =
            a.y - b.y;


          const distancia =
            Math.sqrt(
              dx * dx +
              dy * dy
            );


          if (
            distancia < 105
          ) {

            const opacidade =
              (
                1 -
                distancia / 105
              ) *
              0.10;


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


            ctx.lineWidth =
              0.5;


            ctx.stroke();

          }

        }

      }

    }

  }


  requestAnimationFrame(
    animar
  );

});