const SUPABASE_URL = "https://gstkasaosgwnqypirwhm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGthc2Fvc2d3bnF5cGlyd2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNTI4OTQsImV4cCI6MjEwNzcyODg5NH0.Bzl-s_rb0UerU3U7zIRoPFNpubif9tkEAu6O_6tSOR8";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const state = {
  catalog: [],
  payments: null,
  route: "",
  product: null,
  lang: localStorage.getItem("pinc_lang") || "en",
  currency: localStorage.getItem("pinc_currency") || "USD",
  affiliateCode: localStorage.getItem("pinc_ref") || "",
  user: null,
};

const CURRENCIES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.2, INR: 83.5, KRW: 1385, CAD: 1.36, AUD: 1.54, CHF: 0.89,
  SGD: 1.35, HKD: 7.81, SEK: 10.6, NOK: 10.9, DKK: 6.85, PLN: 4.0, CZK: 23.1, HUF: 367, ILS: 3.7,
  AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.38, JOD: 0.71, EGP: 30.9, MAD: 10.0,
  TND: 3.1, DZD: 135, KES: 130, NGN: 1500, GHS: 12.5, ZAR: 18.7, BRL: 5.1, ARS: 910, CLP: 945,
  COP: 4050, PEN: 3.75, UYU: 39, MXN: 17.2, VES: 36, PHP: 56.5, THB: 35.6, MYR: 4.7, IDR: 15600,
  VND: 24700, SGD: 1.35, HKD: 7.81, TWD: 32.4, KRW: 1385, JPY: 149.5, CNY: 7.2, INR: 83.5,
  BDT: 110, PKR: 278, LKR: 298, NPR: 133, MMK: 2100, KHR: 4100, LAK: 21000, MNT: 3450,
  KZT: 500, UZS: 12600, AZN: 1.7, GEL: 2.7, AMD: 390, BYN: 3.2, MDL: 18.2, UAH: 41, RUB: 92,
  TRY: 32.4, IQD: 1310, JOD: 0.71, LBP: 89500, SYP: 13000, YER: 250, AFN: 72, IRR: 42000,
  OMR: 0.38, QAR: 3.64, KWD: 0.31, BHD: 0.38, AED: 3.67, SAR: 3.75, MRO: 36, GMD: 60,
  GNF: 8600, MWK: 1050, MZN: 63, TZS: 2300, UGX: 3700, BWP: 13.5, ZMW: 26,
  AOA: 825, XAF: 605, XOF: 605, XPF: 107, FJD: 2.2, PGK: 3.8, SB$: 8.3, VUV: 118, WST: 2.7,
  TOP: 2.4, PKR: 278, LKR: 298, BDT: 110, MVR: 15, NPR: 133, BTN: 83.5,
};
const CURRENCY_SYMBOL = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", INR: "₹", KRW: "₩", CAD: "$", AUD: "$", CHF: "Fr",
  SGD: "$", HKD: "$", SEK: "kr", NOK: "kr", DKK: "kr", PLN: "zł", CZK: "Kč", HUF: "Ft", ILS: "₪",
  AED: "د.إ", SAR: "ر.س", QAR: "ر.ق", KWD: "د.ك", BHD: "د.ب", OMR: "ر.ع", JOD: "د.ا", EGP: "£", MAD: "د.م",
  TND: "د.ت", DZD: "د.ج", KES: "Sh", NGN: "₦", GHS: "₵", ZAR: "R", BRL: "R$", ARS: "$", CLP: "$",
  COP: "$", PEN: "S/", UYU: "$", MXN: "$", VES: "Bs", PHP: "₱", THB: "฿", MYR: "RM", IDR: "Rp",
  VND: "₫", TWD: "NT$", BDT: "৳", PKR: "Rs", LKR: "Rs", NPR: "रु", MMK: "K", KHR: "៛", LAK: "₭",
  MNT: "₮", KZT: "₸", UZS: "so'm", AZN: "₼", GEL: "₾", AMD: "֏", BYN: "Br", MDL: "L", UAH: "₴",
  RUB: "₽", TRY: "₺", IQD: "د.ع", LBP: "£", SYP: "£", YER: "﷼", AFN: "؋", IRR: "﷼",
  MRO: "UM", GMD: "D", GNF: "Fr", MWK: "MK", MZN: "MT", TZS: "Sh", UGX: "Sh",
  BWP: "P", ZMW: "K", AOA: "Kz", XAF: "Fr", XOF: "Fr", XPF: "₣", FJD: "$", PGK: "K", SB$: "$",
  VUV: "Vt", WST: "T", TOP: "T$", BTN: "Nu.", MVR: "Rf", MNT: "₮",
};
const LANGS = {
  en: "English", sw: "Kiswahili", fr: "Français", es: "Español", ar: "العربية", zh: "中文",
  de: "Deutsch", ja: "日本語", ko: "한국어", pt: "Português", it: "Italiano", ru: "Русский",
  hi: "हिन्दी", nl: "Nederlands", tr: "Türkçe", vi: "Tiếng Việt", th: "ไทย", id: "Bahasa Indonesia",
  pl: "Polski", cs: "Čeština", el: "Ελληνικά", he: "עברית", ro: "Română",
};
const CAT = { system: ["🖥️", "System"], product: ["📦", "Product"], app: ["📱", "App"], project: ["🚀", "Project"] };

