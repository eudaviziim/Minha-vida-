document.addEventListener("DOMContentLoaded", () => {
  /* ==============================================
     1. LÓGICA DO MODAL DA FOTO E BOTÃO TOPO
     ============================================== */
  const imagens = document.querySelectorAll(".galeria img");
  const tela = document.getElementById("telaCheia");
  const imgGrande = document.getElementById("imgGrande");
  const fechar = document.getElementById("fechar");
  const btnTopo = document.getElementById("btnTopo");

  // Lógica do Modal
  if (imagens.length > 0 && tela && imgGrande && fechar) {
    imagens.forEach((img) => {
      img.addEventListener("click", () => {
        imgGrande.src = img.src;
        tela.classList.add("ativo");
        document.body.classList.add("no-scroll");
      });
    });

    const fecharModal = () => {
      tela.classList.remove("ativo");
      document.body.classList.remove("no-scroll");
      setTimeout(() => { imgGrande.src = ""; }, 300);
    };

    fechar.addEventListener("click", (event) => {
      event.stopPropagation();
      fecharModal();
    });
  }

  // Lógica do Botão Topo
  if (btnTopo) {
    window.addEventListener("scroll", () => {
      btnTopo.style.display = window.scrollY > 300 ? "flex" : "none";
    });
    btnTopo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==============================================
     2. FUNDO 3D (ANIMAÇÃO AUTOMÁTICA)
     ============================================== */
  const canvas = document.querySelector("#bg-3d");

  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 3;

    // Criando as Partículas
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x00d2ff, // Cor azulada
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Ajuste responsivo
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Loop de Animação (Automático)
    const tick = () => {
      // Movimento automático suave e constante
      particles.rotation.y += 0.0005; 
      particles.rotation.x += 0.0002;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();
  }
});
