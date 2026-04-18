// lib/notion.ts

import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

// 1. The Official Client (For querying the Master Directory)
export const officialNotion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 2. The Unofficial Wrapper (For fetching rich page content for rendering)
export const notionWrapper = new NotionAPI();

/**
 * Looks up the Root Page ID for a specific domain from your Master Directory.
 */
export async function getTenantConfig(domain: string) {
  const masterDirectoryId = process.env.NOTION_MASTER_DIRECTORY_ID;

  if (!masterDirectoryId) {
    throw new Error('NOTION_MASTER_DIRECTORY_ID is not defined in environment variables.');
  }

  try {
    const response = await officialNotion.databases.query({
      database_id: masterDirectoryId,
      filter: {
        property: 'Domain',
        title: { equals: domain },
      },
    });

    if (response.results.length > 0) {
      const page = response.results[0] as any;
      const props = page.properties;
      return {
        domain: domain,
        name: props['Site Name']?.rich_text[0]?.plain_text || 'Hegedus Hub',
        rootPageId: props['Root Page ID']?.rich_text[0]?.plain_text,
      };
    }
    return null; // No tenant found
  } catch (error) {
    console.error(`[Error] Failed to fetch tenant config for ${domain}:`, error);
    return null;
  }
}

/**
 * Fetches the rich blocks for a specific Notion page so react-notion-x can render it.
 */
export async function getPageContent(pageId: string) {
  try {
    const recordMap = await notionWrapper.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error(`[Error] Failed to fetch page content for ID ${pageId}:`, error);
    throw error;
  }
}