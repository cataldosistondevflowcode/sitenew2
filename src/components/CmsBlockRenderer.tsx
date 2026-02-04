/**
 * Componente: CmsBlockRenderer
 * 
 * Renderiza blocos CMS publicados no site publico
 * Sprint CMS v1
 * Sprint CMS v10 — Suporte a cards e steps compostos
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { Award, Shield, Headset, Star, Heart, Zap } from 'lucide-react';

interface CmsBlockRendererProps {
  block: CmsBlock;
  isPreview?: boolean;
}

// Mapa de icones para cards
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  award: Award,
  shield: Shield,
  headset: Headset,
  star: Star,
  heart: Heart,
  zap: Zap,
};

export const CmsBlockRenderer = ({ block, isPreview = false }: CmsBlockRendererProps) => {
  const content = isPreview ? block.content_draft : block.content_published;

  if (!content) {
    return null;
  }

  // Sprint v10: Detectar editores compostos pelo block_key
  const isCardList = block.block_key.includes('_cards') || block.block_key.includes('highlight_cards');
  const isStepList = block.block_key.includes('_steps') || block.block_key.includes('how_it_works_steps');

  // Renderizar cards compostos
  if (isCardList && block.block_type === 'list' && content.items) {
    return (
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.items.map((card: any, index: number) => {
          const IconComponent = ICON_MAP[card.icon] || Star;
          return (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.image_alt || card.title || 'Imagem do card'}
                  className="w-full h-36 object-cover rounded-lg mb-4 border"
                  loading="lazy"
                />
              ) : null}

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{card.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              {card.link && (
                <a
                  href={card.link}
                  className="inline-block mt-4 text-primary hover:underline text-sm font-medium"
                >
                  Saiba mais
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Renderizar steps compostos
  if (isStepList && block.block_type === 'list' && content.items) {
    return (
      <div className="my-6 space-y-6">
        {content.items.map((step: any, index: number) => (
          <div key={index} className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
              {step.number}
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  switch (block.block_type) {
    case 'text':
      return (
        <div className="my-4 text-base leading-relaxed text-gray-700">
          {content.value}
        </div>
      );

    case 'richtext':
      return (
        <div className="my-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.value }} />
      );

    case 'image':
      return (
        <div className="my-6">
          <img
            src={content.url}
            alt={content.alt || 'Imagem'}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
          {content.alt && <p className="text-sm text-gray-600 mt-2">{content.alt}</p>}
        </div>
      );

    case 'cta':
      return (
        <div className="my-6">
          <a
            href={content.url}
            target={content.target === '_blank' ? '_blank' : undefined}
            rel={content.target === '_blank' ? 'noopener noreferrer' : undefined}
            className={`inline-block px-6 py-3 rounded font-semibold transition ${
              content.style === 'primary'
                ? 'bg-[#D68E08] text-white hover:bg-[#B87A07]'
                : content.style === 'secondary'
                  ? 'border-2 border-[#D68E08] text-[#D68E08] hover:bg-[#D68E08] hover:text-white'
                  : content.style === 'warning'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : content.style === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : content.style === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-[#D68E08] text-white hover:bg-[#B87A07]'
            }`}
          >
            {content.text}
          </a>
        </div>
      );

    case 'list':
      const isOrdered = content.ordered === true;
      const listStyle = content.style || 'default';
      const ListTag = isOrdered ? 'ol' : 'ul';
      
      return (
        <ListTag className={`my-4 ml-6 space-y-2 ${
          isOrdered ? 'list-decimal' : listStyle === 'default' ? 'list-disc' : 'list-none'
        }`}>
          {content.items?.map((item: string, index: number) => (
            <li key={index} className="text-gray-700">
              {listStyle === 'checkmark' && <span className="mr-2">✓</span>}
              {listStyle === 'arrow' && <span className="mr-2">→</span>}
              {item}
            </li>
          ))}
        </ListTag>
      );

    case 'faq':
      const allowMultiple = content.allowMultiple === true;
      return (
        <div className={`my-6 space-y-3 ${allowMultiple ? 'faq-multiple' : 'faq-accordion'}`}>
          {content.items?.map((item: any, index: number) => (
            <details
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer group"
              {...(!allowMultiple && index > 0 ? { open: false } : {})}
            >
              <summary className="font-semibold text-gray-900 flex items-center justify-between select-none">
                {item.question}
                <span className="text-gray-600 group-open:rotate-180 transition ml-2 flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{item.answer}</p>
            </details>
          ))}
        </div>
      );

    case 'banner':
      return (
        <div className="my-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-900">{content.value}</p>
        </div>
      );

    default:
      return null;
  }
};
