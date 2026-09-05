/**
 * Synthetic local logins. Created by `pnpm setup` and `pnpm db:reset`
 * if they are missing. Never use these remotely.
 */
export const LOCAL_DEV_PASSWORD = "local-dev-password";

export const LOCAL_TEST_USERS = [
  {
    id: "11111111-1111-1111-1111-100000000001",
    email: "ada.founder@example.org",
    name: "Ada Okafor",
    role: "founder",
  },
  {
    id: "11111111-1111-1111-1111-100000000002",
    email: "emeka.coordinator@example.org",
    name: "Emeka Chukwu",
    role: "program coordinator",
  },
  {
    id: "11111111-1111-1111-1111-100000000003",
    email: "tobi.lead@example.org",
    name: "Tobi Adeyemi",
    role: "UNILAG campus lead",
  },
  {
    id: "11111111-1111-1111-1111-100000000004",
    email: "ngozi.assistant@example.org",
    name: "Ngozi Umeh",
    role: "UNILAG assistant lead",
  },
  {
    id: "11111111-1111-1111-1111-100000000005",
    email: "chidi.practitioner@example.org",
    name: "Chidi Eze",
    role: "UNILAG practitioner",
  },
  {
    id: "11111111-1111-1111-1111-100000000006",
    email: "bisi.member@example.org",
    name: "Bisi Lawal",
    role: "UNILAG member",
  },
  {
    id: "11111111-1111-1111-1111-100000000007",
    email: "femi.observer@example.org",
    name: "Femi Bello",
    role: "UNILAG observer",
  },
  {
    id: "11111111-1111-1111-1111-100000000008",
    email: "kunle.lead2@example.org",
    name: "Kunle Afolabi",
    role: "OAU campus lead",
  },
  {
    id: "11111111-1111-1111-1111-100000000009",
    email: "grace.assistant2@example.org",
    name: "Grace Nwosu",
    role: "OAU assistant lead",
  },
  {
    id: "11111111-1111-1111-1111-100000000010",
    email: "ibrahim.member2@example.org",
    name: "Ibrahim Sule",
    role: "OAU member",
  },
  {
    id: "11111111-1111-1111-1111-100000000011",
    email: "fatima.applicant@example.org",
    name: "Fatima Bello",
    role: "applicant",
  },
];

export function formatLocalLogins() {
  const rows = LOCAL_TEST_USERS.map((user) => {
    const email = user.email.padEnd(34, " ");
    return `  ${email}${user.role}`;
  }).join("\n");

  return [
    "Sign in at http://localhost:3000/sign-in",
    `Password for every seed person: ${LOCAL_DEV_PASSWORD}`,
    "",
    rows,
  ].join("\n");
}