const I18N = {
  en: { hero: { title: "Pinc Network", sub: "Premium systems, apps, products & projects. Buy once, download forever.", cta: "Explore the catalog", chat: "Talk to the team" }, sections: { featured: "Featured", all: "All items" }, product: { what: "What it is", how: "How it works", docs: "Documentation", buy: "Buy now" }, checkout: { total: "Total" }, pay: { note: "Secure one-time payment. Our team confirms each order before downloads unlock.", cryptoNote: "Send the exact amount to the wallet below, then tap “I've sent it” to notify our team.", sent: "I've sent it", copy: "Copy address", copied: "Copied ✓" }, errors: { load: "Couldn't load the store. Please refresh in a moment." }, affiliate: { earn: "Earn commission", join: "Become Commissioner", register: "Register as Commissioner", token: "Your API Token (from staff console)", rate: "Your commission rate (%)", link: "Your referral link" }, commissioner: { title: "Become a Commissioner", sub: "Earn 10–30% commission when someone buys through your link. No account needed — just your staff API token." } },
  sw: { hero: { title: "Pinc Network", sub: "Mifumo ya kiufundi, bidhaa, programu na miradi. Teua mara moja, msoge milele.", cta: "Angalia kituo", chat: "Zungumza na timu" }, sections: { featured: "Vipengele", all: "Kituo chote" }, product: { what: "Nini yule", how: "Inavyofanya kazi", docs: "Hatua za matengenezo", buy: "Nunu sasa" }, checkout: { total: "Jumla" }, pay: { note: "Lipili moja moja. Timu yetu inatarajia kila amri kabla ya kupakua.", cryptoNote: "Tuma kiasi kamili kwenye waleti hapa chini, tisha “Nimesomboleza”.", sent: "Nimesomboleza", copy: "Nakili anwani", copied: "Inakopiwa ✓" }, errors: { load: "Hauwezi kuingia kwenye kituo. Bonyeza tena baada ya dakika moja." }, affiliate: { earn: "Pata kiwango", join: "Jioni kama mwakilishi", register: "Jioni kama mwakilishi", token: "Token yako ya API (mfumo wa kituo)", rate: "Asilianza yako ya kiwango (%)", link: "Mfano wako wa kuweka" }, commissioner: { title: "Jioni kama Mwakilishi", sub: "Pata kiwango 10–30% wakati mtu anununua kwenye mfano wako. Hakikaunti — token pekee ya API ya kituo." } },
  fr: { hero: { title: "Pinc Network", sub: "Systèmes, applications, produits et projets premium. Achetez une fois, téléchargez pour toujours.", cta: "Voir le catalogue", chat: "Parler à l'équipe" }, sections: { featured: "En vedette", all: "Tous les articles" }, product: { what: "C'est quoi", how: "Comment ça marche", docs: "Documentation", buy: "Acheter maintenant" }, checkout: { total: "Total" }, pay: { note: "Paiement unique sécurisé. Notre équipe confirme chaque commande avant déblocage.", cryptoNote: "Envoyez le montant exact au portefeuille ci-dessous, puis appuyez sur “J'ai envoyé”.", sent: "J'ai envoyé", copy: "Copier l'adresse", copied: "Copié ✓" }, errors: { load: "Impossible de charger la boutique. Veuillez rafraîchir." }, affiliate: { earn: "Gagner une commission", join: "Devenir commissaire", register: "Devenir commissaire", token: "Votre token API (depuis la console staff)", rate: "Votre taux de commission (%)", link: "Votre lien de parrainage" }, commissioner: { title: "Devenir Commissaire", sub: "Gagnez 10–30 % de commission quand quelqu'un achète via votre lien. Aucun compte nécessaire — juste votre token API staff." } },
  es: { hero: { title: "Pinc Network", sub: "Sistemas, aplicaciones, productos y proyectos premium. Compra una vez, descarga para siempre.", cta: "Ver catálogo", chat: "Hablar con el equipo" }, sections: { featured: "Destacados", all: "Todos los artículos" }, product: { what: "Qué es", how: "Cómo funciona", docs: "Documentación", buy: "Comprar ahora" }, checkout: { total: "Total" }, pay: { note: "Pago único seguro. Nuestro equipo confirma cada pedido antes de desbloquear descargas.", cryptoNote: "Envía el monto exacto a la billetera de abajo, luego toca “Ya lo envié”.", sent: "Ya lo envié", copy: "Copiar dirección", copied: "Copiado ✓" }, errors: { load: "No se pudo cargar la tienda. Por favor actualiza." }, affiliate: { earn: "Ganar comisión", join: "Unirse como comisionado", register: "Registrarse como comisionado", token: "Su token de API (desde la consola de personal)", rate: "Su tasa de comisión (%)", link: "Su enlace de referido" }, commissioner: { title: "Hacerse Comisionado", sub: "Gane 10–30% de comisión cuando alguien compre a través de su enlace. No se necesita cuenta — solo su token API del personal." } },
  ar: { hero: { title: "شبكة بينك", sub: "أنظمة وتطبيقات ومنتجات ومشاريع مميزة. اشترِ مرة واحدة، حمّل للأبد.", cta: "استعرض الكتالوج", chat: "تحدث مع الفريق" }, sections: { featured: "مميز", all: "جميع العناصر" }, product: { what: "ما هو", how: "كيف يعمل", docs: "التوثيق", buy: "اشتري الآن" }, checkout: { total: "المجموع" }, pay: { note: "دفع فريد مؤكد. فريقنا يؤكد كل طلب قبل فتح التحميل.", cryptoNote: "أرسل المبلغ الدقيق إلى المحفظة أدناه، ثم اضغط “لقد أرسلت”.", sent: "لقد أرسلت", copy: "نسخ العنوان", copied: "تم النسخ ✓" }, errors: { load: "تعذر تحميل المتجر. يرجى التحديث بعد لحظة." }, affiliate: { earn: "اكسب عمولة", join: "انضم كمفوض", register: "سجل كمفوض", token: "رمز API الخاص بك (من وحدة الموظفين)", rate: "معدل العمولة الخاص بك (%)", link: "رابط الإحالة الخاص بك" }, commissioner: { title: "انضم كمفوض", sub: "اكسب عمولة 10–30% عندما يشتري شخص ما عبر رابطك. لا حاجة لحساب — فقط رمز API الخاص بالموظفين." } },
  zh: { hero: { title: "Pinc 网络", sub: "高级系统、应用、产品和项目。购买一次，永久下载。", cta: "浏览目录", chat: "与团队交谈" }, sections: { featured: "精选", all: "所有项目" }, product: { what: "是什么", how: "如何工作", docs: "文档", buy: "立即购买" }, checkout: { total: "总计" }, pay: { note: "安全一次性付款。我们的团队在下载解锁前确认每个订单。", cryptoNote: "将准确金额发送到下方钱包，然后点击“我已发送”通知我们的团队。", sent: "我已发送", copy: "复制地址", copied: "已复制 ✓" }, errors: { load: "无法加载商店。请稍后刷新。" }, affiliate: { earn: "赚取佣金", join: "成为专员", register: "注册成为专员", token: "您的 API 令牌 (来自员工控制台)", rate: "您的佣金比率 (%)", link: "您的推荐链接" }, commissioner: { title: "成为专员", sub: "当有人通过您的链接购买时，赚取 10–30% 佣金。无需账户 — 只需员工 API 令牌。" } },
};

