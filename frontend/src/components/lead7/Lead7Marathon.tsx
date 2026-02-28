import { useState, useEffect } from "react";
import { config } from "@/config";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";

const LEAD7_DAYS = [
  { day: 1, title: "Вода и утренняя рутина" },
  { day: 2, title: "Белок и завтрак" },
  { day: 3, title: "Эмоциональная осознанность" },
  { day: 4, title: "Углеводы: друг или враг?" },
  { day: 5, title: "Движение и энергия" },
  { day: 6, title: "Осознанное питание" },
  { day: 7, title: "Распознавание стресс-еды" },
];

function getLead7UserId(): string {
  let id = localStorage.getItem("lead7_user_id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("lead7_user_id", id);
  }
  return id;
}

export const Lead7Marathon = () => {
  const [progress, setProgress] = useState<{ day_number: number; is_test_passed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [promo, setPromo] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const base = config.LEAD7_WEBHOOK_BASE;
  const passedSet = new Set(progress.filter((d) => d.is_test_passed).map((d) => d.day_number));
  const nextDay = [1, 2, 3, 4, 5, 6, 7].find((d) => !passedSet.has(d)) ?? 8;

  useEffect(() => {
    if (!base) {
      setLoading(false);
      return;
    }
    const externalId = getLead7UserId();
    fetch(`${base}/lead7/progress?external_id=${encodeURIComponent(externalId)}`)
      .then((res) => res.json())
      .then((data) => setProgress(data.days ?? []))
      .catch(() => setProgress([]))
      .finally(() => setLoading(false));
  }, [base]);

  const saveDay = async (dayNum: number) => {
    if (!base) return;
    setSaving(dayNum);
    try {
      const res = await fetch(`${base}/lead7/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_id: getLead7UserId(),
          channel: "web",
          day_number: dayNum,
          is_test_passed: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setProgress((prev) => {
          const has = prev.find((d) => d.day_number === dayNum);
          if (has) return prev.map((d) => (d.day_number === dayNum ? { ...d, is_test_passed: true } : d));
          return [...prev, { day_number: dayNum, is_test_passed: true }];
        });
        setOpenDay(null);
      }
    } finally {
      setSaving(null);
    }
  };

  const requestPromo = async () => {
    if (!base) return;
    setPromoLoading(true);
    setPromo(null);
    try {
      const res = await fetch(`${base}/lead7/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ external_id: getLead7UserId() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.promo_code) {
        setPromo(data.promo_code);
      }
    } finally {
      setPromoLoading(false);
    }
  };

  if (!base) {
    return (
      <div className="rounded-2xl bg-card p-6 text-center">
        <p className="text-muted-foreground">Марафон не настроен (VITE_LEAD7_WEBHOOK_BASE).</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center">
        <p className="text-muted-foreground">Загрузка прогресса…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Прогресс сохраняется в облаке. Пройдите все 7 дней и получите промокод 10%.
        </p>
        <Progress value={(passedSet.size / 7) * 100} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">
          Пройдено: <strong>{passedSet.size} / 7</strong>
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {LEAD7_DAYS.map((d) => {
          const done = passedSet.has(d.day);
          const available = d.day <= nextDay;
          return (
            <Button
              key={d.day}
              variant={done ? "default" : "outline"}
              className="h-auto justify-start gap-2 p-4 text-left"
              disabled={!available}
              onClick={() => setOpenDay(d.day)}
            >
              <Target className="h-4 w-4 shrink-0" />
              <span>
                День {d.day}: {d.title} {done && "✓"}
              </span>
            </Button>
          );
        })}
      </div>

      {openDay !== null && (
        <div className="rounded-2xl bg-card p-6">
          <h4 className="mb-2 font-semibold">
            День {openDay}: {LEAD7_DAYS.find((d) => d.day === openDay)?.title}
          </h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Изучите материалы дня и отметьте прохождение.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => saveDay(openDay)}
              disabled={saving !== null}
            >
              {saving === openDay ? "Сохранение…" : "Отметить день пройденным"}
            </Button>
            <Button variant="outline" onClick={() => setOpenDay(null)}>
              Закрыть
            </Button>
          </div>
        </div>
      )}

      {passedSet.size === 7 && (
        <div className="rounded-2xl bg-card p-6">
          <h4 className="mb-2 font-semibold">Поздравляем! Все 7 дней пройдены</h4>
          <Button
            className="mt-2"
            onClick={requestPromo}
            disabled={promoLoading}
          >
            {promoLoading ? "Запрос…" : "Получить промокод 10%"}
          </Button>
          {promo && (
            <p className="mt-4 text-lg font-medium text-primary">
              Ваш промокод: <strong>{promo}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
