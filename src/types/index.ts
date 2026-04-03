export type { UserSignUpData, UserProfile, AuthError, SignUpResponse } from "./auth";
export type { QualityTest, QualityTestStatus } from "./quality-check";

export interface DbResult<T> {
  data: T | null;
  error: string | null;
}