function t(path) {
  const parts = path.split(".");
  let v = (I18N[state.lang] || I18N.en);
  for (const p of parts) v = v[p];
  return v || path;
}
function esc(s = "") { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

init();
async function init() {
  try {
    const qs = new URLSearchParams(location.search);
    const ref = qs.get("ref") || localStorage.getItem("pinc_ref");
    if (ref) { localStorage.setItem("pinc_ref", ref); state.affiliateCode = ref; }

    const { data } = await supabase.from("products_public").select("*").order("updated_at", { ascending: false });
    state.catalog = data || [];

    const { data: pay } = await supabase.from("payments").select("*").maybeSingle();
    state.payments = pay || { payPal: { clientId: "", currency: "USD" }, crypto: [], contact: {}, brand: {}, chat_ws: "" };

    applyI18n();
    renderPickers();
    renderFilters();
    renderGrids();
    setupRouter();
    routeTo(window.location.hash || "#/");
    initChat();
  } catch (e) {
    console.error(e);
    $("#app").innerHTML = `<div style="text-align:center;padding:40px;color:var(--dim)">${t("errors.load")}</div>`;
  }
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const path = el.getAttribute("data-i18n").split(".");
    let val = I18N[state.lang] || I18N.en;
    for (const k of path) val = val[k];
    if (val !== undefined) el.textContent = val;
  });
  document.documentElement.lang = state.lang;
  document.body.style.direction = (state.lang === "ar" ? "rtl" : "ltr");
}

