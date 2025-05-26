declare module 'react-router-hash-link' {
  import * as React from 'react';
  import { LinkProps } from 'react-router-dom';

  export interface HashLinkProps extends LinkProps {
    scroll?: (el: HTMLElement) => void;
    smooth?: boolean;
  }

  export const HashLink: React.FC<HashLinkProps>;
}