/* ==========================================================
   PAPEL PAUTADO — CONFIGURAÇÕES
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

  intervaloCarrossel: 3500,
  intervaloOrdenacaoVendedoresDias: 5,
  intervaloZerarRankingDias: 30,
};

/* ==========================================================
   CONEXÃO COM O SUPABASE
   ========================================================== */

// ATENÇÃO: substitua os dois valores pelos dados reais
// do seu projeto Supabase.
// Use a chave pública anon/publishable. Nunca use service_role.

const SUPABASE_URL = "https://ezufhogcaracmyauznny.supabase.co";
const SUPABASE_CHAVE_PUBLICA = "sb_publishable_sVTnnICXfoRt9ES5xLmamQ_FpCPATCJ";

let supabaseClient = null;

try {
  if (
    window.supabase &&
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_CHAVE_PUBLICA !== "SUA_CHAVE_PUBLICA_REAL" &&
    SUPABASE_CHAVE_PUBLICA.length > 20
  ) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_CHAVE_PUBLICA,
    );
  } else {
    console.warn(
      "Supabase ainda não configurado. O site continuará exibindo as vendedoras e o ranking zerado.",
    );
  }
} catch (erro) {
  console.error("Erro ao iniciar o Supabase:", erro);
}

/* ==========================================================
   FUNÇÕES GERAIS
   ========================================================== */

const $ = (seletor) => document.querySelector(seletor);

const escapeHtml = (valor) =>
  String(valor).replace(
    /[&<>"']/g,
    (caractere) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caractere],
  );

const initials = (nome) =>
  nome
    .split(/\s+/)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const imageOrFallback = (src, nome) => {
  const seguro = escapeHtml(src);

  return `
    <img
      class="seller-photo"
      src="${seguro}"
      alt="Foto de ${escapeHtml(nome)}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"
    >
    <span
      class="seller-photo avatar-fallback"
      style="display:none;place-items:center;color:#64217f;font-weight:900"
    >
      ${escapeHtml(initials(nome))}
    </span>
  `;
};

/* ==========================================================
   TEXTOS DO SITE
   ========================================================== */

function renderTexts() {
  if ($("#titulo-loja")) {
    $("#titulo-loja").textContent = CONFIG.loja.titulo;
  }

  if ($("#subtitulo-loja")) {
    $("#subtitulo-loja").textContent = CONFIG.loja.subtitulo;
  }

  if ($("#texto-hero")) {
    $("#texto-hero").textContent = CONFIG.loja.textoHero;
  }

  if ($("#texto-destaques")) {
    $("#texto-destaques").textContent = CONFIG.loja.textoDestaques;
  }

  if ($("#texto-vendedores")) {
    $("#texto-vendedores").textContent = CONFIG.loja.textoVendedores;
  }

  if ($("#titulo-ranking")) {
    $("#titulo-ranking").innerHTML = CONFIG.loja.tituloRanking
      .split("|")
      .map(escapeHtml)
      .join("<br>");
  }

  if ($("#pergunta-avaliacao")) {
    $("#pergunta-avaliacao").textContent = CONFIG.loja.perguntaAvaliacao;
  }
}

/* ==========================================================
   ORDEM AUTOMÁTICA DAS VENDEDORAS
   ========================================================== */

function vendedoresEmOrdemDoPeriodo() {
  const vendedores = [...CONFIG.vendedores];

  const dias = Math.max(
    1,
    Number(CONFIG.intervaloOrdenacaoVendedoresDias) || 5,
  );

  const periodoMs = dias * 24 * 60 * 60 * 1000;
  const periodoAtual = Math.floor(Date.now() / periodoMs);

  let seed = periodoAtual + 0x9e3779b9;

  const random = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = vendedores.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [vendedores[i], vendedores[j]] = [vendedores[j], vendedores[i]];
  }

  return vendedores;
}

function renderSellers() {
  const grade = $("#seller-grid");

  if (!grade) {
    console.error("Elemento #seller-grid não encontrado no HTML.");
    return;
  }

  const ordemAtual = vendedoresEmOrdemDoPeriodo();

  grade.innerHTML = ordemAtual
    .map(
      (vendedor) => `
        <article class="seller-card">
          ${imageOrFallback(vendedor.foto, vendedor.nome)}

          <span class="seller-name">
            ${escapeHtml(vendedor.nome)}
          </span>

          <button
            class="whatsapp-btn"
            data-vendedor="${escapeHtml(vendedor.id)}"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              style="width:18px;height:18px;vertical-align:middle"
            >
            Falar com
          </button>
        </article>
      `,
    )
    .join("");

  document.querySelectorAll(".whatsapp-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      iniciarAtendimento(botao.dataset.vendedor);
    });
  });
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

