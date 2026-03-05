/**
 * Passport feature — re-exports the existing Passport page.
 * The full Passport.js logic is complex (tabs, timeline, charts).
 * It imports from the old pages/ location which still works perfectly.
 * Migration to Mantine Tabs/Timeline is a follow-up enhancement.
 */
export { default } from '../../pages/Passport';
