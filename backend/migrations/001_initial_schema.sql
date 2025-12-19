-- migrations/001_initial_schema.sql
-- Уберите все не нужное, оставьте только CREATE и INSERT

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    telegram_chat_id VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'ANSWERED')),
    answer TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Тестовые пользователи (пароли в реальном проекте должны быть захешированы!)
INSERT INTO users (id, login, password, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin', 'admin123', 'ADMIN'),
    ('22222222-2222-2222-2222-222222222222', 'user1', 'user123', 'USER'),
    ('33333333-3333-3333-3333-333333333333', 'user2', 'user123', 'USER')
ON CONFLICT (login) DO NOTHING;

-- Тестовые отзывы
INSERT INTO feedbacks (text, status, answer, user_id) VALUES
    ('При работе на максимальной мощности слышен громкий гул. Помогите пожалуйста!', 
     'ANSWERED', 'Мы свяжемся с вами в течение 3х рабочих дней', 
     '22222222-2222-2222-2222-222222222222'),
    ('Нужна консультация по установке сплит-системы в квартиру 50кв.м.', 
     'PENDING', NULL, 
     '22222222-2222-2222-2222-222222222222'),
    ('Из внутреннего блока капает вода на пол. Что делать?', 
     'PENDING', NULL, 
     '33333333-3333-3333-3333-333333333333'),
    ('Спасибо за качественный монтаж и вежливое обслуживание!', 
     'ANSWERED', 'Всегда пожалуйста!', 
     '33333333-3333-3333-3333-333333333333'),
    ('Кондиционер дует, но не охлаждает воздух. Нужна диагностика.', 
     'PENDING', NULL, 
     '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;