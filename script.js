/* ==========================================================
   PAPEL PAUTADO — PERSONALIZE O SITE NESTA ÁREA
   Troque nomes, telefones, fotos, mensagens, textos e ranking.
   Telefones no formato internacional: 55 + DDD + número.
   ========================================================== */

const CONFIG = {
  loja: {
    titulo: "",
    telefoneNotificacoes: "558298359911",
    subtitulo: "O Natal já chegou por aqui!",
    textoHero:
      "É o lugar onde a criatividade ganha vida, os sonhos ganham cores e cada presente se transforma em uma demonstração de carinho. 🎁",
    textoDestaques:
      "Veja novidades, produtos e momentos especiais. Toque em um espaço para adicionar sua foto.",
    textoVendedores:
      "Escolha seu atendimento preferido. Você será direcionado diretamente para o WhatsApp do vendedor.",
    tituloRanking: "Destaques do time|Top 5 vendedores",
    perguntaAvaliacao:
      "Em uma escala de 1 a 5 estrelas, como você avaliaria o nosso serviço de atendimento?",
    mensagemWhatsApp:
      "Olá, {vendedor}! Gostei muito de um dos seus produtos, poderia me ajudar?.🥰🥰",
  },

  // Cadastre até quantos vendedores desejar. Foto: caminho relativo dentro do projeto.
  vendedores: [
    {
      id: "barbara",
      nome: "Bárbara",
      telefone: "558298359911",
      foto: "assets/barbara.jpeg",
    },
    {
      id: "claudia",
      nome: "Claudia",
      telefone: "558298359911",
      foto: "assets/claudia.jpg",
    },
    {
      id: "iolanda",
      nome: "Iolanda",
      telefone: "558298359911",
      foto: "assets/Iolanda.jpeg",
    },
    {
      id: "roberta",
      nome: "Roberta",
      telefone: "558298359911",
      foto: "assets/Roberta.jpeg",
    },
    {
      id: "maisa",
      nome: "Maisa",
      telefone: "558298359911",
      foto: "assets/Maisa.jpeg",
    },
  ],

  // Dez espaços do carrossel. Substitua os caminhos pelas suas imagens.
  destaques: [
    "assets/caixas brancas.jpg",
    "assets/laços.jpg",
    "assets/caixa vermelha.jpg",
    "assets/caixa jesus.jpg",
    "assets/castiçal.jpg",
    "assets/nossa imagens.jpg",
    "assets/foca fofinha.jpg",
    "assets/bolsa novidade.jpg",
    "assets/porta joias.jpg",
    "assets/corujas.jpg",
  ],

  // Edite livremente os nomes, fotos e resultados do ranking.
  ranking: [
    {
      nome: "Bárbara",
      resultado: "0%",
      foto: "assets/barbara.jpeg",
    },
    {
      nome: "Roberta",
      resultado: "0%",
      foto: "assets/Roberta.jpeg",
    },
    {
      nome: "Iolanda",
      resultado: "0%",
      foto: "assets/Iolanda.jpeg",
    },
    {
      nome: "Claudia",
      resultado: "0%",
      foto: "assets/claudia.jpg",
    },
    {
      nome: "Maisa",
      resultado: "0%",
      foto: "assets/Maisa.jpeg",
    },
  ],

  // Intervalo de troca automática do carrossel, em milissegundos.
  intervaloCarrossel: 3500,

  // Reorganiza a ordem dos vendedores automaticamente a cada 5 dias.
  // A ordem é igual para todos os visitantes durante cada período de 5 dias.
  intervaloOrdenacaoVendedoresDias: 5,
  intervaloZerarRankingDias: 30,
};

/* Não é necessário editar abaixo desta linha para personalizações comuns. */
const $ = (s) => document.querySelector(s);
const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const initials = (name) =>
  name
    .split(/\s+/)
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const imageOrFallback = (src, name) => {
  const safe = escapeHtml(src);
  return `<img class="seller-photo" src="${safe}" alt="Foto de ${escapeHtml(name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="seller-photo avatar-fallback" style="display:none;place-items:center;color:#64217f;font-weight:900">${escapeHtml(initials(name))}</span>`;
};

