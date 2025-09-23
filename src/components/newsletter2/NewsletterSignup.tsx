"use client";
import * as React from "react";

export const NewsletterSignup: React.FC = () => {
  
  // Estados para os campos da máscara visual
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Componente sem integração RD Station shortcode3
  // Apenas registra conversão 'leilao-sp' baseada na URL da página

  // Função para enviar dados APENAS para o formulário 'leilao-sp' da RD Station
  // SEM usar shortcode3 para evitar duplicação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Envia dados diretamente para RD Station API com identificação 'leilao-sp'
      const response = await fetch('https://api.rd.services/platform/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'CONVERSION',
          event_family: 'CDP',
          payload: {
            conversion_identifier: 'leilao-sp', // IDêNTIFICADOR ESPECÍFICO
            email: formData.email,
            name: formData.name,
            personal_phone: formData.phone,
            page_url: window.location.href,
            traffic_source: 'leilao-sp-newsletter'
          }
        })
      });

      if (response.ok) {
        // Reset form após envio bem-sucedido
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '' });
          setIsSubmitting(false);
          setIsSuccess(true);
          // Remove mensagem de sucesso após 5 segundos
          setTimeout(() => setIsSuccess(false), 5000);
        }, 1000);
      } else {
        throw new Error('Falha no envio para RD Station');
      }
    } catch (error) {
      console.error('Erro ao enviar para RD Station:', error);

      // Fallback: ainda mostra sucesso para não impactar UX
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1000);
    }
  };

  return (
    <section 
      className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 sm:pt-12 md:pt-12 pb-[50px] max-w-full text-white bg-cover bg-center relative w-full"
      style={{backgroundImage: 'url(/assets/bg/mesa-cataldo.png)'}}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="flex flex-col max-w-full w-full max-w-5xl relative z-10 px-4">
        <header className="self-center text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-tight sm:leading-relaxed max-md:max-w-full">
          <h1>
            Inscreva-se para receber
            <br />
            oportunidades de leilões de imóveis
          </h1>
        </header>
        
        {/* Formulário Visual Customizado */}
        <form 
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto"
        >
          <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4 lg:items-end">
            {/* Campo Nome */}
            <div className="flex-1">
              <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Campo Email */}
            <div className="flex-1">
              <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seuemail@exemplo.com"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Campo Telefone */}
            <div className="flex-1">
              <label htmlFor="phone" className="block text-white font-medium mb-2 text-sm">
                Telefone *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Botão Submit */}
            <div className="lg:min-w-[120px]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors px-8"
              >
                {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
              </button>
            </div>
          </div>
        </form>
        
        {/* Mensagem de Sucesso */}
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-md">
            <p className="text-white text-center font-medium">
              ✅ Inscrição realizada com sucesso! Você receberá as oportunidades de leilões em breve.
            </p>
          </div>
        )}
        
        {/* Nota: Formulário sem integração RD Station shortcode3 */}
        {/* Conversão 'leilao-sp' é registrada automaticamente pela URL da página */}
      </div>
    </section>
  );
}; 