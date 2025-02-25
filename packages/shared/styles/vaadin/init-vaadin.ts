// @ts-expect-error - we are adding a property to the window object
window.Vaadin ||= {};
// @ts-expect-error - we are adding a property to the window object
window.Vaadin.featureFlags ||= {};
// @ts-expect-error - we are adding a property to the window object
window.Vaadin.featureFlags.cardComponent = true;