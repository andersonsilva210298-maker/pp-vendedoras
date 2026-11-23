// ===== CONFIGURAÇÃO: nomes, telefones (DDI+DDD+número) e fotos (URL/data URI em "photo") =====
const META = 25; // pontos para o líder exibir "Meta Batida!"
const PONTOS_ESTRELAS = {
  1: 3,
  2: 5,
  3: 8,
  4: 10,
  5: 15,
};
const SELLERS = [
  {
    id: "barbara",
    name: "Bárbara",
    phone: "558298359911",
    photo: "img/barbara.jpeg",
  },
  {
    id: "claudia",
    name: "Claudia",
    phone: "558298359911",
    photo: "img/claudia.jpg",
  },
  {
    id: "roberta",
    name: "Roberta",
    phone: "558298359911",
    photo: "img/Roberta.jpeg",
  },
  {
    id: "iolanda",
    name: "Iolanda",
    phone: "558298359911",
    photo: "img/Iolanda.jpeg",
  },
  {
    id: "maisa",
    name: "Maisa",
    phone: "558298359911",
    photo: "img/Maisa.jpeg",
  },
  {
    id: "vendedora6",
    name: "Vendedora",
    phone: "",
    photo: "",
  },
];

// ===== FOTO DA LOJA (retângulo logo abaixo do texto de abertura) =====
// Para trocar a foto: substitua o arquivo img/foto-loja.jpg (ou mude o nome abaixo).
const FOTO_LOJA = "img/foto-loja.jpg";
// Texto na parte de baixo da foto (deixe "" para não mostrar nada)
const FOTO_LEGENDA = "";
// Parte da foto que fica visível se ela for cortada: "center", "top", "bottom", "left", "right"...
const FOTO_POSICAO = "center";

// ===== SLIDES (carrossel "Destaques") =====
// Para trocar as fotos: coloque os arquivos na pasta abaixo com os nomes 1.jpg, 2.jpg, 3.jpg...
// e substitua o arquivo antigo. Não precisa mexer no código.
const SLIDES_PASTA = "img/slides/"; // pasta das fotos
const SLIDES_TOTAL = 10; // quantidade de fotos
const SLIDES_EXT = "jpg"; // extensão padrão (jpg, png, webp...)
// Exceções (opcional): foto com nome/extensão diferente. Ex.: { 3: "natal.png", 7: "https://site.com/foto.jpg" }
const SLIDES_EXCECOES = {};
const SLIDES = Array.from(
  { length: SLIDES_TOTAL },
  (_, i) => SLIDES_EXCECOES[i + 1] || `${SLIDES_PASTA}${i + 1}.${SLIDES_EXT}`,
);

// ===== RODÍZIO DAS VENDEDORAS =====
// A cada ROTACAO_DIAS dias, todas as vendedoras avançam uma posição na seção "Quem vai te atender?".
const ROTACAO_DIAS = 5;
const ROTACAO_INICIO = [2026, 11, 22]; // [ano, mês, dia] em que a ordem do array SELLERS vale
function timeRodizio() {
  const h = new Date(),
    dias = Math.floor(
      (Date.UTC(h.getFullYear(), h.getMonth(), h.getDate()) -
        Date.UTC(ROTACAO_INICIO[0], ROTACAO_INICIO[1] - 1, ROTACAO_INICIO[2])) /
        86400000,
    ),
    n = SELLERS.length,
    k = Math.floor(Math.max(0, dias) / ROTACAO_DIAS) % n;
  return SELLERS.slice(k).concat(SELLERS.slice(0, k));
}
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
const av = (s, c = "") =>
  `<div class="av ${c}" style="${s.photo ? `background-image:url('${esc(s.photo)}')` : ""}">${s.photo ? "" : esc(s.name[0])}</div>`;
const WA =
  '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>';
