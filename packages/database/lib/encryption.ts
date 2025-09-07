import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.INTEGRATION_ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error(
    'INTEGRATION_ENCRYPTION_KEY environment variable is required'
  );
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    'INTEGRATION_ENCRYPTION_KEY must be 64 characters (32 bytes in hex)'
  );
}

const key = Buffer.from(ENCRYPTION_KEY, 'hex');

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export function encryptData(text: string): EncryptedData {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decryptData(encryptedData: EncryptedData): string {
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptConfigData(configData: Record<string, any>): string {
  const jsonString = JSON.stringify(configData);
  const encrypted = encryptData(jsonString);
  return JSON.stringify(encrypted);
}

export function decryptConfigData(
  encryptedConfigData: string
): Record<string, any> {
  const encryptedData = JSON.parse(encryptedConfigData) as EncryptedData;
  const decryptedString = decryptData(encryptedData);
  return JSON.parse(decryptedString);
}
