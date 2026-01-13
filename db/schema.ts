import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  varchar,
  jsonb,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    googleId: text("google_id").unique(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    profileImage: text("profile_image"),
    role: varchar("role", { length: 20 }).notNull().default("user"), // 'admin' | 'user'
    accountStatus: varchar("account_status", { length: 20 })
      .notNull()
      .default("pending"), // 'pending' | 'active' | 'suspended' | 'inactive'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    roleIdx: index("role_idx").on(table.role),
    statusIdx: index("status_idx").on(table.accountStatus),
  })
);

// Sessions Table
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
    tokenIdx: index("session_token_idx").on(table.token),
  })
);

// Subscriptions/Paket WiFi Table
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    packageName: varchar("package_name", { length: 255 }).notNull(), // Paket 10Mbps, Paket 50Mbps, dll
    speed: varchar("speed", { length: 50 }).notNull(), // '10 Mbps', '50 Mbps', dll
    monthlyPrice: decimal("monthly_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    installationFee: decimal("installation_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    status: varchar("status", { length: 20 }).notNull().default("active"), // 'active' | 'suspended' | 'expired'
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    nextBillingDate: timestamp("next_billing_date"),
    isAutoRenewal: boolean("is_auto_renewal").default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscription_user_id_idx").on(table.userId),
    statusIdx: index("subscription_status_idx").on(table.status),
  })
);

// Payments Table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, {
      onDelete: "cascade",
    }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // 'duitku' | 'bank_transfer' | 'credit_card'
    paymentStatus: varchar("payment_status", { length: 20 })
      .notNull()
      .default("pending"), // 'pending' | 'completed' | 'failed' | 'cancelled'
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    duitkuReference: varchar("duitku_reference", { length: 255 }),
    invoiceNumber: varchar("invoice_number", { length: 100 }).unique(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    paidDate: timestamp("paid_date"),
    metadata: jsonb("metadata"), // Untuk menyimpan data dari DuitKu API
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("payment_user_id_idx").on(table.userId),
    statusIdx: index("payment_status_idx").on(table.paymentStatus),
    methodIdx: index("payment_method_idx").on(table.paymentMethod),
  })
);

// Financial Report Table (untuk rekap keuangan admin)
export const financialReports = pgTable(
  "financial_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default(
      "0"
    ),
    totalPayments: decimal("total_payments", {
      precision: 12,
      scale: 2,
    }).default("0"),
    totalPending: decimal("total_pending", { precision: 12, scale: 2 }).default(
      "0"
    ),
    totalFailed: decimal("total_failed", { precision: 12, scale: 2 }).default(
      "0"
    ),
    activeSubscriptions: integer("active_subscriptions").default(0),
    newSubscriptions: integer("new_subscriptions").default(0),
    cancelledSubscriptions: integer("cancelled_subscriptions").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    monthYearIdx: index("financial_report_month_year_idx").on(
      table.month,
      table.year
    ),
  })
);

// Account Requests/Pengajuan Akun Table
export const accountRequests = pgTable(
  "account_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    requestType: varchar("request_type", { length: 50 }).notNull(), // 'new_account' | 'plan_upgrade' | 'plan_downgrade'
    status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
    desiredPackage: varchar("desired_package", { length: 255 }),
    reason: text("reason"),
    rejectionReason: text("rejection_reason"),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("account_request_user_id_idx").on(table.userId),
    statusIdx: index("account_request_status_idx").on(table.status),
  })
);

// Admin Logs Table (untuk audit trail)
export const adminLogs = pgTable(
  "admin_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(),
    targetUserId: uuid("target_user_id"),
    description: text("description"),
    changes: jsonb("changes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    adminIdIdx: index("admin_log_admin_id_idx").on(table.adminId),
    actionIdx: index("admin_log_action_idx").on(table.action),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  accountRequests: many(accountRequests),
  adminLogs: many(adminLogs),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [subscriptions.userId],
      references: [users.id],
    }),
    payments: many(payments),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const accountRequestsRelations = relations(
  accountRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [accountRequests.userId],
      references: [users.id],
    }),
    approvedByUser: one(users, {
      fields: [accountRequests.approvedBy],
      references: [users.id],
    }),
  })
);

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(users, {
    fields: [adminLogs.adminId],
    references: [users.id],
  }),
}));