function renderPickers() {
  $("#langLabel").textContent = `🌐 ${LANGS[state.lang]}`;
  $("#currLabel").textContent = `${CURRENCY_SYMBOL[state.currency] || state.currency} ${state.currency}`;

  $("#langMenu").innerHTML = Object.entries(LANGS).map(([k, v]) =>
    `<div class="lang-item${k === state.lang ? " active" : ""}" data-lang="${k}" role="menuitem">${v}</div>`).join("");
  $("#currMenu").innerHTML = Object.entries(CURRENCIES).map(([k, v]) =>
    `<div class="curr-item${k === state.currency ? " active" : ""}" data-cur="${k}" role="menuitem">${CURRENCY_SYMBOL[k] || k} ${k}</div>`).join("");

  const langPicker = $("#langPicker");
  const langMenu = $("#langMenu");
  langPicker.onclick = (e) => { e.stopPropagation(); langMenu.classList.toggle("open"); $("#currMenu").classList.remove("open"); };
  $$("#langMenu .lang-item").forEach(it => it.onclick = () => setLang(it.dataset.lang));

  const currPicker = $("#currPicker");
  const currMenu = $("#currMenu");
  currPicker.onclick = (e) => { e.stopPropagation(); currMenu.classList.toggle("open"); $("#langMenu").classList.remove("open"); };
  $$("#currMenu .curr-item").forEach(it => it.onclick = () => setCurr(it.dataset.cur));

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".picker")) { langMenu.classList.remove("open"); currMenu.classList.remove("open"); }
  });
}

function setLang(l) {
  state.lang = l;
  localStorage.setItem("pinc_lang", l);
  applyI18n();
  renderPickers();
  renderGrids();
  if (state.product) openProduct(state.product.id);
  $("#langMenu").classList.remove("open");
  toast("Language switched", "ok");
}

function setCurr(c) {
  state.currency = c;
  localStorage.setItem("pinc_currency", c);
  renderPickers();
  renderGrids();
  if (state.product) openProduct(state.product.id);
  $("#currMenu").classList.remove("open");
  toast("Currency: " + c, "ok");
}

function convertCents(cents, toCurrency) {
  const rate = CURRENCIES[toCurrency] || 1;
  return Math.round(cents * rate);
}
function fmtPrice(cents) {
  if (cents == null || Number(cents) <= 0) return "Contact for pricing";
  const converted = convertCents(cents, state.currency);
  const sym = CURRENCY_SYMBOL[state.currency] || state.currency;
  return `<small>${state.currency}</small> ${sym} ${(converted / 100).toFixed(2)}`;
}

function setupRouter() {
  window.addEventListener("hashchange", () => routeTo(window.location.hash || "#/"));
  $$(".nav-links a, .back-btn").forEach(el => el.onclick = (e) => {
    const href = el.getAttribute("href");
    if (href && href.startsWith("#")) { e.preventDefault(); routeTo(href); }
  });
  $("#mobileMenu").onclick = () => {
    const links = $(".nav-links");
    links.style.display = links.style.display === "flex" ? "none" : "flex";
  };
}

function routeTo(hash) {
  state.route = hash;
  $$(".view").forEach(v => v.classList.add("hidden"));
  if (hash === "#/" || hash === "#/products") { renderHome(); $("#view-home").classList.remove("hidden"); }
  else if (hash.startsWith("#/product/")) { const id = hash.split("/")[2].split("?")[0]; openProduct(id); }
  else if (hash.startsWith("#/buy/")) { const id = hash.split("/")[2]; openBuy(id); }
  else if (hash === "#/chat") { $("#view-chat").classList.remove("hidden"); }
  else if (hash === "#/commissioner") { $("#view-commissioner").classList.remove("hidden"); setupCommissioner(); }
  else if (hash === "#/unlock") { $("#view-unlock").classList.remove("hidden"); setupUnlock(); }
  else { routeTo("#/"); }
  window.scrollTo(0, 0);
}

