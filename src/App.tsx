import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, MapPin,
  Menu as MenuIcon, Phone, Search, UtensilsCrossed, X
} from 'lucide-react'

const PHONE = '+34 854 70 51 67'
const PHONE_LINK = 'tel:+34854705167'
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Maria+Germina+Tapas+Calle+Flor+de+Albahaca+1+Sevilla'
const INSTAGRAM = 'https://www.instagram.com/mariagerminatapa/'
const INTRO_SCENE_DURATION_MS = 2500
const INTRO_DURATION_MS = INTRO_SCENE_DURATION_MS * 4
const INTRO_SCENES = [
  { kind: 'facade', image: '/images/1.jpg', alt: 'Fachada y entrada publicada en la web oficial', kicker: 'SEVILLA ESTE', title: 'María Germiná' },
  { kind: 'interlude', image: null, alt: '', kicker: 'TAPAS PARA COMPARTIR', title: 'Buenos momentos alrededor de la mesa' },
  { kind: 'gastronomy', image: '/images/2.jpg', alt: 'Fotografía gastronómica del sitio oficial; el plato no está identificado', kicker: 'GASTRONOMÍA DE LA CASA', title: 'Sabores para compartir' },
  { kind: 'endcard', image: null, alt: '', kicker: 'CARTA DIGITAL', title: 'Descubre nuestra carta' },
] as const

const TOUR_SCENES = [
  {
    image: '/images/1.jpg',
    title: 'Fachada y entrada',
    alt: 'Fachada de María Germiná Tapas en Sevilla Este',
    eyebrow: 'FACHADA Y ENTRADA',
    heading: 'Una casa de tapas en Sevilla Este.',
    description: 'Por ahora solo hay una fotografía verificada: la fachada y la entrada. No mostramos el interior, la barra, las mesas ni la terraza sin fotografías autorizadas del propietario.',
  },
] as const

type Dish = {
  name: string
  category?: string
  description?: string
  price?: string
  image?: string
  tags?: string[]
}

const dishes: Dish[] = [
  { name: 'Chicharrón de Cádiz', category: 'Chacinas', price: '3,95 €' },
  { name: 'Ensalada tropical', category: 'Algo ligerito', description: 'Con aguacate y mango.', price: 'Consultar precio' },
  { name: 'Langostinos al ajillo con huevo de codorniz', category: 'Más de lo nuestro', price: 'T 3,95 € · R 8,50 €' },
  { name: 'Papas bravas Braviolis', category: 'De la freidora', price: 'Consultar precio' },
]

const cartaCategories = [
  'Tapas frías',
  'Germinitos',
  'Menú infantil',
  'De la mar...',
  'De la freidora',
  'Carnívoros',
  'El Toke dulce',
  'Nuestra bodega',
  'Hablemos de vinos',
  'Chacinas',
  'Algo ligerito',
  'Más de lo nuestro',
  'Montaditos',
  'Vegano',
] as const

