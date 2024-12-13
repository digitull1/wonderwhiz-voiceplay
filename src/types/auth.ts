export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  age: string;
  gender?: string;
  language?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}