function renderHome() { renderGrids(); }
function renderFilters() {
  const cats = ["all", ...new Set(state.catalog.map(p => p.category))];
  $("#filters").innerHTML = cats.map(c =>
    `<button class="chip${c === "all" ? " active" : ""}" data-cat="${esc(c)}">${c === "all" ? t("sections.all") : (CAT[c] ? CAT[c][1] : c)}</button>`).join("");
  $("#filters").onclick = (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    state.filter = b.dataset.cat;
    $$("#filters .chip").forEach(x => x.classList.toggle("active", x === b));
    renderGrids();
  };
}
function renderGrids() {
  const list = state.filter === "all" ? state.catalog : state.catalog.filter(p => p.category === state.filter);
  const featured = list.filter(p => p.featured).slice(0, 4);
  const ref = state.affiliateCode ? `?ref=${state.affiliateCode}` : "";
  $("#gridFeatured").innerHTML = featured.map(p => cardTpl(p, ref)).join("");
  $("#gridAll").innerHTML = list.map(p => cardTpl(p, ref)).join("");
  $$("#gridFeatured .card, #gridAll .card").forEach(el =>
    el.onclick = () => routeTo(`#/product/${el.dataset.id}`));
  attachImageLoaded();
}
function cardTpl(p, ref) {
  const [emoji] = CAT[p.category] || ["🛒", "Item"];
  return `
    <article class="card${p.featured ? " featured" : ""}" data-id="${esc(p.id)}">
      <div class="card-img">${p.image_url ? `<img class="card-thumb" src="${esc(p.image_url)}" alt="">` : `<div class="fallback">${emoji}</div>`}</div>
      <div class="card-body">
        <span class="card-tag">${(CAT[p.category] ? CAT[p.category][1] : p.category || "Item")}</span>
        <h3>${esc(p.name)}</h3>
        <p class="card-tagline">${esc(p.tagline || "")}</p>
        <div class="card-meta">
          <div class="card-price">${fmtPrice(p.price_cents)}</div>
          <button class="card-btn">${t("product.buy")}</button>
        </div>
      </div>
    </article>`;
}
function attachImageLoaded() {
  $$("img.card-thumb, img#prodMain, .thumb img").forEach(img => {
    if (img.complete) { img.classList.add("loaded"); return; }
    img.onload = () => img.classList.add("loaded");
    img.onerror = () => {
      const fallback = img.parentElement.querySelector(".fallback");
      if (fallback) { img.style.display = "none"; fallback.style.display = "grid"; }
    };
  });
}

function openProduct(id) {
  state.product = state.catalog.find(p => p.id === id);
  if (!state.product) return routeTo("#/");
  const p = state.product;
  const [emoji] = CAT[p.category] || ["🛒", "Item"];
  $("#view-product").classList.remove("hidden");
  $("#prodBack").onclick = () => routeTo("#/");
  $("#prodMain").innerHTML = (p.screenshots && p.screenshots[0])
    ? `<img src="${esc(p.screenshots[0])}" alt="">`
    : `<div class="fallback">${emoji}</div>`;
  $("#prodThumbs").innerHTML = ((p.screenshots || []).map((s, i) =>
    `<div class="thumb${i === 0 ? " active" : ""}" data-s="${i}"><img src="${esc(s)}" alt="" loading="lazy"></div>`).join("")) ||
    `<div class="thumb active"><div class="fallback">${emoji}</div></div>`;
  $$("#prodThumbs .thumb").forEach(t => t.onclick = () => {
    $$("#prodThumbs .thumb").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const idx = Number(t.dataset.s);
    $("#prodMain").innerHTML = p.screenshots[idx] ? `<img src="${esc(p.screenshots[idx])}" alt="">` : `<div class="fallback">${emoji}</div>`;
    attachImageLoaded();
  });
  $("#prodCat").textContent = (CAT[p.category] ? CAT[p.category][1] : p.category) + " · Digital download";
  $("#prodPrice").innerHTML = fmtPrice(p.price_cents);
  $("#prodName").textContent = esc(p.name);
  $("#prodTagline").textContent = esc(p.tagline || "");
  $("#prodDesc").textContent = esc(p.description || "");
  $("#prodHow").textContent = esc(p.how || "Download the package and follow the included instructions.");
  $("#prodDocsTitle").textContent = (p.docs && p.docs.length) ? "Documentation & resources" : "Documentation";
  $("#prodDocs").innerHTML = (p.docs || []).map(d => `<a class="link" href="${esc(d.url)}" target="_blank" rel="noopener">📄 ${esc(d.title)}</a>`).join("<br>") || "<span class='dim'>No documentation yet.</span>";
  $("#buyTotal").innerHTML = fmtPrice(p.price_cents);
  const refLink = state.affiliateCode ? `#/buy/${p.id}?ref=${state.affiliateCode}` : `#/buy/${p.id}`;
  $("#buyBtn").onclick = () => routeTo(refLink);
}

