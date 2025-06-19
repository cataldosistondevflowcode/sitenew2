
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
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Caso tenha poucas páginas, mostra todas
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Caso tenha muitas páginas, mostra algumas e "..."
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
    <Pagination className="my-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }} 
            />
          </PaginationItem>
        )}
        
        {getPageNumbers().map((page, index) => (
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
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
