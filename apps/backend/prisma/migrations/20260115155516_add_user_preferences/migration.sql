-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "prefer_features_on" BOOLEAN NOT NULL DEFAULT false,
    "font_size" INTEGER NOT NULL DEFAULT 16,
    "high_contrast" BOOLEAN NOT NULL DEFAULT false,
    "reduced_motion" BOOLEAN NOT NULL DEFAULT false,
    "warm_colors" BOOLEAN NOT NULL DEFAULT false,
    "hobby_check_in" BOOLEAN NOT NULL DEFAULT false,
    "family_access" BOOLEAN NOT NULL DEFAULT false,
    "optional_features" JSONB NOT NULL DEFAULT '{}',
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
