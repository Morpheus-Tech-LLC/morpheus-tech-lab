// SPDX-License-Identifier: Apache-2.0
//
// Explore's HUD popovers (#69): one open at a time, beside the box whose button opened it, or
// under it at phone width (the CSS says which). The settings popovers (hud.js) and the save
// popover (explore.js) all open through here.
//
// Esc, or a click or focus outside the popover and its button, closes it; so do its own Cancel and
// Apply, through closePopover(). Esc, Cancel and Apply send focus back to the button that
// opened it; a click elsewhere leaves focus where the visitor put it.

const FOCUSABLE = 'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])';
/** Room kept between a popover and the window's edge, in pixels. */
const MARGIN = 8;

/** @type {{button: HTMLElement, popover: HTMLElement, onClose?: () => void} | null} */
let current = null;
let listening = false;

/**
 * Opens `popover` for `button`, closing any other first. A popover that isn't in the button's
 * box moves into it (the save popover serves two boxes).
 * @param {HTMLElement} button
 * @param {HTMLElement} popover
 * @param {object} [options]
 * @param {() => void} [options.onClose] - runs once, however it closes
 * @param {HTMLElement | null} [options.focus] - what takes focus; by default its first field or
 *   button, or the popover itself
 */
export function openPopover(button, popover, { onClose, focus } = {}) {
  listen();
  closePopover({ restoreFocus: false });
  const box = button.closest('.glass-display');
  if (box && popover.parentElement !== box) box.append(popover);
  current = { button, popover, onClose };
  popover.classList.add('is-open');
  box?.classList.add('has-popover');
  button.setAttribute('aria-expanded', 'true');
  button.classList.add('is-active');
  place(popover);
  // The first control on screen: one in a hidden part (a lock note while nothing is locked)
  // can't take focus
  const target = focus === undefined
    ? [...popover.querySelectorAll(FOCUSABLE)].find((el) => el.getClientRects().length > 0)
    : focus;
  (target ?? popover).focus({ preventScroll: true });
}

/**
 * Closes the open popover, or only `popover` if it is given and is the one open.
 * @param {{popover?: HTMLElement, restoreFocus?: boolean}} [options]
 */
export function closePopover({ popover, restoreFocus = true } = {}) {
  if (!current || (popover && current.popover !== popover)) return;
  const { button, popover: open, onClose } = current;
  current = null;
  open.classList.remove('is-open');
  open.style.top = '';
  open.closest('.glass-display')?.classList.remove('has-popover');
  button.setAttribute('aria-expanded', 'false');
  button.classList.remove('is-active');
  onClose?.();
  if (restoreFocus && !button.disabled) button.focus({ preventScroll: true });
}

/** Whether `popover` is the one open. */
export function isPopoverOpen(popover) {
  return current?.popover === popover;
}

/** Moves the open popover back inside the window, after its contents change size. */
export function placeOpenPopover() {
  if (current) place(current.popover);
}

// A popover that would run off the foot of the window moves up, as far as its top allows; its
// CSS caps its height to the window, and it scrolls past that
function place(popover) {
  popover.style.top = '';
  const rect = popover.getBoundingClientRect();
  const over = rect.bottom - (window.innerHeight - MARGIN);
  if (over <= 0) return;
  const shift = Math.min(over, Math.max(0, rect.top - MARGIN));
  if (shift > 0) popover.style.top = `${popover.offsetTop - shift}px`;
}

function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) {
      e.preventDefault();
      closePopover();
    }
  });
  const outside = (target) => current && !current.popover.contains(target) && !current.button.contains(target);
  // The buttons toggle their popover themselves
  document.addEventListener('pointerdown', (e) => {
    if (outside(e.target)) closePopover({ restoreFocus: false });
  });
  // Tab past the popover's last field, or anywhere else, closes it too
  document.addEventListener('focusin', (e) => {
    if (e.target !== document.body && outside(e.target)) closePopover({ restoreFocus: false });
  });
  window.addEventListener('resize', placeOpenPopover);
}
