export interface UserSignUpResponseDto {
  id: number;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN"
}

export interface UserSignInResponseDto {
  user: UserSignUpResponseDto;
  token: string;
  refreshToken: string
}