import { providers } from "./mock-data";
import { Provider, Recommendation, RequirementSlots, ServiceType } from "./types";

const countryKeywords: Record<string, RequirementSlots["country"]> = {
  新加坡: "新加坡",
  singapore: "新加坡",
  英国: "英国",
  uk: "英国",
  britain: "英国",
  加拿大: "加拿大",
  canada: "加拿大",
  美国: "美国",
  usa: "美国",
  us: "美国",
};

const serviceKeywords: Record<string, ServiceType> = {
  注册: "公司注册",
  公司: "公司注册",
  company: "公司注册",
  incorporation: "公司注册",
  tax: "税务",
  税务: "税务",
  报税: "税务",
  visa: "签证",
  签证: "签证",
  工签: "签证",
  商标: "商标",
  trademark: "商标",
  品牌: "商标",
};

export function extractSlotsFromText(input: string): RequirementSlots {
  const text = input.toLowerCase();
  const slots: RequirementSlots = {};

  for (const [k, v] of Object.entries(countryKeywords)) {
    if (text.includes(k.toLowerCase())) {
      slots.country = v;
      break;
    }
  }

  for (const [k, v] of Object.entries(serviceKeywords)) {
    if (text.includes(k.toLowerCase())) {
      slots.serviceType = v;
      break;
    }
  }

  const budgetMatch = input.match(/(预算|预算在|预算大概|预算约)?\s*([0-9]+\s*(万|千)?\s*(人民币|RMB|美元|USD|加币|CAD|英镑|GBP|新币|SGD)?以内?)/i);
  if (budgetMatch?.[2]) slots.budget = budgetMatch[2].replace(/\s+/g, "");

  const timelineMatch = input.match(/(\d+\s*(天|周|个月)|尽快|加急|本月|下月)/i);
  if (timelineMatch?.[0]) slots.timeline = timelineMatch[0];

  if (input.includes("中文")) slots.language = "中文";
  if (input.includes("英文") && !slots.language) slots.language = "英文";

  return slots;
}

export function getCompleteness(slots: RequirementSlots) {
  const keys: Array<keyof RequirementSlots> = ["country", "serviceType", "budget", "timeline"];
  const score = keys.reduce((acc, key) => (slots[key] ? acc + 1 : acc), 0);
  return Math.round((score / keys.length) * 100);
}

function scoreProvider(provider: Provider, query: string, slots: RequirementSlots): number {
  let score = 0;
  const normalized = query.toLowerCase();

  if (slots.country && provider.country === slots.country) score += 35;
  if (slots.serviceType && provider.serviceTypes.includes(slots.serviceType)) score += 35;
  if (slots.language && provider.languages.includes(slots.language)) score += 8;

  const hitCount = provider.keywords.filter((k) => normalized.includes(k.toLowerCase())).length;
  score += hitCount * 4;

  score += Math.min(provider.rating * 2, 10);
  score += Math.min(provider.reviewCount / 30, 6);

  return score;
}

export function searchProviders(query: string, slots: RequirementSlots, topK = 3): Recommendation[] {
  return providers
    .map((provider) => {
      const score = scoreProvider(provider, query, slots);
      const reasonParts = [
        slots.country && provider.country === slots.country ? `覆盖${provider.country}` : "",
        slots.serviceType && provider.serviceTypes.includes(slots.serviceType) ? `擅长${slots.serviceType}` : "",
        provider.trustTags.length ? `具备${provider.trustTags.join("/")}` : "",
      ].filter(Boolean);

      return {
        provider,
        score,
        reason: reasonParts.join("，") || "综合匹配度较高",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
