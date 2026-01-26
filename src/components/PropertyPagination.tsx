import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PropertyPagination: React.FC<PropertyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Função para gerar os números de página a exibir
  // Mobile: mostra menos páginas para evitar overflow
  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = isMobile ? 3 : 5;
    
    // Caso tenha poucas páginas, mostra todas
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    if (isMobile) {
      // Mobile: mostra apenas página atual e adjacentes
      if (currentPage === 1) {
        pages.push(1, 2, '...', totalPages);
      } else if (currentPage === totalPages) {
        pages.push(1, '...', totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
      return pages;
    }
    
    // Desktop: lógica original
    // Sempre mostrar a primeira página
    pages.push(1);
    
    // Lógica para decidir quais páginas mostrar no meio
    if (currentPage <= 3) {
      // Se estiver nas primeiras páginas
      pages.push(2, 3, 4, '...');
    } else if (currentPage >= totalPages - 2) {
      // Se estiver nas últimas páginas
      pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      // Se estiver no meio
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
    }
    
    // Sempre mostrar a última página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Pagination className="my-8 w-full max-w-full overflow-hidden">
      {/* Desktop Pagination */}
      <PaginationContent className="hidden sm:flex gap-2 flex-wrap justify-center">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              className="hover:bg-[#d68e08] hover:text-white hover:border-[#d68e08] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }} 
            />
          </PaginationItem>
        )}
        
        {getPageNumbers(false).map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <span className="flex h-9 w-9 items-center justify-center text-sm">
                ...
              </span>
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof page === 'number') {
                    onPageChange(page);
                  }
                }}
                isActive={page === currentPage}
                className={page === currentPage ? 
                  "border-2 border-[#d68e08] bg-[#d68e08] text-white hover:bg-[#b8780a] hover:border-[#b8780a] font-bold shadow-lg transform scale-110" : 
                  "hover:bg-gray-100 hover:border-gray-300 border border-gray-200 text-gray-700 font-medium hover:text-[#d68e08] transition-all"
                }
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              className="hover:bg-[#d68e08] hover:text-white hover:border-[#d68e08] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>

      {/* Mobile Pagination - Compacta */}
      <PaginationContent className="flex sm:hidden gap-1 flex-wrap justify-center max-w-full overflow-hidden px-2">
        {/* Botão Previous - apenas ícone no mobile */}
        <PaginationItem>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
              currentPage === 1 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                : 'border-gray-200 text-gray-700 hover:bg-[#d68e08] hover:text-white hover:border-[#d68e08]'
            }`}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </PaginationItem>
        
        {/* Números de página - versão mobile compacta */}
        {getPageNumbers(true).map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <span className="flex h-10 w-8 items-center justify-center text-sm text-gray-500">
                ...
              </span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  page === currentPage 
                    ? "border-2 border-[#d68e08] bg-[#d68e08] text-white" 
                    : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )}
          </PaginationItem>
        ))}
        
        {/* Botão Next - apenas ícone no mobile */}
        <PaginationItem>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
              currentPage === totalPages 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                : 'border-gray-200 text-gray-700 hover:bg-[#d68e08] hover:text-white hover:border-[#d68e08]'
            }`}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
