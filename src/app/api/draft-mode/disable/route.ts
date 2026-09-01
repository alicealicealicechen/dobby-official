import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Leaves draft mode and returns to the published site.
 *
 * The cookie otherwise survives until the browser session ends, which is how
 * an editor ends up looking at drafts hours later, wondering why the live site
 * shows something nobody published. The banner in the layout links here.
 */
export async function GET(request: Request) {
  (await draftMode()).disable();
  const to = new URL(request.url).searchParams.get("to");
  // Only same-site paths: an attacker-supplied absolute URL here would turn
  // this into an open redirect wearing a trusted domain.
  redirect(to?.startsWith("/") && !to.startsWith("//") ? to : "/");
}
