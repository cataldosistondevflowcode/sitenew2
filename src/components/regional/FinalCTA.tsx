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
      <div className="relative min-h-[600px] overflow-hidden">
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
          <div className="absolute inset-0 bg-[#191919]/85" />
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
            <div className="grid md:grid-cols-2 gap-12">
              {/* Formulário - Lado esquerdo */}
              <div className="max-w-lg">
                <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-8">
                  Receba nossa newsletter
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campos com borda dourada e placeholder */}
                  <Input
                    type="text"
                    placeholder="Nome*"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-transparent border-[#d68e08] text-white placeholder:text-white/70 h-12 font-body focus:border-[#d68e08] focus:ring-[#d68e08]"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-transparent border-[#d68e08] text-white placeholder:text-white/70 h-12 font-body focus:border-[#d68e08] focus:ring-[#d68e08]"
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Telefone*"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-transparent border-[#d68e08] text-white placeholder:text-white/70 h-12 font-body focus:border-[#d68e08] focus:ring-[#d68e08]"
                    required
                  />
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold h-12 text-base uppercase tracking-wider"
                  >
                    {loading ? 'ENVIANDO...' : 'ENVIAR'}
                  </Button>
                </form>

                {/* Seção "Podemos ajudar" - dentro da mesma área escura */}
                <div className="mt-10">
                  <h3 className="font-display text-xl md:text-2xl font-medium text-white mb-4">
                    Podemos ajudar a solucionar o seu caso!
                  </h3>
                  
                  {/* Ícones de contato com texto abaixo */}
                  <div className="flex items-start gap-6">
                    <button 
                      onClick={handleWhatsApp}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span className="flex items-center justify-center w-10 h-10 text-[#d68e08] group-hover:text-white transition-colors">
                        <Phone className="h-6 w-6" />
                      </span>
                      <span className="font-body text-[#d68e08] text-sm">WhatsApp</span>
                    </button>
                    <button 
                      onClick={handleEmail}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span className="flex items-center justify-center w-10 h-10 text-[#d68e08] group-hover:text-white transition-colors">
                        <Mail className="h-6 w-6" />
                      </span>
                      <span className="font-body text-[#d68e08] text-sm">Email</span>
                    </button>
                    <button 
                      onClick={handlePhone}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span className="flex items-center justify-center w-10 h-10 text-[#d68e08] group-hover:text-white transition-colors">
                        <Phone className="h-6 w-6" />
                      </span>
                      <span className="font-body text-[#d68e08] text-sm">Telefone</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Espaço para a imagem do advogado (posicionada absolutamente) */}
              <div className="hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
