// === Simple static studio chatbot for "Ioana Ancuța" / ia.design.studio ===
// No backend, no API key, no OpenAI.

// ---------- DOM ----------
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const closeHelp = document.getElementById("close-help");

// ---------- Utilities ----------
function escapeHtml(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Very light language detection: Romanian vs English
function detectLanguage(question) {
  const q = normalize(question);
  const browser = (navigator.language || "en").slice(0, 2).toLowerCase();

  // Hard hints for Romanian
  if (
    q.match(
      / proiect| proiecte| amenajare| design interior| arhitect| arhitectura| preț| pret| cost| ofert| buget| colaborare| timp| durata| randari| randari 3d/
    )
  ) {
    return "ro";
  }

  if (browser === "ro") return "ro";

  return "en";
}

// ---------- Q&A BANK (Ioana Ancuța, architect & interior designer) ----------

const QA_CLUSTERS = [
  // 1) Career overview / profile
  {
    id: "overview",
    type: "normal",
    triggers: {
      ro: [
        "rezumat al experientei",
        "experienta ta",
        "despre experienta ta",
        "despre tine",
        "background",
        "profil",
        "cine esti",
        "arhitect si designer de interior"
      ],
      en: [
        "overview of your experience",
        "quick overview of your experience",
        "about your experience",
        "about you",
        "background",
        "profile",
        "who are you",
        "architect and interior designer"
      ]
    },
    answers: {
      ro: [
        "Ioana Ancuța este arhitect și interior designer și lucrează sub studio-ul ei, ia.design.studio. Experiența ei combină partea de concept, funcționalitate și detaliu tehnic, astfel încât spațiul să fie în același timp frumos, coerent și ușor de folosit zi de zi.",
        "De-a lungul timpului a lucrat atât la proiecte de amenajare interioară, cât și la transformări mai complexe, în care a fost nevoie de reorganizare de spațiu, optimizare de flux și coordonare cu furnizori și echipe de execuție."
      ],
      en: [
        "Ioana Ancuța is an architect and interior designer working under her own studio, ia.design.studio. Her experience combines concept work, functionality and technical detail so that spaces are beautiful, coherent and practical in everyday life.",
        "Over time she has worked on interior design projects and more complex transformations where space needed to be reorganised, functions clarified and different suppliers and contractors coordinated."
      ]
    }
  },

  // 2) Types of projects / services
  {
    id: "services",
    type: "normal",
    triggers: {
      ro: [
        "cu ce fel de proiecte lucrezi",
        "ce tipuri de proiecte",
        "ce fel de proiecte iei",
        "ce servicii oferi",
        "serviciile tale",
        "ce faci ca arhitect",
        "ce faci ca designer de interior"
      ],
      en: [
        "what kind of projects do you usually take on",
        "what kind of projects do you take on",
        "what projects do you work on",
        "what services do you offer",
        "your services",
        "what do you do as an architect",
        "what do you do as an interior designer"
      ]
    },
    answers: {
      ro: [
        "La ia.design.studio, Ioana lucrează în principal la proiecte de arhitectură și design interior pentru locuințe și spații mici de lucru sau comerciale. Poate acoperi doar conceptul sau un pachet complet, de la idee până la detaliu tehnic.",
        "În funcție de nevoi, serviciile pot include: consultanță punctuală, concept de amenajare, planuri tehnice pentru echipele de execuție, selecție de finisaje și mobilier, randări 3D și suport în implementare."
      ],
      en: [
        "At ia.design.studio, Ioana mainly works on architecture and interior design projects for homes and small work or commercial spaces. She can cover only the concept stage or provide a full package, from idea to technical detail.",
        "Depending on what you need, services can include: one-off consultations, interior concept, technical drawings for contractors, selection of finishes and furniture, 3D visualisations and support during implementation."
      ]
    }
  },

  // 3) Project process / workflow
  {
    id: "process",
    type: "normal",
    triggers: {
      ro: [
        "cum decurge un proiect",
        "care sunt pasii unui proiect",
        "procesul de lucru",
        "cum lucram impreuna",
        "workflow",
        "cum se desfasoara proiectul"
      ],
      en: [
        "how does a typical project work",
        "what are the steps of a project",
        "project process",
        "how we work together",
        "workflow",
        "how does the project unfold"
      ]
    },
    answers: {
      ro: [
        "Un proiect tipic cu ia.design.studio începe cu o discuție inițială în care clarificăm nevoile, bugetul, stilul dorit și termenul. Apoi Ioana propune un pachet de servicii și o ofertă, iar după acceptare se intră în faza de concept.",
        "Urmează conceptul de arhitectură și/sau design interior, feedback de la tine, apoi rafinare până ajungem la o variantă finală. După aceea, se pregătesc planurile tehnice, listele de materiale și, dacă este cazul, randările 3D și suportul în relația cu echipele de execuție."
      ],
      en: [
        "A typical project with ia.design.studio starts with an initial conversation where Ioana clarifies your needs, budget, preferred style and timing. Then she proposes a service package and a quote and, once approved, work moves into the concept phase.",
        "Next comes the architecture and/or interior design concept, your feedback and a few iterations until you are both aligned. After that she prepares the technical drawings, materials lists and, if relevant, 3D visuals plus support in working with contractors and suppliers."
      ]
    }
  },

  // 4) Deliverables – what the client receives
  {
    id: "deliverables",
    type: "normal",
    triggers: {
      ro: [
        "ce primesc de la tine",
        "ce primesc concret",
        "livrabile",
        "ce include proiectul",
        "ce intra in pachet",
        "ce primesc la final"
      ],
      en: [
        "what do i receive from you",
        "what do i get from you",
        "what exactly do i receive",
        "deliverables",
        "what is included in the project",
        "what is in the package",
        "what do i get at the end"
      ]
    },
    answers: {
      ro: [
        "Exact ce primești depinde de tipul de proiect și pachetul ales, dar în general include: planuri de mobilare și compartimentare, scheme de finisaje, propuneri de iluminat, liste de produse și materiale, plus, unde este nevoie, randări 3D.",
        "Pentru proiectele care merg mai departe de faza de concept, poți primi și planuri tehnice pentru echipele de execuție și suport în dialogul cu furnizori sau antreprenori, astfel încât ce s-a gândit pe plan să se poată implementa corect."
      ],
      en: [
        "What you receive depends on the type of project and the package you choose, but generally it includes: layout and furniture plans, finishes schemes, lighting suggestions, product and materials lists and, where relevant, 3D visuals.",
        "For projects that go beyond concept, you can also receive technical drawings for contractors and support in the dialogue with suppliers or builders so that the design can be implemented correctly on site."
      ]
    }
  },

  // 5) Pricing approach
  {
    id: "pricing",
    type: "normal",
    triggers: {
      ro: [
        "cum lucrezi la capitolul pret",
        "cum stabilesti pretul",
        "cat costa",
        "care sunt tarifele",
        "lista de preturi",
        "oferta personalizata",
        "pret aproximativ",
        "cat ar costa proiectul"
      ],
      en: [
        "how do you approach pricing",
        "how do you set the price",
        "how much does it cost",
        "what are your fees",
        "price list",
        "custom quote",
        "rough price",
        "how much would a project cost"
      ]
    },
    answers: {
      ro: [
        "Ioana nu lucrează cu o listă unică de prețuri pentru toate proiectele, pentru că fiecare spațiu are altă suprafață, complexitate și nivel de detaliu. De obicei, după ce înțelege contextul, îți trimite o ofertă personalizată în funcție de ce ai nevoie.",
        "În ofertă vei găsi clar ce este inclus în pachet, cum se structurează plata pe etape și ce opțiuni ai dacă proiectul se extinde sau ai nevoie de servicii suplimentare pe parcurs."
      ],
      en: [
        "Ioana doesn’t use a single fixed price list for every project because each space has different size, complexity and level of detail. Usually, after understanding your context, she sends a custom quote based on what you actually need.",
        "The quote explains what is included in the package, how payments are structured by stages and what options you have if the project grows or you need extra services later on."
      ]
    }
  },

  // 6) Timeframe / duration
  {
    id: "timeframe",
    type: "normal",
    triggers: {
      ro: [
        "cat dureaza",
        "durata proiectului",
        "timeframe",
        "in cat timp",
        "cat timp dureaza",
        "termen de executie",
        "termen estimat"
      ],
      en: [
        "how long does it take",
        "project duration",
        "time frame",
        "timeline",
        "roughly how long",
        "estimated time",
        "lead time"
      ]
    },
    answers: {
      ro: [
        "Durata depinde mult de dimensiunea spațiului, nivelul de detaliu și cât de repede poți răspunde la feedback. Pentru un apartament de dimensiune medie, fazele de concept și planuri pot dura câteva săptămâni, iar implementarea efectivă se întinde de obicei pe câteva luni.",
        "În discuția inițială, Ioana îți poate propune un calendar realist pentru proiectul tău și îți explică ce depinde de studio și ce depinde de furnizori, echipe de execuție și deciziile tale pe parcurs."
      ],
      en: [
        "The timeframe depends a lot on the size of the space, the level of detail and how quickly you can respond to feedback. For a medium-sized apartment, concept and drawings can take a few weeks, while actual implementation on site usually stretches over a few months.",
        "In the first conversation Ioana can propose a realistic timeline for your project and explain what depends on the studio and what depends on suppliers, contractors and your own decisions along the way."
      ]
    }
  },

  // 7) First call / how to start
  {
    id: "first_call",
    type: "normal",
    triggers: {
      ro: [
        "cum incepem",
        "care este primul pas",
        "prima discutie",
        "call initial",
        "intalnire initiala",
        "cum pot sa incep un proiect cu tine"
      ],
      en: [
        "how do we start",
        "what is the first step",
        "first call",
        "initial call",
        "initial meeting",
        "how can i start a project with you"
      ]
    },
    answers: {
      ro: [
        "Primul pas este o discuție scurtă în care povestești despre spațiu, buget, stil și așteptări. Pe baza acesteia, Ioana îți spune dacă proiectul este potrivit pentru ia.design.studio și ce variante de colaborare recomandă.",
        "Dacă decizi să mergi mai departe, vei primi o ofertă și o structură clară de pași. Abia după ce ești de acord cu ele începe efectiv lucrul pe proiect."
      ],
      en: [
        "The first step is a short call where you describe the space, budget, style and expectations. Based on that, Ioana can tell you if the project is a good fit for ia.design.studio and which collaboration options she recommends.",
        "If you decide to move forward, you’ll receive a quote and a clear structure of steps. Work on the project only starts once you are happy with that framework."
      ]
    }
  },

  // 8) Budget boundaries / unrealistic expectations
  {
    id: "budget_boundary",
    type: "boundary",
    triggers: {
      ro: [
        "fa-mi ceva foarte ieftin",
        "buget aproape zero",
        "cel mai ieftin posibil",
        "gratis",
        "fara buget"
      ],
      en: [
        "do something very cheap",
        "almost zero budget",
        "as cheap as possible",
        "for free",
        "no budget"
      ]
    },
    answers: {
      ro: [
        "Un proiect de arhitectură și design interior are întotdeauna nevoie de un buget minim, atât pentru servicii, cât și pentru implementare. Ioana poate adapta propunerile la un buget realist, dar nu poate promite rezultate de calitate cu costuri aproape zero."
      ],
      en: [
        "Architecture and interior design projects always need a minimum budget, both for professional services and for implementation. Ioana can adapt proposals to a realistic budget, but she can’t promise high-quality results with almost no costs."
      ]
    }
  }
];

// ---------- Matching logic ----------
function findAnswer(question) {
  const lang = detectLanguage(question);
  const qNorm = normalize(question);

  for (const cluster of QA_CLUSTERS) {
    const trigList = cluster.triggers[lang] || [];
    for (const trig of trigList) {
      if (!trig) continue;
      if (qNorm.includes(normalize(trig))) {
        const answers = cluster.answers[lang] || cluster.answers["en"] || [];
        if (!answers.length) break;
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return { lang, answer, type: cluster.type, id: cluster.id };
      }
    }
  }

  // Fallback: generic scope message
  let fallback;
  if (lang === "ro") {
    fallback =
      "Această versiune demo răspunde doar la întrebări legate de experiența Ioanei, serviciile ia.design.studio, preț, pașii unui proiect, ce primești și timeframe. Încearcă să reformulezi întrebarea în zona asta.";
  } else {
    fallback =
      "This demo only answers questions about Ioana’s experience, ia.design.studio services, pricing, project steps, deliverables and timeframe. Try rephrasing your question in that direction.";
  }
  return { lang, answer: fallback, type: "fallback", id: "fallback" };
}

// ---------- Chat UI helpers ----------
function addMessage(sender, msg, who = "bot") {
  const wrap = document.createElement("div");
  wrap.className = `msg ${who === "you" ? "you" : "bot"}`;

  if (who === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "I";
    wrap.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<span class="sender">${escapeHtml(
    sender
  )}</span><p>${escapeHtml(msg)}</p>`;
  wrap.appendChild(bubble);

  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const wrap = document.createElement("div");
  wrap.className = "msg bot typing-indicator";
  wrap.id = "typing-indicator";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "I";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML =
    '<span class="sender">Ioana · ia.design.studio</span><div class="typing-dots"><span></span><span></span><span></span></div>';

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// ---------- Help modal ----------
helpBtn.addEventListener("click", () => {
  helpModal.classList.remove("hidden");
});

closeHelp.addEventListener("click", () => {
  helpModal.classList.add("hidden");
});

helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.classList.add("hidden");
  }
});

document.querySelectorAll(".sample-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = btn.getAttribute("data-question") || "";
    input.value = q;
    helpModal.classList.add("hidden");
    form.dispatchEvent(new Event("submit"));
  });
});

// ---------- Form handling ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMsg = input.value.trim();
  if (!userMsg) return;

  addMessage("Tu", userMsg, "you");
  input.value = "";

  showTyping();

  setTimeout(() => {
    const { answer } = findAnswer(userMsg);
    hideTyping();
    addMessage("Ioana · ia.design.studio", answer, "bot");
  }, 400);
});

// ---------- Initial greeting ----------
(function initialGreeting() {
  const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
  let greet;

  if (browser === "ro") {
    greet =
      "Bună, sunt versiunea interactivă a prezentării Ioanei Ancuța, arhitect și interior designer la ia.design.studio. Poți să mă întrebi în română sau engleză despre experiența ei, cum decurge un proiect, ce primești, prețuri și timeframe.";
  } else {
    greet =
      "Hi, I’m the interactive profile of Ioana Ancuța, architect and interior designer at ia.design.studio. You can ask in Romanian or English about her experience, how a project works, what you receive, pricing and timeframe.";
  }

  addMessage("Ioana · ia.design.studio", greet, "bot");
})();