/* ==========================================================
   CARROSSEL DE FOTOS
   ========================================================== */

function renderCarousel() {
  const track = $("#carousel-track");
  const dots = $("#carousel-dots");

  if (!track || !dots) {
    console.warn("Elementos do carrossel não encontrados.");
    return;
  }

  const destaques = CONFIG.destaques.slice(0, 10);

  track.innerHTML = destaques
    .map(
      (src, i) => `
        <div class="slide ${i === 0 ? "active" : ""}" data-slide="${i}">
          <img
            src="${escapeHtml(src)}"
            alt="Foto de destaque ${i + 1}"
            onerror="this.remove();this.parentElement.innerHTML='<div class=&quot;slide-placeholder&quot;>Adicione a foto ${i + 1} em CONFIG.destaques</div>'"
          >
        </div>
      `,
    )
    .join("");

  dots.innerHTML = destaques
    .map(
      (_, i) => `
        <button
          class="${i === 0 ? "active" : ""}"
          aria-label="Ir para foto ${i + 1}"
          data-dot="${i}"
        ></button>
      `,
    )
    .join("");

  let atual = 0;

  const mostrarSlide = (numero) => {
    const slides = [...track.children];
    const botoes = [...dots.children];

    slides.forEach((elemento, i) => {
      elemento.classList.toggle("active", i === numero);
    });

    botoes.forEach((elemento, i) => {
      elemento.classList.toggle("active", i === numero);
    });

    atual = numero;
  };

  dots.querySelectorAll("button").forEach((botao) => {
    botao.addEventListener("click", () => {
      mostrarSlide(Number(botao.dataset.dot));
    });
  });

  if (destaques.length > 1) {
    setInterval(() => {
      mostrarSlide((atual + 1) % destaques.length);
    }, CONFIG.intervaloCarrossel);
  }
}

/* ==========================================================
   PONTUAÇÃO
   ========================================================== */

function calcularPontos(nota) {
  const tabela = {
    1: 1,
    2: 5,
    3: 6,
    4: 8,
    5: 10,
  };

  return tabela[nota] || 0;
}

/* ==========================================================
   BUSCAR AVALIAÇÕES NO SUPABASE
   ========================================================== */

async function obterAvaliacoes() {
  if (!supabaseClient) {
    console.warn("Supabase não está conectado.");
    return [];
  }

  const { data, error } = await supabaseClient
    .from("avaliacoes")
    .select("id, vendedor_id, vendedor, nota, pontos, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar avaliações:", error);
    return [];
  }

  return data || [];
}

/* ==========================================================
   CALCULAR RANKING COMPARTILHADO
   ========================================================== */

async function calcularRanking() {
  const avaliacoes = await obterAvaliacoes();

  return CONFIG.vendedores
    .map((vendedor) => {
      const avaliacoesVendedor = avaliacoes.filter(
        (avaliacao) => avaliacao.vendedor_id === vendedor.id,
      );

      const pontos = avaliacoesVendedor.reduce(
        (total, avaliacao) => total + Number(avaliacao.pontos),
        0,
      );

      const quantidadeAvaliacoes = avaliacoesVendedor.length;

      const somaNotas = avaliacoesVendedor.reduce(
        (total, avaliacao) => total + Number(avaliacao.nota),
        0,
      );

      const media = quantidadeAvaliacoes
        ? (somaNotas / quantidadeAvaliacoes).toFixed(1)
        : "0.0";

      return {
        ...vendedor,
        pontos,
        quantidadeAvaliacoes,
        media,
      };
    })
    .sort((a, b) => b.pontos - a.pontos);
}

/* ==========================================================
   MOSTRAR RANKING
   ========================================================== */

