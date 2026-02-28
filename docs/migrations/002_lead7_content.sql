-- Контент 7-дневного марафона (тексты, вопросы, визуальные тесты).
-- Выполни в Neon SQL Editor после 001_add_roles_and_auth.sql.

-- Таблица контента по дням (фронт/бот читает day_number и отдаёт content_json)
CREATE TABLE IF NOT EXISTS lead7_day_content (
  id SERIAL PRIMARY KEY,
  day_number SMALLINT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL,
  questions_json JSONB,
  visual_test_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- День 1: Вода и утренняя рутина
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(1,
 'Water and Morning Routine',
 '{"morning":{"greeting":"Good morning! Ready to start your journey to less stress?","affirmation":"I am hydrated and ready for the day","nutrition_fact":{"title":"Why drinking water in the morning saves from anxiety?","content":"Drinking water first thing in the morning helps regulate cortisol levels and rehydrate your body after sleep. This simple act can reduce morning anxiety by up to 30%."},"exercise":"Joint gymnastics 3-5 min","questions":["What am I feeling right now as I begin this journey?","Where in my body do I feel tension this morning?","What would support me most today?"]},"evening":{"summary_question":"How did staying hydrated today affect your energy and mood?","gratitude_affirmation":"I am taking the first step toward a calmer me","progress_summary":"Day 1 complete: You''ve learned about morning hydration and started observing your body''s signals"}}',
 '[{"text":"What am I feeling right now as I begin this journey?"},{"text":"Where in my body do I feel tension this morning?"},{"text":"What would support me most today?"},{"text":"How do you usually start your morning? Rush or with intention?"}]',
 '{"image_description":"Image showing order/mess/dirt","question":"What does this remind you of in your morning routine?","options":["Orderly routine","Chaotic start","Peaceful beginning","Rushed preparation"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 2: Белок и завтрак
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(2,
 'Protein-Powered Mornings',
 '{"morning":{"greeting":"Day 2! How are you feeling today compared to yesterday?","affirmation":"I fuel my body and mind with nourishing choices","nutrition_fact":{"title":"Why a protein breakfast is anti-stress?","content":"A protein-rich breakfast stabilizes blood sugar and supports neurotransmitter production, helping you stay calm and focused throughout the morning."},"exercise":"Cat-dog stretch sequence","questions":["How does my energy level feel this morning?","What would I like to accomplish today?","How can I be kinder to myself today?"]},"evening":{"summary_question":"Did you notice any difference in your morning energy after focusing on protein?","gratitude_affirmation":"I am learning to nourish myself with intention","progress_summary":"Day 2 complete: You''ve discovered how breakfast choices impact stress levels"}}',
 '[{"text":"How does my energy level feel this morning?"},{"text":"What would I like to accomplish today?"},{"text":"How can I be kinder to myself today?"},{"text":"What does a typical breakfast look like for you? How does it make you feel?"}]',
 '{"image_description":"Image of different breakfast options","question":"Which would give you sustained energy?","options":["Light and quick","Protein-rich","Sweet start","Skipped breakfast"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 3: Эмоциональная осознанность
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(3,
 'Emotional Awareness',
 '{"morning":{"greeting":"Day 3 - How are you feeling today?","affirmation":"I am aware of my feelings and I allow them to be","nutrition_fact":{"title":"Emotional awareness and stress eating","content":"Emotional awareness helps prevent stress eating by helping you distinguish between physical hunger and emotional needs."},"exercise":"Close eyes, imagine yourself, then approach mirror","questions":["What emotions have I experienced today?","Where do I feel these emotions in my body?","How have I responded to challenges today?"]},"evening":{"summary_question":"What did you learn about your emotional patterns today?","gratitude_affirmation":"I am becoming more aware of my inner world","progress_summary":"Day 3 complete: You''ve developed emotional awareness skills"}}',
 '[{"text":"What emotions have I experienced today?"},{"text":"Where do I feel these emotions in my body?"},{"text":"How have I responded to challenges today?"}]',
 '{"image_description":"Image of a street kitten","question":"What emotion does this image evoke in you?","options":["Compassion","Indifference","Curiosity","Protectiveness"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 4: Углеводы
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(4,
 'Carbohydrates: Friend or Foe?',
 '{"morning":{"greeting":"Day 4 - Building on your awareness","affirmation":"I make food choices that support my well-being","nutrition_fact":{"title":"Carbohydrates: enemies or allies?","content":"Complex carbohydrates support serotonin production, promoting feelings of calm and well-being, while simple carbs can cause energy crashes and mood swings."},"exercise":"Arms up and down stretch with breathing","questions":["What food choices have I made today?","How did these choices affect my energy and mood?","What would nourish me most right now?"]},"evening":{"summary_question":"How did your understanding of carbs change your food choices today?","gratitude_affirmation":"I am learning to make food choices that support my mental health","progress_summary":"Day 4 complete: You''ve gained insight into how carbs affect your mood"}}',
 '[{"text":"What food choices have I made today?"},{"text":"How did these choices affect my energy and mood?"},{"text":"What would nourish me most right now?"},{"text":"When do you typically crave carbohydrates? What triggers these cravings?"}]',
 '{"image_description":"Image of food choices (healthy/emotional/celebration)","question":"Which represents your typical carb choice?","options":["Whole grains","Sweets and snacks","Balanced meal","Skip carbs"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 5: Движение и энергия
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(5,
 'Movement and Energy',
 '{"morning":{"greeting":"Day 5 - Mid-week energy boost!","affirmation":"Movement brings me vitality and peace","nutrition_fact":{"title":"Physical activity for stress relief","content":"Physical movement releases endorphins, natural mood elevators that reduce stress hormones like cortisol and adrenaline."},"exercise":"Neck turns and shoulder rolls","questions":["How does my body feel today compared to when we started?","What movement would energize me right now?","How can I incorporate more movement into my day?"]},"evening":{"summary_question":"How did movement affect your stress levels today?","gratitude_affirmation":"My body is capable of finding balance and peace","progress_summary":"Day 5 complete: You''ve experienced the stress-relieving benefits of movement"}}',
 '[{"text":"How does my body feel today compared to when we started?"},{"text":"What movement would energize me right now?"},{"text":"How can I incorporate more movement into my day?"},{"text":"What kind of movement feels good to you right now?"}]',
 '{"image_description":"Image of different physical activities","question":"Which would you enjoy most?","options":["Walking","Stretching","Dance","Yoga"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 6: Осознанное питание
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(6,
 'Mindful Eating',
 '{"morning":{"greeting":"Day 6 - Deepening your practice","affirmation":"I eat with awareness and gratitude","nutrition_fact":{"title":"Developing awareness around eating habits","content":"Mindful eating - paying attention to taste, texture, and satisfaction - can reduce overeating by up to 25% and improve digestion."},"exercise":"Meditation Observing breath 3 min","questions":["Am I eating because I''m hungry or for another reason?","How does my food make me feel physically and emotionally?","What would support me in eating more mindfully?"]},"evening":{"summary_question":"What did you notice about your eating patterns today?","gratitude_affirmation":"I am developing a healthier relationship with food","progress_summary":"Day 6 complete: You''ve practiced mindful eating techniques"}}',
 '[{"text":"Am I eating because I''m hungry or for another reason?"},{"text":"How does my food make me feel physically and emotionally?"},{"text":"What would support me in eating more mindfully?"},{"text":"What does ''eating mindfully'' mean to you?"}]',
 '{"image_description":"Image of a table with pies and fruits","question":"Which would help you unwind?","options":["Fruit","Comfort food","Light snack","Mindful pause"]}')
ON CONFLICT (day_number) DO NOTHING;

-- День 7: Распознавание стресс-еды
INSERT INTO lead7_day_content (day_number, title, content_json, questions_json, visual_test_json) VALUES
(7,
 'Recognizing Stress Eating',
 '{"morning":{"greeting":"Day 7 - Recognizing your patterns","affirmation":"I recognize my stress patterns and respond with care","nutrition_fact":{"title":"What does stress eating mean? How to recognize it in the moment.","content":"Stress eating often occurs when we use food to cope with emotions rather than satisfy hunger. Recognizing this pattern is the first step toward change."},"exercise":"I''m tired, but also... - complete this sentence and do a gentle stretch","questions":["When have I eaten today for reasons other than hunger?","What emotions triggered these eating moments?","What other ways could I comfort myself in those moments?"]},"evening":{"summary_question":"What patterns did you notice in your eating today?","gratitude_affirmation":"I am becoming aware of my habits with compassion","progress_summary":"Day 7 complete: You''ve identified your stress eating triggers. Congratulations on completing the 7-day journey!"}}',
 '[{"text":"When have I eaten today for reasons other than hunger?"},{"text":"What emotions triggered these eating moments?"},{"text":"What other ways could I comfort myself in those moments?"},{"text":"Can you identify times when you eat for reasons other than hunger?"}]',
 '{"image_description":"Image showing different emotional states","question":"Which resonates with you today?","options":["Calm","Restless","Overwhelmed","Grounded"]}')
ON CONFLICT (day_number) DO NOTHING;
