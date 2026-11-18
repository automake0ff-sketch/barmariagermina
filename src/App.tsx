import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, MapPin,
  Menu as MenuIcon, Phone, Search, UtensilsCrossed, X
} from 'lucide-react'

const PHONE = '+34 854 70 51 67'
const PHONE_LINK = 'tel:+34854705167'
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Maria+Germina+Tapas+Calle+Flor+de+Albahaca+1+Sevilla'
const INSTAGRAM = 'https://www.instagram.com/mariagerminatapa/'

type Dish = {
  name: string
  category?: string
  description?: string
  price?: string
  image?: string
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

const cartaCategories = [
  'Germinitos',
  'Algo ligero',
  'Más de lo nuestro',
  'De la freidora',
  'Vegano',
  'Carnívoros',
  'Toke dulce',
  'Bebidas',
  'Hablamos de vinos',
  'Infantil',
  'Montaditos',
] as const

const cartaSections: Record<(typeof cartaCategories)[number], Dish[]> = {
  Germinitos: [
    { name: 'Ensalada Tropical', description: 'Ensalada tropical con aguacate y mango.', price: '9,95 €', image: '/images/photo-1.jpg' },
    { name: 'Ensaladilla del Chef', description: 'Ensaladilla del Chef.', price: 'T 3,95 € · R 7,50 €', image: '/images/photo-1.jpg' },
  ],
  'Algo ligero': [
    { name: 'Ensalada César', description: 'Ensalada César con pollo crujiente y virutas de parmesano.', price: 'T 5,50 € · R 9,95 €' },
    { name: 'Tartar de Atún Fresco', description: 'Tartar de atún fresco con daditos de mango y aguacate.', price: '5,95 €' },
  ],
  'Más de lo nuestro': [
    { name: 'Langostinos al ajillo con huevo de codorniz', description: 'Langostinos al ajillo con huevo de codorniz.', price: 'T 3,95 € · R 8,50 €', image: '/images/3.jpg', tags: ['Especialidad'] },
    { name: 'Tataki de Atún', description: 'Tataki de atún con coulis de soja y algas wakame.', price: '7,95 €', image: '/images/photo-5.jpg', tags: ['Especialidad'] },
    { name: 'Pata de pulpo', description: 'Pata de pulpo trenzada con pimentón y suave de patata.', price: 'T 4,95 € · R 8,95 €' },
  ],
  'De la freidora': [
    { name: 'Tortillita de camarones de Sanlúcar', price: '3,95 €/ud', image: '/images/1.jpg' },
    { name: 'Croquetas de puchero', description: 'Croquetas de puchero, de cola de toro, chipirón en su tinta y jamón.', price: 'T 3,95 € · R 9,00 €', image: '/images/photo-1.jpg' },
    { name: 'Croquetas de bacalao', description: 'Croquetas de bacalao.', price: 'T 3,95 € · R 9,00 €' },
    { name: 'Pavías de merluza XXL', description: 'Pavías de merluza XXL.', price: '5,95 €/ud · R 7,50 €', image: '/images/1.jpg', tags: ['Especialidad'] },
    { name: 'Patatas Braviolis', description: 'Patatas Braviolis con bravas y salsa de mostaza.', price: 'T 3,95 € · R 7,50 €', image: '/images/2.jpg' },
  ],
  Vegano: [
    { name: 'Tartar de tofu', description: 'Tartar de tofu con mango y aguacate.', price: '5,95 €' },
    { name: 'Falafel Burger Vegano', description: 'Falafel burger vegano 100%.', price: '6,50 €' },
    { name: 'Noodles con verduras', description: 'Noodles con verduras.', price: '6,25 €' },
  ],
  Carnívoros: [
    { name: 'Chuleta vaca madurada', description: 'Chuleta de vaca madurada 25 días. 350 g aprox.', price: '16,95 €' },
    { name: 'Serrano del Chef', description: 'Serrano del Chef con huevo, jamón o lomo.', price: '7,95 €', image: '/images/photo-2.jpg' },
    { name: 'Hamburguesa de vacuno', description: 'Hamburguesa de vacuno.', price: '10,50 €', image: '/images/photo-3.jpg' },
    { name: 'Mini burger angus completa', description: 'Mini burger Angus completa.', price: '3,75 €' },
  ],
  'Toke dulce': [
    { name: 'Coulant', description: 'Coulant caliente de corazón líquido.', price: '4,50 €' },
    { name: 'Brownie', description: 'Brownie casero con helado de vainilla.', price: '3,75 €' },
    { name: 'Tarta Milka', description: 'Tarta Milka con helado de vainilla y dulce de leche.', price: '4,95 €' },
    { name: 'Tarta de chocolate', description: 'Tarta de chocolate con helado de vainilla.', price: '4,95 €' },
  ],
  Bebidas: [
    { name: 'Cerveza Cruz Campo', price: '1,00 €' },
    { name: 'Cerveza Cruzcampo Sin', price: '1,00 €' },
    { name: 'Cerveza Radler', price: '1,20 €' },
    { name: 'Cerveza en copa', price: '1,50 €' },
    { name: 'Tónica Schweppes', price: '1,50 €' },
    { name: 'Refrescos', price: '1,50 €' },
  ],
  'Hablamos de vinos': [
    { name: 'Vino Ribera Protos Roble', price: 'Copa 2,30 € · Botella 12,00 €' },
    { name: 'Vino Ribera Finca Resalso', price: 'Copa 2,35 € · Botella 12,00 €' },
    { name: 'Vino Rioja Mtg. Psýtera Joven', price: 'Copa 2,00 € · Botella 10,00 €' },
    { name: 'Vino Rioja Azpilicueta', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Vino Blanco Verdejo Vilera', price: 'Copa 2,10 € · Botella 10,00 €' },
    { name: 'Vino Blanco Sauvignon ÁraBe', price: 'Copa 2,40 € · Botella 12,00 €' },
  ],
  Infantil: [
    { name: 'Solomillo de pollo crujiente con patatas', price: '3,75 €' },
    { name: 'Tapa de croquetas', price: '3,95 €' },
  ],
  Montaditos: [
    { name: 'Montadito de Crustáceo', price: 'Precio pendiente de confirmar' },
  ],
}

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
  const [preparedRequest, setPreparedRequest] = useState('')
  const [cartaCategory, setCartaCategory] = useState<(typeof cartaCategories)[number]>('Germinitos')
  const [cartaIndex, setCartaIndex] = useState(0)
  const [introVisible, setIntroVisible] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    const path = window.location.pathname
    if (path !== '/' && !path.startsWith('/carta')) {
      window.history.replaceState({}, '', '/')
    }
  }, [])

  useEffect(() => {
    if (!window.location.pathname.startsWith('/carta')) return
    if (reduceMotion || sessionStorage.getItem('mg-carta-intro-seen') === '1') {
      setIntroVisible(false)
      return
    }
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('mg-carta-intro-seen', '1')
      setIntroVisible(false)
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  useEffect(() => {
    setCartaIndex(0)
  }, [cartaCategory])

  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(dishes.map((dish) => dish.category || 'Otras')))],
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
    const summary = Object.entries(data)
      .map(([label, value]) => `${label}: ${String(value || '-')}`)
      .join('\n')
    setPreparedRequest(summary)
    event.currentTarget.reset()
    setNotice('Solicitud preparada y guardada localmente. No se ha enviado al restaurante.')
  }

  const copyPreparedRequest = async () => {
    if (!preparedRequest) return
    await navigator.clipboard.writeText(preparedRequest)
    setNotice('Datos copiados para llamar o enviar por el canal elegido por el cliente.')
  }

  const isCartaRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/carta')
  if (isCartaRoute) {
    const cartaDishes = cartaSections[cartaCategory]
    const activeDish = cartaDishes[cartaIndex] || cartaDishes[0]
    const changeDish = (direction: number) => {
      setCartaIndex((current) => (current + direction + cartaDishes.length) % cartaDishes.length)
    }
    const skipIntro = () => {
      sessionStorage.setItem('mg-carta-intro-seen', '1')
      setIntroVisible(false)
    }

    return (
      <>
        {introVisible && (
          <div className="carta-intro" aria-label="Presentación de María Germiná">
            <div className="carta-intro-light" />
            <motion.img
              className="carta-intro-logo"
              src="/images/logo-maria-germina.jpg"
              alt="María Germiná Tapas"
              initial={reduceMotion ? false : { opacity: 0, scale: .92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .8 }}
            />
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .7, duration: .6 }}
            >
              MARÍA GERMINÁ · SEVILLA ESTE
            </motion.p>
            <button type="button" onClick={skipIntro}>Ver carta</button>
          </div>
        )}
        <header className="qr-header">
          <a className="brand" href="/" aria-label="Volver al inicio">
            <img className="carta-brand-logo" src="/images/logo-maria-germina-192.jpg" alt="" />
            <span><strong>MARÍA GERMINÁ</strong><small>CARTA DIGITAL</small></span>
          </a>
          <a className="nav-reserve" href={PHONE_LINK}><Phone size={17} /> Llamar</a>
        </header>
        <main className="qr-menu">
          <div className="section-heading">
            <div><p className="eyebrow">CARTA DIGITAL</p><h2>ELIGE TU TENTACIÓN</h2></div>
            <p>Carta tomada de las imágenes oficiales disponibles. Precios o textos ilegibles quedan pendientes de confirmar.</p>
          </div>
          <div className="menu-tools carta-tools">
            <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la carta" /></label>
            <div className="category-list">
              {cartaCategories.map((item) => (
                <button key={item} className={cartaCategory === item ? 'active' : ''} onClick={() => setCartaCategory(item)}>{item}</button>
              ))}
            </div>
          </div>
          <section
            className="carta-3d"
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (touchStart === null) return
              const difference = event.changedTouches[0].clientX - touchStart
              if (Math.abs(difference) > 45) changeDish(difference > 0 ? -1 : 1)
              setTouchStart(null)
            }}
          >
            <button className="carta-arrow carta-arrow-left" type="button" onClick={() => changeDish(-1)} aria-label="Plato anterior"><ArrowLeft /></button>
            <div className="carta-carousel" aria-live="polite">
              {cartaDishes.map((dish, index) => {
                const offset = index - cartaIndex
                const wrappedOffset =
                  offset > cartaDishes.length / 2 ? offset - cartaDishes.length :
                  offset < -cartaDishes.length / 2 ? offset + cartaDishes.length : offset
                return (
                  <motion.button
                    type="button"
                    key={dish.name}
                    className={`carta-plate ${wrappedOffset === 0 ? 'active' : ''}`}
                    onClick={() => setCartaIndex(index)}
                    animate={{
                      x: wrappedOffset * (window.innerWidth < 760 ? 155 : 280),
                      scale: wrappedOffset === 0 ? 1 : .72,
                      opacity: Math.abs(wrappedOffset) > 1 ? 0 : .72,
                      rotateY: wrappedOffset * -16,
                      zIndex: 10 - Math.abs(wrappedOffset),
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  >
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} />
                    ) : (
                      <div className="carta-typographic-plate"><UtensilsCrossed size={32} /><span>{dish.category}</span></div>
                    )}
                    <span className="carta-plate-name">{dish.name}</span>
                  </motion.button>
                )
              })}
            </div>
            <button className="carta-arrow carta-arrow-right" type="button" onClick={() => changeDish(1)} aria-label="Plato siguiente"><ArrowRight /></button>
          </section>
          {activeDish && (
            <motion.article className="carta-detail" key={activeDish.name} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div>
                <p className="eyebrow">{cartaCategory}</p>
                <h2>{activeDish.name}</h2>
                {activeDish.description && <p>{activeDish.description}</p>}
              </div>
              <strong>{activeDish.price || 'Precio pendiente de confirmar'}</strong>
              {activeDish.tags?.map((tag) => <span className="carta-tag" key={tag}>{tag}</span>)}
              <button type="button" onClick={() => setSelectedDish(activeDish)}>Ver ficha</button>
            </motion.article>
          )}
          <p className="verification-note carta-verification">Fotografías solo donde se corresponden con el plato verificado. Consulte alérgenos e ingredientes con el personal antes de pedir.</p>
        </main>
        {selectedDish && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedDish(null)}>
            <motion.div className="dish-modal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDish(null)} aria-label="Cerrar"><X /></button>
              {selectedDish.image
                ? <img src={selectedDish.image} alt={selectedDish.name} />
                : <div className="dish-modal-placeholder"><UtensilsCrossed size={42} /><span>{selectedDish.category}</span></div>}
              <div><small>{selectedDish.category}</small><h2>{selectedDish.name}</h2><p>{selectedDish.description}</p><strong>{selectedDish.price || 'Precio por confirmar'}</strong><p className="allergen-note">Fotografía e información pendientes de validar. Consulta alérgenos e ingredientes con el personal.</p></div>
            </motion.div>
          </div>
        )}
      </>
    )
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
          <a href="/carta" onClick={() => setMenuOpen(false)}>Carta</a>
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
              <a className="button button-primary" href="/carta">Ver carta <ArrowRight size={18} /></a>
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
          <a className="button button-dark" href="/carta">Descubre nuestra carta <ArrowRight size={18} /></a>
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
            <p>Consulta disponibilidad y ingredientes directamente en el restaurante. Precios pendientes de confirmar: compruébalos antes de publicar.</p>
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
          <a className="button button-light" href={PHONE_LINK}>Consulta tus necesidades <ArrowRight size={18} /></a>
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
            <p><Clock3 size={19} /> Horario publicado como referencia: martes–sábado 12:00–00:00 · domingo 12:00–17:00 · lunes cerrado. Confirmar antes de publicar.</p>
            <p className="verification-note">Dirección publicada como referencia. Verificar el número exacto y horario con el establecimiento.</p>
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
        <a href="/carta"><UtensilsCrossed size={19} /><span>Carta</span></a>
        <a href={PHONE_LINK}><Phone size={19} /><span>Llamar</span></a>
        <a href={MAPS_LINK} target="_blank" rel="noreferrer"><MapPin size={19} /><span>Cómo llegar</span></a>
      </div>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          {preparedRequest && <button className="toast-copy" onClick={copyPreparedRequest}>Copiar datos</button>}
          <button onClick={() => setNotice('')} aria-label="Cerrar"><X size={16} /></button>
        </div>
      )}

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
