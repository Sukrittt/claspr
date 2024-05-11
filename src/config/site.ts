export const siteConfig = {
  name: "Scribe",
  description:
    "Upgrade to Scribe for seamless organization, AI-powered interactions, and collaborative learning. Effortlessly manage assignments, engage with students, and stay ahead with our innovative features.",
  url: "https://scribe-rho.vercel.app/",
};

const WEBSITE_DOMAIN = "Scribe";

export const SITE_TITLE = {
  HOMEPAGE: `${WEBSITE_DOMAIN}`,
  DASHBOARD: `Dashboard`,
  CALENDAR: `Calendar`,
  CLASSROOM: (classroomTitle: string) => `${classroomTitle} `,
  ASSIGNMENT: (assignmentTitle: string) => `${assignmentTitle} `,
  NOTE: (noteTitle: string) => `${noteTitle} `,
  CREATE_ASSIGNMENT: (classroomTitle: string) =>
    `Create Assignment for ${classroomTitle}`,
  SIGN_IN: `Sign In`,
  SIGN_UP: `Sign Up`,
  ONBOARDING: `Onboarding`,
};

export const SITE_DESCRIPTION = {
  HOMEPAGE:
    "Welcome to Scribe, where education meets innovation. Elevate your classroom experience with our powerful suite of tools.",
  DASHBOARD:
    "Manage your classroom effortlessly with Scribe's intuitive dashboard. Stay organized, plan ahead, and engage with ease.",
  CALENDAR:
    "Stay on top of assignments and events with Scribe's interactive calendar. Never miss a deadline again.",
  CLASSROOM: (classroomTitle: string) =>
    `Explore ${classroomTitle} on Scribe. Foster collaboration, spark discussions, and empower your students.`,
  ASSIGNMENT: `Complete your assignment with confidence using Scribe's streamlined assignment management system.`,
  NOTE: (noteTitle: string) =>
    `Take notes like never before with Scribe. Organize, collaborate, and access your notes anytime, anywhere.`,
  CREATE_ASSIGNMENT:
    "Start your educational journey with Scribe. Create assignments with our AI tailored to your teaching style and needs.",
  SIGN_IN:
    "Sign in to Scribe and unlock a world of educational possibilities. Seamlessly access your classrooms and resources.",
  SIGN_UP:
    "Join the Scribe community today. Sign up and revolutionize your classroom experience.",
  ONBOARDING:
    "Get started with Scribe's easy-to-follow onboarding process. Discover all the features and capabilities to enhance your teaching and learning.",
};