function renderTexts() {
  $("#titulo-loja").textContent = CONFIG.loja.titulo;
  $("#subtitulo-loja").textContent = CONFIG.loja.subtitulo;
  $("#texto-hero").textContent = CONFIG.loja.textoHero;
  $("#texto-destaques").textContent = CONFIG.loja.textoDestaques;
  $("#texto-vendedores").textContent = CONFIG.loja.textoVendedores;
  $("#titulo-ranking").innerHTML = CONFIG.loja.tituloRanking
    .split("|")
    .map(escapeHtml)
    .join("<br>");
  $("#pergunta-avaliacao").textContent = CONFIG.loja.perguntaAvaliacao;
}

function vendedoresEmOrdemDoPeriodo() {
  const vendedores = [...CONFIG.vendedores];
  const dias = Math.max(
    1,
    Number(CONFIG.intervaloOrdenacaoVendedoresDias) || 5,
  );
  const periodoMs = dias * 24 * 60 * 60 * 1000;
  // Período calculado em UTC: todos veem a mesma ordem e ela muda a cada N dias.
  const periodoAtual = Math.floor(Date.now() / periodoMs);
  let seed = periodoAtual + 0x9e3779b9;
  const random = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Fisher-Yates com semente baseada no período de 5 dias.
  for (let i = vendedores.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [vendedores[i], vendedores[j]] = [vendedores[j], vendedores[i]];
  }
  return vendedores;
}

function renderSellers() {
  const ordemAtual = vendedoresEmOrdemDoPeriodo();
  $("#seller-grid").innerHTML = ordemAtual
    .map(
      (v) => `
    <article class="seller-card">
      ${imageOrFallback(v.foto, v.nome)}
      <span class="seller-name">${escapeHtml(v.nome)}</span>
      <button class="whatsapp-btn" data-vendedor="${escapeHtml(v.id)}"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 18px; height: 18px; vertical-align: middle;"> Falar com</button>
    </article>`,
    )
    .join("");
  document
    .querySelectorAll(".whatsapp-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        iniciarAtendimento(btn.dataset.vendedor),
      ),
    );
}

function programarProximaTrocaDeOrdem() {
  const dias = Math.max(
    1,
    Number(CONFIG.intervaloOrdenacaoVendedoresDias) || 5,
  );
  const periodoMs = dias * 24 * 60 * 60 * 1000;
  const proximaVirada = (Math.floor(Date.now() / periodoMs) + 1) * periodoMs;
  const tempoAteVirada = Math.max(1000, proximaVirada - Date.now() + 1000);
  setTimeout(() => {
    renderSellers();
    programarProximaTrocaDeOrdem();
  }, tempoAteVirada);
}

function renderCarousel() {
  const track = $("#carousel-track"),
    dots = $("#carousel-dots");
  track.innerHTML = CONFIG.destaques
    .slice(0, 10)
    .map(
      (src, i) => `
    <div class="slide ${i === 0 ? "active" : ""}" data-slide="${i}">
      <img src="${escapeHtml(src)}" alt="Foto de destaque ${i + 1}" onerror="this.remove();this.parentElement.innerHTML='<div class=&quot;slide-placeholder&quot;>Adicione a foto ${i + 1} em CONFIG.destaques</div>'">
    </div>`,
    )
    .join("");
  dots.innerHTML = CONFIG.destaques
    .slice(0, 10)
    .map(
      (_, i) =>
        `<button class="${i === 0 ? "active" : ""}" aria-label="Ir para foto ${i + 1}" data-dot="${i}"></button>`,
    )
    .join("");
  let current = 0;
  const show = (n) => {
    const slides = [...track.children],
      buttons = [...dots.children];
    slides.forEach((el, i) => el.classList.toggle("active", i === n));
    buttons.forEach((el, i) => el.classList.toggle("active", i === n));
    current = n;
  };
  dots
    .querySelectorAll("button")
    .forEach((b) =>
      b.addEventListener("click", () => show(Number(b.dataset.dot))),
    );
  if (CONFIG.destaques.length > 1)
    setInterval(
      () => show((current + 1) % Math.min(CONFIG.destaques.length, 10)),
      CONFIG.intervaloCarrossel,
    );
}


function calcularPontos(nota) {
  const tabela = {
    1: 1,
    2: 5,
    3: 6,
    4: 8,
    5: 10
  };

  return tabela[nota] || 0;
}

function obterAvaliacoes() {
  return JSON.parse(
    localStorage.getItem("papelPautadoAvaliacoes") || "[]"
  );
}

