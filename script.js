document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MODAL DAS FOTOS
     ========================================================= */

  const imagens = document.querySelectorAll(".galeria img");
  const telaCheia = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");

  if (imagens.length > 0 && telaCheia && imgGrande && fechar) {

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

    // Apenas o botão X fecha a imagem
    fechar.addEventListener("click", (event) => {
      event.stopPropagation();
      fecharModal();
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

    window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
    atualizarBotaoTopo();

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

  if (!canvas || typeof THREE === "undefined") {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const quantidadeParticulas = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(quantidadeParticulas * 3);

  for (let i = 0; i < quantidadeParticulas * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x00d2ff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  function ajustarTela() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", ajustarTela);

  function animar() {
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;
    renderer.render(scene, camera);
    requestAnimationFrame(animar);
  }

  animar();
});
