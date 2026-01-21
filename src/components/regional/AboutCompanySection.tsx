export function AboutCompanySection() {
  return (
    <section 
      className="relative py-14 md:py-20 overflow-hidden"
      style={{
        backgroundImage: `url('/logo-background.jpg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay branco semi-transparente */}
      <div className="absolute inset-0 bg-white/80" />
      
      {/* Círculos decorativos - igual ao site institucional */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ebe5de] rounded-full opacity-60 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-1/4 w-52 h-52 bg-[#ebe5de] rounded-full opacity-40" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Título centralizado */}
        <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] font-medium text-[#191919] mb-12 text-center italic">
          Sobre
        </h2>
        
        {/* Layout: Foto à esquerda, conteúdo à direita */}
        <div className="grid md:grid-cols-[35%_1fr] gap-8 md:gap-12 items-end">
          {/* Foto do Advogado - com borda dourada no canto inferior esquerdo */}
          <div className="flex justify-center md:justify-start">
            <div className="relative inline-block">
              {/* Borda dourada decorativa - L invertido no canto inferior esquerdo */}
              <div 
                className="absolute bottom-0 left-0 w-[85%] h-[85%] border-l-4 border-b-4 border-[#d68e08] -translate-x-3 translate-y-3"
                style={{ zIndex: 0 }}
              />
              <img 
                src="https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2021/09/perfil-rafael-cataldo.jpg.webp"
                alt="Raphael Cataldo Siston - Advogado especialista em leilões de imóveis"
                className="relative z-10 w-full max-w-[380px] object-cover"
              />
            </div>
          </div>
          
          {/* Conteúdo */}
          <div className="text-[#191919]">
            <h3 className="font-display text-2xl md:text-3xl font-medium mb-4 italic">
              Raphael Cataldo Siston
            </h3>
            
            <p className="font-body text-[#333333] mb-6 leading-relaxed text-base md:text-lg">
              Advogado especialista em leilões de imóveis, com mais de 19 anos de experiência 
              em arrematações imobiliárias. Pós-graduado em direito imobiliário e em direito 
              processual civil.
            </p>
            
            {/* Assinatura */}
            <div className="mb-6">
              <img 
                src="https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2021/09/assinatura-cataldo.svg"
                alt="Assinatura de Cataldo Siston"
                className="h-20 md:h-24 object-contain"
              />
            </div>
            
            {/* OAB e Email */}
            <p className="font-body font-bold text-[#191919] mb-1">
              OAB/RJ nº 153.146
            </p>
            <a 
              href="mailto:raphael@cataldosiston-adv.com.br"
              className="font-body text-[#333333] hover:text-[#d68e08] transition-colors"
            >
              raphael@cataldosiston-adv.com.br
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
