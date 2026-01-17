-- AlterTable
ALTER TABLE "caregiver_relations" ADD COLUMN     "relationship_type" TEXT NOT NULL DEFAULT 'caregiver';

-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "checked_in_by_caretaker_id" TEXT;

-- CreateTable
CREATE TABLE "caregiver_notes" (
    "id" TEXT NOT NULL,
    "relation_id" TEXT NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "note_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_invitations" (
    "id" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "target_email" TEXT,
    "target_phone" TEXT,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiver_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "subject" TEXT NOT NULL,
    "html_content" TEXT NOT NULL,
    "text_content" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'standard',
    "variables" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "content" VARCHAR(320) NOT NULL,
    "variables" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "caregiver_notes_relation_id_idx" ON "caregiver_notes"("relation_id");

-- CreateIndex
CREATE INDEX "caregiver_notes_note_date_idx" ON "caregiver_notes"("note_date");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_invitations_token_key" ON "caregiver_invitations"("token");

-- CreateIndex
CREATE INDEX "caregiver_invitations_token_idx" ON "caregiver_invitations"("token");

-- CreateIndex
CREATE INDEX "caregiver_invitations_inviter_id_idx" ON "caregiver_invitations"("inviter_id");

-- CreateIndex
CREATE INDEX "email_templates_code_idx" ON "email_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_code_language_key" ON "email_templates"("code", "language");

-- CreateIndex
CREATE INDEX "sms_templates_code_idx" ON "sms_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sms_templates_code_language_key" ON "sms_templates"("code", "language");

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_checked_in_by_caretaker_id_fkey" FOREIGN KEY ("checked_in_by_caretaker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_notes" ADD CONSTRAINT "caregiver_notes_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "caregiver_relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_invitations" ADD CONSTRAINT "caregiver_invitations_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
