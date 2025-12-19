import { Telegraf, Markup } from "telegraf";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";


const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const BACKEND_URL = process.env.BACKEND_URL || "http://api:3000/api";

const TARGET_COUNT = 10;      
const MAX_ATTEMPTS = 20;     
const ATTEMPT_DELAY_MS = 250;  


type Store = Record<string, { userId: string }>;

type SessionState =
  | { step: "idle" }
  | { step: "await_login" }
  | { step: "await_password"; login: string };

type FeedbackItem = {
  request_id: number;
  text: string;
  answer?: string | null;
  status?: string;
};


const DATA_FILE = path.join(process.cwd(), "data.json");

function loadStore(): Store {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveStore(store: Store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

const store: Store = loadStore();
const session: Record<string, SessionState> = {};

function userKey(userId: number): string {
  return String(userId);
}


function keyboard() {
  return Markup.inlineKeyboard([Markup.button.callback("Мои отзывы", "MY_FEEDBACK")]);
}

function isAxiosError(e: unknown): e is AxiosError {
  return typeof e === "object" && e !== null && (e as any).isAxiosError === true;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatItem(item: FeedbackItem): string {
  const ans =
    item.answer && typeof item.answer === "string" && item.answer.trim()
      ? item.answer.trim()
      : "Ответа нет";

  return `Отзыв #${item.request_id}\n${item.text}\n\nОтвет:\n${ans}`;
}

async function authUpsert(login: string, password: string): Promise<string> {
  const res = await axios.post(`${BACKEND_URL}/auth/signup`, { login, password });
  const userId = res?.data?.user_id;
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid auth response (no user_id)");
  }
  return userId;
}

async function fetchMyFeedbacks(userId: string): Promise<FeedbackItem[]> {
  const res = await axios.get(`${BACKEND_URL}/feedback/getAnswers`, {
    params: { user_id: userId },
  });
  return Array.isArray(res.data) ? (res.data as FeedbackItem[]) : [];
}
async function fetchWithRetries(userId: string): Promise<FeedbackItem[]> {
  const acc = new Map<number, FeedbackItem>();
  let lastErr: any = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const items = await fetchMyFeedbacks(userId);

      // Накапливаем уникальные по request_id
      for (const it of items) {
        if (typeof it?.request_id === "number") {
          // если раньше не было — добавляем
          if (!acc.has(it.request_id)) acc.set(it.request_id, it);
          // если было — можем обновить (например, раньше answer был null, потом появился)
          else acc.set(it.request_id, { ...acc.get(it.request_id)!, ...it });
        }
      }

      if (acc.size >= TARGET_COUNT) break;
    } catch (e) {
      lastErr = e;

      if (isAxiosError(e) && e.response?.status && e.response.status !== 500) {
        break;
      }
    }

    await sleep(ATTEMPT_DELAY_MS);
  }

  if (acc.size === 0 && lastErr) throw lastErr;

  return Array.from(acc.values())
    .sort((a, b) => (b.request_id ?? 0) - (a.request_id ?? 0))
    .slice(0, TARGET_COUNT);
}


const bot = new Telegraf(BOT_TOKEN);


bot.start(async (ctx) => {
  const key = userKey(ctx.from.id);
  session[key] = { step: "await_login" };
  await ctx.reply("Введи логин:");
});


bot.on("text", async (ctx) => {
  const key = userKey(ctx.from.id);
  const state = session[key] ?? { step: "idle" };
  const text = ctx.message.text.trim();

  if (state.step === "await_login") {
    session[key] = { step: "await_password", login: text };
    await ctx.reply("Введи пароль:");
    return;
  }

  if (state.step === "await_password") {
    try {
      const userId = await authUpsert(state.login, text);
      store[key] = { userId };
      saveStore(store);
      session[key] = { step: "idle" };
      await ctx.reply("Авторизация выполнена.", keyboard());
    } catch (e: any) {
      session[key] = { step: "idle" };
      if (isAxiosError(e)) {
        await ctx.reply(
          `Ошибка авторизации: ${e.response?.status ?? ""} ${JSON.stringify(e.response?.data ?? {})}`.trim()
        );
      } else {
        await ctx.reply(`Ошибка авторизации: ${String(e?.message ?? e)}`);
      }
    }
    return;
  }

  if (!store[key]?.userId) {
    await ctx.reply("Сначала авторизуйся: /start");
    return;
  }

  await ctx.reply("Нажми кнопку «Мои отзывы».", keyboard());
});


bot.action("MY_FEEDBACK", async (ctx) => {
  await ctx.answerCbQuery();

  const key = userKey(ctx.from.id);
  const userId = store[key]?.userId;

  if (!userId) {
    await ctx.reply("Сначала авторизуйся: /start");
    return;
  }

  try {
    const items = await fetchWithRetries(userId);

    if (!items.length) {
      await ctx.reply("У тебя пока нет отзывов.", keyboard());
      return;
    }

    const blocks = items.map(formatItem);
    const separator = "\n\n--------------------\n\n";
    const out = blocks.join(separator);

    const MAX = 3800;
    if (out.length <= MAX) {
      await ctx.reply(out);
    } else {
      let buf = "";
      for (const b of blocks) {
        const next = (buf ? buf + separator : "") + b;
        if (next.length > MAX) {
          if (buf) await ctx.reply(buf);
          buf = b;
        } else {
          buf = next;
        }
      }
      if (buf) await ctx.reply(buf);
    }

    await ctx.reply("Готово.", keyboard());
  } catch (e: any) {
    if (isAxiosError(e)) {
      await ctx.reply(
        `Ошибка API: ${e.response?.status ?? ""} ${JSON.stringify(e.response?.data ?? {})}`.trim()
      );
    } else {
      await ctx.reply(`Ошибка: ${String(e?.message ?? e)}`);
    }
  }
});


bot.launch();
console.log("Telegram bot started", { BACKEND_URL });