function calcularRanking() {
  const avaliacoes = obterAvaliacoes();

  return CONFIG.vendedores.map(vendedor => {
    const avaliacoesVendedor = avaliacoes.filter(
      avaliacao => avaliacao.vendedorId === vendedor.id
    );

    const pontos = avaliacoesVendedor.reduce(
      (total, avaliacao) => total + calcularPontos(avaliacao.nota),
      0
    );

    return {
      ...vendedor,
      pontos,
      quantidadeAvaliacoes: avaliacoesVendedor.length
    };
  }).sort((a, b) => b.pontos - a.pontos);
}

function renderRanking() {
  const ranking = calcularRanking();

  $("#ranking-list").innerHTML = ranking
    .map((vendedor, i) => `
      <li class="rank-row">
        <span class="rank-number">${i + 1}</span>

        <span class="rank-name">
          ${escapeHtml(vendedor.nome)}
        </span>

        <img
          class="rank-photo"
          src="${escapeHtml(vendedor.foto)}"
          alt=""
          onerror="this.style.visibility='hidden'"
        >

        <strong class="rank-value">
          ${vendedor.pontos} pontos
        </strong>
      </li>
    `)
    .join("");
}


function verificarZeragemAutomatica() {
  const CHAVE = "papelPautadoUltimaZeragem";

  const intervaloDias = CONFIG.intervaloZerarRankingDias || 30;
  const intervaloMs = intervaloDias * 24 * 60 * 60 * 1000;

  const agora = Date.now();

  let ultimaZeragem = Number(localStorage.getItem(CHAVE));

  // Primeira execução: inicia a contagem de 30 dias.
  if (!ultimaZeragem) {
    localStorage.setItem(CHAVE, String(agora));
    return;
  }

  // Verifica se os 30 dias foram completados.
  if (agora - ultimaZeragem >= intervaloMs) {

    // Apaga todas as avaliações e pontos acumulados.
    localStorage.removeItem("papelPautadoAvaliacoes");

    // Inicia um novo ciclo de 30 dias.
    localStorage.setItem(CHAVE, String(agora));

    // Atualiza o ranking.
    renderRanking();

    console.log("Ranking zerado automaticamente!");
  }
}


function iniciarAtendimento(id) {
  const vendedor = CONFIG.vendedores.find((v) => v.id === id);
  if (!vendedor) return;
  const mensagem = CONFIG.loja.mensagemWhatsApp.replaceAll(
    "{vendedor}",
    vendedor.nome,
  );
  const telefone = vendedor.telefone.replace(/\D/g, "");
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  // Abre o WhatsApp em outra aba e mantém esta aba na avaliação do vendedor escolhido.
  window.open(url, "_blank", "noopener");
  window.location.href = `?avaliar=${encodeURIComponent(vendedor.id)}`;
}

function mostrarAvaliacao() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("avaliar");
  if (!id) return false;
  const vendedor = CONFIG.vendedores.find((v) => v.id === id);
  if (!vendedor) return false;
  $("#pagina-inicial").classList.add("hidden");
  $("#pagina-avaliacao").classList.remove("hidden");
  $("#titulo-avaliacao").textContent = "Avalie o atendimento de";
  $("#nome-vendedor-avaliacao").textContent = vendedor.nome;
  $("#foto-vendedor-avaliacao").src = vendedor.foto;
  $("#foto-vendedor-avaliacao").alt = `Foto de ${vendedor.nome}`;
  $("#foto-vendedor-avaliacao").onerror = () => {
    $("#foto-vendedor-avaliacao").src = "";
    $("#foto-vendedor-avaliacao").style.background = "#ddd";
  };
  configurarNota(vendedor);
  return true;
}


