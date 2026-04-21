// components/NotionPageRenderer.tsx - Component for rendering Notion pages using react-notion-x

"use client";

import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

// Using 'any' for recordMap to avoid strict TypeScript errors for now
export default function NotionPageRenderer({ recordMap }: { recordMap: any }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      fullPage={true} 
      darkMode={false} 
    />
  );
}