function openBuy(id) {
  state.product = state.catalog.find(p => p.id === id);
  if (!state.product) return routeTo("#/");
  const qs = new URLSearchParams(location.hash.split("?")[1] || "");
  const refFromUrl = qs.get("ref");
  if (refFromUrl) { localStorage.setItem("pinc_ref", refFromUrl); state.affiliateCode = refFromUrl; }
  $("#view-checkout").classList.remove("hidden");
  const p = state.product;
  $("#checkoutBack").onclick = () => routeTo("#/product/" + p.id);
  $("#coThumb").innerHTML = (p.screenshots && p.screenshots[0])
    ? `<img src="${esc(p.screenshots[0])}" alt="">` : `<div class="fallback">🛒</div>`;
  $("#coName").textContent = esc(p.name);
  $("#coDesc").textContent = esc(p.tagline || "");
  $("#coAmount").innerHTML = fmtPrice(p.price_cents);
  $("#panePaypal").classList.remove("hidden");
  $("#paneCrypto").classList.add("hidden");
  $$(".method-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.m === "paypal");
    t.onclick = () => {
      $$(".method-tab").forEach(x => x.classList.toggle("active", x === t));
      $("#panePaypal").classList.toggle("hidden", t.dataset.m !== "paypal");
      $("#paneCrypto").classList.toggle("hidden", t.dataset.m !== "crypto");
      if (t.dataset.m === "paypal") renderPayPal(); else renderCrypto();
    };
  });
  renderPayPal();
  renderCrypto();
  $("#orderNote").classList.add("hidden");

  const btn = document.createElement("button");
  btn.id = "iPayCrypto"; btn.className = "btn btn-primary btn-block"; btn.textContent = t("pay.sent");
  const pane = $("#paneCrypto");
  const old = pane.querySelector("#iPayCrypto");
  if (old) old.remove();
  pane.appendChild(btn);
  btn.onclick = () => {
    const w = (state.payments?.crypto || []).find(c => c.address) || {};
    submitOrder("crypto", w);
  };
}

function renderPayPal() {
  const pane = $("#panePaypal");
  const cfg = state.payments?.payPal || {};
  pane.innerHTML = "";
  if (!cfg.clientId) {
    pane.innerHTML = `<div class="pay-note">PayPal isn't configured yet.<br>Use crypto or contact us.</div>`;
    return;
  }
  pane.innerHTML = `<div class="pay-note">${t("pay.note")} <strong>${fmtPrice(state.product.price_cents)}</strong>. Downloads unlock after confirmation.</div><div id="ppButtons"></div>`;
  loadPayPal(cfg.clientId, cfg.currency || "USD", () => {
    if (!state.product) return;
    paypal.Buttons({
      style: { color: "black", shape: "rect", label: "paypal", height: 46 },
      createOrder: (d, a) => a.order.create({
        purchase_units: [{ amount: { value: String(state.product.price_cents / 100), currency_code: state.product.currency || cfg.currency || "USD" }, description: `Pinc Network — ${state.product.name}` }],
      }),
      onApprove: (d, a) => a.order.capture().then(detail => submitOrder("paypal", { id: detail.id, payer: detail.payer })),
      onError: () => alert("Payment couldn't complete. Try again or use crypto / contact us."),
    }).render("#ppButtons");
  });
}
let ppPromise = null;
function loadPayPal(clientId, currency, cb) {
  if (ppPromise) { ppPromise.then(cb); return; }
  ppPromise = new Promise(res => {
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
    s.onload = res; document.head.appendChild(s);
  });
  ppPromise.then(cb);
}