function configurarNota(vendedor) {
  let nota = 0;

  // Campos para identificar o cliente.
  const camposCliente = document.createElement("div");

  camposCliente.id = "dados-cliente-avaliacao";

  camposCliente.innerHTML = `
    <div class="campo-avaliacao">
      <label for="cliente-nome">Seu nome:</label>
      <input
        type="text"
        id="cliente-nome"
        placeholder="Digite seu nome completo"
        required
      >
    </div>

    <div class="campo-avaliacao">
      <label for="cliente-telefone">Seu telefone / WhatsApp:</label>
      <input
        type="tel"
        id="cliente-telefone"
        placeholder="Ex.: (82) 99999-9999"
        required
      >
    </div>

    <p style="font-size:12px;color:#777">
      Seus dados serão utilizados para identificar sua avaliação.
    </p>
  `;

  // Insere os campos antes da mensagem de feedback.
  $("#rating-feedback").before(camposCliente);


  const feedback = [
    "",
    "Sentimos muito. Vamos buscar melhorar.",
    "Obrigado. Vamos trabalhar para melhorar.",
    "Obrigado pela avaliação!",
    "Que bom! Ficamos felizes.",
    "Uau! Muito obrigado pela avaliação!"
  ];

  document.querySelectorAll(".star-option").forEach(btn => {
    btn.addEventListener("click", () => {
      nota = Number(btn.dataset.score);

      document.querySelectorAll(".star-option").forEach(b => {
        b.classList.toggle(
          "selected",
          Number(b.dataset.score) <= nota
        );
      });

      $("#rating-feedback").textContent = feedback[nota];

      $("#enviar-avaliacao").disabled = false;
    });
  });

  $("#enviar-avaliacao").addEventListener("click", () => {
    if (!nota) {
      alert("Por favor, selecione as estrelas da avaliação.");
      return;
    }

    const nomeCliente = $("#cliente-nome").value.trim();
    const telefoneCliente = $("#cliente-telefone").value.trim();
    const telefoneLimpo = telefoneCliente.replace(/\D/g, "");

    if (nomeCliente.length < 2) {
      alert("Por favor, informe seu nome.");
      $("#cliente-nome").focus();
      return;
    }

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 13) {
      alert("Informe um telefone válido com DDD.");
      $("#cliente-telefone").focus();
      return;
    }

    const telefoneLoja =
      CONFIG.loja.telefoneNotificacoes.replace(/\D/g, "");

    if (!telefoneLoja || telefoneLoja.length < 12) {
      alert("O telefone de notificações da loja não está configurado.");
      return;
    }

    const ratings = obterAvaliacoes();
    const pontos = calcularPontos(nota);

    // Registra todos os dados da avaliação.
    const avaliacao = {
      cliente: nomeCliente,
      telefoneCliente: telefoneLimpo,
      vendedorId: vendedor.id,
      vendedor: vendedor.nome,
      nota: nota,
      pontos: pontos,
      data: new Date().toISOString()
    };

    ratings.push(avaliacao);

    localStorage.setItem(
      "papelPautadoAvaliacoes",
      JSON.stringify(ratings)
    );

    // Atualiza o ranking.
    renderRanking();

    // Monta a mensagem para a loja.
    const estrelas = "⭐".repeat(nota);

    const mensagemLoja =
      `🔔 NOVA AVALIAÇÃO - PAPEL PAUTADO\n\n` +
      `👤 Cliente: ${nomeCliente}\n` +
      `📱 Telefone: ${telefoneCliente}\n` +
      `🛍️ Vendedora: ${vendedor.nome}\n` +
      `⭐ Avaliação: ${estrelas} (${nota} estrelas)\n` +
      `🏆 Pontos gerados: ${pontos} pontos\n` +
      `📅 Data: ${new Date().toLocaleString("pt-BR")}`;

    // Abre o WhatsApp da loja com a mensagem preenchida.
    const urlWhatsApp =
      `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagemLoja)}`;

    window.open(urlWhatsApp, "_blank");

    $("#rating-feedback").textContent =
      `Obrigado, ${nomeCliente}! Sua avaliação foi registrada e ${pontos} pontos foram atribuídos a ${vendedor.nome}.`;

    $("#enviar-avaliacao").disabled = true;
  });

}

 

function contarVisita() {
  // Contador local do navegador. Contagem global exige um serviço/backend compartilhado.
  const key = "papelPautadoVisitas";
  const total = Number(localStorage.getItem(key) || 0) + 1;
  localStorage.setItem(key, String(total));
  $("#contador-visitas").textContent = total;
}


renderTexts();

if (!mostrarAvaliacao()) {
  contarVisita();
  renderSellers();
  programarProximaTrocaDeOrdem();
  renderCarousel();

  // Verifica se chegou o momento de zerar o ranking.
  verificarZeragemAutomatica();

  // Mostra o ranking atualizado.
  renderRanking();
}

