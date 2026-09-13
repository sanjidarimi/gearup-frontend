export const SITE_IMAGES = {
  hero: "/images/hero-tent-sunset.jpg",
  authLogin: "/images/auth-login.jpg",
  authRegister: "/images/auth-register.jpg",
  ctaProvider: "/images/cta-provider.jpg",
  community: "/images/community-campfire.jpg",
  notFound: "/images/not-found-mountains.jpg",
  paymentSuccess: "/images/payment-success.jpg",
};

export interface CategoryVisual {
  cover: string;
  gallery: string[];
}

const CATEGORY_VISUALS: { pattern: RegExp; visual: CategoryVisual }[] = [
  {
    pattern: /swim|pool/i,
    visual: {
      cover: "/images/categories/swimming.jpg",
      gallery: [
        "/images/categories/swimming.jpg",
        "/images/lifestyle/water-2.jpg",
      ],
    },
  },
  {
    pattern: /water|surf|kayak|paddle|sup|dive|boat|fish/i,
    visual: {
      cover: "/images/categories/water-sports.jpg",
      gallery: [
        "/images/categories/water-sports.jpg",
        "/images/lifestyle/water-2.jpg",
        "/images/lifestyle/water-3.jpg",
      ],
    },
  },
  {
    pattern: /camp|hik|trek|tent|backpack/i,
    visual: {
      cover: "/images/categories/camping.jpg",
      gallery: [
        "/images/categories/camping.jpg",
        "/images/lifestyle/camping-2.jpg",
        "/images/lifestyle/camping-3.jpg",
      ],
    },
  },
  {
    pattern: /cycl|bike|bicycle|mtb/i,
    visual: {
      cover: "/images/categories/cycling.jpg",
      gallery: [
        "/images/categories/cycling.jpg",
        "/images/lifestyle/cycling-2.jpg",
        "/images/lifestyle/cycling-3.jpg",
      ],
    },
  },
  {
    pattern: /winter|ski|snow|ice/i,
    visual: {
      cover: "/images/categories/winter-sports.jpg",
      gallery: [
        "/images/categories/winter-sports.jpg",
        "/images/lifestyle/winter-2.jpg",
        "/images/lifestyle/winter-3.jpg",
      ],
    },
  },
  {
    pattern: /fitness|gym|training|yoga|workout/i,
    visual: {
      cover: "/images/categories/fitness.jpg",
      gallery: [
        "/images/categories/fitness.jpg",
        "/images/lifestyle/fitness-2.jpg",
        "/images/lifestyle/fitness-3.jpg",
      ],
    },
  },
  {
    pattern: /team|football|soccer|basket|cricket|volley|rugby/i,
    visual: {
      cover: "/images/categories/team-sports.jpg",
      gallery: [
        "/images/categories/team-sports.jpg",
        "/images/lifestyle/team-2.jpg",
        "/images/lifestyle/team-3.jpg",
      ],
    },
  },
  {
    pattern: /racket|tennis|badminton|squash|pickle/i,
    visual: {
      cover: "/images/categories/racket-sports.jpg",
      gallery: [
        "/images/categories/racket-sports.jpg",
        "/images/lifestyle/fitness-3.jpg",
      ],
    },
  },
  {
    pattern: /run|track|athlet|marathon/i,
    visual: {
      cover: "/images/categories/running.jpg",
      gallery: [
        "/images/categories/running.jpg",
        "/images/lifestyle/running-2.jpg",
        "/images/lifestyle/running-3.jpg",
      ],
    },
  },
  {
    pattern: /climb|adventure|outdoor|mountain/i,
    visual: {
      cover: "/images/categories/climbing.jpg",
      gallery: [
        "/images/categories/climbing.jpg",
        "/images/lifestyle/adventure-2.jpg",
        "/images/lifestyle/default-2.jpg",
      ],
    },
  },
];

const DEFAULT_VISUAL: CategoryVisual = {
  cover: "/images/categories/default.jpg",
  gallery: [
    "/images/categories/default.jpg",
    "/images/lifestyle/default-2.jpg",
    "/images/lifestyle/adventure-2.jpg",
  ],
};

export function getCategoryVisual(name?: string | null): CategoryVisual {
  if (!name) return DEFAULT_VISUAL;
  return (
    CATEGORY_VISUALS.find(({ pattern }) => pattern.test(name))?.visual ??
    DEFAULT_VISUAL
  );
}
