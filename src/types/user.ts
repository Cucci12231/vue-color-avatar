export interface UserInfo {
  id: string
  username: string
  phone: string
  email: string
  avatar: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface ProfileForm {
  username: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  avatar: string
}
