import { createContext, useContext, type ReactNode } from "react";
import { Link } from "wouter";
import { Heart, Plus } from "lucide-react";
import { money, type Product } from "../lib/catalog";

type Actions = { favorites: string[]; add: (p: Product) => void; favorite: (id: string) => void };
const ProductActions = createContext<Actions | null>(null);
export function ProductActionsProvider({ children, ...actions }: Actions & { children: ReactNode }) {
  return <ProductActions.Provider value={actions}>{children}</ProductActions.Provider>;
}
function ProductCard({ p }: { p: Product }) {
  const actions = useContext(ProductActions);
  if (!actions) return null;
  const { favorites, add, favorite } = actions;
  const saved = favorites.includes(p.id);
  return <article className="product-card" data-motion-key={p.id}>
    <div className="product-image">
      <Link href={`/produit/${p.id}`}><img src={`/images/${p.image}.jpg`} alt={p.name} loading="lazy" width={500} height={560}/></Link>
      <span className="product-badge">{p.badge}</span>
      <button className={`heart-button ${saved ? "selected" : ""}`} aria-pressed={saved} aria-label={`${saved ? "Retirer des" : "Ajouter aux"} favoris : ${p.name}`} onClick={() => favorite(p.id)}><Heart size={17} fill={saved ? "currentColor" : "none"}/></button>
      <button className="quick-add" onClick={() => add(p)}><Plus size={16}/> Ajouter au panier</button>
    </div>
    <div className="product-meta"><span>{p.category} · {p.size}</span><span className="rating" aria-label="Note illustrative : 5 sur 5">★★★★★</span></div>
    <Link href={`/produit/${p.id}`} className="product-name">{p.name}</Link>
    <div className="product-price">{money(p.price)} {p.old && <del>{money(p.old)}</del>}<button onClick={() => add(p)} aria-label={`Ajouter ${p.name} au panier`}><Plus size={17}/></button></div>
  </article>;
}
export function ProductGrid({ list }: { list: Product[] }) {
  return <div className="product-grid">{list.map(p => <ProductCard key={p.id} p={p}/>)}</div>;
}