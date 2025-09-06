export { default } from "next-auth/middleware";

export const config = { matcher: ['/businesses', '/businesses/[id]', '/businesses/saved','/businesses/add', '/businesses/edit', '/profile', '/messages', '/hostfarmmarkets', '/hostfarmmarkets/[id]', '/hostfarmmarkets/add', '/hostfarmmarkets/edit'] }