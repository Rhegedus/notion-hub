// app/tenant/[domain]/[[...pageId]]/page.tsx - Dynamic page component for tenant-specific Notion pages

import { notFound } from 'next/navigation';
import { getTenantConfig, getPageContent } from '@/lib/notion';
import NotionPageRenderer from '@/components/NotionPageRenderer';

// We define our Promise params to include the optional pageId array
type Params = Promise<{ domain: string; pageId?: string[] }>;

export default async function TenantHomePage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const decodedDomain = decodeURIComponent(resolvedParams.domain);
  
  // 1. Did the user click a subpage? (e.g., rhegedus.com/12345abcdef)
  // If yes, 'pageId' will be an array containing the Notion ID.
  const subPageId = resolvedParams.pageId ? resolvedParams.pageId[0] : null;

  let targetPageId = subPageId;

  // 2. If NO subpage was clicked, we are at the Root Domain. Look it up!
  if (!targetPageId) {
    const tenantConfig = await getTenantConfig(decodedDomain);
    
    if (!tenantConfig || !tenantConfig.rootPageId) {
      console.error(`[Error] No tenant config found for domain: ${decodedDomain}`);
      return notFound(); 
    }
    targetPageId = tenantConfig.rootPageId;
  }

  try {
    // 3. Fetch whichever ID we resolved (either the subpage or the root page)
    const recordMap = await getPageContent(targetPageId);

    return (
      <main className="min-h-screen">
        <NotionPageRenderer recordMap={recordMap} />
      </main>
    );
  } catch (error) {
    console.error(`[Error] Failed to render page ID ${targetPageId}:`, error);
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <h1>Content Unavailable. Please check logs.</h1>
      </div>
    );
  }
}