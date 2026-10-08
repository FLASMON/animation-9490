import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  ShoppingBag,
  Heart,
  X,
  Menu,
  Plus,
  Minus,
  Leaf,
  Truck,
  ShieldCheck,
  PackageCheck,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Check,
  Mail,
  Instagram,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { products, categories, money, articles, type Product } from "../lib/catalog";

type Cart = Record<string, number>;
function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
const photo = (name: string) => `/images/${name}.jpg`;
function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg className={`botanical ${className}`} viewBox="0 0 300 370" fill="none" aria-hidden="true">
      <path d="M35 360C70 250 140 115 260 15" stroke="currentColor" strokeWidth="3" />
      {Array.from({ length: 10 }, (_, i) => {
        const y = 330 - i * 32;
        const x = 43 + i * 20;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y}Q${x - 58} ${y - 8} ${x - 62} ${y - 46}Q${x - 21} ${y - 46} ${x} ${y}`}
              fill="currentColor"
            />
            <path
              d={`M${x} ${y}Q${x + 28} ${y - 48} ${x + 82} ${y - 49}Q${x + 62} ${y - 18} ${x} ${y}`}
              fill="currentColor"
            />
          </g>
        );
      })}
    </svg>
  );
}
function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i}>
          La beauté au naturel <span className="ribbon-star">✳</span> Prenez soin de vous{" "}
          <span className="ribbon-star">✳</span>
        </span>
      ))}
    </div>
  );
}

export default function Shop() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const [cart, setCart] = useSaved<Cart>("botanica-cart", {});
  const [favorites, setFavorites] = useSaved<string[]>("botanica-favorites", []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");
  const [category, setCategory] = useState("Tous les soins");
  const [sort, setSort] = useState("popular");
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(false);
  const [order, setOrder] = useState("");
  const [review, setReview] = useState(0);
  const [tab, setTab] = useState("Tous les soins");
  const [contactSent, setContactSent] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(
    () => !!localStorage.getItem("botanica-newsletter"),
  );
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const shipping = total >= 49 || total === 0 ? 0 : 4.9;
  const savings = discount ? total * 0.1 : 0;
  useEffect(() => {
    if (window.location.hash === "#notre-histoire" && location === "/") {
      requestAnimationFrame(() => document.getElementById("notre-histoire")?.scrollIntoView());
    } else window.scrollTo(0, 0);
    setMenuOpen(false);
    setCartOpen(false);
    setSearchOpen(false);
    setProductQty(1);
    const params = new URLSearchParams(search);
    setCategory(params.get("categorie") || "Tous les soins");
    setOnlyOffers(params.get("offres") === "oui");
    setSearchTerm(params.get("q") || "");
  }, [location, search]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!cartOpen && !searchOpen && !menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "Tab") {
        const controls = Array.from(document.querySelectorAll<HTMLElement>('dialog[open] button, dialog[open] a, dialog[open] input'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previous;
    };
  }, [cartOpen, searchOpen, menuOpen]);
  function add(p: Product, qty = 1) {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + qty }));
    setToast(`${p.name} ajouté au panier`);
  }
  function favorite(id: string) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }
  function quantity(id: string, change: number) {
    setCart((c) => {
      const next = { ...c };
      next[id] = Math.max(0, (next[id] || 0) + change);
      if (!next[id]) delete next[id];
      return next;
    });
  }
  function ProductCard({ p }: { p: Product }) {
    return (
      <article className="product-card">
        <div className="product-image">
          <Link href={`/produit/${p.id}`}>
            <img src={photo(p.image)} alt={p.name} loading="lazy" />
          </Link>
          <span className="product-badge">{p.badge}</span>
          <button
            className={`heart-button ${favorites.includes(p.id) ? "selected" : ""}`}
            aria-label={`${favorites.includes(p.id) ? "Retirer des" : "Ajouter aux"} favoris : ${p.name}`}
            onClick={() => favorite(p.id)}
          >
            <Heart size={17} fill={favorites.includes(p.id) ? "currentColor" : "none"} />
          </button>
          <button className="quick-add" onClick={() => add(p)}>
            <Plus size={16} /> Ajouter au panier
          </button>
        </div>
        <div className="product-meta">
          <span>
            {p.category} · {p.size}
          </span>
          <span className="rating">★★★★★</span>
        </div>
        <Link href={`/produit/${p.id}`} className="product-name">
          {p.name}
        </Link>
        <div className="product-price">
          {money(p.price)} {p.old && <del>{money(p.old)}</del>}
          <button onClick={() => add(p)} aria-label={`Ajouter ${p.name} au panier`}>
            <Plus size={17} />
          </button>
        </div>
      </article>
    );
  }
  function ProductGrid({ list }: { list: Product[] }) {
    return (
      <div className="product-grid">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    );
  }
  function Newsletter({ compact = false }: { compact?: boolean }) {
    const setDone = setNewsletterDone;
    return (
      <form
        className={`newsletter-form ${compact ? "compact" : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          const email = new FormData(e.currentTarget).get("email");
          localStorage.setItem("botanica-newsletter", String(email));
          setDone(true);
        }}
      >
        {newsletterDone ? (
          <p className="form-success">
            <Check size={18} /> Votre inscription de démonstration est enregistrée sur cet appareil.
          </p>
        ) : (
          <>
            <div className="email-field">
              <Mail size={18} />
              <input
                name="email"
                type="email"
                required
                aria-label="Votre adresse e-mail"
                placeholder="Votre adresse e-mail"
              />
              <button aria-label="S’inscrire à la newsletter" type="submit">
                <ArrowRight size={19} />
              </button>
            </div>
            <label className="consent">
              <input type="checkbox" aria-label="Accepter l’inscription locale" required /> J’accepte l’enregistrement local de mon adresse
              pour cette démonstration.
            </label>
          </>
        )}
      </form>
    );
  }
  function Header() {
    return (
      <>
        <div className="announcement">
          <span>Une parenthèse de douceur, livrée chez vous.</span>
          <span>
            Livraison offerte dès 49 € <ArrowUpRight size={12} />
          </span>
        </div>
        <header className="header">
          <div className="main-header wrap">
            <button
              className="mobile-menu icon-button"
              aria-label="Ouvrir le menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
            <Link href="/" className="brand">
              <Leaf size={33} strokeWidth={1.35} />
              <span>
                botanica<span className="brand-dot">.</span>
                <small>LA BEAUTÉ, AU NATUREL</small>
              </span>
            </Link>
            <div className="header-promise">
              <Leaf size={19} />
              <span>
                Inspiré par la nature.
                <br />
                <strong>Pensé pour vous.</strong>
              </span>
            </div>
            <div className="header-actions">
              <button
                className="icon-button"
                aria-label="Rechercher"
                onClick={() => {
                  setSearchTerm("");
                  setSearchOpen(true);
                }}
              >
                <Search size={21} />
              </button>
              <Link
                className="icon-button favorites-link"
                href="/favoris"
                aria-label={`Favoris (${favorites.length})`}
              >
                <Heart size={21} />
                {favorites.length > 0 && <b>{favorites.length}</b>}
              </Link>
              <button
                className="bag-button"
                aria-label={`Ouvrir le panier, ${count} articles`}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={21} />
                <span>
                  Panier <b>{count}</b>
                </span>
              </button>
            </div>
          </div>
          <nav className="nav">
            <div className="wrap nav-inner">
              <div className="nav-links">
                <Link href="/" className={location === "/" ? "active" : ""}>
                  Accueil
                </Link>
                <Link href="/boutique" className={location.startsWith("/boutique") ? "active" : ""}>
                  Tous nos soins <ChevronDown size={12} />
                </Link>
                <Link href="/boutique?categorie=Visage">Visage</Link>
                <Link href="/boutique?categorie=Corps">Corps</Link>
                <Link href="/boutique?categorie=Cheveux">Cheveux</Link>
                <Link href="/boutique?categorie=Coffrets">Coffrets</Link>
                <Link href="/journal">Le journal</Link>
              </div>
              <Link href="/boutique?offres=oui" className="nav-offer">
                Nos offres du moment <ArrowUpRight size={14} />
              </Link>
            </div>
          </nav>
        </header>
      </>
    );
  }
  function SectionHeading({
    label,
    title,
    to = "/boutique",
    link = "Tout découvrir",
  }: {
    label: string;
    title: string;
    to?: string;
    link?: string;
  }) {
    return (
      <div className="section-heading">
        <div>
          <p className="eyebrow">{label}</p>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" href={to}>
          {link} <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  }
  function Home() {
    return (
      <>
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="short-line" /> LE MEILLEUR DE LA NATURE, POUR VOUS
              </p>
              <h1>
                Votre beauté.
                <br />
                Votre nature.
                <br />
                <em>Notre passion.</em>
              </h1>
              <p className="hero-description">
                Des soins inspirés par la nature, des gestes qui font du bien.
                <br className="desktop-break" /> Découvrez une beauté plus douce, tout simplement.
              </p>
              <div className="hero-buttons">
                <Link href="/boutique" className="button">
                  Découvrir nos soins <ArrowUpRight size={17} />
                </Link>
                <a href="#notre-histoire" className="underlined">
                  L’esprit Botanica <ArrowRight size={15} />
                </a>
              </div>
              <div className="hero-social">
                <div className="avatars">
                  {["hero", "portrait", "routine"].map((img) => (
                    <img key={img} src={photo(img)} alt="Portrait de la sélection beauté" />
                  ))}
                </div>
                <div>
                  <span className="rating">★★★★★</span>
                  <p>Un rituel à aimer, jour après jour.</p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-orbit" />
              <img
                className="hero-portrait"
                src={photo("hero")}
                alt="Femme souriante présentant un soin pour le visage"
              />
              <Botanical className="hero-leaf" />
              <div className="hero-stamp">
                <Leaf size={23} />
                <span>
                  LA NATURE
                  <br />
                  NOUS INSPIRE
                </span>
              </div>
              <div className="floating-product">
                <img src={photo("serum")} alt="Sérum Éclat Botanique" />
                <div>
                  <span>VOTRE NOUVEL ESSENTIEL</span>
                  <strong>Sérum Éclat Botanique</strong>
                  <Link href="/produit/serum-eclat">
                    Un peu de lumière <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
              <span className="hero-handwriting">la beauté commence par vous</span>
            </div>
          </div>
          <div className="hero-bottom wrap">
            <span>
              <Leaf size={16} /> Une sélection inspirée par la nature
            </span>
            <span>
              <PackageCheck size={17} /> Votre routine, en toute simplicité
            </span>
            <span>
              <Heart size={16} /> Des petits moments pour soi
            </span>
          </div>
        </section>
        <Ribbon />
        <section className="section wrap category-section">
          <div className="center-heading">
            <p className="eyebrow">À CHAQUE ENVIE, SON RITUEL</p>
            <h2>Explorez votre univers beauté</h2>
          </div>
          <div className="category-grid">
            {[
              {
                title: "Soins du visage",
                cat: "Visage",
                img: "portrait",
                sub: "Votre éclat au quotidien",
              },
              {
                title: "Soins du corps",
                cat: "Corps",
                img: "amber",
                sub: "Une parenthèse de douceur",
              },
              {
                title: "Soins des cheveux",
                cat: "Cheveux",
                img: "routine",
                sub: "Révélez leur beauté",
              },
              { title: "Nos coffrets", cat: "Coffrets", img: "green", sub: "Le plaisir d’offrir" },
              {
                title: "Les essentiels",
                cat: "Tous les soins",
                img: "collection",
                sub: "Vos nouveaux favoris",
              },
            ].map((c) => (
              <Link
                href={`/boutique?categorie=${encodeURIComponent(c.cat)}`}
                className="category-card"
                key={c.title}
              >
                <div>
                  <img src={photo(c.img)} alt={c.title} loading="lazy" />
                  <span>
                    <ArrowUpRight size={23} />
                  </span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.sub}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="wrap promo-pair">
          <div className="promo-card light">
            <img src={photo("ritual")} alt="Application d’un sérum" loading="lazy" />
            <div>
              <p className="eyebrow">VOTRE INSTANT DOUCEUR</p>
              <h2>
                Un beau jour
                <br />
                pour prendre
                <br />
                <em>soin de vous.</em>
              </h2>
              <Link href="/boutique?categorie=Visage" className="button">
                Je découvre <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="promo-card dark">
            <img src={photo("portrait")} alt="Rituel de soin du visage" loading="lazy" />
            <div>
              <p className="eyebrow">LES OFFRES BOTANIQUES</p>
              <h2>
                Vos essentiels.
                <br />À prix
                <br />
                <em>tout doux.</em>
              </h2>
              <Link href="/boutique?offres=oui" className="button light-button">
                Voir les offres <ArrowUpRight size={16} />
              </Link>
            </div>
            <span className="discount-stamp">
              JUSQU’À
              <br />
              <strong>-20 %</strong>
            </span>
          </div>
        </section>
        <section id="notre-histoire" className="section wrap story">
          <div className="story-collage">
            <img
              className="story-main"
              src={photo("routine")}
              alt="Un soin intégré à une routine quotidienne"
              loading="lazy"
            />
            <img
              className="story-small"
              src={photo("collection")}
              alt="Collection de soins botaniques"
              loading="lazy"
            />
            <span className="story-seal">
              <Leaf size={25} />
              Simplement
              <br />
              essentiel.
            </span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">L’ESPRIT BOTANICA</p>
            <h2>
              La beauté la plus belle,
              <br />
              c’est celle qui vous
              <br />
              <em>ressemble.</em>
            </h2>
            <p>
              Nous croyons aux gestes simples, aux ingrédients inspirants et à ces petits moments
              qui font toute la différence. Botanica, c’est une invitation à ralentir et à retrouver
              l’essentiel.
            </p>
            <div className="story-points">
              <span>
                <Leaf /> Inspiré par la nature
              </span>
              <span>
                <Heart /> Pensé avec attention
              </span>
            </div>
            <Link href="/boutique" className="underlined">
              Trouvez votre rituel <ArrowUpRight size={17} />
            </Link>
            <p className="signature">Avec douceur, Botanica.</p>
          </div>
        </section>
        <section className="section wrap bestsellers">
          <SectionHeading label="LES INCONTOURNABLES" title="Vos futurs coups de cœur" />
          <div className="product-tabs">
            {categories.map((c) => (
              <button key={c} className={tab === c ? "active" : ""} onClick={() => setTab(c)}>
                {c}
              </button>
            ))}
          </div>
          <ProductGrid
            list={(tab === "Tous les soins"
              ? products
              : products.filter((p) => p.category === tab)
            ).slice(0, 4)}
          />
        </section>
        <section className="wrap seasonal">
          <img
            className="seasonal-left"
            src={photo("spa")}
            alt="Un instant de bien-être"
            loading="lazy"
          />
          <Botanical />
          <div>
            <p className="eyebrow">UNE NOUVELLE SAISON, UN NOUVEL ÉCLAT</p>
            <h2>
              La douceur vous va
              <br />
              <em>si bien.</em>
            </h2>
            <p>Composez votre rituel et profitez de nos offres du moment.</p>
            <Link href="/boutique?offres=oui" className="button">
              Explorer la sélection <ArrowUpRight size={16} />
            </Link>
            <small>Une sélection de soins à prix doux.</small>
          </div>
          <img
            className="seasonal-right"
            src={photo("ritual")}
            alt="Un rituel de beauté tout en douceur"
            loading="lazy"
          />
        </section>
        <section className="section wrap deals">
          <SectionHeading
            label="LE PLAISIR DE SE FAIRE PLAISIR"
            title="Les petites attentions du moment"
            to="/boutique?offres=oui"
            link="Toutes les offres"
          />
          <div className="deal-grid">
            {products.slice(0, 2).map((p) => (
              <article className="deal-card" key={p.id}>
                <Link href={`/produit/${p.id}`}>
                  <img src={photo(p.image)} alt={p.name} loading="lazy" />
                </Link>
                <div>
                  <span className="pill">OFFRE DU MOMENT</span>
                  <p className="rating">★★★★★</p>
                  <Link href={`/produit/${p.id}`}>
                    <h3>{p.name}</h3>
                  </Link>
                  <p>Un essentiel pour votre routine beauté.</p>
                  <strong>
                    {money(p.price)} <del>{money(p.old!)}</del>
                  </strong>
                  <button className="text-link" onClick={() => add(p)}>
                    Ajouter au panier <Plus size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="wrap wide-promo">
          <div>
            <p className="eyebrow">VOTRE BEAUTÉ, SANS COMPROMIS</p>
            <h2>
              Un peu de nature.
              <br />
              Beaucoup de vous.
            </h2>
            <Link href="/boutique?categorie=Coffrets" className="button light-button">
              Découvrir nos coffrets <ArrowUpRight size={16} />
            </Link>
          </div>
          <img src={photo("hero")} alt="La beauté au naturel" loading="lazy" />
          <Botanical />
        </section>
        <div className="section-ribbon">
          <Ribbon />
        </div>
        <section className="section wrap new-arrivals">
          <SectionHeading label="FRAÎCHEMENT ARRIVÉS" title="De nouveaux rituels à aimer" />
          <div className="new-layout">
            <Link href="/boutique" className="editorial-card">
              <img src={photo("routine")} alt="Le plaisir d’une routine de soins" loading="lazy" />
              <div>
                <p className="eyebrow">L’ESSENTIEL, C’EST VOUS.</p>
                <h3>
                  Votre moment.
                  <br />
                  Votre rituel.
                </h3>
                <span>
                  Découvrez la collection <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
            <ProductGrid list={products.slice(4, 8)} />
          </div>
        </section>
        <section className="testimonials">
          <div className="wrap">
            <p className="eyebrow">DES MOTS QUI FONT DU BIEN</p>
            <h2>
              De belles histoires,
              <br />
              <em>de beaux rituels.</em>
            </h2>
            <div className="review-avatars">
              {["hero", "portrait", "routine"].map((im, i) => (
                <img
                  src={photo(im)}
                  alt={`Portrait illustratif ${i + 1}`}
                  key={im}
                  className={review === i ? "active" : ""}
                />
              ))}
            </div>
            <div className="review-content">
              <button
                className="circle-arrow"
                aria-label="Avis précédent"
                onClick={() => setReview((review + 2) % 3)}
              >
                <ArrowLeft size={19} />
              </button>
              <blockquote>
                <h3>
                  {
                    [
                      "Mon petit moment préféré de la journée.",
                      "Une routine simple, un vrai plaisir.",
                      "Le cadeau qui fait toujours plaisir.",
                    ][review]
                  }
                </h3>
                <p>
                  {
                    [
                      "« J’aime les textures, l’univers et surtout cette envie de prendre quelques minutes pour moi. Une jolie découverte. »",
                      "« J’ai trouvé les essentiels qui me donnent envie de garder une routine. Tout est simple et agréable à découvrir. »",
                      "« Les coffrets sont une belle façon de découvrir cet univers. J’adore l’attention apportée à chaque petit détail. »",
                    ][review]
                  }
                </p>
                <span className="rating">★★★★★</span>
                <strong>{["Camille R.", "Sarah M.", "Julie L."][review]}</strong>
                <small>Avis illustratif — boutique de démonstration</small>
              </blockquote>
              <button
                className="circle-arrow filled"
                aria-label="Avis suivant"
                onClick={() => setReview((review + 1) % 3)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </section>
        <section className="section wrap journal-section">
          <SectionHeading
            label="UN PEU D’INSPIRATION"
            title="Le journal Botanica"
            to="/journal"
            link="Lire le journal"
          />
          <div className="article-grid">
            {articles.map((a) => (
              <Link href={`/journal/${a.id}`} key={a.id} className="article-card">
                <div>
                  <img src={photo(a.image)} alt={a.title} loading="lazy" />
                  <span>{a.tag}</span>
                </div>
                <p>LE JOURNAL · 5 MIN DE LECTURE</p>
                <h3>{a.title}</h3>
                <span className="underlined">
                  Lire l’article <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <Ribbon />
        <section className="section wrap instagram-section">
          <div className="center-heading">
            <p className="eyebrow">DES INSTANTS À PARTAGER</p>
            <h2>Un peu de Botanica au quotidien</h2>
            <span className="instagram-handle">
              <Instagram size={15} /> Notre galerie d’inspiration
            </span>
          </div>
          <div className="instagram-grid">
            {["amber", "portrait", "routine", "collection", "ritual", "green"].map((im) => (
              <Link href="/journal" key={im}>
                <img src={photo(im)} alt="Inspiration beauté Botanica" loading="lazy" />
                <Instagram />
              </Link>
            ))}
          </div>
        </section>
        <section className="section wrap faq-section">
          <div className="center-heading">
            <p className="eyebrow">ON VOUS RÉPOND</p>
            <h2>
              Les petites questions, <em>les grandes réponses.</em>
            </h2>
          </div>
          <div className="faq-layout">
            <div className="faq-list">
              {[
                {
                  q: "Comment choisir ma routine de soins ?",
                  a: "Commencez par identifier les besoins de votre peau et privilégiez quelques essentiels. Les fiches de cette boutique sont illustratives ; pour un conseil personnalisé, demandez l’avis d’un professionnel.",
                },
                {
                  q: "Quels sont les délais de livraison ?",
                  a: "Il s’agit d’une boutique de démonstration : aucune livraison n’a lieu. Le panier illustre une livraison à 4,90 €, offerte dès 49 €.",
                },
                {
                  q: "Comment fonctionne la commande ?",
                  a: "Ajoutez vos soins au panier et remplissez le formulaire. Une référence de commande de démonstration est enregistrée sur votre appareil. Aucun paiement n’est demandé.",
                },
                {
                  q: "Puis-je modifier ou retourner ma commande ?",
                  a: "Les commandes sont simulées. Vous pouvez vider votre panier à tout moment ; aucune transaction ni expédition réelle n’est effectuée.",
                },
                {
                  q: "Les produits présentés sont-ils disponibles ?",
                  a: "Les noms, prix et formules sont un catalogue fictif créé pour présenter le site. Les photos sont des illustrations et ne représentent pas des produits Botanica réels.",
                },
              ].map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <Plus size={17} />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <div className="help-card">
              <div className="help-icon">
                <Mail size={25} />
              </div>
              <h3>Un petit conseil ?</h3>
              <p>Nous sommes là pour vous accompagner dans votre découverte.</p>
              <Link href="/contact" className="button light-button">
                Contactez-nous <ArrowUpRight size={15} />
              </Link>
              <small>Formulaire de démonstration</small>
            </div>
          </div>
        </section>
      </>
    );
  }
  function Catalog({ saved = false }: { saved?: boolean }) {
    let filtered = products.filter(
      (p) =>
        (!saved || favorites.includes(p.id)) &&
        (category === "Tous les soins" || p.category === category) &&
        (!onlyOffers || p.old) &&
        (p.name + " " + p.category).toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return (
      <>
        <PageTitle
          label={saved ? "VOTRE SÉLECTION" : "LE MEILLEUR DE BOTANICA"}
          title={
            saved
              ? "Vos coups de cœur"
              : onlyOffers
                ? "Les offres du moment"
                : "Les soins qui vous ressemblent"
          }
          text={
            saved
              ? "Retrouvez ici vos essentiels préférés."
              : "Des gestes simples. Des textures délicates. Votre moment à vous."
          }
        />
        <section className="wrap catalog section">
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search size={18} />
              <input
                placeholder="Rechercher un soin…"
                aria-label="Rechercher dans le catalogue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <label className="sort-label">
              Trier par{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Nos favoris</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom du soin</option>
              </select>
            </label>
          </div>
          <div className="catalog-filters">
            <SlidersHorizontal size={17} />
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
            <label>
              <input
                type="checkbox"
                  aria-label="Afficher uniquement les promotions"
                checked={onlyOffers}
                onChange={(e) => setOnlyOffers(e.target.checked)}
              />
              En promotion
            </label>
          </div>
          <p className="result-count">
            {filtered.length} soin{filtered.length !== 1 ? "s" : ""} à découvrir
          </p>
          {filtered.length ? (
            <ProductGrid list={filtered} />
          ) : (
            <div className="empty-state">
              <Leaf size={40} />
              <h2>{saved ? "Votre sélection prend racine." : "Aucun soin ne correspond."}</h2>
              <p>
                {saved
                  ? "Ajoutez vos favoris en cliquant sur le cœur d’un produit."
                  : "Essayez une autre recherche ou une autre catégorie."}
              </p>
              <button
                className="button"
                onClick={() => {
                  setCategory("Tous les soins");
                  setSearchTerm("");
                  setOnlyOffers(false);
                  if (saved) navigate("/boutique");
                }}
              >
                Découvrir tous les soins <ArrowRight size={17} />
              </button>
            </div>
          )}
        </section>
      </>
    );
  }
  function PageTitle({ label, title, text }: { label: string; title: string; text?: string }) {
    return (
      <section className="page-title">
        <div className="wrap">
          <Link href="/" className="breadcrumb">
            Accueil <ChevronRight size={12} />
          </Link>
          <p className="eyebrow">{label}</p>
          <h1>{title}</h1>
          {text && <p>{text}</p>}
        </div>
        <Botanical />
      </section>
    );
  }
  function ProductPage({ id }: { id: string }) {
    const p = products.find((p) => p.id === id);
    if (!p) return <NotFound />;
    return (
      <section className="wrap section product-detail">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/boutique">Nos soins</Link>
          <ChevronRight size={12} />
          {p.name}
        </div>
        <div className="detail-grid">
          <div className="detail-image">
            <img src={photo(p.image)} alt={p.name} />
            <span className="product-badge">{p.badge}</span>
          </div>
          <div className="detail-copy">
            <p className="eyebrow">
              {p.category} · {p.size}
            </p>
            <h1>{p.name}</h1>
            <span className="rating">
              ★★★★★ <small>Sélection de démonstration</small>
            </span>
            <p className="detail-price">
              {money(p.price)} {p.old && <del>{money(p.old)}</del>}
            </p>
            <p>{p.description}</p>
            <div className="detail-pills">
              <span>
                <Leaf size={15} /> Inspiration botanique
              </span>
              <span>
                <Heart size={15} /> Un moment pour soi
              </span>
            </div>
            <div className="detail-buy">
              <div className="quantity">
                <button
                  aria-label="Diminuer la quantité"
                  onClick={() => setProductQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={15} />
                </button>
                <span>{productQty}</span>
                <button
                  aria-label="Augmenter la quantité"
                  onClick={() => setProductQty((q) => Math.min(20, q + 1))}
                >
                  <Plus size={15} />
                </button>
              </div>
              <button className="button" onClick={() => add(p, productQty)}>
                Ajouter au panier <ShoppingBag size={17} />
              </button>
              <button
                className={`icon-button favorite-detail ${favorites.includes(p.id) ? "selected" : ""}`}
                aria-label="Ajouter ou retirer des favoris"
                onClick={() => favorite(p.id)}
              >
                <Heart fill={favorites.includes(p.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="delivery-note">
              <Truck size={17} /> Livraison simulée offerte dès 49 €
            </p>
            <details open>
              <summary>
                Conseils d’utilisation <ChevronDown size={17} />
              </summary>
              <p>
                Intégrez ce soin à une routine adaptée à vos besoins. Les descriptions et formules
                sont illustratives : ce produit n’est pas commercialisé et ne constitue pas un
                conseil médical.
              </p>
            </details>
            <details>
              <summary>
                Ingrédients <ChevronDown size={17} />
              </summary>
              <p>{p.ingredients} Cette liste n’est pas une formule cosmétique réelle.</p>
            </details>
            <details>
              <summary>
                Livraison & retours <ChevronDown size={17} />
              </summary>
              <p>
                Boutique de démonstration. Aucune expédition réelle. La commande sert uniquement à
                présenter le parcours d’achat.
              </p>
            </details>
          </div>
        </div>
        <div className="related">
          <SectionHeading label="UN RITUEL À COMPLÉTER" title="Ils vont si bien ensemble" />
          <ProductGrid list={products.filter((x) => x.id !== id).slice(0, 4)} />
        </div>
      </section>
    );
  }
  function CartItems() {
    return (
      <div className="cart-items">
        {products
          .filter((p) => cart[p.id])
          .map((p) => (
            <div className="cart-item" key={p.id}>
              <Link href={`/produit/${p.id}`}>
                <img src={photo(p.image)} alt={p.name} />
              </Link>
              <div>
                <Link href={`/produit/${p.id}`}>
                  <strong>{p.name}</strong>
                </Link>
                <p>{p.size}</p>
                <div className="quantity small">
                  <button aria-label={`Diminuer ${p.name}`} onClick={() => quantity(p.id, -1)}>
                    <Minus size={13} />
                  </button>
                  <span>{cart[p.id]}</span>
                  <button aria-label={`Augmenter ${p.name}`} onClick={() => quantity(p.id, 1)}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>
              <div className="cart-item-end">
                <strong>{money(p.price * cart[p.id])}</strong>
                <button
                  aria-label={`Supprimer ${p.name}`}
                  onClick={() =>
                    setCart((c) => {
                      const n = { ...c };
                      delete n[p.id];
                      return n;
                    })
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    );
  }
  function EmptyCart() {
    return (
      <div className="empty-state">
        <ShoppingBag size={42} />
        <h2>
          Votre panier attend
          <br />
          ses petits essentiels.
        </h2>
        <p>Offrez-vous un instant de douceur.</p>
        <Link href="/boutique" className="button" onClick={() => setCartOpen(false)}>
          Explorer nos soins <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  }
  function OrderSummary() {
    return (
      <div className="order-summary">
        <h3>Votre récapitulatif</h3>
        <p>
          <span>Sous-total</span>
          <strong>{money(total)}</strong>
        </p>
        <p>
          <span>Livraison simulée</span>
          <strong>{shipping ? money(shipping) : "Offerte"}</strong>
        </p>
        {discount && (
          <p>
            <span>BOTANICA10 · -10 %</span>
            <strong>−{money(savings)}</strong>
          </p>
        )}
        <div className="summary-total">
          <span>Total</span>
          <strong>{money(total + shipping - savings)}</strong>
        </div>
        <small>Prix illustratifs, taxes incluses. Aucun montant ne sera débité.</small>
      </div>
    );
  }
  function CartPage() {
    return (
      <>
        <PageTitle label="VOTRE INSTANT BEAUTÉ" title="Votre panier" />
        <section className="wrap section">
          {count ? (
            <div className="cart-page-grid">
              <div>
                <div className="shipping-progress">
                  <Truck size={21} />
                  <span>
                    {total >= 49
                      ? "Vous bénéficiez de la livraison simulée offerte !"
                      : `Encore ${money(49 - total)} pour la livraison simulée offerte.`}
                  </span>
                  <div>
                    <i style={{ width: `${Math.min((total / 49) * 100, 100)}%` }} />
                  </div>
                </div>
                <CartItems />
                <Link href="/boutique" className="underlined">
                  <ArrowLeft size={16} /> Continuer ma découverte
                </Link>
              </div>
              <aside>
                <OrderSummary />
                <form
                  className="promo-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (promo.trim().toUpperCase() === "BOTANICA10") {
                      setDiscount(true);
                      setToast("Code appliqué : −10 %");
                    } else setToast("Code non valide. Essayez BOTANICA10.");
                  }}
                >
                  <label htmlFor="promo">Un code de douceur ?</label>
                  <div>
                    <input
                      id="promo"
                      aria-label="Code promotionnel"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="BOTANICA10"
                    />
                    <button type="submit">Appliquer</button>
                  </div>
                </form>
                <Link href="/commande" className="button full-button">
                  Passer la commande <ArrowRight size={17} />
                </Link>
                <p className="demo-note">
                  <ShieldCheck size={16} /> Démonstration · Aucun paiement réel
                </p>
              </aside>
            </div>
          ) : (
            <EmptyCart />
          )}
        </section>
      </>
    );
  }
  function Checkout() {
    function submit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const ref = "BOT-DEMO-" + Date.now().toString(36).toUpperCase();
      localStorage.setItem(
        "botanica-last-order",
        JSON.stringify({
          ref,
          items: cart,
          total: total + shipping - savings,
          date: new Date().toISOString(),
        }),
      );
      setOrder(ref);
      setCart({});
      setDiscount(false);
    }
    if (order)
      return (
        <section className="wrap section order-success">
          <span className="success-icon">
            <Check size={35} />
          </span>
          <p className="eyebrow">UN JOLI RITUEL VOUS ATTEND</p>
          <h1>Merci pour votre visite.</h1>
          <p>
            Votre commande de démonstration <strong>{order}</strong> a été enregistrée sur cet
            appareil.
          </p>
          <p>Aucun paiement, e-mail ou envoi de colis n’a été effectué.</p>
          <Link href="/boutique" className="button" onClick={() => setOrder("")}>
            Continuer à explorer <ArrowRight size={17} />
          </Link>
        </section>
      );
    return (
      <>
        <PageTitle
          label="UNE DERNIÈRE PETITE ÉTAPE"
          title="Votre commande"
          text="Parcours de démonstration : utilisez des coordonnées fictives."
        />
        <section className="wrap section">
          {!count ? (
            <EmptyCart />
          ) : (
            <div className="checkout-grid">
              <form className="checkout-form" onSubmit={submit}>
                <h2>Vos coordonnées</h2>
                <p>Aucune information n’est transmise. Aucun paiement n’est demandé.</p>
                <div className="field-pair">
                  <label>
                    Prénom
                    <input
                      required
                      type="text"
                      aria-label="Prénom"
                      autoComplete="off"
                      name="firstname"
                      placeholder="Camille"
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      required
                      type="text"
                      aria-label="Nom"
                      autoComplete="off"
                      name="lastname"
                      placeholder="Martin"
                    />
                  </label>
                </div>
                <label>
                  Adresse e-mail
                  <input
                    required
                    type="email"
                    aria-label="Adresse e-mail pour la commande"
                    autoComplete="email"
                    placeholder="camille@example.com"
                  />
                </label>
                <label>
                  Adresse
                  <input required aria-label="Adresse" autoComplete="street-address" placeholder="12 rue des Fleurs" />
                </label>
                <div className="field-pair">
                  <label>
                    Code postal
                    <input required aria-label="Code postal" pattern="[0-9]{5}" inputMode="numeric" placeholder="75001" />
                  </label>
                  <label>
                    Ville
                    <input required aria-label="Ville" autoComplete="address-level2" placeholder="Paris" />
                  </label>
                </div>
                <label>
                  Pays
                  <select>
                    <option>France</option>
                  </select>
                </label>
                <div className="checkout-method">
                  <Truck size={22} />
                  <div>
                    <strong>Livraison standard — simulée</strong>
                    <p>Pour illustrer le parcours uniquement.</p>
                  </div>
                  <strong>{shipping ? money(shipping) : "Offerte"}</strong>
                </div>
                <label className="consent checkout-consent">
                  <input type="checkbox" aria-label="Accepter la commande fictive" required /> Je comprends qu’il s’agit d’une commande
                  fictive, sans paiement ni livraison.
                </label>
                <button className="button full-button" type="submit">
                  Confirmer la commande de démonstration <Check size={18} />
                </button>
              </form>
              <aside>
                <CartItems />
                <OrderSummary />
              </aside>
            </div>
          )}
        </section>
      </>
    );
  }
  function Journal({ id }: { id?: string }) {
    const article = articles.find((a) => a.id === id);
    if (id && !article) return <NotFound />;
    return article ? (
      <article className="wrap section article-detail">
        <Link href="/journal" className="underlined">
          <ArrowLeft size={16} /> Le journal Botanica
        </Link>
        <p className="eyebrow">{article.tag} · 5 MIN DE LECTURE</p>
        <h1>{article.title}</h1>
        <img src={photo(article.image)} alt={article.title} />
        <div className="article-body">
          <p>{article.text}</p>
          <h2>La simplicité, avant tout.</h2>
          <p>
            Écoutez vos besoins, gardez les gestes qui vous plaisent et laissez de la place aux
            petits moments de douceur. La plus belle routine reste celle qui vous ressemble.
          </p>
          <p className="demo-note">
            Article éditorial de démonstration. Les informations générales ne remplacent pas un
            conseil professionnel.
          </p>
          <Link href="/boutique" className="button">
            Découvrir nos rituels <ArrowUpRight size={16} />
          </Link>
        </div>
      </article>
    ) : (
      <>
        <PageTitle
          label="RITUELS, NATURE & INSPIRATION"
          title="Le journal Botanica"
          text="Un peu de lecture. Beaucoup de douceur."
        />
        <section className="wrap section">
          <div className="article-grid">
            {articles.map((a) => (
              <Link href={`/journal/${a.id}`} className="article-card" key={a.id}>
                <div>
                  <img src={photo(a.image)} alt={a.title} />
                  <span>{a.tag}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.text.slice(0, 130)}…</p>
                <span className="underlined">
                  Lire l’article <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }
  function Contact() {
    const sent = contactSent;
    const setSent = setContactSent;
    return (
      <>
        <PageTitle
          label="PARLONS BEAUTÉ"
          title="Un mot, une question ?"
          text="Une petite attention commence toujours par une conversation."
        />
        <section className="wrap section contact-grid">
          <div>
            <p className="eyebrow">À VOTRE ÉCOUTE</p>
            <h2>Faisons connaissance.</h2>
            <p>
              Une question sur l’univers Botanica ou sur ce site ? Essayez notre formulaire de
              démonstration.
            </p>
            <div className="contact-info">
              <Mail />
              <span>
                Votre message reste sur cet appareil.
                <br />
                Aucun e-mail n’est envoyé.
              </span>
            </div>
            <img src={photo("collection")} alt="L’univers botanique de nos soins" />
          </div>
          {sent ? (
            <div className="contact-success">
              <Check size={35} />
              <h2>Votre message est enregistré.</h2>
              <p>Il s’agit d’une démonstration locale : aucune équipe ne le recevra.</p>
              <button className="button" onClick={() => setSent(false)}>
                Écrire un autre message
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                localStorage.setItem("botanica-contact", JSON.stringify(data));
                setSent(true);
              }}
            >
              <label>
                Votre nom
                <input name="name" aria-label="Votre nom" required placeholder="Camille Martin" />
              </label>
              <label>
                Votre adresse e-mail
                <input name="email" aria-label="Votre adresse e-mail" required type="email" placeholder="camille@example.com" />
              </label>
              <label>
                Votre sujet
                <select name="subject">
                  <option>Une question sur les soins</option>
                  <option>Une question sur la commande</option>
                  <option>Autre demande</option>
                </select>
              </label>
              <label>
                Votre message
                <textarea
                  name="message"
                  aria-label="Votre message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Dites-nous tout…"
                />
              </label>
              <label className="consent">
                <input type="checkbox" aria-label="Accepter l’enregistrement local du message" required /> J’accepte que ce message soit enregistré
                localement pour la démonstration.
              </label>
              <button className="button" type="submit">
                Enregistrer le message <ArrowUpRight size={17} />
              </button>
            </form>
          )}
        </section>
      </>
    );
  }
  function Legal({ type }: { type: string }) {
    const title =
      type === "confidentialite"
        ? "Votre confidentialité"
        : type === "livraison"
          ? "Livraison & retours"
          : "Informations légales";
    return (
      <>
        <PageTitle label="EN TOUTE TRANSPARENCE" title={title} />
        <section className="wrap section legal-content">
          <h2>Une boutique de démonstration</h2>
          <p>
            Botanica est une marque fictive créée pour présenter un site e-commerce. Le catalogue,
            les prix, les avis et les promotions sont des exemples. Les photographies illustrent
            l’univers beauté et ne représentent pas des produits commercialisés par Botanica.
          </p>
          <h2>Commandes & livraison</h2>
          <p>
            Aucune commande réelle n’est passée, aucun paiement n’est collecté et aucune livraison
            n’est effectuée. Le parcours illustre un tarif de livraison de 4,90 €, offert dès 49 €.
            Il n’existe pas de contrat de vente sur cette démonstration.
          </p>
          <h2>Données enregistrées localement</h2>
          <p>
            Le panier, les favoris, la dernière commande fictive, l’adresse de newsletter et les
            messages du formulaire sont stockés dans le navigateur de cet appareil. Les coordonnées
            saisies lors de la commande ne sont pas enregistrées. Les formulaires n’envoient aucun
            e-mail. Utilisez des données fictives.
          </p>
          <h2>Mesure d’audience de la plateforme</h2>
          <p>
            La plateforme d’hébergement peut utiliser ses propres outils de mesure d’audience. Leur
            gestion relève des paramètres et de la politique de la plateforme, et non des
            formulaires de démonstration.
          </p>
          <button
            className="button"
            onClick={() => {
              [
                "botanica-cart",
                "botanica-favorites",
                "botanica-newsletter",
                "botanica-last-order",
                "botanica-contact",
              ].forEach((k) => localStorage.removeItem(k));
              setCart({});
              setFavorites([]);
              setOrder("");
                setNewsletterDone(false);
                setContactSent(false);
                setDiscount(false);
              setToast("Données de démonstration effacées.");
            }}
          >
            Effacer mes données de démonstration <Trash2 size={16} />
          </button>
        </section>
      </>
    );
  }
  function NotFound() {
    return (
      <section className="wrap section empty-state">
        <Leaf size={40} />
        <h1>Cette page n’a pas encore fleuri.</h1>
        <Link href="/" className="button">
          Revenir à l’accueil <ArrowLeft size={17} />
        </Link>
      </section>
    );
  }
  function Footer() {
    return (
      <>
        <section className="benefits wrap">
          <div>
            <Truck />
            <span>
              <strong>Livraison à prix doux</strong>
              <small>Offerte dès 49 € · simulation</small>
            </span>
          </div>
          <div>
            <Leaf />
            <span>
              <strong>Une inspiration naturelle</strong>
              <small>L’essentiel dans chaque rituel</small>
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>Découverte en toute sérénité</strong>
              <small>Aucun paiement dans la démo</small>
            </span>
          </div>
        </section>
        <section className="newsletter">
          <div className="wrap newsletter-layout">
            <div>
              <p className="eyebrow">UN PEU DE DOUCEUR DANS VOTRE BOÎTE MAIL</p>
              <h2>
                Restons proches.
                <br />
                <em>Naturellement.</em>
              </h2>
              <p>Nos nouveautés, nos inspirations et vos prochaines petites attentions.</p>
            </div>
            {Newsletter({})}
          </div>
          <Botanical />
        </section>
        <footer className="footer">
          <div className="wrap footer-grid">
            <div className="footer-brand">
              <Link href="/" className="brand">
                <Leaf size={30} />
                <span>
                  botanica<span className="brand-dot">.</span>
                  <small>LA BEAUTÉ, AU NATUREL</small>
                </span>
              </Link>
              <p>
                Des gestes simples.
                <br />
                Une beauté qui vous ressemble.
              </p>
              <Link
                href="/journal"
                className="social-link"
                aria-label="Découvrir notre galerie d’inspiration"
              >
                <Instagram size={19} />
              </Link>
            </div>
            <div>
              <h4>Votre univers beauté</h4>
              <Link href="/boutique?categorie=Visage">Soins du visage</Link>
              <Link href="/boutique?categorie=Corps">Soins du corps</Link>
              <Link href="/boutique?categorie=Cheveux">Soins des cheveux</Link>
              <Link href="/boutique?categorie=Coffrets">Nos coffrets</Link>
            </div>
            <div>
              <h4>À vos côtés</h4>
              <Link href="/contact">Contactez-nous</Link>
              <Link href="/livraison">Livraison & retours</Link>
              <Link href="/favoris">Mes favoris</Link>
              <Link href="/panier">Mon panier</Link>
            </div>
            <div>
              <h4>L’esprit Botanica</h4>
              <Link
                href="/#notre-histoire"
                onClick={() => {
                  if (location === "/")
                    document
                      .getElementById("notre-histoire")
                      ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Notre histoire
              </Link>
              <Link href="/journal">Le journal</Link>
              <Link href="/mentions-legales">Informations légales</Link>
              <Link href="/confidentialite">Confidentialité</Link>
            </div>
          </div>
          <div className="wrap footer-bottom">
            <span>© {new Date().getFullYear()} Botanica. La beauté, au naturel.</span>
            <span>Boutique de démonstration · Produits & avis fictifs · Aucun paiement</span>
          </div>
        </footer>
      </>
    );
  }
  let page;
  if (location === "/") page = Home();
  else if (location === "/boutique") page = Catalog({});
  else if (location === "/favoris") page = Catalog({ saved: true });
  else if (location.startsWith("/produit/")) page = ProductPage({ id: location.split("/")[2] });
  else if (location === "/panier") page = CartPage();
  else if (location === "/commande") page = Checkout();
  else if (location === "/journal") page = <Journal />;
  else if (location.startsWith("/journal/")) page = <Journal id={location.split("/")[2]} />;
  else if (location === "/contact") page = Contact();
  else if (["/mentions-legales", "/confidentialite", "/livraison"].includes(location))
    page = <Legal type={location.slice(1)} />;
  else page = <NotFound />;
  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      {Header()}
      <main id="main-content">{page}</main>
      {Footer()}
      {toast && (
        <output className="toast" aria-live="polite">
          <Check size={18} />
          {toast}
          <button aria-label="Fermer la notification" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </output>
      )}
      {cartOpen && (
        <div className="modal-overlay">
          <button className="modal-backdrop" aria-label="Fermer le panier" onClick={() => setCartOpen(false)} />
          <dialog open
            className="cart-drawer"
            aria-modal="true"
            aria-label="Votre panier"
          >
            <div className="drawer-heading">
              <h2>
                Votre panier <small>({count})</small>
              </h2>
              <button
                className="icon-button"
                autoFocus
                aria-label="Fermer le panier"
                onClick={() => setCartOpen(false)}
              >
                <X />
              </button>
            </div>
            {count ? (
              <>
                <p className="drawer-intro">Vos petits essentiels, tout simplement.</p>
                <CartItems />
                <div className="drawer-footer">
                  <p>
                    <span>Sous-total</span>
                    <strong>{money(total)}</strong>
                  </p>
                  <small>Livraison calculée à l’étape suivante.</small>
                  <Link
                    className="button full-button"
                    href="/panier"
                    onClick={() => setCartOpen(false)}
                  >
                    Voir mon panier <ArrowRight size={17} />
                  </Link>
                  <span className="demo-note">Commande de démonstration, sans paiement.</span>
                </div>
              </>
            ) : (
              <EmptyCart />
            )}
          </dialog>
        </div>
      )}
      {searchOpen && (
        <div className="modal-overlay search-overlay">
          <button className="modal-backdrop" aria-label="Fermer la recherche" onClick={() => setSearchOpen(false)} />
          <dialog open
            className="search-dialog"
            aria-modal="true"
            aria-label="Rechercher un soin"
          >
            <div className="drawer-heading">
              <h2>Trouvez votre essentiel.</h2>
              <button
                className="icon-button"
                aria-label="Fermer la recherche"
                onClick={() => setSearchOpen(false)}
              >
                <X />
              </button>
            </div>
            <form
              className="search-big"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/boutique?q=${encodeURIComponent(searchTerm)}`);
                setSearchOpen(false);
              }}
            >
              <Search size={21} />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sérum, crème, coffret…"
                aria-label="Rechercher un soin"
              />
              <button type="submit" aria-label="Afficher les résultats">
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="eyebrow">{searchTerm ? "VOTRE SÉLECTION" : "NOS ESSENTIELS"}</p>
            <div className="search-results">
              {products
                .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 4)
                .map((p) => (
                  <Link href={`/produit/${p.id}`} key={p.id} onClick={() => setSearchOpen(false)}>
                    <img src={photo(p.image)} alt={p.name} />
                    <span>
                      {p.name}
                      <small>{money(p.price)}</small>
                    </span>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              {!products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) && (
                <p>Aucun résultat. Essayez « sérum » ou « crème ».</p>
              )}
            </div>
          </dialog>
        </div>
      )}
      {menuOpen && (
        <div className="modal-overlay">
          <button className="modal-backdrop" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} />
          <dialog open
            className="mobile-drawer"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="drawer-heading">
              <span className="brand">botanica.</span>
              <button
                autoFocus
                className="icon-button"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
              >
                <X />
              </button>
            </div>
            {[
              { name: "Accueil", url: "/" },
              { name: "Tous nos soins", url: "/boutique" },
              ...categories.slice(1).map((c) => ({ name: c, url: `/boutique?categorie=${c}` })),
              { name: "Nos offres du moment", url: "/boutique?offres=oui" },
              { name: "Le journal", url: "/journal" },
              { name: "Mes favoris", url: "/favoris" },
              { name: "Contactez-nous", url: "/contact" },
            ].map((l) => (
              <Link href={l.url} key={l.name} onClick={() => setMenuOpen(false)}>
                {l.name}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </dialog>
        </div>
      )}
    </>
  );
}
