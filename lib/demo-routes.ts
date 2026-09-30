/**
 * Curated weekly demonstrations — single official entry for hosts to begin the flow.
 * After admin approval, users finalize scheduling and creative on `/featured-demonstration/new`.
 */
export const WEEKLY_DEMO_APPLICATION_PATH = "/demo-access/apply"
export const WEEKLY_DEMO_APPLICATION_REDIRECT_PARAM = "/featured-demonstration/new"

/** Full href: apply first, then redirect to post-approval finalization */
export const WEEKLY_DEMO_APPLICATION_HREF = `${WEEKLY_DEMO_APPLICATION_PATH}?redirect=${encodeURIComponent(WEEKLY_DEMO_APPLICATION_REDIRECT_PARAM)}`