async function renderRanking() {
  const lista = $("#ranking-list");

  if (!lista) {
    console.error("Elemento #ranking-list não encontrado no HTML.");
    return;
  }

  lista.innerHTML = "<li>Carregando ranking...</li>";

  try {
    const ranking = await calcularRanking();

    lista.innerHTML = ranking
      .map(
        (vendedor, i) => `
          <li class="rank-row">
            <span class="rank-number">${i + 1}</span>

            <span class="rank-name">
              ${escapeHtml(vendedor.nome)}
            </span>

            <img
              class="rank-photo"
              src="${escapeHtml(vendedor.foto)}"
              alt="Foto de ${escapeHtml(vendedor.nome)}"
              onerror="this.style.visibility='hidden'"
            >

            <strong class="rank-value">
              ${vendedor.pontos} pontos
            </strong>
          </li>
        `,
      )
      .join("");
  } catch (erro) {
    console.error("Erro ao exibir ranking:", erro);

    // Mesmo se houver falha no banco, mostra todas as vendedoras.
    lista.innerHTML = CONFIG.vendedores
      .map(
        (vendedor, i) => `
          <li class="rank-row">
            <span class="rank-number">${i + 1}</span>
            <span class="rank-name">${escapeHtml(vendedor.nome)}</span>
            <img
              class="rank-photo"
              src="${escapeHtml(vendedor.foto)}"
              alt=""
              onerror="this.style.visibility='hidden'"
            >
            <strong class="rank-value">0 pontos</strong>
          </li>
        `,
      )
      .join("");
  }
}

/* ==========================================================
   WHATSAPP DAS VENDEDORAS
   ========================================================== */

function iniciarAtendimento(id) {
  const vendedor = CONFIG.vendedores.find((v) => v.id === id);

  if (!vendedor) return;

  const mensagem = CONFIG.loja.mensagemWhatsApp.replaceAll(
    "{vendedor}",
    vendedor.nome,
  );

  const telefone = vendedor.telefone.replace(/\D/g, "");

  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank", "noopener");

  window.location.href = `?avaliar=${encodeURIComponent(vendedor.id)}`;
}

/* ==========================================================
   PÁGINA DE AVALIAÇÃO
   ========================================================== */

function mostrarAvaliacao() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("avaliar");

  if (!id) return false;

  const vendedor = CONFIG.vendedores.find((v) => v.id === id);

  if (!vendedor) return false;

  if ($("#pagina-inicial")) {
    $("#pagina-inicial").classList.add("hidden");
  }

  if ($("#pagina-avaliacao")) {
    $("#pagina-avaliacao").classList.remove("hidden");
  }

  if ($("#titulo-avaliacao")) {
    $("#titulo-avaliacao").textContent = "Avalie o atendimento de";
  }

  if ($("#nome-vendedor-avaliacao")) {
    $("#nome-vendedor-avaliacao").textContent = vendedor.nome;
  }

  if ($("#foto-vendedor-avaliacao")) {
    $("#foto-vendedor-avaliacao").src = vendedor.foto;
    $("#foto-vendedor-avaliacao").alt = `Foto de ${vendedor.nome}`;

    $("#foto-vendedor-avaliacao").onerror = () => {
      $("#foto-vendedor-avaliacao").src = "";
      $("#foto-vendedor-avaliacao").style.background = "#ddd";
    };
  }

  configurarNota(vendedor);

  return true;
}

/* ==========================================================
   FORMULÁRIO E ENVIO DA AVALIAÇÃO
   ========================================================== */

