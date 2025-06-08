'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollFixer() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
    document.body.style.overflow = 'auto'; // Re-enable scroll
  }, [pathname]);

  return null;
}
