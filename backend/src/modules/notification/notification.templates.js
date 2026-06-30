const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const templates = {
  interestCreatedTemplate: (payload) => `
    <h1>New Interest Request!</h1>
    <p>Hi ${escapeHtml(payload.ownerName)},</p>
    <p>${escapeHtml(payload.tenantName)} is interested in your room: ${escapeHtml(payload.roomTitle)}.</p>
    <p>Compatibility Score: ${payload.compatibilityScore || 'N/A'}</p>
    <p>Log in to review this request.</p>
  `,
  interestAcceptedTemplate: (payload) => `
    <h1>Interest Request Accepted!</h1>
    <p>Hi ${escapeHtml(payload.tenantName)},</p>
    <p>${escapeHtml(payload.ownerName)} accepted your request for the room: ${escapeHtml(payload.roomTitle)}.</p>
    <p>You can now start chatting with them!</p>
  `,
  interestRejectedTemplate: (payload) => `
    <h1>Interest Request Update</h1>
    <p>Hi ${escapeHtml(payload.tenantName)},</p>
    <p>Unfortunately, your request for the room ${escapeHtml(payload.roomTitle)} was declined.</p>
    <p>Don't worry, keep searching for other great rooms!</p>
  `,
  chatCreatedTemplate: (payload) => `
    <h1>New Chat Started!</h1>
    <p>A new chat has been created for the room: ${escapeHtml(payload.roomTitle)}.</p>
    <p>Log in to send your first message.</p>
  `,
  roomFilledTemplate: (payload) => `
    <h1>Room Filled Successfully!</h1>
    <p>Congratulations ${escapeHtml(payload.ownerName)},</p>
    <p>Your room ${escapeHtml(payload.roomTitle)} has been marked as filled.</p>
    <p>All pending requests have been notified.</p>
  `,
  welcomeTemplate: (payload) => `
    <h1>Welcome to Rent & Flatmate Finder!</h1>
    <p>Hi ${escapeHtml(payload.userName)},</p>
    <p>We're thrilled to have you on board.</p>
  `
};

const getTemplate = (type, payload) => {
  switch (type) {
    case 'INTEREST_CREATED': return { subject: 'New Interest Request', html: templates.interestCreatedTemplate(payload) };
    case 'INTEREST_ACCEPTED': return { subject: 'Interest Request Accepted', html: templates.interestAcceptedTemplate(payload) };
    case 'INTEREST_REJECTED': return { subject: 'Interest Request Update', html: templates.interestRejectedTemplate(payload) };
    case 'CHAT_CREATED': return { subject: 'New Chat Started', html: templates.chatCreatedTemplate(payload) };
    case 'ROOM_FILLED': return { subject: 'Room Filled', html: templates.roomFilledTemplate(payload) };
    case 'USER_REGISTERED': return { subject: 'Welcome!', html: templates.welcomeTemplate(payload) };
    default: throw new Error(`Unknown template type: ${type}`);
  }
};

module.exports = { getTemplate };
