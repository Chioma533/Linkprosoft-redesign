export const searchDashboard = (query, navigationItems, myJobs, jobs, messages, notifications) => {
  const q = query.trim().toLowerCase();
  if (!q) return { navMatches: [], jobMatches: [], messageMatches: [], notifMatches: [] };

  const navMatches = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.keywords.some((keyword) => keyword.includes(q))
  );

  const combinedJobs = [...(myJobs || []), ...(jobs || [])];
  const seenJobIds = new Set();
  const jobMatches = [];

  for (const job of combinedJobs) {
    const id = String(job.id || job.orderId || "");
    if (seenJobIds.has(id)) continue;

    const title = (job.title || job.jobTitle || "").toLowerCase();
    const client = (job.client?.fullName || job.client?.name || job.client || job.employerName || "").toLowerCase();
    const category = (job.category?.name || job.category || "").toLowerCase();
    const orderId = String(job.orderId || job.order_id || "").toLowerCase();

    if (title.includes(q) || client.includes(q) || category.includes(q) || orderId.includes(q)) {
      seenJobIds.add(id);
      jobMatches.push(job);
      if (jobMatches.length >= 4) break;
    }
  }

  const messageMatches = (messages || [])
    .filter((message) => {
      const sender = (message.senderName || message.sender || "").toLowerCase();
      const text = (message.lastMessage || message.content || message.text || "").toLowerCase();
      return sender.includes(q) || text.includes(q);
    })
    .slice(0, 2);

  const notifMatches = (notifications || [])
    .filter((notification) => {
      const title = (notification.title || notification.subject || "").toLowerCase();
      const message = (notification.message || notification.body || "").toLowerCase();
      return title.includes(q) || message.includes(q);
    })
    .slice(0, 2);

  return { navMatches, jobMatches, messageMatches, notifMatches };
};
