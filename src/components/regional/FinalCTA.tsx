import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface FinalCTAProps {
  regionName?: string;
}

export function FinalCTA({ regionName }: FinalCTAProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleWhatsApp = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent(
      regionName 
        ? `Olá! Tenho interesse em imóveis em leilão em ${regionName}. Gostaria de mais informações.`
        : 'Olá! Gostaria de mais informações sobre imóveis em leilão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:contato@cataldosiston-adv.com.br?subject=Interesse em imóveis em leilão';
  };

  const handlePhone = () => {
    window.location.href = 'tel:+552131733795';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    // Simular envio - em produção, integrar com RD Station ou outro serviço
    try {
      // Aqui seria a integração com RD Station ou outro serviço de email marketing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cadastro realizado com sucesso! Em breve entraremos em contato.');
      setFormData({ nome: '', email: '', telefone: '' });
    } catch (error) {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      {/* Seção Newsletter com imagem do advogado */}
      <div className="relative min-h-[550px] flex items-center">
        {/* Background Image - Escritório com advogado */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('/mesa-escritorio-cataldo-siston-advogados.jpg.webp')`,
          }}
        >
          {/* Dark overlay com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191919]/95 via-[#191919]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Formulário - Lado esquerdo */}
              <div className="max-w-md">
                <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-2">
                  Receba nossa newsletter
                </h2>
                
                <p className="font-body text-[#d68e08] text-sm mb-6">
                  Oportunidades de negócio, decisões, artigos, cases, etc.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-body mb-1">Nome*</label>
                    <Input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="bg-transparent border-white/50 text-white placeholder:text-white/40 h-11 font-body focus:border-[#d68e08]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-body mb-1">Email*</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-white/50 text-white placeholder:text-white/40 h-11 font-body focus:border-[#d68e08]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-body mb-1">Telefone*</label>
                    <Input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="bg-transparent border-white/50 text-white placeholder:text-white/40 h-11 font-body focus:border-[#d68e08]"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold h-12 text-base uppercase tracking-wider"
                  >
                    {loading ? 'ENVIANDO...' : 'ENVIAR'}
                    {!loading && <Send className="h-4 w-4 ml-2" />}
                  </Button>
                </form>

                {/* Texto de privacidade */}
                <p className="font-body text-white/60 text-xs mt-4">
                  Prometemos não utilizar suas informações de contato para enviar qualquer tipo de SPAM.
                </p>
              </div>

              {/* Espaço para a imagem do advogado (já no background) */}
              <div className="hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de contato inferior - Estilo do site institucional */}
      <div className="bg-[#3c3c3c]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Texto */}
            <div>
              <h3 className="font-display text-xl md:text-2xl font-medium text-white">
                Podemos ajudar a solucionar o seu caso!
              </h3>
              <p className="font-body text-[#d68e08] text-sm">
                Entre em contato conosco
              </p>
            </div>

            {/* Ícones de contato */}
            <div className="flex items-center gap-6">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
              <button 
                onClick={handleEmail}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </button>
              <button 
                onClick={handlePhone}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="Telefone"
              >
                <Phone className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
