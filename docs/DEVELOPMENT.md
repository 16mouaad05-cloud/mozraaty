# تطبيق مزرعتي - دليل التطوير

## التثبيت والتشغيل

### 1. التثبيت
```bash
npm install
```

### 2. إعداد قاعدة البيانات

#### أولاً: إنشاء قاعدة بيانات PostgreSQL
```bash
psql -U postgres
CREATE DATABASE mozraaty;
\q
```

#### ثانياً: تهيئة الجداول
```bash
npm run db:init
```

#### ثالثاً: إضافة البيانات الأولية
```bash
npm run db:seed
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` بالمحتوى التالي:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/mozraaty

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Project
NEXT_PUBLIC_PROJECT_ID=default-project
```

### 4. التشغيل
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في متصفحك.

## البنية

```
mozraaty/
├── src/
│   ├── pages/              # صفحات التطبيق
│   │   ├── api/           # API routes
│   │   ├── index.tsx      # الصفحة الرئيسية
│   │   ├── dashboard.tsx  # لوحة التحكم
│   │   ├── purchases.tsx  # الشراء
│   │   ├── births.tsx     # الولادات
│   │   ├── sales.tsx      # المبيعات
│   │   ├── deaths.tsx     # النفوق
│   │   ├── expenses.tsx   # المصاريف
│   │   ├── finances.tsx   # الأموال
│   │   ├── reports.tsx    # التقارير
│   │   ├── project.tsx    # المشروع
│   │   └── feed.tsx       # العلف
│   ├── components/        # المكونات
│   ├── db/               # قاعدة البيانات
│   ├── store/            # إدارة الحالة
│   ├── utils/            # الدوال المساعدة
│   ├── types/            # أنواع TypeScript
│   └── styles/           # الأنماط
├── scripts/              # برامج نصية
├── public/               # الملفات الثابتة
└── docs/                 # التوثيق
```

## الميزات الرئيسية

### 1. لوحة التحكم
- عرض إحصائيات القطيع والمال
- رسوم بيانية لنمو المشروع
- آخر العمليات المسجلة

### 2. إدارة القطيع
- تسجيل الشراء والبيع
- تسجيل الولادات والنفوق
- حساب تلقائي لعدد الأغنام

### 3. إدارة المال
- تسجيل المصاريف بفئات متعددة
- حساب الأرباح والخسائر
- عرض الرصيد النقدي وقيمة القطيع

### 4. التقارير
- تقرير شامل للقطيع
- تقرير مالي مفصل
- تفصيل شهري للعمليات

## الحسابات

### معادلة عدد القطيع
```
العدد الحالي = العدد الأولي + المشتريات + الولادات - المبيعات - النفوق
```

### معادلة الرصيد النقدي
```
الرصيد = رأس المال + المبيعات - (الشراء + المصاريف)
```

### معادلة الربح/الخسارة
```
النتيجة = الرصيد النقدي + قيمة القطيع - رأس المال الأولي
```

## API Routes

- `GET /api/dashboard` - لوحة التحكم
- `GET /api/transactions` - الحصول على العمليات
- `POST /api/purchases` - تسجيل شراء
- `POST /api/births` - تسجيل ولادة
- `POST /api/sales` - تسجيل بيع
- `POST /api/deaths` - تسجيل نفوق
- `POST /api/expenses` - تسجيل مصروف
- `GET /api/finances` - البيانات المالية
- `GET /api/reports` - التقارير
- `GET /api/project` - بيانات المشروع

## الدعم والمساهمة

للإبلاغ عن مشاكل أو المساهمة، يرجى فتح issue أو pull request.

## الترخيص

MIT License