// bordas rasgadas de papel
document.querySelectorAll(".sec").forEach((e) => {
  const n = 34,
    t = [],
    b = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    t.push(`${x}% ${(Math.random() * 9).toFixed(1)}px`);
    b.unshift(`${x}% calc(100% - ${(Math.random() * 9).toFixed(1)}px)`);
  }
  e.style.clipPath = `polygon(${t.concat(b).join(",")})`;
});
// foto temática da loja (retângulo branco logo abaixo do texto de abertura)
(() => {
  const box = $("#fotoLoja");
  if (!FOTO_LOJA || !box) return;
  const im = new Image();
  im.onload = () => {
    box.textContent = "";
    box.style.background = `url('${esc(FOTO_LOJA)}') ${FOTO_POSICAO}/cover no-repeat`;
    if (FOTO_LEGENDA.trim()) {
      const l = document.createElement("div");
      l.className = "leg";
      l.textContent = FOTO_LEGENDA;
      box.appendChild(l);
    }
  };
  im.src = FOTO_LOJA;
})();
// carrossel
const trk = $("#trk"),
  cd = $("#cd");
let cur = 0,
  tm;
SLIDES.forEach((u, i) => {
  trk.insertAdjacentHTML("beforeend", `<div class="sl">Foto ${i + 1}</div>`);
  cd.insertAdjacentHTML("beforeend", "<i></i>");
  // só mostra a foto se o arquivo existir; senão mantém o texto "Foto N"
  const im = new Image(),
    el = trk.lastElementChild;
  im.onload = () => {
    el.style.backgroundImage = `url('${esc(u)}')`;
    el.textContent = "";
  };
  im.src = u;
});
const sl = [...trk.children],
  dt = [...cd.children];
function go(n) {
  cur = (n + sl.length) % sl.length;
  trk.style.transform = `translateX(${-sl[cur].offsetLeft}px)`;
  sl.forEach((e, i) => e.classList.toggle("a", i == cur));
  dt.forEach((e, i) => e.classList.toggle("a", i == cur));
}
const auto = () => {
  clearInterval(tm);
  tm = setInterval(() => go(cur + 1), 3500);
};
dt.forEach(
  (d, i) =>
    (d.onclick = () => {
      go(i);
      auto();
    }),
);
let sx = 0;
trk.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), {
  passive: true,
});
trk.addEventListener("touchend", (e) => {
  const d = e.changedTouches[0].clientX - sx;
  if (Math.abs(d) > 40) {
    go(cur + (d < 0 ? 1 : -1));
    auto();
  }
});
addEventListener("resize", () => go(cur));
// time
$("#team").innerHTML = timeRodizio()
  .map(
    (s) =>
      `<div class="sc">${av(s)}<h3>${esc(s.name)}</h3><button class="wa" data-id="${s.id}">${WA}Falar com</button></div>`,
  )
  .join("");
$("#team").onclick = (e) => {
  const b = e.target.closest(".wa");
  if (!b) return;
  const s = SELLERS.find((x) => x.id == b.dataset.id);
  window.open(
    "https://wa.me/" +
      s.phone +
      "?text=" +
      encodeURIComponent(
        "Olá, " + s.name + " tenho interesse em um dos seus produtos, poderia me ajudar?🥰🥰",
      ),
    "_blank",
    "noopener",
  );
  location.hash = "avaliar-" + s.id;
  route();
};
// avaliação
$("#goTeam").onclick = () => {
  $("#time").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(
    () =>
      document
        .querySelectorAll(".sc")
        .forEach((c, i) =>
          c.animate(
            [
              { transform: "translateY(0)" },
              { transform: "translateY(-10px) scale(1.04)" },
              { transform: "translateY(0)" },
            ],
            { duration: 700, delay: i * 90, easing: "ease-out" },
          ),
        ),
    650,
  );
};
const FACES = [
    ["#dc2626", "M34 70q16-10 32 0"],
    ["#f43f5e", "M34 68q16-6 32 0"],
    ["#f59e0b", "M36 66h28"],
    ["#84cc16", "M34 62q16 10 32 0"],
    ["#16a34a", "M32 60q18 16 36 0"],
  ],
  LAB = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];
