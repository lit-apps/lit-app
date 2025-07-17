/**
 * Simulate keyboard input on the active element.
 * @param options - { type: string } where type is the string to type.
 */
// @deprecated Use vitest userEvent.keyboard instead.
export async function sendKeys(options: { type: string }) {
  return new Promise<void>(async (resolve) => {
    const input = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (!input) throw new Error('No active element to send keys to');
    console.log('sendKeys input', input);
    for (const char of options.type) {
      const eventInit = { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true };
      input.dispatchEvent(new KeyboardEvent('keydown', eventInit));
      input.value += char;
      input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', eventInit));
      await new Promise(r => setTimeout(r, 0));
    }
    resolve();
  });
}