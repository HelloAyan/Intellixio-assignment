"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { ProductModal } from "@/views/products/productModal/productModal";
import { BackToHome } from "@/components/backToHome/backToHome";
import { ProductList } from "@/views/products/productList/productList";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";
import { useSearchParams, usePathname } from 'next/navigation';

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Using Next.js's hooks to manage URL path and query parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });

  // Effect to handle URL and open modal based on query parameter
  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams]);

  const handleOpenModal = useCallback(
    (product: Product) => {
      // Update the URL to include the productId
      setSelectedProduct(product);
      const newUrl = `${pathname}?productId=${product.id}`;
      window.history.pushState({}, "", newUrl);
    },
    [pathname]
  );

  const handleCloseModal = useCallback(() => {
    // Clear the URL query parameter when closing the modal
    setSelectedProduct(null);
    window.history.pushState({}, "", pathname);
  }, [pathname]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
