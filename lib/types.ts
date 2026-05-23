export type ServiceType = "公司注册" | "税务" | "签证" | "商标";
export type Country = "新加坡" | "英国" | "加拿大" | "美国";

export type Provider = {
  id: string;
  name: string;
  country: Country;
  city: string;
  serviceTypes: ServiceType[];
  priceRange: string;
  timeline: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  trustTags: string[];
  credentials: string[];
  description: string;
  cases: string[];
  keywords: string[];
};

export type RequirementSlots = {
  serviceType?: ServiceType;
  country?: Country;
  budget?: string;
  timeline?: string;
  language?: string;
  specialRequirements?: string[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type Recommendation = {
  provider: Provider;
  score: number;
  reason: string;
};
