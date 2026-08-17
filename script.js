document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     GALERIA
     ========================================================= */

  const imagens =
    document.querySelectorAll(".galeria img");

  const telaCheia =
    document.getElementById("telaCheia");

  const imgGrande =
    document.getElementById("imgGrande");

  const fechar =
    document.getElementById("fechar");


  let modalAberto = false;


  if (
    imagens.length > 0 &&
    telaCheia &&
    imgGrande &&
    fechar
  ) {

    imagens.forEach((img) => {

      img.addEventListener("click", () => {

        imgGrande.src =
          img.currentSrc || img.src;

        imgGrande.alt =
          img.alt || "Imagem ampliada";


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


    /* =====================================================
       FECHAR SOMENTE PELO X
       ===================================================== */

    fechar.addEventListener("click", (event) => {

      event.preventDefault();

      event.stopPropagation();

      fecharModal();

    });


    /*
      NÃO colocamos click no fundo.

      Portanto:
      tocar fora da foto NÃO fecha.
    */


    /* ESC somente no computador */

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

    let esperandoScroll = false;


    function verificarScroll() {

      if (window.scrollY > 350) {

        btnTopo.style.display = "flex";

      } else {

        btnTopo.style.display = "none";

      }

      esperandoScroll = false;

    }


    window.addEventListener(
      "scroll",
      () => {

        if (!esperandoScroll) {

          requestAnimationFrame(
            verificarScroll
          );

          esperandoScroll = true;

        }

      },
      {
        passive: true
      }
    );


    verificarScroll();


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


        document.body.style.opacity =
          "0";


        setTimeout(() => {

          window.location.href =
            destino;

        }, 250);

      }
    );

  });


  /* =========================================================
     THREE.JS
     ========================================================= */

  const canvas =
    document.getElementById("bg-3d");


  if (
    !canvas ||
    typeof THREE === "undefined"
  ) {

    return;

  }


  /* =========================================================
     CELULAR
     ========================================================= */

  const celular =
    window.innerWidth <= 700;


  const celularPequeno =
    window.innerWidth <= 450;


  /* =========================================================
     CENA
     ========================================================= */

  const scene =
    new THREE.Scene();


  /* =========================================================
     CAMERA
     ========================================================= */

  const camera =
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth /
        window.innerHeight,
      0.1,
      100
    );


  camera.position.z = 4;


  /* =========================================================
     RENDER
     ========================================================= */

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


  /* =========================================================
     PARTÍCULAS
     ========================================================= */

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


  /* =========================================================
     SEGUNDO GRUPO
     ========================================================= */

  const geometry2 =
    new THREE.BufferGeometry();


  const quantidade2 =
    celular
      ? 100
      : 250;


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


  /* =========================================================
     MOUSE
     
     SOMENTE PC.
     NENHUM touchmove.
     ========================================================= */

  let mouseX = 0;
  let mouseY = 0;

  let alvoX = 0;
  let alvoY = 0;


  if (!celular) {

    window.addEventListener(
      "mousemove",
      (event) => {

        alvoX =
          (
            event.clientX /
            window.innerWidth -
            .5
          ) * .3;


        alvoY =
          (
            event.clientY /
            window.innerHeight -
            .5
          ) * .3;

      },
      {
        passive: true
      }
    );

  }


  /* =========================================================
     RESIZE
     ========================================================= */

  let timerResize;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        timerResize
      );


      timerResize =
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
    {
      passive: true
    }
  );


  /* =========================================================
     ANIMAÇÃO
     ========================================================= */

  let animacaoRodando = true;

  const clock =
    new THREE.Clock();


  function animar() {

    if (!animacaoRodando) {
      return;
    }


    requestAnimationFrame(
      animar
    );


    /*
      Quando o modal estiver aberto,
      o fundo fica congelado.
    */

    if (modalAberto) {
      return;
    }


    const tempo =
      clock.getElapsedTime();


    if (!celular) {

      mouseX +=
        (
          alvoX -
          mouseX
        ) * .02;


      mouseY +=
        (
          alvoY -
          mouseY
        ) * .02;

    }


    particles.rotation.y =
      tempo * .014 +
      mouseX;


    particles.rotation.x =
      tempo * .005 +
      mouseY;


    particles2.rotation.y =
      -tempo * .008;


    particles2.rotation.x =
      tempo * .003;


    renderer.render(
      scene,
      camera
    );

  }


  /* =========================================================
     INICIAR
     ========================================================= */

  animar();

});