/** Maps a notification's event_key to the screen it should open (backend §7). The customer app has no per-item detail routes, so this always lands on the relevant list. */
export const resolveNotificationUrl = (
  eventKey: string | undefined,
): string => {
  switch (eventKey) {
    case "customer_request.created":
    case "customer_request.accepted":
    case "customer_request.rejected":
      return "/orders";
    default:
      return "/notifications";
  }
};
