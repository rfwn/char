export function formatDuration(seconds: number): string {
    const units = [
        { label: 'd', value: 86400 },
        { label: 'h', value: 3600 },
        { label: 'm', value: 60 },
        { label: 's', value: 1 },
    ];
    
    for (const { label, value } of units) {
        if (seconds >= value) return `${Math.floor(seconds / value)}${label}`;
    }
    return '0s';
}

export function validateConfig(obj: Record<string, any>): void {
    for (const key in obj) {
      if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
        throw new Error(`Empty value found for key: ${key}`);
      }
    }
  }
  