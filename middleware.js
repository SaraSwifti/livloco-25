export { default } from "next-auth/middleware";

export const config = { matcher: ['/businesses', '/businesses/saved','/businesses/add', '/businesses/edit', '/profile', '/messages' ]}