$("#stars").innerHTML = FACES.map(
  (f, i) =>
    `<button class="st" data-v="${i + 1}"><svg viewBox="0 0 100 100"><polygon points="50,4 62,36 96,38 69,59 79,94 50,74 21,94 31,59 4,38 38,36" fill="${f[0]}" stroke="${f[0]}" stroke-width="8" stroke-linejoin="round"/><circle cx="39" cy="48" r="4" fill="#111"/><circle cx="61" cy="48" r="4" fill="#111"/><path d="${f[1]}" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/></svg>${LAB[i]}</button>`,
).join("");
let stars = 0,
  seller = null;
const chk = () => {
  $("#send").disabled = !(
    stars &&
    $("#nm").value.trim().length > 2 &&
    $("#ph").value.replace(/\D/g, "").length >= 10
  );
};
$("#stars").onclick = (e) => {
  const b = e.target.closest(".st");
  if (!b) return;
  stars = +b.dataset.v;
  document.querySelectorAll(".st").forEach((x) => {
    x.classList.toggle("sel", x == b);
    x.classList.toggle("dim", x != b);
  });
  chk();
};
$("#nm").oninput = $("#ph").oninput = chk;
function route() {
  const m = location.hash.match(/^#avaliar-([a-z0-9]+)$/);
  seller = m && SELLERS.find((s) => s.id == m[1]);
  if (seller) {
    const r = $("#rav");
    r.textContent = seller.photo ? "" : seller.name[0];
    r.style.backgroundImage = seller.photo ? `url('${seller.photo}')` : "";
    $("#rname").textContent = seller.name;
    stars = 0;
    $("#msg").textContent = "";
    document.querySelectorAll(".st").forEach((x) => (x.className = "st"));
    $("#nm").value = $("#ph").value = "";
    chk();
    $("#rate").classList.add("on");
    $("#rate").scrollTop = 0;
  } else $("#rate").classList.remove("on");
}
addEventListener("hashchange", route);
$("#back").onclick = () => {
  location.hash = "inicio";
};
// O site continua funcionando mesmo sem a conexão com o Supabase.
let votes = [];
const local = [];

$("#send").onclick = async () => {
  if (!seller || !stars) return;

  $("#send").disabled = true;

  if (typeof sb === "undefined" || !sb) {
    $("#msg").textContent =
      "Sistema de avaliações temporariamente indisponível. Tente novamente mais tarde.";
    $("#send").disabled = false;
    return;
  }

  const { error } = await sb.from("votes").insert({
    seller: seller.id,
    stars: stars,
  });

  if (error) {
    console.error(error);
    $("#msg").textContent = "Erro ao registrar avaliação. Tente novamente.";
    $("#send").disabled = false;
    return;
  }

  $("#msg").textContent = "Obrigado! Sua avaliação foi registrada. 💜";
  setTimeout(() => {
    location.hash = "inicio";
  }, 2200);
};

async function carregarVotos() {
  // Sem Supabase, mantém o site aberto e mostra o ranking local (vazio).
  if (typeof sb === "undefined" || !sb) {
    votes = [];
    $("#note").textContent = "Ranking online indisponível no momento.";
    draw();
    return;
  }

  const { data, error } = await sb
    .from("votes")
    .select("seller, stars, created_at");

  if (error) {
    console.error(error);
    $("#note").textContent = "Erro ao carregar ranking.";
    return;
  }

  votes = data || [];
  $("#note").textContent = "";
  draw();
}

carregarVotos();

// Atualização em tempo real somente quando o Supabase estiver configurado.
if (typeof sb !== "undefined" && sb && typeof sb.channel === "function") {
  sb.channel("ranking-papel-pautado")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "votes",
      },
      () => carregarVotos(),
    )
    .subscribe();
}

