// lib/notion.ts - Notion API client and utility functions

import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

// The Unofficial Wrapper (Safe at top level)
export const notionWrapper = new NotionAPI();

export async function getTenantConfig(domain: string) {
  const masterDirectoryId = process.env.NOTION_MASTER_DIRECTORY_ID;
  const token = process.env.NOTION_TOKEN;

  if (!masterDirectoryId || !token) {
    throw new Error('Missing Notion environment variables.');
  }

  try {
    // IMMUNE TO TURBOPACK: We use native fetch instead of the official SDK
    const response = await fetch(`https://api.notion.com/v1/databases/${masterDirectoryId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28', // Standard Notion API version
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Domain',
          title: { equals: domain },
        },
      }),
      // Advanced Next.js feature: We can cache this lookup to make it blazing fast!
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      console.error(`[Notion API Error] Status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const page = data.results[0];
      const props = page.properties;
      return {
        domain: domain,
        name: props['Site Name']?.rich_text[0]?.plain_text || 'Hegedus Hub',
        rootPageId: props['Root Page ID']?.rich_text[0]?.plain_text,
      };
    }
    return null;
  } catch (error) {
    console.error(`[Error] Failed to fetch tenant config for ${domain}:`, error);
    return null;
  }
}

export async function getPageContent(pageId: string) {
  try {
    const recordMap = await notionWrapper.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error(`[Error] Failed to fetch page content for ID ${pageId}:`, error);
    throw error;
  }
}