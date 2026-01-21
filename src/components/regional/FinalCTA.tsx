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
    <section className="relative min-h-[500px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/Raphael-Cataldo-Siston-Advogado-especialista-em-leilao-de-imoveis-RJ-SP-1.png')`,
          backgroundPosition: 'right center'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#191919] via-[#191919]/95 to-[#191919]/70" />
      </div>
      
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Formulário */}
            <div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-6">
                Receba nossa newsletter
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nome*"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-transparent border-[#d68e08] text-white placeholder:text-white/60 h-12 font-body"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-[#d68e08] text-white placeholder:text-white/60 h-12 font-body"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Telefone*"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="bg-transparent border-[#d68e08] text-white placeholder:text-white/60 h-12 font-body"
                  required
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold h-12 text-base"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR'}
                  {!loading && <Send className="h-4 w-4 ml-2" />}
                </Button>
              </form>

              {/* Contatos rápidos */}
              <div className="mt-8">
                <p className="font-display text-lg font-medium text-white mb-4">
                  Podemos ajudar a solucionar o seu caso!
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 text-[#d68e08] hover:text-[#b87a07] font-body transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={handleEmail}
                    className="flex items-center gap-2 text-[#d68e08] hover:text-[#b87a07] font-body transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </button>
                  <button 
                    onClick={handlePhone}
                    className="flex items-center gap-2 text-[#d68e08] hover:text-[#b87a07] font-body transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Telefone
                  </button>
                </div>
              </div>
            </div>

            {/* Espaço para a imagem do advogado (já no background) */}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
