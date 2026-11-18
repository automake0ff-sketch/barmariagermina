import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, CalendarDays, ChevronRight, Clock3, MapPin,
  Menu as MenuIcon, Phone, Search, UtensilsCrossed, X
} from 'lucide-react'

const PHONE = '+34 854 70 51 67'
const PHONE_LINK = 'tel:+34854705167'
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Maria+Germina+Tapas+Calle+Flor+de+Albahaca+1+Sevilla'
const INSTAGRAM = 'https://www.instagram.com/mariagerminatapa/'

type Dish = {
  name: string
  category: string
  description: string
  price?: string
  image: string
  tags?: string[]
}

const dishes: Dish[] = [
  { name: 'Croquetas caseras variadas', category: 'Croquetas', description: 'Ración de croquetas caseras variadas.', price: '12,00 €', image: '/images/photo-1.jpg', tags: ['Recomendado'] },
  { name: 'Serrano del Chef de pollo', category: 'Especialidades', description: 'Serrano del Chef con pollo.', price: '12,90 €', image: '/images/photo-2.jpg' },
  { name: 'Burger casera de vacuno', category: 'Hamburguesas', description: 'Burger casera elaborada con vacuno.', price: '12,90 €', image: '/images/photo-3.jpg', tags: ['Especialidad'] },
  { name: 'Serrano del Chef de lomo', category: 'Especialidades', description: 'Serrano del Chef con lomo.', price: '12,90 €', image: '/images/photo-4.jpg' },
  { name: 'Pavías de merluza XXL', category: 'Fritos', description: 'Pavías XXL de merluza, crujientes y doradas.', image: '/images/1.jpg', tags: ['Especialidad'] },
  { name: 'Patatas Braviolis', category: 'Entrantes', description: 'Patatas Braviolis con sus salsas.', image: '/images/2.jpg' },
  { name: 'Langostinos al ajillo con huevos de codorniz', category: 'Entrantes', description: 'Langostinos al ajillo acompañados de huevos de codorniz.', image: '/images/3.jpg', tags: ['Especialidad'] },
  { name: 'Tataki de atún', category: 'Tatakis', description: 'Tataki de atún con presentación cuidada.', image: '/images/photo-5.jpg', tags: ['Especialidad'] },
  { name: 'Tataki de carne', category: 'Tatakis', description: 'Tataki de carne.', image: '/images/photo-6.jpg' },
  { name: 'Ensaladilla rusa', category: 'Ensaladillas', description: 'Ensaladilla rusa tradicional.', image: '/images/photo-1.jpg' },
  { name: 'Fingers de pollo en tandori', category: 'Fritos', description: 'Fingers de pollo con preparación tandori.', image: '/images/photo-2.jpg' },
  { name: 'Plato con tofu', category: 'Opciones vegetales', description: 'Opción vegetal con tofu. Consulta disponibilidad e ingredientes al personal.', image: '/images/photo-3.jpg', tags: ['Vegetal'] },
]

const favorites = [
  { name: 'Pavías de merluza XXL', image: '/images/1.jpg', className: 'dish-pavias' },
  { name: 'Croquetas caseras', image: '/images/photo-1.jpg', className: 'dish-croquetas' },
  { name: 'Patatas Braviolis', image: '/images/2.jpg', className: 'dish-braviolis' },
  { name: 'Langostinos al ajillo', image: '/images/3.jpg', className: 'dish-langostinos' },
  { name: 'Tataki de atún', image: '/images/photo-5.jpg', className: 'dish-tataki' },
]

