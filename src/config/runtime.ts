let runtimeConfig: { apiUrl: string } | null = null;

export async function getRuntimeConfig() {
  if (runtimeConfig) {
    return runtimeConfig;
  }

  try {
    const response = await fetch('/api/config');
    runtimeConfig = await response.json();
    return runtimeConfig;
  } catch (error) {
    console.error('Failed to load runtime config:', error);
    return { apiUrl: 'http://localhost:8088/api/v1' };
  }
}
