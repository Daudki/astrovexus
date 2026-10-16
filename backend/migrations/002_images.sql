-- Posts may be image-only, so the text can be empty. The app requires text or at least one image.
ALTER TABLE insights DROP CONSTRAINT insights_body_check;
ALTER TABLE insights ADD CONSTRAINT insights_body_check CHECK (char_length(body) <= 2000);

CREATE TABLE insight_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid NOT NULL REFERENCES insights (id) ON DELETE CASCADE,
  -- Cloudinary identifiers. public_id is unique so one upload can't be attached twice.
  public_id text NOT NULL,
  url text NOT NULL,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  position smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX insight_images_public_id_idx ON insight_images (public_id);
CREATE INDEX insight_images_insight_idx ON insight_images (insight_id, position);