// ranking
function draw() {
  const all = votes.length ? votes : typeof local !== "undefined" ? local : [],
    tot = {},
    cnt = {};
  SELLERS.forEach((s) => {
    tot[s.id] = 0;
    cnt[s.id] = 0;
  });
  all.forEach((v) => {
    if (v && v.seller in tot) {
      tot[v.seller] +=
        Number(v.points) || PONTOS_ESTRELAS[Number(v.stars)] || 0;
      cnt[v.seller]++;
    }
  });
  const top = [...SELLERS]
      .sort((a, b) => tot[b.id] - tot[a.id] || cnt[b.id] - cnt[a.id])
      .slice(0, 3),
    M = ["🥇", "🥈", "🥉"];
  $("#pod").innerHTML = [1, 0, 2]
    .map((i) => {
      const s = top[i];
      return `<div class="pc p${i + 1}">${av(s)}<span class="mdl">${i + 1}</span><div class="pn">${esc(s.name)}</div><div class="ps">${cnt[s.id]} avaliações</div><div class="pp">${tot[s.id]} pts</div><div class="bs"><b>${i + 1}º</b></div></div>`;
    })
    .join("");
  $("#meta").style.display = tot[top[0].id] >= META ? "block" : "none";
}
draw();
// sequência: carregamento → lápis escrevendo → site
const STROKES = {
    w: 903,
    h: 296,
    s: [
      [
        19, 171, 18, 18, 54, 28, 25, 47, 30, 35, 47, 27, 50, 32, 16, 65, 21, 15,
        84, 16, 15, 103, 16, 16, 114, 20, 17, 122, 28, 19, 126, 42, 18, 122, 63,
        19, 108, 75, 16, 97, 77, 15, 80, 77, 15, 63, 73, 16, 35, 47, 27,
      ],
      [25, 47, 30, 18, 39, 28, 18, 24, 20],
      [
        91, 106, 11, 124, 110, 14, 136, 120, 17, 139, 125, 17, 143, 143, 18,
        143, 167, 19, 141, 168, 21,
      ],
      [
        139, 168, 23, 131, 165, 17, 109, 165, 16, 99, 176, 13, 92, 179, 13, 77,
        181, 13, 68, 179, 14, 63, 175, 15, 60, 163, 15,
      ],
      [
        59, 161, 16, 62, 150, 16, 68, 145, 15, 77, 143, 14, 97, 147, 13, 104,
        153, 14, 109, 165, 16,
      ],
      [
        143, 143, 18, 192, 142, 27, 207, 156, 15, 227, 170, 16, 248, 174, 15,
        263, 173, 15, 276, 168, 16, 284, 160, 17, 289, 146, 16, 287, 125, 17,
        284, 119, 18, 272, 109, 17, 255, 105, 16, 238, 106, 16, 220, 113, 16,
        193, 137, 28, 192, 142, 27, 182, 153, 17, 183, 266, 18,
      ],
      [
        256, 202, 10, 266, 205, 13, 284, 204, 13, 293, 206, 15, 299, 209, 15,
        307, 217, 17, 311, 224, 18, 314, 239, 18, 314, 265, 19, 311, 268, 22,
        302, 264, 17, 277, 264, 16, 272, 250, 15, 262, 243, 13, 245, 240, 14,
        232, 245, 16, 228, 252, 16, 226, 260, 16, 230, 273, 15, 238, 278, 14,
        257, 278, 12, 270, 273, 14, 277, 264, 16,
      ],
      [
        355, 214, 18, 354, 227, 18, 360, 255, 19, 364, 261, 19, 376, 271, 18,
        393, 274, 17, 415, 272, 17, 421, 270, 18, 430, 263, 18, 438, 250, 19,
        443, 214, 18,
      ],
      [
        432, 140, 18, 444, 149, 13, 451, 159, 14, 478, 164, 21, 482, 167, 22,
        511, 167, 15, 524, 165, 13, 535, 167, 12,
      ],
      [
        480, 166, 23, 480, 219, 17, 483, 246, 16, 487, 258, 16, 498, 271, 15,
        522, 276, 18, 529, 275, 20, 535, 280, 18, 546, 280, 15, 570, 276, 13,
        584, 263, 17, 609, 263, 19, 617, 267, 22,
      ],
      [
        618, 265, 21, 620, 263, 19, 620, 237, 18, 617, 222, 17, 613, 213, 17,
        599, 203, 14, 566, 200, 11,
      ],
      [480, 166, 23, 480, 140, 16],
      [
        432, 140, 18, 420, 146, 14, 406, 162, 15, 391, 170, 14, 375, 172, 14,
        362, 171, 17, 355, 158, 20, 333, 152, 19, 330, 147, 18, 328, 134, 17,
        332, 118, 17, 347, 104, 14, 358, 102, 14, 376, 104, 14, 382, 109, 16,
        386, 120, 15, 382, 136, 15, 374, 144, 13, 367, 146, 13, 355, 158, 20,
      ],
      [193, 137, 28, 182, 127, 17, 182, 117, 17],
      [432, 140, 18, 432, 23, 16],
      [
        529, 275, 20, 533, 254, 16, 537, 245, 16, 549, 240, 14, 572, 244, 14,
        578, 249, 15, 584, 263, 17,
      ],
      [
        620, 249, 19, 643, 249, 4, 660, 247, 18, 664, 228, 17, 669, 221, 16,
        679, 215, 15, 696, 215, 13, 705, 217, 13, 720, 229, 13, 726, 231, 13,
        751, 255, 20, 757, 274, 17,
      ],
      [
        741, 246, 27, 714, 271, 15, 707, 275, 15, 694, 277, 14, 680, 276, 16,
        671, 272, 16, 664, 263, 17, 660, 247, 18,
      ],
      [741, 246, 27, 749, 237, 20, 742, 138, 14],
      [
        790, 239, 17, 794, 223, 17, 804, 212, 15, 817, 206, 15, 835, 203, 15,
        859, 204, 13, 871, 208, 14, 880, 216, 14, 885, 232, 14, 884, 251, 15,
        877, 263, 15, 868, 269, 15, 842, 274, 15, 822, 273, 16, 805, 267, 16,
        794, 255, 17,
      ],
    ],
  },
  PH = 0.55,
  TIP = [0.248, 0.999],
  AR = 699 / 782;
