import Cookies from 'js-cookie';
const TokenKey = 'my-admin-token'
const TokenType = 'bearer'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function getType() {
  return Cookies.get(TokenType)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setTokenType(tokentype) {
  return Cookies.set(TokenType, tokentype)
}

export function removeToken() {
  Cookies.remove(TokenKey)
  return Cookies.remove(TokenType)
}
