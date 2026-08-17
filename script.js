document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MODAL DAS FOTOS
     ========================================================= */

  const imagens = document.querySelectorAll(".galeria img");
  const telaCheia = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");

  let modalAberto = false;

  if (imagens.length && telaCheia && imgGrande && fechar) {

    imagens.forEach((img) => {

      img.addEventListener("click", () => {

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

      setTimeout(() => {
        imgGrande.removeAttribute("src");
      }, 250);

    }

    // SOMENTE O X FECHA
    fechar.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      fecharModal();

    });

    // ESC no computador
    document.addEventListener("keydown", (event) => {

      if (
        event.key === "Escape" &&
        modalAberto
      ) {
        fecharModal();
      }

    });

  }


  /* =========================================================
     BOTÃO VOLTAR AO TOPO
     ========================================================= */

  const btnTopo =
    document.getElementById("btnTopo");

  if (btnTopo) {

    let aguardando = false;

    function atualizarBotao() {

      btnTopo.style.display =
        window.scrollY > 350
          ? "flex"
          : "none";

      aguardando = false;

    }

    window.addEventListener(
      "scroll",
      () => {

        if (!aguardando) {

          requestAnimationFrame(
            atualizarBotao
          );

          aguardando = true;

        }

      },
      { passive: true }
    );

    atualizarBotao();

    btnTopo.addEventListener(
      "click",
      () => {

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

  links.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const destino =
          link.getAttribute("href");

        if (
          !destino ||
          destino.startsWith("#") ||
          link.target === "_blank"
        ) {
          return;
        }

        event.preventDefault();

        document.body.style.transition =
          "opacity .25s ease";

        document.body.style.opacity = "0";

        setTimeout(() => {

          window.location.href =
            destino;

        }, 250);

      }
    );

  });


  /* =========================================================
     FUNDO ANIMADO
     
     PRIMEIRO:
     tenta Three.js.

     SE NÃO FUNCIONAR:
     usa CANVAS 2D COMO PLANO B.
     ========================================================= */

  const canvas =
    document.getElementById("bg-3d");

  if (!canvas) {
    return;
  }


  /* =========================================================
     PLANO B
     CANVAS 2D
     ========================================================= */

  function iniciarPlanoB() {

    console.log(
      "Three.js não disponível. Usando Plano B."
    );

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }


    let largura =
      window.innerWidth;

    let altura =
      window.innerHeight;


    canvas.width = largura;
    canvas.height = altura;


    const celular =
      largura <= 700;


    const quantidade =
      celular ? 45 : 80;


    const particulas = [];


    for (
      let i = 0;
      i < quantidade;
      i++
    ) {

      particulas.push({

        x: Math.random() * largura,

        y: Math.random() * altura,

        tamanho:
          Math.random() * 1.8 + .5,

        velocidade:
          Math.random() * .25 + .08,

        brilho:
          Math.random() * .6 + .2,

        fase:
          Math.random() * Math.PI * 2

      });

    }


    let ativo = true;


    function desenharPlanoB() {

      if (!ativo) {
        return;
      }


      requestAnimationFrame(
        desenharPlanoB
      );


      /*
        Quando abrir uma foto,
        o fundo congela.
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


      const tempo =
        Date.now() * .001;


      for (
        let i = 0;
        i < particulas.length;
        i++
      ) {

        const p =
          particulas[i];


        p.y -= p.velocidade;


        if (p.y < -10) {

          p.y =
            altura + 10;

          p.x =
            Math.random() * largura;

        }


        const pulsar =
          .5 +
          Math.sin(
            tempo * 1.5 +
            p.fase
          ) * .5;


        const opacidade =
          p.brilho *
          (.5 + pulsar * .5);


        ctx.beginPath();


        ctx.arc(
          p.x,
          p.y,
          p.tamanho,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          `rgba(0,217,255,${opacidade})`;


        ctx.fill();


      }


      /*
        Pequenas linhas entre algumas partículas.
        Só no computador para manter o celular leve.
      */

      if (!celular) {

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


            if (distancia < 100) {

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
                `rgba(0,217,255,${(
                  1 -
                  distancia / 100
                ) * .12})`;

              ctx.lineWidth = .5;

              ctx.stroke();

            }

          }

        }

      }

    }


    window.addEventListener(
      "resize",
      () => {

        largura =
          window.innerWidth;

        altura =
          window.innerHeight;

        canvas.width =
          largura;

        canvas.height =
          altura;

      },
      { passive: true }
    );


    desenharPlanoB();

  }


  /* =========================================================
     TENTAR THREE.JS
     ========================================================= */

  if (
    typeof THREE === "undefined"
  ) {

    // Three.js não carregou
    iniciarPlanoB();

    return;

  }


  /* =========================================================
     THREE.JS
     ========================================================= */

  try {

    const celular =
      window.innerWidth <= 700;

    const celularPequeno =
      window.innerWidth <= 450;


    const scene =
      new THREE.Scene();


    const camera =
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
          window.innerHeight,
        .1,
        100
      );


    camera.position.z = 4;


    const renderer =
      new THREE.WebGLRenderer({

        canvas: canvas,

        alpha: true,

        antialias: !celular

      });


    renderer.setPixelRatio(
      celular
        ? 1
        : Math.min(
            window.devicePixelRatio || 1,
            1.5
          )
    );


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    /*
      Se o WebGL não estiver disponível,
      cai automaticamente no Plano B.
    */

    if (!renderer.getContext()) {

      iniciarPlanoB();

      return;

    }


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    let quantidade;

    if (celularPequeno) {

      quantidade = 260;

    } else if (celular) {

      quantidade = 380;

    } else {

      quantidade = 750;

    }


    const geometry =
      new THREE.BufferGeometry();


    const positions =
      new Float32Array(
        quantidade * 3
      );


    for (
      let i = 0;
      i < quantidade;
      i++
    ) {

      const i3 =
        i * 3;


      positions[i3] =
        (Math.random() - .5) * 12;

      positions[i3 + 1] =
        (Math.random() - .5) * 8;

      positions[i3 + 2] =
        (Math.random() - .5) * 8;

    }


    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );


    const material =
      new THREE.PointsMaterial({

        size:
          celular
            ? .032
            : .025,

        color:
          0x00d9ff,

        transparent:
          true,

        opacity:
          .55,

        blending:
          THREE.AdditiveBlending,

        depthWrite:
          false

      });


    const particles =
      new THREE.Points(
        geometry,
        material
      );


    scene.add(
      particles
    );


    /* =====================================================
       SEGUNDO GRUPO
       ===================================================== */

    const quantidade2 =
      celular ? 100 : 250;


    const geometry2 =
      new THREE.BufferGeometry();


    const positions2 =
      new Float32Array(
        quantidade2 * 3
      );


    for (
      let i = 0;
      i < quantidade2;
      i++
    ) {

      const i3 =
        i * 3;


      positions2[i3] =
        (Math.random() - .5) * 14;

      positions2[i3 + 1] =
        (Math.random() - .5) * 10;

      positions2[i3 + 2] =
        (Math.random() - .5) * 9;

    }


    geometry2.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions2,
        3
      )
    );


    const material2 =
      new THREE.PointsMaterial({

        size:
          celular
            ? .015
            : .012,

        color:
          0xffffff,

        transparent:
          true,

        opacity:
          .25,

        depthWrite:
          false

      });


    const particles2 =
      new THREE.Points(
        geometry2,
        material2
      );


    scene.add(
      particles2
    );


    /* =====================================================
       ANIMAÇÃO
       ===================================================== */

    const clock =
      new THREE.Clock();


    function animar() {

      requestAnimationFrame(
        animar
      );


      /*
        Foto aberta:
        congela o fundo.
      */

      if (modalAberto) {
        return;
      }


      const tempo =
        clock.getElapsedTime();


      particles.rotation.y =
        tempo * .014;

      particles.rotation.x =
        tempo * .005;


      particles2.rotation.y =
        -tempo * .008;

      particles2.rotation.x =
        tempo * .003;


      renderer.render(
        scene,
        camera
      );

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
      "resize",
      () => {

        clearTimeout(
          resizeTimer
        );


        resizeTimer =
          setTimeout(() => {

            camera.aspect =
              window.innerWidth /
              window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(
              window.innerWidth,
              window.innerHeight
            );

          }, 150);

      },
      { passive: true }
    );


    animar();


  } catch (erro) {

    /*
      QUALQUER ERRO NO THREE.JS
      ativa o Plano B.
    */

    console.warn(
      "Three.js falhou. Ativando Plano B.",
      erro
    );

    iniciarPlanoB();

  }

});