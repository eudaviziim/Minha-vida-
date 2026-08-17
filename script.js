document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MODAL DAS FOTOS
     ========================================================= */

  const imagens = document.querySelectorAll(".galeria img");
  const telaCheia = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");


  if (
    imagens.length > 0 &&
    telaCheia &&
    imgGrande &&
    fechar
  ) {

    // Abrir foto em tela cheia
    imagens.forEach((img) => {

      img.addEventListener("click", () => {

        imgGrande.src = img.currentSrc || img.src;
        imgGrande.alt = img.alt || "Imagem ampliada";

        telaCheia.classList.add("ativo");

        document.body.classList.add("no-scroll");

      });

    });


    // Função para fechar o modal
    function fecharModal() {

      telaCheia.classList.remove("ativo");

      document.body.classList.remove("no-scroll");

      setTimeout(() => {
        imgGrande.removeAttribute("src");
      }, 300);

    }


    // Botão X
    fechar.addEventListener("click", (event) => {

      event.stopPropagation();

      fecharModal();

    });


    // Clicar fora da imagem
    telaCheia.addEventListener("click", (event) => {

      if (event.target === telaCheia) {

        fecharModal();

      }

    });


    // Tecla ESC
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {

        fecharModal();

      }

    });

  }



  /* =========================================================
     2. BOTÃO VOLTAR AO TOPO
     ========================================================= */

  const btnTopo = document.getElementById("btnTopo");


  if (btnTopo) {

    function atualizarBotaoTopo() {

      if (window.scrollY > 300) {

        btnTopo.style.display = "flex";

      } else {

        btnTopo.style.display = "none";

      }

    }


    window.addEventListener(
      "scroll",
      atualizarBotaoTopo,
      { passive: true }
    );


    // Verifica o estado inicial
    atualizarBotaoTopo();


    // Voltar para o topo
    btnTopo.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }



  /* =========================================================
     3. FUNDO 3D COM THREE.JS
     ========================================================= */

  const canvas = document.getElementById("bg-3d");


  // Verifica se o canvas existe
  if (!canvas) {

    console.error(
      "❌ ERRO: o elemento #bg-3d não foi encontrado."
    );

    return;

  }


  // Verifica se o Three.js carregou
  if (typeof THREE === "undefined") {

    console.error(
      "❌ ERRO: Three.js não foi carregado."
    );

    return;

  }


  console.log(
    "✅ Three.js carregado corretamente."
  );



  /* =========================================================
     4. CRIAÇÃO DA CENA
     ========================================================= */

  const scene = new THREE.Scene();


  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );


  camera.position.z = 3;



  /* =========================================================
     5. RENDERIZADOR
     ========================================================= */

  const renderer = new THREE.WebGLRenderer({

    canvas: canvas,

    alpha: true,

    antialias: true

  });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );



  /* =========================================================
     6. CRIAÇÃO DAS PARTÍCULAS
     ========================================================= */

  const quantidadeParticulas = 1500;


  const geometry =
    new THREE.BufferGeometry();


  const positions =
    new Float32Array(
      quantidadeParticulas * 3
    );


  for (
    let i = 0;
    i < quantidadeParticulas * 3;
    i++
  ) {

    positions[i] =
      (Math.random() - 0.5) * 10;

  }


  geometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
      positions,
      3
    )

  );



  /* =========================================================
     7. MATERIAL DAS PARTÍCULAS
     ========================================================= */

  const material =
    new THREE.PointsMaterial({

      // Tamanho das partículas
      size: 0.025,

      // Azul neon
      color: 0x00d2ff,

      // Transparência
      transparent: true,

      opacity: 0.7,

      // Brilho das partículas
      blending: THREE.AdditiveBlending

    });



  /* =========================================================
     8. OBJETO DAS PARTÍCULAS
     ========================================================= */

  const particles =
    new THREE.Points(
      geometry,
      material
    );


  scene.add(particles);



  /* =========================================================
     9. REDIMENSIONAMENTO DA TELA
     ========================================================= */

  function ajustarTela() {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }


  window.addEventListener(
    "resize",
    ajustarTela
  );



  /* =========================================================
     10. ANIMAÇÃO
     ========================================================= */

  function animar() {

    // Rotação horizontal
    particles.rotation.y += 0.0005;


    // Rotação vertical
    particles.rotation.x += 0.0002;


    // Renderiza a cena
    renderer.render(
      scene,
      camera
    );


    // Continua a animação
    requestAnimationFrame(animar);

  }


  /* =========================================================
     11. INICIAR ANIMAÇÃO
     ========================================================= */

  animar();


  console.log(
    "✨ Fundo 3D iniciado com sucesso!"
  );

});