async function pencil(done) {
  const ib = $("#ib"),
    cv = $("#cv"),
    ctx = cv.getContext("2d"),
    pen = $("#pen"),
    logo = $("#lgsrc");
  try {
    await Promise.all([logo.decode(), pen.decode()]);
  } catch (e) {}
  const W = ib.clientWidth,
    sc = W / STROKES.w,
    pw = PH * W,
    ph = pw * AR;
  pen.style.width = PH * 100 + "%";
  pen.style.filter = "drop-shadow(0 8px 8px rgba(0,0,0,.3))";
  const mk = document.createElement("canvas");
  mk.width = STROKES.w;
  mk.height = STROKES.h;
  const mx = mk.getContext("2d");
  mx.strokeStyle = "#fff";
  mx.lineCap = mx.lineJoin = "round";
  const segs = [];
  let tot = 0;
  STROKES.s.forEach((f) => {
    const P = [];
    for (let i = 0; i < f.length; i += 3) P.push([f[i], f[i + 1], f[i + 2]]);
    const D = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)],
        p1 = P[i],
        p2 = P[i + 1],
        p3 = P[Math.min(P.length - 1, i + 2)],
        n = Math.max(
          2,
          Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3),
        );
      for (let k = 0; k < n; k++) {
        const t = k / n,
          t2 = t * t,
          t3 = t2 * t,
          cr = (a, b, c, d) =>
            0.5 *
            (2 * b +
              (-a + c) * t +
              (2 * a - 5 * b + 4 * c - d) * t2 +
              (-a + 3 * b - 3 * c + d) * t3);
        D.push([
          cr(p0[0], p1[0], p2[0], p3[0]),
          cr(p0[1], p1[1], p2[1], p3[1]),
          p1[2] + (p2[2] - p1[2]) * t,
        ]);
      }
    }
    D.push(P[P.length - 1]);
    const cum = [0];
    for (let i = 1; i < D.length; i++)
      cum.push(
        cum[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]),
      );
    segs.push({ D, cum, len: cum[cum.length - 1] });
    tot += cum[cum.length - 1];
  });
  const TL = [],
    spd = tot / 2600;
  let prev = [STROKES.w * 0.62, -70],
    T = 0;
  segs.forEach((s, i) => {
    const a = s.D[0],
      d = Math.hypot(a[0] - prev[0], a[1] - prev[1]);
    TL.push({
      k: "lift",
      a: prev,
      b: a,
      dur: i ? Math.min(140, Math.max(60, d * 0.5)) : 250,
    });
    TL.push({ k: "draw", s, dur: Math.max(120, s.len / spd) });
    prev = s.D[s.D.length - 1];
  });
  TL.forEach((x) => {
    x.t0 = T;
    T += x.dur;
  });
  const ease = (u) => 0.45 * u + 0.55 * (0.5 - 0.5 * Math.cos(Math.PI * u)),
    last = new Map();
  const line = (a, b) => {
    mx.lineWidth = 2 * Math.max(a[2], b[2]) * 1.08 + 2.5;
    mx.beginPath();
    mx.moveTo(a[0], a[1]);
    mx.lineTo(b[0], b[1]);
    mx.stroke();
  };
  const render = () => {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(logo, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mk, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  };
  const place = (x, y, h, t) => {
    pen.style.transform = `translate(${x * sc - TIP[0] * pw}px,${y * sc - ph - h * 10}px) rotate(${Math.sin(t / 300) * 0.5 - h * 2}deg)`;
  };
  const fin = (s) => {
    let j = last.get(s) || 0;
    for (let i = j + 1; i < s.D.length; i++) line(s.D[i - 1], s.D[i]);
    last.set(s, s.D.length - 1);
  };
  let li = 0,
    t0 = null;
  function f(ts) {
    t0 = t0 || ts;
    const t = ts - t0;
    while (li < TL.length - 1 && t >= TL[li].t0 + TL[li].dur) {
      if (TL[li].k == "draw") fin(TL[li].s);
      li++;
    }
    if (t >= T) {
      fin(segs[segs.length - 1]);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(logo, 0, 0);
      pen.style.transition = "opacity .5s";
      pen.style.opacity = 0;
      setTimeout(done, 600);
      return;
    }
    const e = TL[li],
      u = Math.min(1, Math.max(0, (t - e.t0) / e.dur));
    if (e.k == "draw") {
      const s = e.s,
        p = ease(u) * s.len;
      let j = last.get(s) || 0;
      const ps = j;
      while (j < s.D.length - 1 && s.cum[j + 1] <= p) j++;
      for (let i = ps + 1; i <= j; i++) line(s.D[i - 1], s.D[i]);
      last.set(s, j);
      const a = s.D[j],
        b = s.D[Math.min(j + 1, s.D.length - 1)],
        den = (s.cum[j + 1] || s.cum[j]) - s.cum[j] || 1,
        r = Math.min(1, (p - s.cum[j]) / den),
        q = [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, a[2]];
      line(a, q);
      render();
      place(q[0], q[1], 0, t);
    } else {
      const k = ease(u);
      place(
        e.a[0] + (e.b[0] - e.a[0]) * k,
        e.a[1] + (e.b[1] - e.a[1]) * k,
        Math.sin(Math.PI * u),
        t,
      );
    }
    requestAnimationFrame(f);
  }
  place(TL[0].a[0], TL[0].a[1], 1, 0);
  requestAnimationFrame(f);
}
function mostrarSite() {
  const intro = $("#intro");
  const app = $("#app");
  if (intro) intro.classList.add("off");
  if (app) app.classList.add("on");
  setTimeout(() => {
    if (typeof go === "function" && $("#trk")) {
      go(0);
      auto();
    }
    if (typeof route === "function" && $("#rate")) route();
  }, 60);
}

function start() {
  // Se a animação não puder rodar, abre o site normalmente em vez de travá-lo.
  try {
    if (!$("#ib") || !$("#cv") || !$("#pen") || !$("#lgsrc")) {
      mostrarSite();
      return;
    }
    pencil(mostrarSite).catch((erro) => {
      console.error("Falha na animação de abertura:", erro);
      mostrarSite();
    });
  } catch (erro) {
    console.error("Falha ao iniciar o site:", erro);
    mostrarSite();
  }
}
start();
