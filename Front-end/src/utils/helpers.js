export function serverPathToPublicUrl(serverPath) {
  // convert backend path like "/uploads/doc.pdf" to absolute URL
  if (!serverPath) return null;
  if (serverPath.startsWith('/')) return window.location.origin + serverPath;
  return serverPath;
}