function configurarNota(vendedor) {
  let nota = 0;

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

  const feedbackElemento = $("#rating-feedback");

  if (!feedbackElemento) {
    console.error("Elemento #rating-feedback não encontrado.");
    return;
  }

  // Evita criar os campos duas vezes.
  const camposAntigos = $("#dados-cliente-avaliacao");

  if (camposAntigos) {
    camposAntigos.remove();
  }

  feedbackElemento.before(camposCliente);

  const feedback = [
    "",
    "Sentimos muito. Vamos buscar melhorar.",
    "Obrigado. Vamos trabalhar para melhorar.",
    "Obrigado pela avaliação!",
    "Que bom! Ficamos felizes.",
    "Uau! Muito obrigado pela avaliação!",
  ];

  document.querySelectorAll(".star-option").forEach((botao) => {
    botao.addEventListener("click", () => {
      nota = Number(botao.dataset.score);

      document.querySelectorAll(".star-option").forEach((b) => {
        b.classList.toggle("selected", Number(b.dataset.score) <= nota);
      });

      feedbackElemento.textContent = feedback[nota];

      const enviar = $("#enviar-avaliacao");

      if (enviar) enviar.disabled = false;
    });
  });

  const botaoEnviar = $("#enviar-avaliacao");

  if (!botaoEnviar) {
    console.error("Botão #enviar-avaliacao não encontrado.");
    return;
  }

  botaoEnviar.addEventListener("click", async () => {
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

    const telefoneLoja = CONFIG.loja.telefoneNotificacoes.replace(/\D/g, "");

    if (!telefoneLoja || telefoneLoja.length < 12) {
      alert("O telefone de notificações da loja não está configurado.");
      return;
    }

    if (!supabaseClient) {
      alert(
        "O sistema de avaliações ainda não está conectado ao banco de dados. Verifique a URL e a chave pública do Supabase.",
      );
      return;
    }

    const pontos = calcularPontos(nota);

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Registrando avaliação...";

    try {
      // Salva somente os dados necessários para o ranking.
      // Nome e telefone do cliente não são publicados no banco.
      const { error } = await supabaseClient.from("avaliacoes").insert([
        {
          vendedor_id: vendedor.id,
          vendedor: vendedor.nome,
          nota: nota,
          pontos: pontos,
        },
      ]);

      if (error) {
        console.error("ERRO COMPLETO DO SUPABASE:", error);

        alert(
          "Erro ao salvar: " +
            (error.message || "Erro desconhecido") +
            "\nCódigo: " +
            (error.code || "Não informado"),
        );

        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar avaliação";
        return;
      }

      // Atualiza o ranking depois de salvar no banco.
      await renderRanking();

      const estrelas = "⭐".repeat(nota);

      const mensagemLoja =
        `🔔 NOVA AVALIAÇÃO - PAPEL PAUTADO\n\n` +
        `👤 Cliente: ${nomeCliente}\n` +
        `📱 Telefone: ${telefoneCliente}\n` +
        `🛍️ Vendedora: ${vendedor.nome}\n` +
        `⭐ Avaliação: ${estrelas} (${nota} estrelas)\n` +
        `🏆 Pontos gerados: ${pontos} pontos\n` +
        `📅 Data: ${new Date().toLocaleString("pt-BR")}`;

      const urlWhatsApp = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagemLoja)}`;

      window.open(urlWhatsApp, "_blank");

      feedbackElemento.textContent = `Obrigado, ${nomeCliente}! Sua avaliação foi registrada e ${pontos} pontos foram atribuídos a ${vendedor.nome}.`;

      botaoEnviar.textContent = "Avaliação registrada";
      botaoEnviar.disabled = true;
    } catch (erro) {
      console.error("Erro inesperado ao enviar avaliação:", erro);

      alert("Ocorreu um erro ao registrar sua avaliação. Tente novamente.");

      botaoEnviar.disabled = false;
      botaoEnviar.textContent = "Enviar avaliação";
    }
  });
}

/* ==========================================================
   ATUALIZAÇÃO AUTOMÁTICA DO RANKING
   ========================================================== */

function iniciarAtualizacaoRanking() {
  if (!supabaseClient) return;

  supabaseClient
    .channel("atualizacao-ranking")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "avaliacoes",
      },
      async () => {
        await renderRanking();
      },
    )
    .subscribe((status) => {
      console.log("Status da atualização do ranking:", status);
    });
}

/* ==========================================================
   CONTADOR DE VISITAS LOCAL
   ========================================================== */

function contarVisita() {
  const chave = "papelPautadoVisitas";

  const total = Number(localStorage.getItem(chave) || 0) + 1;

  localStorage.setItem(chave, String(total));

  if ($("#contador-visitas")) {
    $("#contador-visitas").textContent = total;
  }
}

/* ==========================================================
   INICIALIZAÇÃO DO SITE
   ========================================================== */

function iniciarSite() {
  renderTexts();

  if (!mostrarAvaliacao()) {
    contarVisita();

    // As vendedoras aparecem independentemente do Supabase.
    renderSellers();

    programarProximaTrocaDeOrdem();

    renderCarousel();

    // O ranking é carregado do banco compartilhado.
    renderRanking();

    // Atualiza o ranking quando outra pessoa avalia.
    iniciarAtualizacaoRanking();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarSite);
} else {
  iniciarSite();
}
