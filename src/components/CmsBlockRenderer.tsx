/**
 * Componente: CmsBlockRenderer
 * 
 * Renderiza blocos CMS publicados no site público
 * Sprint CMS v1
 */

import { CmsBlock } from '@/hooks/useCmsContent';

interface CmsBlockRendererProps {
  block: CmsBlock;
  isPreview?: boolean;
}

export const CmsBlockRenderer = ({ block, isPreview = false }: CmsBlockRendererProps) => {
  const content = isPreview ? block.content_draft : block.content_published;

  if (!content) {
    return null;
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
            className={`inline-block px-6 py-3 rounded font-semibold transition ${
              content.style === 'primary'
                ? 'bg-[#D68E08] text-white hover:bg-[#B87A07]'
                : content.style === 'secondary'
                  ? 'border-2 border-[#D68E08] text-[#D68E08] hover:bg-[#D68E08] hover:text-white'
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {content.text}
          </a>
        </div>
      );

    case 'list':
      return (
        <ul className="my-4 ml-6 space-y-2 list-disc">
          {content.items?.map((item: string, index: number) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'faq':
      return (
        <div className="my-6 space-y-3">
          {content.items?.map((item: any, index: number) => (
            <details
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer group"
            >
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                {item.question}
                <span className="text-gray-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">{item.answer}</p>
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
