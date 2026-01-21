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
    
    try {
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
      <div className="relative min-h-[500px] overflow-hidden">
        {/* Background escuro base */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url('/bg-newsletter.jpg.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-[#191919]/80" />
        </div>
        
        {/* Imagem do advogado no lado direito */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <img 
            src="/foto-recortada-cataldo.png"
            alt="Raphael Cataldo Siston"
            className="absolute right-0 bottom-0 h-full object-contain object-right-bottom"
            style={{ maxHeight: '100%' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2021/09/foto-recortada-cataldo.png.webp';
            }}
          />
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

              {/* Espaço para a imagem do advogado (posicionada absolutamente) */}
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

            {/* Ícones de contato - estilo outline como no site institucional */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button 
                onClick={handleEmail}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </button>
              <button 
                onClick={handlePhone}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[#d68e08] text-[#d68e08] hover:bg-[#d68e08] hover:text-white transition-all"
                aria-label="Telefone"
              >
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
