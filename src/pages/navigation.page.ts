/**
 * src/pages/navigation.page.ts
 *
 * NavigationPage models the site's primary navigation.
 * Uses semantic role-based selectors and avoids site-specific class names.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface NavLinkInfo {
  text: string;
  href: string;
}

export interface LinkCheckResult {
  url: string;
  status: number;
  ok: boolean;
}

export class NavigationPage extends BasePage {
  // ── Nav detection ────────────────────────────────────────────────────────────

  /**
   * Return the primary navigation locator.
   * Tries semantic nav/role first, then common Avada/WordPress class patterns.
   */
  private getNavLocator(): Locator {
    return this.page.locator(
      'nav, [role="navigation"], #nav, #main-nav, .fusion-main-menu, [class*="main-menu"], [class*="main-nav"]'
    ).first();
  }

  /**
   * Return true if navigation is accessible on the page.
   * Checks semantic nav element first; falls back to header link presence
   * for themes (e.g. Avada/Fusion Builder) that omit semantic nav markup.
   */
  async isNavVisible(): Promise<boolean> {
    const nav = this.getNavLocator();
    if (await nav.count() > 0 && await nav.isVisible()) return true;

    // Avada/Fusion Builder: nav links live in header divs without a <nav> element.
    // If the header contains any links the navigation is present and accessible.
    const headerLinks = this.page.locator('header a[href]');
    return (await headerLinks.count()) > 0;
  }

  // ── Nav links ────────────────────────────────────────────────────────────────

  /**
   * Return primary navigation links (list-item anchors only).
   * Scopes to `li > a` to exclude standalone CTAs that live in the same
   * nav container but aren't menu items. Filters non-navigable protocols.
   */
  async getNavLinks(): Promise<NavLinkInfo[]> {
    const nav = this.getNavLocator();
    if (await nav.count() === 0) return [];

    // li > a scopes to menu items; falls back to all a[href] if none found
    let links = nav.locator('li > a[href]');
    if (await links.count() === 0) {
      links = nav.locator('a[href]');
    }

    const count = await links.count();
    const results: NavLinkInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = ((await link.textContent()) ?? '').trim();
      const href = (await link.getAttribute('href')) ?? '';

      // Skip empty, anchor-only, non-navigable-protocol, or javascript: links
      if (!href || href === '#') continue;
      if (/^(javascript|mailto|tel|sms):/i.test(href)) continue;

      results.push({ text, href });
    }

    return results;
  }

  /**
   * Click a navigation item by its visible text.
   * Uses a case-insensitive partial match.
   */
  async clickNavItem(text: string): Promise<void> {
    const nav = this.getNavLocator();
    const link = nav.getByRole('link', { name: text });
    await link.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Mobile menu ──────────────────────────────────────────────────────────────

  /**
   * Return the mobile hamburger / menu toggle locator, or null if not found.
   * Searches for common patterns: button with aria-label containing "menu",
   * elements with class containing "hamburger", "menu-toggle", "nav-toggle".
   */
  async getMobileMenuToggle(): Promise<Locator | null> {
    const candidates = [
      this.page.getByRole('button', { name: /menu|navigation|toggle|hamburger/i }),
      this.page.locator('[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"]'),
      this.page.locator('[aria-label*="menu" i], [aria-label*="navigation" i]').filter({ hasNotText: /^\s*$/ }),
      this.page.locator('button[aria-expanded]').first(),
      // Avada/Fusion Builder mobile nav patterns
      this.page.locator('.fusion-mobile-nav-icons a, a.fusion-icon-bars, [class*="mobile-nav-icons"] a'),
      this.page.locator('[class*="mobile-menu"] a, [class*="nav-icon"], a[class*="bars"]'),
    ];

    for (const candidate of candidates) {
      if (await candidate.count() > 0 && await candidate.first().isVisible()) {
        return candidate.first();
      }
    }

    return null;
  }

  /**
   * Open the mobile navigation menu if a toggle exists and the menu is currently closed.
   * No-op if no toggle is found (desktop layout).
   */
  async openMobileMenu(): Promise<void> {
    const toggle = await this.getMobileMenuToggle();
    if (!toggle) return;

    const isExpanded = await toggle.getAttribute('aria-expanded');
    if (isExpanded === 'true') return; // Already open

    await toggle.click();

    // Wait briefly for animation
    await this.page.waitForTimeout(400);
  }

  // ── Link reachability ────────────────────────────────────────────────────────

  /**
   * Check all nav links are reachable by issuing HEAD requests.
   * Returns an array of results with URL, HTTP status, and ok flag.
   * Relative URLs are resolved against config.url.
   */
  async checkAllNavLinksReachable(): Promise<LinkCheckResult[]> {
    const navLinks = await this.getNavLinks();
    const baseUrl = new URL(this.config.url);
    const results: LinkCheckResult[] = [];

    for (const link of navLinks) {
      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(link.href, baseUrl).toString();
      } catch {
        results.push({ url: link.href, status: 0, ok: false });
        continue;
      }

      // Skip non-HTTP(S) URLs (mailto:, tel:, etc.) — already filtered by getNavLinks
      if (!/^https?:\/\//i.test(absoluteUrl)) {
        results.push({ url: absoluteUrl, status: 0, ok: false });
        continue;
      }

      // Skip external social media domains — they block bot HEAD requests (400/403/429)
      // and should not count as "broken" links owned by the site.
      const isExternal = new URL(absoluteUrl).hostname !== baseUrl.hostname;
      const socialDomains = /\b(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest)\b/i;
      if (isExternal && socialDomains.test(absoluteUrl)) {
        // Treat as unreachable warning, not a broken link
        results.push({ url: absoluteUrl, status: 0, ok: false });
        continue;
      }

      try {
        const response = await this.page.request.head(absoluteUrl, {
          timeout: 8_000,
        });
        const status = response.status();
        // External links returning 4xx/5xx other than 404 are usually bot-blocking, not broken.
        // Only flag 404 as definitively broken regardless of domain.
        const ok = isExternal
          ? status !== 404
          : response.ok();
        results.push({ url: absoluteUrl, status, ok });
      } catch {
        results.push({ url: absoluteUrl, status: 0, ok: false });
      }
    }

    return results;
  }
}