function renderCrypto() {
  const pane = $("#paneCrypto");
  const wallets = ((state.payments && state.payments.crypto) || []).filter(w => w.address);
  if (!wallets.length) {
    pane.innerHTML = `<div class="pay-note">Crypto checkout isn't configured yet.</div>`;
    return;
  }
  const p = state.product;
  pane.innerHTML = `
    <div class="pay-note">${t("pay.cryptoNote")}</div>
    <div class="crypto-pick" id="cryptoPick"></div>
    <div class="wallet-box">
      <div class="wallet-row"><span class="wallet-label" id="coWalletLabel">Bitcoin</span><button class="copy-btn" id="coCopy">${t("pay.copy")}</button></div>
      <div class="wallet-addr mono" id="coWalletAddr"></div>
      <div class="qr-wrap"><img id="coQr" alt="QR" /></div>
      <p class="amount-note mt">Amount: <strong id="coAmtCrypto">${fmtPrice(p.price_cents)}</strong></p>
    </div>`;
  const pick = $("#cryptoPick");
  pick.innerHTML = wallets.map((w, i) => `<button class="chip${i === 0 ? " active" : ""}" data-i="${i}">${esc(w.symbol || w.label)}</button>`).join("");
  pick.querySelectorAll(".chip").forEach(b => b.onclick = () => {
    pick.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderWallet(wallets[Number(b.dataset.i)]);
  });
  renderWallet(wallets[0]);
  $("#coCopy").onclick = () => {
    navigator.clipboard.writeText($("#coWalletAddr").textContent);
    $("#coCopy").textContent = t("pay.copied");
    setTimeout(() => $("#coCopy").textContent = t("pay.copy"), 1400);
  };
  const btn = $("#iPayCrypto");
  if (btn) btn.textContent = t("pay.sent");
}
function renderWallet(w) {
  $("#coWalletLabel").textContent = esc(w.label || "Wallet");
  $("#coWalletAddr").textContent = esc(w.address || "");
  $("#coQr").src = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" + encodeURIComponent(w.address || "");
  $("#coAmtCrypto").textContent = fmtPrice(state.product.price_cents);
}

async function submitOrder(method, meta) {
  if (!state.product) return;
  const email = ($("#buyerEmail")?.value || "").trim();
  if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
    toast("Enter a valid email — it's how your download unlocks", "err");
    return;
  }
  const { data, error } = await supabase.rpc("create_order", {
    p_product_id: state.product.id,
    p_buyer_email: email,
    p_method: method,
    p_affiliate_code: state.affiliateCode || null,
  });
  if (error) { toast("Order failed — contact us", "err"); return; }
  if (data && data.error) { toast(data.error, "err"); return; }
  const orderId = data && data.id ? data.id : null;
  if (orderId) {
    localStorage.setItem("pinc_last_order", orderId);
    localStorage.setItem("pinc_last_email", email);
  }
  $("#orderNote").classList.remove("hidden");
  const pane = document.getElementById("pane" + (method === "paypal" ? "Paypal" : "Crypto"));
  if (pane) pane.innerHTML = `
    <div class="pay-note">✅ Order received — ID <strong class="mono">${esc(orderId || "")}</strong><br>
    Save this ID. After our team confirms payment, unlock your download here:</div>
    <a class="btn btn-primary btn-block mt" href="#/unlock">🔓 Check my download</a>`;
  toast("Order placed — awaiting confirmation", "ok");
}

/* ── Download unlock ── */
function setupUnlock() {
  $("#uEmail").value = localStorage.getItem("pinc_last_email") || "";
  $("#uOrder").value = localStorage.getItem("pinc_last_order") || "";
  $("#uResult").innerHTML = "";
  $("#uGo").onclick = async () => {
    const email = $("#uEmail").value.trim();
    const oid = $("#uOrder").value.trim();
    if (!email || email.indexOf("@") < 1) return toast("Enter the email you ordered with", "err");
    if (!oid) return toast("Enter your order ID", "err");
    const { data, error } = await supabase.rpc("claim_download", { p_order_id: oid, p_email: email });
    if (error) { if (/uuid/i.test(error.message)) return toast("Order ID looks invalid", "err"); return toast(error.message, "err"); }
    const url = (Array.isArray(data) ? data[0] : data) || null;
    $("#uResult").innerHTML = url
      ? `<div class="pay-note">🎉 Payment confirmed — your file is ready:</div>
         <a class="btn btn-primary btn-block mt" href="${esc(url)}" target="_blank" rel="noopener">⬇ Download your file</a>`
      : `<div class="pay-note">⏳ Not unlocked yet. Once our team confirms your payment, this page will show your download automatically. Keep this order ID safe.</div>`;
    toast(url ? "Download unlocked ✓" : "Checked — still awaiting confirmation", url ? "ok" : "");
  };
}

