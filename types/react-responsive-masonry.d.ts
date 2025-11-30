declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  interface MasonryProps {
    columnsCount?: number;
    columnsCountBreakPoints?: Record<number, number>;
    gutter?: string;
    children?: ReactNode;
  }

  const Masonry: React.FC<MasonryProps>;
  export default Masonry;
}