function saveDemo(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [notice, setNotice] = useState('')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(dishes.map((dish) => dish.category)))],
    [],
  )

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = category === 'Todas' || dish.category === category
    const matchesQuery = `${dish.name} ${dish.description}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  const submitDemo = (event: React.FormEvent<HTMLFormElement>, key: string) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    saveDemo(key, data)
    event.currentTarget.reset()
    setNotice('Solicitud registrada localmente en esta demo. No constituye una reserva real.')
  }

  return (
    <>
      <header className="nav-shell">
        <a className="brand" href="#inicio" aria-label="Inicio">
          <span className="brand-mark">MG</span>
          <span><strong>MARÍA GERMINÁ</strong><small>TAPAS · SEVILLA ESTE</small></span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Principal">
          <a href="#casa" onClick={() => setMenuOpen(false)}>Nuestra casa</a>
          <a href="#carta" onClick={() => setMenuOpen(false)}>Carta</a>
          <a href="#experiencia" onClick={() => setMenuOpen(false)}>Experiencia</a>
          <a href="#grupos" onClick={() => setMenuOpen(false)}>Grupos</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
        </nav>
        <a className="nav-reserve" href="#reservas"><CalendarDays size={17} /> Reservar mesa</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          {menuOpen ? <X /> : <MenuIcon />}
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-bg" />
          <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <p className="eyebrow">SEVILLA ESTE · TAPAS PARA COMPARTIR</p>
            <h1>EL BUEN <em>TAPEo</em><br />TIENE NOMBRE PROPIO.</h1>
            <p className="hero-lead">Sabores que sorprenden, ambiente de barrio y buenos momentos en María Germiná.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#carta">Ver carta <ArrowRight size={18} /></a>
              <a className="button button-ghost" href="#reservas">Reservar mesa</a>
            </div>
          </motion.div>
          <div className="hero-photo">
            <img src="/images/1.jpg" alt="Tapas de María Germiná" />
            <div className="hero-seal"><span>BUEN<br />AMBIENTE</span></div>
          </div>
        </section>

        <section className="scene-section" id="experiencia">
          <div className="scene-heading">
            <p className="eyebrow">LA MESA ESTÁ SERVIDA</p>
            <h2>DE TAPEO SE COMPARTE.</h2>
            <p>Cinco tentaciones para empezar. Muchas más razones para volver.</p>
          </div>
          <div className="table-stage">
            <div className="tablecloth" />
            {favorites.map((dish, index) => (
              <motion.div
                key={dish.name}
                className={`floating-dish ${dish.className}`}
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 220 : -220, rotate: index % 2 ? 8 : -8 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, amount: .4 }}
                transition={{ duration: .9, delay: index * .12 }}
              >
                <img src={dish.image} alt={dish.name} />
                <span>{dish.name}</span>
              </motion.div>
            ))}
          </div>
          <a className="button button-dark" href="#carta">Descubre nuestra carta <ArrowRight size={18} /></a>
        </section>

        <section className="house-section" id="casa">
          <div className="house-images">
            <img className="house-main" src="/images/2.jpg" alt="Ambiente del local" />
            <img className="house-detail" src="/images/photo-6.jpg" alt="Detalle gastronómico" />
          </div>
          <motion.div className="house-copy" initial={reduceMotion ? false : { opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="eyebrow">NUESTRA CASA</p>
            <h2>UN LUGAR PARA VENIR, COMPARTIR Y REPETIR.</h2>
            <p>En Sevilla Este vivimos el tapeo con cercanía: platos tradicionales, propuestas actuales y mesas hechas para compartir amigos, familia o pareja.</p>
            <p>El ambiente es animado y el trato cercano. Una experiencia informal, sabrosa y muy nuestra.</p>
            <a className="text-link" href="#reservas">Ven a conocernos <ChevronRight size={18} /></a>
          </motion.div>
        </section>

        <section className="menu-section" id="carta">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CARTA DIGITAL</p>
              <h2>NUESTROS FAVORITOS</h2>
            </div>
            <p>Consulta disponibilidad y ingredientes directamente en el restaurante.</p>
          </div>
          <div className="menu-tools">
            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la carta" />
            </label>
            <div className="category-list">
              {categories.map((item) => (
                <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="dish-grid">
            {filteredDishes.map((dish) => (
              <motion.button className="dish-card" key={dish.name} onClick={() => setSelectedDish(dish)} whileHover={reduceMotion ? undefined : { y: -6 }}>
                <div className="dish-image"><img src={dish.image} alt={dish.name} />{dish.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="dish-card-copy">
                  <small>{dish.category}</small>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <strong>{dish.price || 'Precio por confirmar'}</strong>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="inclusive-section">
          <div>
            <p className="eyebrow">HAY SITIO PARA TODOS</p>
            <h2>CADA PERSONA TIENE SU FORMA DE DISFRUTAR.</h2>
          </div>
          <p>Consulta por opciones vegetales, platos con tofu e información sobre ingredientes y alérgenos. Ante cualquier alergia o intolerancia, confirma siempre con el personal.</p>
          <a className="button button-light" href="mailto:hola@barmariagerminatapassevillaeste.shop?subject=Consulta alimentaria">Consulta tus necesidades <ArrowRight size={18} /></a>
        </section>

        <section className="reservations-section" id="reservas">
          <div className="reservation-panel">
            <p className="eyebrow">RESERVAS</p>
            <h2>¿NOS VEMOS EN UNA MESA?</h2>
            <p>Completa la solicitud o llama directamente. La demo no confirma disponibilidad real.</p>
            <form onSubmit={(event) => submitDemo(event, 'maria-germina-reservation')}>
              <div className="form-grid">
                <label>Nombre<input name="name" required placeholder="Tu nombre" /></label>
                <label>Teléfono<input name="phone" required type="tel" placeholder="+34" /></label>
                <label>Fecha<input name="date" required type="date" /></label>
                <label>Hora<input name="time" required type="time" /></label>
                <label>Comensales<input name="guests" required type="number" min="1" placeholder="2" /></label>
                <label>Observaciones<textarea name="notes" placeholder="Alergias o preferencias" /></label>
              </div>
              <button className="button button-primary" type="submit">Enviar solicitud <ArrowRight size={18} /></button>
            </form>
          </div>
          <a className="call-card" href={PHONE_LINK}>
            <Phone size={28} />
            <span>¿Prefieres llamar?</span>
            <strong>{PHONE}</strong>
            <small>Llamar para reservar</small>
          </a>
        </section>

        <section className="groups-section" id="grupos">
          <div className="groups-copy">
            <p className="eyebrow">GRUPOS Y CELEBRACIONES</p>
            <h2>LOS BUENOS MOMENTOS SABEN MEJOR COMPARTIDOS.</h2>
            <p>Comidas familiares, reuniones de amigos, cumpleaños o encuentros de empresa. Cuéntanos tu idea y consulta las posibilidades con el equipo.</p>
          </div>
          <form className="groups-form" onSubmit={(event) => submitDemo(event, 'maria-germina-group')}>
            <div className="form-grid">
              <label>Nombre<input name="name" required /></label>
              <label>Teléfono<input name="phone" required type="tel" /></label>
              <label>Email<input name="email" required type="email" /></label>
              <label>N.º personas<input name="people" required type="number" min="2" /></label>
              <label>Fecha aproximada<input name="date" type="date" /></label>
              <label>Celebración
                <select name="type"><option>Comida familiar</option><option>Reunión de amigos</option><option>Cumpleaños</option><option>Comida de empresa</option><option>Otro</option></select>
              </label>
              <label className="full">Comentarios<textarea name="comments" /></label>
            </div>
            <button className="button button-dark" type="submit">Consultar grupo <ArrowRight size={18} /></button>
          </form>
        </section>

        <section className="reviews-section">
          <p className="eyebrow">LO QUE DICEN LOS CLIENTES</p>
          <h2>BUENA COMIDA. BUEN TRATO. BUENOS MOMENTOS.</h2>
          <div className="review-grid">
            <blockquote>“ Recomendable 100%. Buen trato y buena comida, a destacar los fingers de pollo y también el tataki de atún. ”<cite>Vanessa Tirado · Opinión pública</cite></blockquote>
            <blockquote>“ Como vegana fue parada obligatoria. Todo buenísimo y precios razonables. Tienen mucho cuidado con el gluten y las intolerancias. ”<cite>MJ H · Opinión pública</cite></blockquote>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-info">
            <p className="eyebrow">VEN A VERNOS</p>
            <h2>SEVILLA ESTE TIENE SU BAR DE TAPAS.</h2>
            <p><MapPin size={19} /> Local 9, Calle Flor de Albahaca, 1 · 41020 Sevilla</p>
            <p><Phone size={19} /> <a href={PHONE_LINK}>{PHONE}</a></p>
            <p><Clock3 size={19} /> Martes–sábado: 12:00–00:00 · Domingo: 12:00–17:00 · Lunes cerrado</p>
            <div className="contact-actions">
              <a className="button button-primary" href={MAPS_LINK} target="_blank" rel="noreferrer">Cómo llegar <MapPin size={18} /></a>
              <a className="button button-ghost-dark" href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="map-wrap">
            <iframe title="Ubicación de María Germiná" src="https://www.google.com/maps?q=Maria+Germina+Tapas+Calle+Flor+de+Albahaca+1+Sevilla&output=embed" loading="lazy" />
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#inicio"><span className="brand-mark">MG</span><span><strong>MARÍA GERMINÁ</strong><small>TAPAS · SEVILLA ESTE</small></span></a>
        <p>Tapas para compartir. Buenos momentos para repetir.</p>
        <a href={INSTAGRAM} target="_blank" rel="noreferrer">@mariagerminatapa</a>
      </footer>

      <div className="mobile-bar">
        <a href="#carta"><UtensilsCrossed size={19} /><span>Carta</span></a>
        <a href={PHONE_LINK}><Phone size={19} /><span>Llamar</span></a>
        <a href={MAPS_LINK} target="_blank" rel="noreferrer"><MapPin size={19} /><span>Cómo llegar</span></a>
      </div>

      {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar"><X size={16} /></button></div>}

      {selectedDish && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedDish(null)}>
          <motion.div className="dish-modal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDish(null)} aria-label="Cerrar"><X /></button>
            <img src={selectedDish.image} alt={selectedDish.name} />
            <div>
              <small>{selectedDish.category}</small>
              <h2>{selectedDish.name}</h2>
              <p>{selectedDish.description}</p>
              <strong>{selectedDish.price || 'Precio por confirmar'}</strong>
              <p className="allergen-note">Información de alérgenos e ingredientes disponible consultando al personal.</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
