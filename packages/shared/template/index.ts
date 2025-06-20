/**
 * A series of helper functions to help with the survey app templating
 */

import { html, TemplateResult } from "lit";
import { ellipsis } from "../ellipsis.js";

/**
 * Helper function to generate a section title with a given title and optional class.
 *
 * @param title - The title of the section, can be a string or a TemplateResult.
 * @param cls - Optional class to add to the section title.
 * @returns A TemplateResult containing the section title.
 */
export function sectionTitleHelper(title: string | TemplateResult, cls: string = ''): TemplateResult {
  return html`<h4 class="section heading ${cls}">${title}</h4>`
}

/**
 * A helper function that renders an info message with an icon.
 *
 * @param info - The info message to display. It can be a string or a TemplateResult.
 * @returns A TemplateResult containing the info message with an icon.
 */
export function infoHelper(info: string | TemplateResult): TemplateResult {
  return html`<p class="info"><lapp-icon class="secondary">info</lapp-icon>${info}</p>`
}

/**
 * Creates a badge with an optional ellipsis.
 *
 * @param badge - The text to display in the badge.
 * @param length - The maximum length of the badge text before applying ellipsis. Defaults to 20.
 * @returns A TemplateResult for rendering the badge.
 */
export function badgeHelper(badge: string, length = 20): TemplateResult {
  return html`<span class="badge">${ellipsis(badge, length)}</span>`
}