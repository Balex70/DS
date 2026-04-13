export function getErrorStringFromCatch(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export  function convertUrlToDockerHost(url: string, dockerHost: string): string {
  try {
    const parsedUrl = new URL(url);

    // Parse the env var CORE_API_ENTRYPOINT
    const dockerHostUrl = new URL(dockerHost);

    // Replace protocol and hostname with those from CORE_API_ENTRYPOINT
    parsedUrl.protocol = dockerHostUrl.protocol;  // e.g. 'http:'
    parsedUrl.hostname = dockerHostUrl.hostname;  // e.g. 'php'
    parsedUrl.port = dockerHostUrl.port;          // e.g. '3000' or '' if none

    return parsedUrl.toString();
  } catch (_errors) {
    // If invalid URL, return original
    return url;
  }
}

export  function urlHasSchemaAndHostname(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return !!parsedUrl.protocol && !!parsedUrl.hostname;
  } catch {
    // If it's not a valid URL (relative path), it will throw
    return false;
  }
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!)
  }
}