const cartaSections: Record<(typeof cartaCategories)[number], Dish[]> = {
  'Tapas frías': [],
  Germinitos: [
    { name: 'Anchoa y salmorejo', price: '2,50 €' },
    { name: 'Anchoa y queso de cabra', price: '2,50 €' },
    { name: 'Pincho de pollo', price: '2,50 €' },
    { name: 'Queso de cabra y cebolla caramelizada', price: '2,50 €' },
    { name: 'Bocadito de calamares en pan bao', price: '2,75 €' },
    { name: 'Brocheta', price: 'Consultar precio' },
    { name: 'Pollo con salsa caramelizada al PX', price: '2,50 €' },
    { name: 'Mini Germiná', price: '2,50 €' },
    { name: 'Queso cabrales con sardina ahumada', price: '2,50 €' },
    { name: 'Presa y miel', price: '2,50 €' },
  ],
  'Menú infantil': [
    { name: 'Solomillo de pollo crujiente con patatas y huevo frito', price: '3,75 €' },
    { name: 'Pinchito de pollo', price: '3,95 €' },
    { name: 'Tapa de croquetas', description: 'Puchero o jamón.', price: '3,95 €' },
    { name: 'Pollo rebozado', description: 'Con patatas fritas y huevo.', price: '6,50 €' },
    { name: 'Burguer con queso', description: 'Con patatas fritas.', price: '4,95 €' },
  ],
  'De la mar...': [
    { name: 'CangreBurger auténtica', price: '5,00 €' },
    { name: 'Lomo de bacalao confitado', description: 'A baja temperatura con piperrada.', price: '3,75 €' },
    { name: 'Pavía de gambones', price: '3,75 €' },
    { name: 'Pavía de merluza de pintxo', price: '4,75 €' },
    { name: 'Pulpo braseado', description: 'Con virutas de patata.', price: '7,50 €' },
    { name: 'Langostinos al ajillo a nuestro estilo', price: '3,75 €' },
    { name: 'Langostinos tenderete', price: '4,50 €' },
  ],
  'De la freidora': [
    { name: 'Taquitos de bacalao', price: 'Tapa 2,75 € · Compartir 7,00 €' },
    { name: 'Croquetas de chipirón', price: 'Tapa 3,00 € · Compartir 6,50 €' },
    { name: 'Croquetas de pulpo', price: 'Tapa 3,00 € · Compartir 6,50 €' },
    { name: 'Croquetas de cola de toro', price: 'Tapa 3,00 € · Compartir 6,50 €' },
    { name: 'Bravas Germiná', price: 'Tapa 2,50 € · Compartir 6,00 €' },
    { name: 'Choco frito', price: 'Tapa 2,75 € · Compartir 6,50 €' },
    { name: 'Ortigüillas de Chipiona', price: 'Media 7,00 € · Compartir 12,00 €' },
    { name: 'Tortillita de camarones de Sanlúcar', price: 'Consultar precio' },
    { name: 'Croquetas variadas', description: 'Puchero, cola de toro, chipirón en su tinta, jamón, boletus y trufa, queso azul y cebolla caramelizada, serranito, secreto y miel.', price: 'Consultar precio' },
    { name: 'Bocaditos fritos', description: 'Merluza, bacalao o cazón en adobo.', price: 'Consultar precio' },
    { name: 'Tiras de choco fritas', price: 'Consultar precio' },
    { name: 'Pavía XXL de merluza', price: 'Consultar precio' },
    { name: 'Papas bravas Braviolis', price: 'Consultar precio' },
    { name: 'Fingers de pollo artesanos', description: 'Con coulis de miel y mostaza.', price: 'Consultar precio' },
  ],
  Carnívoros: [
    { name: 'Fingers de pollo en tandori', price: 'Tapa 2,75 € · Compartir 6,00 €' },
    { name: 'Tataky de presa', description: 'Con crema de cabrales.', price: '4,00 €' },
    { name: 'Presa ibérica', description: 'Con crujiente de jamón.', price: '4,00 €' },
    { name: 'Brocheta de solomillo', description: 'Con verduras.', price: '4,50 €' },
    { name: 'Serrano especial del Chef', price: '5,00 €' },
    { name: 'Burger Angus', description: '200 g.', price: '5,00 €' },
    { name: 'Mini burger Angus completa', price: '3,75 €' },
    { name: 'Chuleta de vaca madurada', description: '25 días, 350 g aprox.', price: '16,95 €' },
    { name: 'Serrano del Chef con huevo', description: 'Lomo o pollo.', price: 'Consultar precio' },
    { name: 'Hamburguesa de txuleta de vaca', description: 'Con huevo.', price: 'Consultar precio' },
    { name: 'Brocheta XXL de solomillo de cerdo', description: 'Con verduras crujientes.', price: 'Consultar precio' },
    { name: 'Solomillo de cerdo al brandy o al gorgonzola', price: 'Consultar precio' },
    { name: 'Presa ibérica plancheada', description: 'Con taquitos de jamón.', price: 'Consultar precio' },
    { name: 'Churrasco de cerdo', description: 'Aprox. 300 g.', price: 'Consultar precio' },
    { name: 'Secreto ibérico al punto', price: 'Consultar precio' },
    { name: 'Lagartito ibérico o abanico ibérico', price: 'Consultar precio' },
    { name: 'Presa ibérica', price: 'Consultar precio' },
  ],
  'El Toke dulce': [
    { name: 'Coulant caliente de corazón líquido', price: '4,50 €' },
    { name: 'Brownie', description: 'Con sopa fría de chocolate blanco.', price: '3,75 €' },
    { name: 'Tarta de chocolate suizo Toblerone', price: '3,75 €' },
    { name: 'Tarta de almendras y chocolate', price: '3,75 €' },
    { name: 'Helado con nata y dulce de leche', price: '3,00 €' },
    { name: 'Sorbete de cítrico', description: 'Lemon pie o mango.', price: '3,00 €' },
    { name: 'Brownie casero', description: 'Con helado de vainilla, nata y sopa de chocolate blanco.', price: 'Consultar precio' },
    { name: 'Coulant de chocolate negro', description: 'Con helado de vainilla y nata.', price: 'Consultar precio' },
    { name: 'Tarta Milka', description: 'Con helado de vainilla y dulce de leche.', price: 'Consultar precio' },
    { name: 'Tarta de queso casera', description: 'Con helado de vainilla y nata. Elige el sirope.', price: 'Consultar precio' },
    { name: 'Copa de helado', description: '2 bolas de vainilla, dulce de leche y nata.', price: 'Consultar precio' },
  ],
  Chacinas: [
    { name: 'Chicharrón de Cádiz', price: '3,95 €' },
    { name: 'Plato de queso', price: '8,00 €' },
    { name: 'Plato de chorizo cular ibérico de bellota', price: '10,00 €' },
    { name: 'Plato de salchichón cular ibérico de bellota', price: '12,00 €' },
    { name: 'Plato de caña de lomo de bellota', price: '15,00 €' },
    { name: 'Tabla serrana o tabla de quesos surtidos', price: '15,00 €' },
  ],
  'Algo ligerito': [
    { name: 'Ensalada tropical', description: 'Con aguacate y mango.', price: 'Consultar precio' },
    { name: 'Ensalada César', description: 'Con pollo crujiente y virutas de parmesano.', price: 'Consultar precio' },
    { name: 'Ensaladilla del Chef', price: 'Consultar precio' },
    { name: 'Tartar de atún fresco', description: 'Con daditos de mango y aguacate.', price: '5,95 €' },
    { name: 'Mojama de Isla Cristina', description: 'Con AOVE.', price: 'Consultar precio' },
    { name: 'Anchoa 00', description: 'Mermelada de pimientos asados sobre crujiente de centeno (2 uds).', price: '4,50 €' },
    { name: 'Salmorejo Germiná', price: '4,25 €' },
  ],
  'Más de lo nuestro': [
    { name: 'Langostinos al ajillo con huevo de codorniz', price: 'T 3,95 € · R 8,50 €' },
    { name: 'Tataki de atún', description: 'Con coulis de soja y alga wakame.', price: '7,95 €' },
    { name: 'Pata de pulpo', description: 'Trenzado con pimentón y suave de patata.', price: '14,95 €' },
    { name: 'Chipirón plancheado', description: 'Con coulis de salsa verde.', price: 'T 4,95 € · R 8,95 €' },
    { name: 'Tosta crujiente con tataki de presa ibérica', description: 'Con gorgonzola y tomate.', price: 'Consultar precio' },
    { name: 'Lomo de lubina plancheada', price: '9,95 €' },
    { name: 'Noodles con vegetales y gambas o pollo', price: '6,75 €' },
    { name: 'Morcilla de cebolla', description: 'Con huevo frito.', price: '4,50 €' },
    { name: 'Cazuela Germiná', description: 'Con patatas fritas, huevo y chorizo.', price: '8,50 €' },
    { name: 'Tortilla ibérica', description: 'Con salmorejo y taquitos de jamón.', price: '5,50 €' },
    { name: 'Tortilla con salsa al brandy', price: 'Consultar precio' },
  ],
  Montaditos: [
    { name: 'Montadito de queso de cabra y salmón ahumado', price: '3,95 €' },
    { name: 'Montadito Mantecado Sevillano', price: '3,95 €' },
    { name: 'Montadito de pollo plancheado', description: 'Con virutas de jamón.', price: '3,95 €' },
  ],
  Vegano: [
    { name: 'Tartar de tofu', description: 'Con mango y aguacate.', price: '5,95 €' },
    { name: 'Falafel Burger Vegano 100%', price: '6,50 €' },
    { name: 'Noodles con vegetales', price: '6,25 €' },
    { name: 'Alcachofa confitada', description: 'Con parmentier y trufa con AOVE.', price: 'Consultar precio' },
    { name: 'Burger de alcaucil', price: '7,50 €' },
  ],
  'Nuestra bodega': [
    { name: 'Cerveza Cruz Campo', price: '1,00 €' },
    { name: 'Cerveza Cruzcampo Sin', price: '1,00 €' },
    { name: 'Cerveza Radler', price: '1,20 €' },
    { name: 'Cerveza Gran Reserva', price: '2,00 €' },
    { name: 'Refresco marca Coca-Cola', price: '1,50 €' },
    { name: 'Tónica Schweppes', price: '1,50 €' },
    { name: 'Bitter Kas', price: '1,50 €' },
    { name: 'Agua mineral 1 l', price: '1,50 €' },
    { name: 'Agua mineral pequeña', price: '1,00 €' },
    { name: 'Tinto de verano', price: '1,20 €' },
    { name: 'Cerveza en copa', price: '1,50 €' },
    { name: 'Nestea', price: '1,50 €' },
  ],
  'Hablemos de vinos': [
    { name: 'Ribera Protos Roble', price: 'Copa 2,30 € · Botella 12,00 €' },
    { name: 'Ribera Finca Resalso', price: 'Copa 2,35 € · Botella 12,00 €' },
    { name: 'Ribera TierraFiel Joven', price: 'Copa 2,00 € · Botella 10,00 €' },
    { name: 'Ribera Pesquera', price: 'Botella 19,00 €' },
    { name: 'Rioja Muga', price: 'Botella 18,00 €' },
    { name: 'Habla del Silencio', price: 'Botella 15,00 €' },
    { name: 'Vino de la Tierra Garum', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Luis Alegre Maceración Carbónica', price: 'Copa 2,10 € · Botella 10,00 €' },
    { name: 'Lágrimas de María Crianza', price: 'Copa 2,10 € · Botella 10,00 €' },
    { name: 'Ribera Finca Engalia Crianza', price: 'Copa 2,35 € · Botella 12,00 €' },
    { name: 'Ribera Finca Engalia Roble', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Rioja Azpilicueta', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Rioja Arrios Crianza', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Rioja Heredero Crianza', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Blanco Verdejo Yllera', price: 'Copa 2,10 € · Botella 10,00 €' },
    { name: 'Blanco Sauvignon ÁraBe', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Blanco Aguadulce', price: 'Copa 2,40 € · Botella 12,00 €' },
    { name: 'Blanco Verdejo Embrumas', price: 'Copa 2,35 € · Botella 12,00 €' },
    { name: 'Frizzante Yllera 5.5', price: 'Copa 2,40 € · Botella 11,00 €' },
    { name: 'Frizzante Atlántica Rosado', price: 'Copa 2,70 € · Botella 14,00 €' },
    { name: 'Frizzante Hacienda Casa del Valle', price: 'Copa 2,50 € · Botella 12,00 €' },
  ],
}

const populatedCartaCategories = cartaCategories.filter((category) => cartaSections[category].length > 0)

const cartaCategoryNotes: Partial<Record<(typeof cartaCategories)[number], string>> = {
  'Tapas frías': 'La foto física confirma esta categoría, pero la imagen pública disponible no permite leer con fiabilidad los nombres y precios. No se han inventado.',
  Germinitos: 'Transcripción de las líneas legibles de la foto física. El nombre de la brocheta no se distingue por completo.',
}

function displayPrice(price?: string) {
  return price || 'Consultar precio'
}

const favorites = [
  { name: 'Pavías de merluza XXL' },
  { name: 'Croquetas caseras' },
  { name: 'Patatas Braviolis' },
  { name: 'Langostinos al ajillo' },
  { name: 'Tataki de atún' },
]

function saveDemo(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function DishPhotoPlaceholder({ dishName, className = '' }: { dishName: string; className?: string }) {
  return (
    <div className={`dish-photo-placeholder ${className}`} role="img" aria-label={`Fotografía auténtica pendiente de verificar: ${dishName}`}>
      <UtensilsCrossed size={28} aria-hidden="true" />
      <small>Fotografía real pendiente</small>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [notice, setNotice] = useState('')
  const [preparedRequest, setPreparedRequest] = useState('')
  const [cartaCategory, setCartaCategory] = useState<(typeof cartaCategories)[number]>('De la mar...')
  const [cartaIndex, setCartaIndex] = useState(0)
  const [tourSceneIndex, setTourSceneIndex] = useState(0)
  const [introVisible, setIntroVisible] = useState(true)
  const [introSceneIndex, setIntroSceneIndex] = useState(0)
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
    }, INTRO_DURATION_MS)
    const sceneTimer = window.setInterval(() => {
      setIntroSceneIndex((current) => Math.min(current + 1, INTRO_SCENES.length - 1))
    }, INTRO_SCENE_DURATION_MS)
    return () => {
      window.clearTimeout(timer)
      window.clearInterval(sceneTimer)
    }
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
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase('es')
    const cartaDishes = normalizedQuery
      ? Object.entries(cartaSections).flatMap(([section, sectionDishes]) =>
          sectionDishes.map((dish) => ({ ...dish, category: section })),
        ).filter((dish) => {
          const searchable = `${dish.name} ${dish.description || ''} ${displayPrice(dish.price)}`
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('es')
          return searchable.includes(normalizedQuery)
        })
      : cartaSections[cartaCategory].map((dish) => ({ ...dish, category: cartaCategory }))
    const activeDish = cartaDishes[cartaIndex] || cartaDishes[0]
    const changeDish = (direction: number) => {
      if (cartaDishes.length < 2) return
      setCartaIndex((current) => (current + direction + cartaDishes.length) % cartaDishes.length)
    }
    const skipIntro = () => {
      sessionStorage.setItem('mg-carta-intro-seen', '1')
      setIntroVisible(false)
    }
    const selectCartaCategory = (item: (typeof cartaCategories)[number]) => {
      setCartaCategory(item)
      setQuery('')
    }
    const introScene = INTRO_SCENES[introSceneIndex]
    const isFinalIntroScene = introSceneIndex === INTRO_SCENES.length - 1
    const activeTourScene = TOUR_SCENES[tourSceneIndex]

    return (
      <>
        <AnimatePresence>
        {introVisible && (
          <motion.div
            className="carta-intro"
            aria-label="Presentación de María Germiná"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .45 }}
          >
            <div className="carta-intro-light" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={introSceneIndex}
                className={`carta-intro-scene carta-intro-scene-${introScene.kind}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : .8 }}
              >
                {introScene.image && (
                  <motion.img
                    className="carta-intro-scene-image"
                    src={introScene.image}
                    alt={introScene.alt}
                    decoding="async"
                    initial={reduceMotion ? false : { scale: 1.04 }}
                    animate={{ scale: reduceMotion ? 1 : 1.12 }}
                    transition={{ duration: INTRO_SCENE_DURATION_MS / 1000, ease: 'linear' }}
                  />
                )}
                <div className="carta-intro-scene-shade" />
              </motion.div>
            </AnimatePresence>
            <div className="carta-intro-content">
              <motion.img
                className="carta-intro-logo"
                src="/images/logo-maria-germina.jpg"
                alt="María Germiná Tapas"
                initial={reduceMotion ? false : { opacity: 0, scale: .92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: .8 }}
              />
              <p className="carta-intro-kicker">MARÍA GERMINÁ · SEVILLA ESTE</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="carta-intro-caption"
                  key={introScene.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : .4 }}
                >
                  <p>{introScene.kicker}</p>
                  <h1>{introScene.title}</h1>
                </motion.div>
              </AnimatePresence>
              {isFinalIntroScene && (
                <a className="carta-intro-explore" href="#carta-menu" onClick={skipIntro}>
                  Explorar carta <ArrowRight size={17} />
                </a>
              )}
            </div>
            <button className="carta-intro-skip" type="button" onClick={skipIntro}>Saltar introducción</button>
          </motion.div>
        )}
        </AnimatePresence>
        <header className="qr-header">
          <a className="brand" href="/" aria-label="Volver al inicio">
            <img className="carta-brand-logo" src="/images/logo-maria-germina.jpg" alt="" />
            <span><strong>MARÍA GERMINÁ</strong><small>CARTA DIGITAL</small></span>
          </a>
          <a className="nav-reserve" href={PHONE_LINK}><Phone size={17} /> Llamar</a>
        </header>
        <section className="venue-tour" aria-labelledby="venue-tour-title">
          <div className="venue-tour-heading">
            <p className="eyebrow">UNA MIRADA A MARÍA GERMINÁ</p>
            <h1 id="venue-tour-title">CONOCE MARÍA GERMINÁ</h1>
            <p>Un recorrido solo puede enseñar los espacios que cuentan con fotografías reales verificables.</p>
          </div>
          <div className="venue-tour-panel">
            {activeTourScene && (
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  className="venue-tour-scene"
                  key={activeTourScene.title}
                  initial={reduceMotion ? false : { opacity: 0, scale: .98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : .6 }}
                >
                  <img src={activeTourScene.image} alt={activeTourScene.alt} loading="lazy" decoding="async" />
                  <figcaption><span>ESCENA {String(tourSceneIndex + 1).padStart(2, '0')} / {String(TOUR_SCENES.length).padStart(2, '0')}</span><strong>{activeTourScene.title}</strong></figcaption>
                </motion.figure>
              </AnimatePresence>
            )}
            <div className="venue-tour-copy">
              <p className="eyebrow">{activeTourScene?.eyebrow}</p>
              <h2>{activeTourScene?.heading}</h2>
              <p>{activeTourScene?.description}</p>
              <div className="venue-tour-progress" role="progressbar" aria-label="Progreso del recorrido" aria-valuemin={1} aria-valuemax={TOUR_SCENES.length} aria-valuenow={tourSceneIndex + 1}>
                {TOUR_SCENES.map((scene, index) => <span className={index === tourSceneIndex ? 'active' : ''} key={scene.title} />)}
              </div>
              <div className="venue-tour-controls">
                <button type="button" disabled={tourSceneIndex === 0} onClick={() => setTourSceneIndex((index) => Math.max(0, index - 1))} aria-label="Escena anterior"><ArrowLeft size={17} /></button>
                <span>{String(tourSceneIndex + 1).padStart(2, '0')} / {String(TOUR_SCENES.length).padStart(2, '0')} · {activeTourScene?.title}</span>
                <button type="button" disabled={tourSceneIndex === TOUR_SCENES.length - 1} onClick={() => setTourSceneIndex((index) => Math.min(TOUR_SCENES.length - 1, index + 1))} aria-label="Escena siguiente"><ArrowRight size={17} /></button>
              </div>
              <div className="venue-tour-actions">
                <a className="button button-primary" href="#carta-menu">Ver carta <ArrowRight size={17} /></a>
                <a className="button button-ghost-dark" href={MAPS_LINK} target="_blank" rel="noreferrer">Cómo llegar <MapPin size={17} /></a>
                <a className="button button-ghost-dark" href={PHONE_LINK}><Phone size={17} /> Llamar para reservar</a>
              </div>
            </div>
          </div>
        </section>
        <main className="qr-menu" id="carta-menu">
          <div className="section-heading">
            <div><p className="eyebrow">CARTA DIGITAL</p><h2>ELIGE TU TENTACIÓN</h2></div>
            <p>Consulta la carta por categorías o busca un plato. Los precios que requieren confirmación se indican como «Consultar precio».</p>
          </div>
          <div className="menu-tools carta-tools">
            <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => { setCartaIndex(0); setQuery(event.target.value) }} placeholder="Buscar en toda la carta" /></label>
            <div className="category-list">
              {populatedCartaCategories.map((item) => (
                <button key={item} className={!normalizedQuery && cartaCategory === item ? 'active' : ''} onClick={() => selectCartaCategory(item)} aria-pressed={!normalizedQuery && cartaCategory === item}>
                  {item}<span className="category-count">{cartaSections[item].length}</span>
                </button>
              ))}
            </div>
          </div>
          {cartaDishes.length > 0 ? <section
            className="carta-3d"
            role="region"
            aria-label={`Platos de ${normalizedQuery ? 'la búsqueda' : cartaCategory}`}
            tabIndex={0}
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (touchStart === null) return
              const difference = event.changedTouches[0].clientX - touchStart
              if (Math.abs(difference) > 45) changeDish(difference > 0 ? -1 : 1)
              setTouchStart(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') changeDish(-1)
              if (event.key === 'ArrowRight') changeDish(1)
            }}
          >
            <div className="carta-count">{normalizedQuery ? 'RESULTADOS DE BÚSQUEDA' : cartaCategory}<span>{cartaIndex + 1} / {cartaDishes.length}</span></div>
            <button className="carta-arrow carta-arrow-left" type="button" onClick={() => changeDish(-1)} aria-label="Plato anterior" disabled={cartaDishes.length < 2}><ArrowLeft /></button>
            <div className="carta-carousel" aria-live="polite">
              {cartaDishes.map((dish, index) => {
                const offset = index - cartaIndex
                const wrappedOffset =
                  offset > cartaDishes.length / 2 ? offset - cartaDishes.length :
                  offset < -cartaDishes.length / 2 ? offset + cartaDishes.length : offset
                return { dish, index, wrappedOffset }
              }).filter(({ wrappedOffset }) => Math.abs(wrappedOffset) <= 1).map(({ dish, index, wrappedOffset }) => {
                return (
                  <motion.button
                    type="button"
                    key={`${dish.category}-${dish.name}`}
                    className={`carta-plate ${wrappedOffset === 0 ? 'active' : ''}`}
                    onClick={() => setCartaIndex(index)}
                    tabIndex={Math.abs(wrappedOffset) > 1 ? -1 : 0}
                    animate={{
                      x: wrappedOffset * (window.innerWidth < 760 ? 155 : 280),
                      scale: wrappedOffset === 0 ? 1 : .72,
                      opacity: Math.abs(wrappedOffset) > 1 ? 0 : .72,
                      rotateY: wrappedOffset * -16,
                      zIndex: 10 - Math.abs(wrappedOffset),
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  >
                    <div className={`carta-platter ${wrappedOffset === 0 ? 'active' : ''}`} aria-hidden="true">
                      <div className="carta-platter-face">
                        {dish.image
                          ? <img className="carta-platter-photo" src={dish.image} alt="" loading="lazy" decoding="async" />
                          : <div className="carta-photo-placeholder"><UtensilsCrossed size={22} /><small>Foto real pendiente</small></div>}
                        <span>{dish.category}</span>
                      </div>
                      <div className="carta-platter-face back"><span>{dish.category}</span></div>
                    </div>
                    <span className="carta-plate-name">{dish.name}</span>
                  </motion.button>
                )
              })}
            </div>
            <button className="carta-arrow carta-arrow-right" type="button" onClick={() => changeDish(1)} aria-label="Plato siguiente" disabled={cartaDishes.length < 2}><ArrowRight /></button>
          </section> : <div className="carta-no-results">{normalizedQuery ? `No hay platos que coincidan con «${query}».` : cartaCategoryNotes[cartaCategory] || 'No hay platos disponibles en esta categoría.'}</div>}
          {activeDish && (
            <motion.article className="carta-detail" key={`${activeDish.category}-${activeDish.name}`} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div>
                <p className="eyebrow">{activeDish.category}</p>
                <h2>{activeDish.name}</h2>
                {activeDish.description && <p>{activeDish.description}</p>}
              </div>
              <strong className="menu-price">{displayPrice(activeDish.price)}</strong>
              {activeDish.tags?.map((tag) => <span className="carta-tag" key={tag}>{tag}</span>)}
              <button type="button" onClick={() => setSelectedDish(activeDish)}>Ver ficha</button>
            </motion.article>
          )}
          <p className="verification-note carta-verification">Las fotografías específicas de los platos están pendientes de verificación. Consulta disponibilidad, ingredientes y alérgenos con el personal.</p>
        </main>
        <nav className="mobile-bar carta-mobile-bar" aria-label="Accesos rápidos de la carta">
          <a href="#carta-menu"><UtensilsCrossed size={19} /><span>Carta</span></a>
          <a href={PHONE_LINK}><Phone size={19} /><span>Llamar</span></a>
          <a href={MAPS_LINK} target="_blank" rel="noreferrer"><MapPin size={19} /><span>Cómo llegar</span></a>
        </nav>
        {selectedDish && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedDish(null)}>
            <motion.div className="dish-modal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDish(null)} aria-label="Cerrar"><X /></button>
              {selectedDish.image
                ? <img src={selectedDish.image} alt={selectedDish.name} />
                : <DishPhotoPlaceholder dishName={selectedDish.name} className="dish-modal-placeholder" />}
              <div><small>{selectedDish.category}</small><h2>{selectedDish.name}</h2>{selectedDish.description && <p>{selectedDish.description}</p>}<strong className="menu-price">{displayPrice(selectedDish.price)}</strong><p className="allergen-note">Fotografía e información pendientes de validar. Consulta alérgenos e ingredientes con el personal.</p></div>
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
            <img src="/images/1.jpg" alt="Fachada de María Germiná Tapas" />
            <div className="hero-seal"><span>BUEN<br />AMBIENTE</span></div>
          </div>
        </section>

        <section className="scene-section" id="experiencia">
          <div className="scene-heading">
            <p className="eyebrow">LA MESA ESTÁ SERVIDA</p>
            <h2>DE TAPEO SE COMPARTE.</h2>
            <p>Cinco tentaciones para empezar. Muchas más razones para volver.</p>
          </div>
          <div className="featured-menu-stage">
            <div className="featured-menu-board">
              <div className="featured-menu-copy">
                <p className="eyebrow">SELECCIÓN DE LA CARTA</p>
                <h3>Cinco formas de empezar.</h3>
                <p>Las fotografías auténticas de estos platos están pendientes de recibir y verificar.</p>
              </div>
              <div className="featured-menu-list" role="list" aria-label="Platos destacados sin fotografía asignada">
                {favorites.map((dish, index) => (
                  <motion.div
                    className="featured-menu-item"
                    role="listitem"
                    key={dish.name}
                    initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: .4 }}
                    transition={{ duration: .5, delay: index * .08 }}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{dish.name}</strong>
                    <ChevronRight size={17} aria-hidden="true" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <a className="button button-dark" href="/carta">Descubre nuestra carta <ArrowRight size={18} /></a>
        </section>

        <section className="house-section" id="casa">
          <div className="house-images">
            <img className="house-main" src="/images/2.jpg" alt="Fotografía gastronómica publicada en la web oficial; plato sin identificar" />
            <img className="house-detail" src="/images/photo-6.jpg" alt="Fotografía de la carta física de María Germiná Tapas" />
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
            <p>Consulta disponibilidad, ingredientes y precios vigentes directamente con el restaurante.</p>
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
                <div className="dish-image">
                  {dish.image
                    ? <img src={dish.image} alt={dish.name} loading="lazy" />
                    : <DishPhotoPlaceholder dishName={dish.name} />}
                  {dish.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="dish-card-copy">
                  <small>{dish.category}</small>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <strong className="menu-price">{displayPrice(dish.price)}</strong>
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
            <p>Esta demo guarda los datos solo en este navegador: no los envía al restaurante ni confirma una reserva. Llama para gestionar la solicitud.</p>
            <form onSubmit={(event) => submitDemo(event, 'maria-germina-reservation')}>
              <div className="form-grid">
                <label>Nombre<input name="name" required placeholder="Tu nombre" /></label>
                <label>Teléfono<input name="phone" required type="tel" placeholder="+34" /></label>
                <label>Fecha<input name="date" required type="date" /></label>
                <label>Hora<input name="time" required type="time" /></label>
                <label>Comensales<input name="guests" required type="number" min="1" placeholder="2" /></label>
                <label>Observaciones<textarea name="notes" placeholder="Alergias o preferencias" /></label>
              </div>
              <button className="button button-primary" type="submit">Guardar solicitud local <ArrowRight size={18} /></button>
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
            <p className="demo-notice">La consulta se guarda solo en este navegador; no se envía al restaurante ni confirma disponibilidad.</p>
            <button className="button button-dark" type="submit">Guardar consulta local <ArrowRight size={18} /></button>
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
            <p><Clock3 size={19} /> Horario publicado como referencia: martes–sábado 12:00–00:00 · domingo 12:00–17:00 · lunes cerrado. Consulta el horario actualizado con el establecimiento.</p>
            <p className="verification-note">Dirección y horario publicados como referencia; confirma los detalles vigentes antes de desplazarte.</p>
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
            {selectedDish.image
              ? <img src={selectedDish.image} alt={selectedDish.name} />
              : <DishPhotoPlaceholder dishName={selectedDish.name} className="dish-modal-placeholder" />}
            <div>
              <small>{selectedDish.category}</small>
              <h2>{selectedDish.name}</h2>
              {selectedDish.description && <p>{selectedDish.description}</p>}
              <strong className="menu-price">{displayPrice(selectedDish.price)}</strong>
              <p className="allergen-note">Información de alérgenos e ingredientes disponible consultando al personal.</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