/* ── Commissioner registration (token-based, no account) ── */
function setupCommissioner() {
  $("#commBack").onclick = () => routeTo("#/");
  $("#commRegister").onclick = async () => {
    const token = $("#fCommToken").value.trim();
    const email = $("#fCommEmail").value.trim();
    const rate = Number($("#fCommRate").value || 15);
    if (!token) return toast("API token required", "err");
    if (!email || email.indexOf("@") < 1) return toast("Enter your email", "err");
    const { data, error } = await supabase.rpc("register_commissioner", {
      p_staff_token: token, p_email: email, p_rate: rate,
    });
    if (error) return toast(error.message, "err");
    const row = Array.isArray(data) ? data[0] : data;
    const link = `${location.origin}/?ref=${row.code}`;
    localStorage.setItem("pinc_comm_link", link);
    $("#commResult").classList.remove("hidden");
    $("#commLink").value = link;
    $("#commCopy").onclick = () => { navigator.clipboard.writeText(link); toast("Link copied", "ok"); };
    toast("Registered as commissioner ✓", "ok");
  };
  $("#commCopy").onclick = () => {
    const link = $("#commLink").value || localStorage.getItem("pinc_comm_link");
    navigator.clipboard.writeText(link);
    toast("Link copied", "ok");
  };

  const affEmail = $("#affTrackEmail"); const affResult = $("#affTrackResult");
  $("#affTrackBtn").onclick = async () => {
    const email = affEmail.value.trim();
    if (!email || email.indexOf("@") < 1) return toast("Enter your registered email", "err");
    const { data, error } = await supabase.rpc("affiliate_status", { p_email: email });
    if (error) return toast(error.message, "err");
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.error) return toast(row ? row.error : "Not found", "err");
    const dollars = (Number(row.balance_cents || 0) / 100).toFixed(2);
    affResult.innerHTML = `<div class="pay-note">Balance: <strong>$${dollars}</strong> · Code: <strong class="mono">${esc(row.referral_code || "")}</strong></div>
      <a class="btn btn-primary btn-block mt" href="${location.origin}/?ref=${esc(row.referral_code || "")}">Referral link</a>`;
  };
  const pEmail = $("#affPayEmail"); const pAmt = $("#affPayAmount"); const pResult = $("#affPayResult");
  $("#affPayBtn").onclick = async () => {
    const email = pEmail.value.trim(); const amt = Number(pAmt.value || 0);
    if (!email || email.indexOf("@") < 1) return toast("Enter your registered email", "err");
    if (!amt || amt <= 0) return toast("Enter a valid amount", "err");
    const { data, error } = await supabase.rpc("request_payout", { p_email: email, p_amount_cents: amt });
    if (error) return toast(error.message, "err");
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.error) return toast(row ? row.error : "Request failed", "err");
    pResult.innerHTML = `<div class="pay-note">✅ Payout requested — $${(amt/100).toFixed(2)}. Paid out by staff within 24h.</div>`;
    toast("Payout requested ✓", "ok");
  };
}

function initChat() {
  const cfg = state.payments || {};
  const url = (cfg.chat_ws || "").replace(/\/$/, "");
  const msgs = $("#chatMsgs");
  const input = $("#chatIn");
  const send = $("#chatSend");
  if (!url) {
    msgs.innerHTML = `<div class="msg msg-them"><div class="bubble them">Chat backend isn't configured yet. Contact us via the links below.</div></div>`;
    send.disabled = true; input.disabled = true;
    return;
  }
  try {
    state.ws = new WebSocket(url);
    state.ws.onopen = () => addSys("Connected to support.");
    state.ws.onmessage = ev => addThem(ev.data);
    state.ws.onclose = () => addSys("Disconnected.");
  } catch { addSys("Chat unavailable."); }
  send.onclick = () => { const v = input.value.trim(); if (!v || !state.ws || state.ws.readyState !== 1) return; addMe(v); state.ws.send(JSON.stringify({ from: "client", text: v })); input.value = ""; };
  input.onkeypress = e => { if (e.key === "Enter") send.click(); };
}
function addMe(t) { addMsg("me", t); }
function addThem(t) { addMsg("them", t); }
function addSys(t) { addMsg("sys", t); }
function addMsg(kind, t) {
  const msgs = $("#chatMsgs");
  const div = document.createElement("div");
  div.className = `msg msg-${kind === "me" ? "me" : kind === "sys" ? "sys" : "them"}`;
  if (kind === "sys") div.innerHTML = `<div class="bubble" style="background:var(--panel2);color:var(--dim);font-size:12px;border:none">${esc(t)}</div>`;
  else div.innerHTML = `<div class="bubble ${kind === "me" ? "me" : "them"}">${esc(t)}</div>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function toast(msg, cls = "") {
  document.querySelectorAll(".toastbox").forEach(t => t.remove());
  const d = document.createElement("div");
  d.className = "toastbox " + cls; d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3400);
}
