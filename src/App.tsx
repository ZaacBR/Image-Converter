import { WebpConverter } from './components/WebpConverter'
import { motion } from 'motion/react'

const TICKER_ITEMS = [
  'WebP',
  'Otimização',
  'Performance',
  'LCP',
  'SEO',
  'PNG / JPEG',
  'Transparência',
  'Qualidade ajustável',
  'Privacidade local',
]

export default function App() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="min-h-svh bg-background pb-40">
      <header className="border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.65rem] text-primary font-bold tracking-[0.3em] uppercase mb-4">
              Ferramenta · Portfolio ZAAC
            </p>
            <p className="font-mono text-[0.6rem] text-on-surface-variant uppercase tracking-widest max-w-md leading-relaxed">
              Stack alinhada: React · TypeScript · Tailwind v4 · Motion · Vite
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[0.6rem] tracking-widest font-bold border border-outline-variant px-3 py-1.5 uppercase font-sans">
              Sem upload servidor
            </span>
            <span className="text-[0.6rem] tracking-widest font-bold border border-outline-variant px-3 py-1.5 uppercase font-sans">
              WebP
            </span>
          </div>
        </div>
      </header>

      <section className="pt-8 pb-16 md:pt-10 md:pb-20 border-b border-outline-variant bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WebpConverter />
          </motion.div>
        </div>
      </section>

      <section className="py-28 md:py-32">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="mb-20 md:mb-24"
          >
            <h1 className="type-giant font-display uppercase tracking-tighter text-on-surface mb-10">
              WebP.
            </h1>
            <div className="w-full h-[1px] bg-outline-variant mb-12 max-w-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7">
                <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-on-surface mb-8 leading-none">
                  Conversor editorial
                </h2>
                <p className="text-xl font-sans text-on-surface-variant leading-relaxed max-w-2xl">
                  Transforme imagens raster em WebP direto no navegador — ideal
                  para portfólios, produtos e landing pages que precisam de
                  velocidade real.
                </p>
              </div>
              <div className="lg:col-span-5 border-l border-outline-variant pl-8">
                <div className="grid grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    <div className="text-4xl md:text-5xl font-display font-black mb-2 text-primary">
                      100%
                    </div>
                    <div className="text-[0.55rem] uppercase tracking-[0.2em] text-on-surface font-bold leading-tight">
                      Dados no
                      <br />
                      seu dispositivo
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="text-4xl md:text-5xl font-display font-black mb-2 text-tertiary">
                      Ajuste
                    </div>
                    <div className="text-[0.55rem] uppercase tracking-[0.2em] text-on-surface font-bold leading-tight">
                      Controle fino
                      <br />
                      de qualidade
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-outline-variant py-10 bg-surface-container-low">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-on-surface-variant shrink-0"
            >
              <span className="w-1 h-1 bg-primary inline-block rounded-full" />
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl"
          >
            <h2 className="text-[0.65rem] text-primary font-bold tracking-[0.3em] uppercase mb-8">
              O fluxo
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-12">
              Do arquivo à entrega.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Importar',
                  body: 'Selecione ou arraste imagens — PNG, JPEG e outros formatos comuns.',
                },
                {
                  step: '02',
                  title: 'Calibrar',
                  body: 'Defina a qualidade WebP antes de gerar os arquivos finais.',
                },
                {
                  step: '03',
                  title: 'Exportar',
                  body: 'Baixe os resultados prontos para o build estático ou CMS.',
                },
              ].map((b, i) => (
                <motion.article
                  key={b.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-outline-variant bg-surface p-10 group hover:border-primary transition-colors duration-500"
                >
                  <div className="w-8 h-[2px] bg-primary mb-8" />
                  <p className="font-mono text-[0.6rem] text-primary font-bold uppercase tracking-[0.25em] mb-4">
                    {b.step}
                  </p>
                  <h4 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface mb-4">
                    {b.title}
                  </h4>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                    {b.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="bg-primary text-on-primary py-32 px-8 flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter max-w-4xl mx-auto leading-none mb-12">
          Performance é identidade.
        </h2>
        <p className="font-sans text-sm text-on-primary/80 max-w-xl mx-auto mb-12 leading-relaxed">
          Use WebP em hero sections, grids de projeto e thumbnails — menos
          peso, mais clareza visual, alinhado ao minimalismo editorial do
          sistema ZAAC.
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .querySelector('[data-converter-root]')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="bg-black text-white font-sans font-bold px-12 py-5 uppercase tracking-widest text-xs transition-transform hover:scale-105"
        >
          Voltar ao conversor
        </button>
      </motion.div>
    </div>
  )
}
